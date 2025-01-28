# websockets/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class HabitacionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Obtener el room_name de los parámetros de la URL
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.group_name = f'room_{self.room_name}'

        # Agregar al grupo
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        
        # Enviar mensaje de conexión exitosa
        await self.send(text_data=json.dumps({
            'type': 'connection_status',
            'message': f'Conectado a la sala {self.room_name}'
        }))

    async def disconnect(self, close_code):
        # Quitar del grupo
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

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