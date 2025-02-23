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
        if obj.images:
            return obj.images.url
        return None


class DispositivoSerializer(serializers.ModelSerializer):

    habitacion = HabitacionSerializer()
    on_image = serializers.SerializerMethodField()
    off_image = serializers.SerializerMethodField()
    fecha_actualizacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Dispositivo
        fields = '__all__'

    def get_on_image(self, obj):
     return obj.on_image.url if obj.on_image else None

    def get_off_image(self, obj):
        return obj.off_image.url if obj.off_image else None

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