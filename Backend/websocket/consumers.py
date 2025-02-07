import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Hotel.settings")
django.setup()

from channels.generic.websocket import AsyncWebsocketConsumer
from websocket.models import Habitacion ,Hotel ,Dispositivo, Nivel ,RegistroConsumo,Alerta
import json
from .serializers import *
from asgiref.sync import sync_to_async

@sync_to_async
def get_hoteles():
    return Hotel.objects.all()

@sync_to_async
def get_niveles():
    return Nivel.objects.all()

@sync_to_async
def get_habitaciones():
    return Habitacion.objects.all()

@sync_to_async
def get_dispositivos():
    return Dispositivo.objects.all()

@sync_to_async
def get_registros_consumo():
    return RegistroConsumo.objects.all()

@sync_to_async
def get_alertas():
    return Alerta.objects.all()


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
        habitaciones_json = await sync_to_async(self.serialize_habitaciones)(habitaciones)
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
        hotel_json = await sync_to_async(self.serialize_hotel)(hotel)
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
        nivel_json = await sync_to_async(self.serialize_nivel)(nivel)
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
        dispositivo_json = await sync_to_async(self.serialize_nivel)(dispositivo)
        await self.send(text_data=json.dumps(dispositivo_json))

    def serialize_dispositivo(self, dispositivo):
        return DispositivoSerializer(dispositivo, many=True).data

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

class RegistrosConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "registros"  
        self.group_name = f'room_{self.room_name}'
       
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        await self.send_registros_data()
        
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def send_registros_data(self):
        registro = await get_registros_consumo()
        registro_json = await sync_to_async(self.serialize_nivel)(registro)
        await self.send(text_data=json.dumps(registro_json))

    def serialize_registros(self, registro):
        return ResgistroConsumoSerializer(registro, many=True).data

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
        alerta_json = await sync_to_async(self.serialize_nivel)(alerta)
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