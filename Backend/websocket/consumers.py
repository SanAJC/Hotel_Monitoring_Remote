import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Hotel.settings")
django.setup()

from channels.generic.websocket import AsyncWebsocketConsumer
from websocket.models import Habitacion
from django.core.serializers import serialize
import json
from .serializers import *
from asgiref.sync import sync_to_async


@sync_to_async
def get_habitaciones():
    return Habitacion.objects.all()



class HabitacionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
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
