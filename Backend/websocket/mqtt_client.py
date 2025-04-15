import paho.mqtt.client as mqtt
import json
from django.conf import settings
import time
import threading
from .models import Habitacion, Dispositivo, RegistroConsumo, Alerta
from datetime import datetime, timedelta

mqtt_client = None
reconnect_thread = None
reconnect_interval = 10  

ultima_alerta = {}  
INTERVALO_ALERTA = timedelta(minutes=5) 

def on_connect(client, userdata, flags, rc):
    print(f"Conectado con resultado: {rc}")
    client.subscribe("hotel/rooms")

def on_disconnect(client, userdata, rc):
    print(f"Desconectado con código: {rc}")
    if rc != 0:
        print("Desconexión inesperada.")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"Mensaje recibido en {msg.topic}: {msg.payload.decode()}")

        room_id = payload.get("room_id")
        device_id = payload.get("device_id")
        if not room_id and not device_id:
            print("El mensaje no contiene un 'room_id' ni un 'device_id'.")
            return
        # Obtener la habitación
        try:
            habitacion = Habitacion.objects.get(numero=room_id)
        except Habitacion.DoesNotExist:
            print(f"No existe habitación con número {room_id}")
            return
        
        if device_id == "ld2410c":
            presencia = payload.get("presencia")
            habitacion.presencia_humana = presencia
            habitacion.save()
        
            print(f"Actualizada presencia humana en habitación {room_id}: {presencia}")
            
            # Registrar historial de presencia en todos los dispositivos de la habitación
            for dispositivo in habitacion.dispositivos.all():
                RegistroConsumo.objects.create(
                    dispositivo=dispositivo,
                    habitacion=habitacion,
                    consumo=dispositivo.consumo_acumulado,
                    presencia_humana=presencia,
                    temperatura=habitacion.temperatura,
                    humedad=habitacion.humedad,
                    estado_remoto=dispositivo.estado_remoto,
                    fecha=datetime.now()
                )

            if not presencia and habitacion.dispositivos.filter(estado_remoto="ENCENDER").exists():
                ahora = datetime.now()
                ultima_vez = ultima_alerta.get(room_id)
                if ultima_vez is None or (ahora - ultima_vez) >= INTERVALO_ALERTA:
                    Alerta.objects.create(
                        habitacion=habitacion,
                        tipo="APAGADO_MANUAL",
                    )
                    ultima_alerta[room_id] = ahora
                    print(f"Alerta creada para habitación {room_id}")

                

        elif device_id == "dht22":
            habitacion.temperatura = payload.get("temperatura")
            habitacion.humedad = payload.get("humedad")
            habitacion.save()

            print(f"Actualizada temperatura y humedad en habitación {room_id}: {habitacion.temperatura}, {habitacion.humedad}")
            
            # Registrar historial de temperatura y humedad en todos los dispositivos de la habitación
            for dispositivo in habitacion.dispositivos.all():
                RegistroConsumo.objects.create(
                    dispositivo=dispositivo,
                    habitacion=habitacion,
                    consumo=dispositivo.consumo_acumulado,
                    presencia_humana=habitacion.presencia_humana,
                    temperatura=habitacion.temperatura,
                    humedad=habitacion.humedad,
                    estado_remoto=dispositivo.estado_remoto,
                    fecha=datetime.now()
                )

        else:
            # Dispositivos eléctricos
            tipo_dispositivo = {
                "foco_baño": "FOCO_BAÑO",
                "foco_habitacion": "FOCO_HABITACION",
                "television": "TELEVISOR",
                "ventilador": "VENTILADOR",
                "aire": "AIRE"
            }.get(device_id)

            if not tipo_dispositivo:
                print(f"Tipo de dispositivo desconocido: {device_id}")
                return
            try:
                dispositivo = Dispositivo.objects.get(
                    habitacion=habitacion,
                    tipo=tipo_dispositivo
                )
            except Dispositivo.DoesNotExist:
                print(f"No existe {tipo_dispositivo} en habitación {room_id}")
                return
            
            # Actualizar valores del dispositivo
            dispositivo.consumo_actual = payload.get("potencia_actual")
            consumo_wh = payload.get("consumo_acumulado")
            consumo_kwh = consumo_wh / 1000 if consumo_wh is not None else 0
            if dispositivo.consumo_acumulado is None:
                dispositivo.consumo_acumulado = 0
            dispositivo.consumo_acumulado += consumo_kwh
            dispositivo.estado_remoto = "ENCENDER" if payload.get("estado_rele") == "ON" else "APAGAR"
            dispositivo.save()

            #Actualiza el consumo de la habitación desperdiciado
            if not habitacion.presencia_humana:
                habitacion.consumo_desperdicio += consumo_kwh
                habitacion.save()
                
            #Actualiza el consumo total de la habitación
            habitacion.actualizar_consumo_total()

            # Registrar el consumo
            RegistroConsumo.objects.create(
                dispositivo=dispositivo,
                habitacion=habitacion,
                consumo=dispositivo.consumo_acumulado,
                estado_remoto=dispositivo.estado_remoto,
                presencia_humana=habitacion.presencia_humana,
                temperatura=habitacion.temperatura,
                humedad=habitacion.humedad,
                fecha=datetime.now()
            )
               
    except Exception as e:
        print(f"Error al procesar mensaje: {e}")



