from rest_framework import serializers
from .models import *

class HotelSerializer(serializers.ModelSerializer):
    fecha_actualizacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = Hotel
        fields = '__all__'

class NivelSerializer(serializers.ModelSerializer):
    fecha_actualizacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = Nivel
        fields = '__all__'

class HabitacionSerializer(serializers.ModelSerializer):
    hotel = HotelSerializer()
    nivel = NivelSerializer()

    images = serializers.SerializerMethodField()
    fecha_actualizacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Habitacion
        fields = '__all__'

    def get_images(self, obj):
        # devuelve la url de la imagen si existe
        if obj.images:
            return obj.images.url
        return None


class DispositivoSerializer(serializers.ModelSerializer):
    habitacion = HabitacionSerializer()
    fecha_actualizacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = Dispositivo
        fields = '__all__'

class ResgistroConsumoSerializer(serializers.ModelSerializer):
    dispositivo = DispositivoSerializer()
    fecha= serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = RegistroConsumo
        fields = '__all__'

class AlertaSeralizer(serializers.ModelSerializer):
    habitacion = HabitacionSerializer()
    fecha_creacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  
    class Meta:
        model = Alerta
        fields = '__all__'