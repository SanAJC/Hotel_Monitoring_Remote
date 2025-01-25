from django.shortcuts import render
from rest_framework import viewsets , status
from rest_framework.response import Response
from rest_framework.decorators import action , permission_classes
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.parsers import MultiPartParser , FormParser
from rest_framework.viewsets import ModelViewSet


class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    @action(detail=False, methods=['get'] ,url_path='hotel-data', permission_classes=[IsAuthenticated] )
    def send(self,request):
        hotel = Hotel.objects.filter(user=request.user).order_by('-fecha_actualizacion').first()

        try:
            serializer=HotelSerializer(hotel)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

       
class HabitacionViewSet(viewsets.ModelViewSet):
    queryset = Habitacion.objects.all()
    serializer_class = HabitacionSerializer

    @action(detail = False, methods=['get'], url_path='habitacion-data', permission_classes=[IsAuthenticated]) 
    def send(self, request):
        habitacion = Habitacion.objects.all()

        try:
            serializers = HabitacionSerializer(habitacion, many=True)
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class DispisitivoViewSet(viewsets.ModelViewSet):
    queryset = Dispositivo.objects.all()
    serializer_class = DispositivoSerializer

    @action(detail = False, methods=['get'], url_path='dispositivo-data', permission_classes=[IsAuthenticated]) 
    def send(self, request):
        dispositivo = Dispositivo.objects.all()

        try:
            serializers = DispositivoSerializer(dispositivo, many=True)
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


        
class RegistroConsumoViewSet(viewsets.ModelViewSet):
    queryset = RegistroConsumo.objects.all()
    serializer_class = ResgistroConsumoSerializer

    @action(detail = False, methods=['get'], url_path='registroconsumo-data', permission_classes=[IsAuthenticated]) 
    def send(self, request):
        registroconsumo = RegistroConsumo.objects.all()

        try:
            serializers = ResgistroConsumoSerializer(registroconsumo, many=True)
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all()
    serializer_class = AlertaSeralizer

    @action(detail = False, methods=['get'], url_path='alerta-data', permission_classes=[IsAuthenticated]) 
    def send(self, request):
        alerta = Alerta.objects.all()

        try:
            serializers = AlertaSeralizer(alerta, many=True)
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)