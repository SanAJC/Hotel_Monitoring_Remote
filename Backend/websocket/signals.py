from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Habitacion
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json

@receiver(post_save, sender=Habitacion)
def send_habitacion_update(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    data = {
        'id': instance.id,
        'numero': instance.numero,
        'consumo': instance.consumo,
        'presencia_humana': instance.presencia_humana,
        'temperatura': instance.temperatura,
        'humedad': instance.humedad,
    }

    # Enviar datos al grupo
    async_to_sync(channel_layer.group_send)(
        'realtime_data',
        {
            'type': 'send_update',
            'data': data,
        }
    )
