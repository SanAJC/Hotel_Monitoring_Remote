from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Habitacion, Hotel, Nivel, Dispositivo, RegistroConsumo, Alerta
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json
from .serializers import *
from .mqtt_client import publish_message
from django.db.models import Sum, Max, Avg, Count
from django.db.models.functions import TruncDay, TruncMonth
import datetime
from .views import send_weekly_consumption_update, send_monthly_consumption_update, send_monthly_consumption_nivel_update

@receiver(post_save, sender=Habitacion)
def send_habitacion_update(sender, instance, created, **kwargs):
    
    channel_layer = get_channel_layer()
    nivel_data = NivelSerializer(instance.nivel).data
    images_url = instance.images.url if instance.images else None
    data = {
        'id': instance.id,
        'numero': instance.numero,
        'consumo': instance.consumo,
        'presencia_humana': instance.presencia_humana,
        'nivel': nivel_data,
        'images': images_url,
        'temperatura': instance.temperatura,
        'humedad': instance.humedad,
        'consumo_desperdicio':instance.consumo_desperdicio,
    }
    
    # Enviar datos al grupo
    async_to_sync(channel_layer.group_send)(
        'room_habitaciones',
        {
            'type': 'send_update',
            'data': data,
        }
    )


@receiver(post_save, sender=Hotel)
def send_hotel_update(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    data = {
        'id': instance.id,
        'consumo_total': instance.consumo_total,
        'presupuesto': instance.presupuesto,
        'fecha_actualizacion': instance.fecha_actualizacion.isoformat(),
    }
    
    async_to_sync(channel_layer.group_send)(
        'room_hotel',
        {
            'type': 'send_update',
            'data': data,
        }
    )

@receiver(post_save, sender=Nivel)
def send_nivel_update(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    data = {
        'id': instance.id,
        'nivel': instance.nivel,
        'consumo': instance.consumo,
        'fecha_actualizacion': instance.fecha_actualizacion.isoformat(),
    }
    
    async_to_sync(channel_layer.group_send)(
        'room_niveles',
        {
            'type': 'send_update',
            'data': data,
        }
    )

@receiver(post_save, sender=Dispositivo)
def send_dispositivo_update(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    habitacion_data = HabitacionSerializer(instance.habitacion).data
    data = {
        'id': instance.id,
        'tipo': instance.tipo,
        'consumo_actual': instance.consumo_actual,
        'consumo_acumulado' : instance.consumo_acumulado,
        'estado_remoto': instance.estado_remoto,
        'on_image': instance.on_image.url if instance.on_image else None,
        'off_image': instance.off_image.url if instance.off_image else None,
        'habitacion': habitacion_data,
        'fecha_actualizacion': instance.fecha_actualizacion.isoformat(),
    }
    
    async_to_sync(channel_layer.group_send)(
        'room_dispositivos',
        {
            'type': 'send_update',
            'data': data,
        }
    )

    device_id_map = {
        'FOCO_BAÑO': 'foco_baño',
        'FOCO_HABITACION': 'foco_habitacion',
        'TELEVISOR': 'television',
        'VENTILADOR': 'ventilador',
        'AIRE': 'aire'
    }
    device_id = device_id_map.get(instance.tipo)

    if device_id:

        topic = f"hotel/room/{instance.habitacion.numero}/{device_id}/relay"
        relay_state = "ON" if instance.estado_remoto == "ENCENDER" else "OFF"
        
        # Publicar el mensaje
        publish_message(topic, relay_state)

@receiver(post_save, sender=RegistroConsumo)
def send_consumption_updates(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    
    # Enviar actualización semanal
    weekly_data = send_weekly_consumption_update()
    async_to_sync(channel_layer.group_send)(
        "registros",
        {
            "type": "weekly_update",
            "data": weekly_data
        }
    )
    
    # Enviar actualización mensual
    monthly_data = send_monthly_consumption_update()
    async_to_sync(channel_layer.group_send)(
        "registros",
        {
            "type": "monthly_update",
            "data": monthly_data
        }
    )
    
    # Enviar actualización mensual por nivel
    nivel_monthly_data = send_monthly_consumption_nivel_update()
    async_to_sync(channel_layer.group_send)(
        "registros",
        {
            "type": "monthly_nivel_update",
            "data": nivel_monthly_data
        }
    )

@receiver(post_save, sender=Alerta)
def send_alerta_update(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    habitacion_data = HabitacionSerializer(instance.habitacion).data
    data = {
        'id': instance.id,
        'tipo': instance.tipo,
        'habitacion': habitacion_data,
        'mensaje': instance.mensaje,
        'fecha_creacion': instance.fecha_creacion.isoformat(),
    }
    
    async_to_sync(channel_layer.group_send)(
        'room_alertas',
        {
            'type': 'send_update',
            'data': data,
        }
    )