def try_connect(client, broker, port=8883, timeout=10):
    try:
        print(f"Intentando conexión a {broker}...")
        client.connect(broker, port, timeout)
        print(f"Conexión exitosa a {broker} por el puerto {port}")
        return True
    except Exception as e:
        print(f"Error al conectar a {broker}: {e}")
        return False

def reconnect_loop():
    global mqtt_client
    
    while mqtt_client and not mqtt_client.is_connected():
        print("Intentando reconexión...")
        
        if try_connect(mqtt_client, "192.168.1.7"):
            break
    
        if try_connect(mqtt_client, "hotel-mqtt.serveftp.com"):
            break
        
        print(f"Ambos brokers no disponibles. Esperando {reconnect_interval} segundos...")
        time.sleep(reconnect_interval)

def setup_mqtt_client():
    global mqtt_client, reconnect_thread
    
    if mqtt_client is not None and mqtt_client.is_connected():
        return mqtt_client
    
    if mqtt_client is not None:
        try:
            mqtt_client.disconnect()
            mqtt_client.loop_stop()
        except:
            pass
    
    # Crear un nuevo cliente
    client = mqtt.Client()
    client.username_pw_set("hotel_kamila", "hotel-admin-1")
    client.tls_set(ca_certs=settings.ROOT_CA_PATH)
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    
    client.loop_start()
    
    # Intenta primero la conexión local
    if try_connect(client, "192.168.1.7"):
        mqtt_client = client
        return client
    
    # Si falla, intenta la conexión remota
    if try_connect(client, "hotel-mqtt.serveftp.com"):
        mqtt_client = client
        return client
    
    print("No se pudo conectar a ningún broker. Iniciando proceso de reconexión...")
    mqtt_client = client
    
    if reconnect_thread is None or not reconnect_thread.is_alive():
        reconnect_thread = threading.Thread(target=reconnect_loop)
        reconnect_thread.daemon = True
        reconnect_thread.start()
    
    return client

def publish_message(topic, message):
    global mqtt_client, reconnect_thread
    
    if mqtt_client is None:
        mqtt_client = setup_mqtt_client()
    
    if not mqtt_client.is_connected():
        print("Cliente MQTT no conectado. No se puede publicar mensaje.")
        # Intentar reconexión si no hay hilo activo
        if reconnect_thread is None or not reconnect_thread.is_alive():
            reconnect_thread = threading.Thread(target=reconnect_loop)
            reconnect_thread.daemon = True
            reconnect_thread.start()
        return False
    
    try:
        result = mqtt_client.publish(topic, json.dumps(message))
        return result.rc == mqtt.MQTT_ERR_SUCCESS
    except Exception as e:
        print(f"Error al publicar mensaje: {e}")
        return False