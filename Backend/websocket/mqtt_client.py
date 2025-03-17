import paho.mqtt.client as mqtt
import json
from django.conf import settings
import time
import threading

mqtt_client = None
reconnect_thread = None
reconnect_interval = 10  

def on_connect(client, userdata, flags, rc):
    print(f"Conectado con resultado: {rc}")
    client.subscribe("hotel/room/+")

def on_disconnect(client, userdata, rc):
    print(f"Desconectado con código: {rc}")
    if rc != 0:
        print("Desconexión inesperada.")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"Mensaje recibido en {msg.topic}: {msg.payload.decode()}")
    except Exception as e:
        print(f"Error al procesar mensaje: {e}")

def try_connect(client, broker, port=1883, timeout=10):
    try:
        print(f"Intentando conexión a {broker}...")
        client.connect(broker, port, timeout)
        print(f"Conexión exitosa a {broker}")
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
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    
    # Iniciar el loop antes de intentar conectar
    client.loop_start()
    
    # Intenta primero la conexión local
    if try_connect(client, "192.168.1.7"):
        mqtt_client = client
        return client
    
    # Si falla, intenta la conexión remota
    if try_connect(client, "hotel-mqtt.serveftp.com"):
        mqtt_client = client
        return client
    
    # Si ambas fallan, inicia un proceso de reconexión en segundo plano
    print("No se pudo conectar a ningún broker. Iniciando proceso de reconexión...")
    mqtt_client = client
    
    if reconnect_thread is None or not reconnect_thread.is_alive():
        reconnect_thread = threading.Thread(target=reconnect_loop)
        reconnect_thread.daemon = True
        reconnect_thread.start()
    
    return client

def publish_message(topic, message):
    global mqtt_client
    
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