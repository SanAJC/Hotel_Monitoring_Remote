from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
from websocket.models import Habitacion ,Hotel ,Dispositivo, Nivel ,RegistroConsumo,Alerta
import json
from .serializers import *
from channels.db import database_sync_to_async
from datetime import timedelta
from django.utils import timezone
from .views import send_weekly_consumption_update, send_monthly_consumption_update, send_monthly_consumption_nivel_update

@database_sync_to_async
def get_hoteles():
    return (Hotel.objects.all())
    

@database_sync_to_async
def get_niveles():
    return (Nivel.objects.all()) 


@database_sync_to_async
def get_habitaciones():
    return (Habitacion.objects.all())
   

@database_sync_to_async
def get_dispositivos():
    return (Dispositivo.objects.all())
    

@database_sync_to_async
def get_registros_consumo():
    return (RegistroConsumo.objects.all())
    

@database_sync_to_async
def get_alertas():
    return (Alerta.objects.filter(fecha_creacion__gte=timezone.now() - timedelta(days=1)))


class HabitacionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "habitaciones"  
        self.group_name = f'room_{self.room_name}'
       
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        await self.send_habitaciones_data()
        
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def send_habitaciones_data(self):
        habitaciones = await get_habitaciones()
        habitaciones_json = await database_sync_to_async(self.serialize_habitaciones)(habitaciones)
        await self.send(text_data=json.dumps(habitaciones_json))

    def serialize_habitaciones(self, habitaciones):
        # Serializar las habitaciones (esto se ejecuta en un hilo separado)
        return HabitacionSerializer(habitaciones, many=True).data

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_update',
                'data': data,
            }
        )
    async def send_update(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))

class HotelConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "hotel"  
        self.group_name = f'room_{self.room_name}'
       
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        await self.send_hotel_data()
        
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def send_hotel_data(self):
        hotel = await get_hoteles()
        hotel_json = await database_sync_to_async(self.serialize_hotel)(hotel)
        await self.send(text_data=json.dumps(hotel_json))

    def serialize_hotel(self, hotel):
        return HotelSerializer(hotel, many=True).data

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_update',
                'data': data,
            }
        )
    async def send_update(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))

class NivelConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "niveles"  
        self.group_name = f'room_{self.room_name}'
       
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        await self.send_nivel_data()
        
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def send_nivel_data(self):
        nivel = await get_niveles()
        nivel_json = await database_sync_to_async(self.serialize_nivel)(nivel)
        await self.send(text_data=json.dumps(nivel_json))

    def serialize_nivel(self, nivel):
        return NivelSerializer(nivel, many=True).data

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_update',
                'data': data,
            }
        )
    async def send_update(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))
    
    async def send_monthly_update_nivel(self, event):
        data = event['data']
        await self.send(text_data=json.dumps({
            'type': 'monthly_update_nivel',
            'data': data
        }))

class DispositivosConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "dispositivos"  
        self.group_name = f'room_{self.room_name}'
       
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        await self.send_dispositivo_data()
        
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def send_dispositivo_data(self):
        dispositivo = await get_dispositivos()
        dispositivo_json = await database_sync_to_async(self.serialize_dispositivo)(dispositivo)
        await self.send(text_data=json.dumps(dispositivo_json))

    def serialize_dispositivo(self, dispositivo):
        return DispositivoSerializer(dispositivo, many=True).data

    async def receive(self, text_data):
        data = json.loads(text_data)
        dispositivo = await self.update_dispositivo(data)
        dispositivos = [dispositivo]

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_update',
                'data': await database_sync_to_async(self.serialize_dispositivo)(dispositivos),
            }
        )
    @database_sync_to_async
    def update_dispositivo(self, data):
        dispositivo = Dispositivo.objects.get(id=data['dispositivo_id'])
        dispositivo.estado_remoto = data['action']
        dispositivo.save()
        return dispositivo
    
    async def send_update(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))

class RegistrosConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("registros", self.channel_name)
        await self.accept()
        
        # Enviar datos iniciales
        await self.send_initial_data()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("registros", self.channel_name)

    async def receive_json(self, content):
        pass

    async def send_initial_data(self):
        # Enviar datos semanales
        weekly_data = await database_sync_to_async(send_weekly_consumption_update)()
        await self.send_json({
            "type": "weekly_update",
            "data": weekly_data
        })
        
        # Enviar datos mensuales
        monthly_data = await database_sync_to_async(send_monthly_consumption_update)()
        await self.send_json({
            "type": "monthly_update",
            "data": monthly_data
        })
        
        # Enviar datos mensuales por nivel
        nivel_monthly_data = await database_sync_to_async(send_monthly_consumption_nivel_update)()
        await self.send_json({
            "type": "monthly_nivel_update",
            "data": nivel_monthly_data
        })

    async def weekly_update(self, event):
        await self.send_json({
            "type": "weekly_update",
            "data": event["data"]
        })

    async def monthly_update(self, event):
        await self.send_json({
            "type": "monthly_update",
            "data": event["data"]
        })

    async def monthly_nivel_update(self, event):
        await self.send_json({
            "type": "monthly_nivel_update",
            "data": event["data"]
        })

class AlertaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "alertas"  
        self.group_name = f'room_{self.room_name}'
       
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        await self.send_alerta_data()
        
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def send_alerta_data(self):
        alerta = await get_alertas()
        alerta_json = await database_sync_to_async(self.serialize_alerta)(alerta)
        await self.send(text_data=json.dumps(alerta_json))

    def serialize_alerta(self, alerta):
        return AlertaSeralizer(alerta, many=True).data

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_update',
                'data': data,
            }
        )
    async def send_update(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))