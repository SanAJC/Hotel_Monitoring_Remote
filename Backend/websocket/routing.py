from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/habitaciones/$', consumers.HabitacionConsumer.as_asgi()),
    re_path(r'ws/niveles/$', consumers.NivelConsumer.as_asgi()),
    re_path(r'ws/hoteles/$', consumers.HotelConsumer.as_asgi()),
    re_path(r'ws/dispositivos/$', consumers.DispositivosConsumer.as_asgi()),
    re_path(r'ws/registros_consumo/$', consumers.RegistrosConsumer.as_asgi()),
    re_path(r'ws/alertas/$', consumers.AlertaConsumer.as_asgi()),
]