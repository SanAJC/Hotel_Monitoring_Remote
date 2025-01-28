from rest_framework import serializers
from .models import *

class HotelSerializer(serializers.ModelSerializer):
    fecha_actualizacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = Hotel
        fields = '__all__'

class HabitacionSerializer(serializers.ModelSerializer):
    fecha_actualizacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = Habitacion
        fields = '__all__'

class DispositivoSerializer(serializers.ModelSerializer):
    fecha_actualizacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = Dispositivo
        fields = '__all__'

class ResgistroConsumoSerializer(serializers.ModelSerializer):
    fecha= serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    class Meta:
        model = RegistroConsumo
        fields = '__all__'

class AlertaSeralizer(serializers.ModelSerializer):
    fecha_creacion = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  
    class Meta:
        model = Alerta
        fields = '__all__'