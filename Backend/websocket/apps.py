from django.apps import AppConfig


class WebsocketConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'websocket'

    def ready(self):
        from .mqtt_client import setup_mqtt_client
        setup_mqtt_client()
        import websocket.signals 
