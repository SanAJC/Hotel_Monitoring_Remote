from django.shortcuts import render
from .models import RegistroConsumo, Habitacion, Nivel
from .serializers import RegistroConsumoSerializer
from rest_framework.response import Response
from rest_framework.decorators import action , authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from django.db.models import Sum ,Max ,F, Avg, Count
from django.db.models.functions import TruncDay, TruncMonth
import datetime
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_weekly_consumption_update():
    fecha_inicio = datetime.datetime.now() - datetime.timedelta(days=7)
    
    # Base queryset con filtros comunes
    queryset = RegistroConsumo.objects.filter(
        fecha__range=(fecha_inicio, datetime.datetime.now())
    ).select_related('dispositivo', 'habitacion')
    
    # Agrupar por día, habitación y tipo de dispositivo
    result = queryset.annotate(
        dia=TruncDay('fecha')
    ).values(
        'dia', 
        'habitacion__numero',
        'dispositivo__tipo'
    ).annotate(
        consumo_maximo=Max('consumo'),
        consumo_promedio=Avg('consumo'),
        consumo_total=Sum('consumo'),
        registros_count=Count('id')
    ).order_by('dia', 'habitacion__numero', 'dispositivo__tipo')

    # Transformar los datos para el frontend
    dias = {}
    for item in result:
        dia_str = item['dia'].strftime('%Y-%m-%d')
        habitacion_numero = item['habitacion__numero']
        tipo_dispositivo = item['dispositivo__tipo']
        
        if dia_str not in dias:
            dias[dia_str] = {
                'day': dia_str,
                'habitaciones': {}
            }
            
        if habitacion_numero not in dias[dia_str]['habitaciones']:
            dias[dia_str]['habitaciones'][habitacion_numero] = {
                'dispositivos': {
                    'AIRE': {'max': 0, 'avg': 0, 'total': 0, 'count': 0},
                    'VENTILADOR': {'max': 0, 'avg': 0, 'total': 0, 'count': 0},
                    'TELEVISOR': {'max': 0, 'avg': 0, 'total': 0, 'count': 0},
                    'FOCO_HABITACION': {'max': 0, 'avg': 0, 'total': 0, 'count': 0},
                    'FOCO_BAÑO': {'max': 0, 'avg': 0, 'total': 0, 'count': 0}
                },
                'consumo_total_habitacion': 0
            }
        
        dias[dia_str]['habitaciones'][habitacion_numero]['dispositivos'][tipo_dispositivo] = {
            'max': round(item['consumo_maximo'], 2),
            'avg': round(item['consumo_promedio'], 2),
            'total': round(item['consumo_total'], 2),
            'count': item['registros_count']
        }
        dias[dia_str]['habitaciones'][habitacion_numero]['consumo_total_habitacion'] += item['consumo_total']
    
    # Convertir el diccionario a una lista ordenada por día
    data = []
    for dia in sorted(dias.keys()):
        dia_data = {
            'day': dias[dia]['day'],
            'habitaciones': []
        }
        for habitacion_numero in sorted(dias[dia]['habitaciones'].keys()):
            habitacion_data = {
                'numero': habitacion_numero,
                'dispositivos': dias[dia]['habitaciones'][habitacion_numero]['dispositivos'],
                'consumo_total_habitacion': round(dias[dia]['habitaciones'][habitacion_numero]['consumo_total_habitacion'], 2)
            }
            dia_data['habitaciones'].append(habitacion_data)
        data.append(dia_data)
    
    # Mapear los nombres de los días de la semana
    dias_semana = {
        0: 'Lunes',
        1: 'Martes',
        2: 'Miércoles',
        3: 'Jueves',
        4: 'Viernes',
        5: 'Sábado',
        6: 'Domingo'
    }
    
    # Reemplazar las fechas con los nombres de los días de la semana
    for item in data:
        fecha = datetime.datetime.strptime(item['day'], '%Y-%m-%d')
        item['day'] = dias_semana[fecha.weekday()]
    
    return data

def send_monthly_consumption_update():
    fecha_inicio = datetime.datetime.now() - datetime.timedelta(days=30)
    
    # Base queryset con filtros comunes
    queryset = RegistroConsumo.objects.filter(
        fecha__range=(fecha_inicio, datetime.datetime.now())
    ).select_related('dispositivo', 'habitacion')
    
    # Agrupar por mes y tipo de dispositivo, obteniendo estadísticas adicionales
    result = queryset.annotate(
        mes=TruncMonth('fecha')
    ).values(
        'mes', 
        'dispositivo__tipo',
        'habitacion__numero'
    ).annotate(
        consumo_maximo=Max('consumo'),
        consumo_promedio=Avg('consumo'),
        consumo_total=Sum('consumo'),
        registros_count=Count('id')
    ).order_by('mes', 'dispositivo__tipo', 'habitacion__numero')

    # Transformar los datos para el frontend
    meses = {}
    for item in result:
        mes_str = item['mes'].strftime('%Y-%m')
        tipo_dispositivo = item['dispositivo__tipo']
        habitacion_numero = item['habitacion__numero']

        if mes_str not in meses:
            meses[mes_str] = {
                'month': mes_str,
                'habitaciones': {}    
        }
        
        if habitacion_numero not in meses[mes_str]['habitaciones']:
            meses[mes_str]['habitaciones'][habitacion_numero] = {
                'dispositivos': {
                    'AIRE': {'max': 0, 'avg': 0, 'total': 0, 'count': 0},
                    'VENTILADOR': {'max': 0, 'avg': 0, 'total': 0, 'count': 0},
                    'TELEVISOR': {'max': 0, 'avg': 0, 'total': 0, 'count': 0},
                    'FOCO_HABITACION': {'max': 0, 'avg': 0, 'total': 0, 'count': 0},
                    'FOCO_BAÑO': {'max': 0, 'avg': 0, 'total': 0, 'count': 0}
                },
                'consumo_total_mes': 0
            }
        
        meses[mes_str]['habitaciones'][habitacion_numero]['dispositivos'][tipo_dispositivo] = {
            'max': round(item['consumo_maximo'], 2),
            'avg': round(item['consumo_promedio'], 2),
            'total': round(item['consumo_total'], 2),
            'count': item['registros_count']
        }
        meses[mes_str]['habitaciones'][habitacion_numero]['consumo_total_mes'] += item['consumo_total']
    
    # Convertir el diccionario a una lista ordenada por mes 
    data = []
    for mes in sorted(meses.keys()):
        mes_data = {
            'month': meses[mes]['month'],
            'habitaciones': []
        }
        for habitacion_numero in sorted(meses[mes]['habitaciones'].keys()):
            habitacion_data = {
                'numero': habitacion_numero,
                'dispositivos': meses[mes]['habitaciones'][habitacion_numero]['dispositivos'],
                'consumo_total_habitacion': round(meses[mes]['habitaciones'][habitacion_numero]['consumo_total_mes'], 2)
            }
            mes_data['habitaciones'].append(habitacion_data)
        data.append(mes_data)
    # Mapear los nombres de los meses
    meses_nombres = {
        1: 'Enero',
        2: 'Febrero',
        3: 'Marzo',
        4: 'Abril',
        5: 'Mayo',
        6: 'Junio',
        7: 'Julio',
        8: 'Agosto',
        9: 'Septiembre',
        10: 'Octubre',
        11: 'Noviembre',
        12: 'Diciembre'
    }
    
    # Reemplazar las fechas con los nombres de los meses
    for item in data:
        fecha = datetime.datetime.strptime(item['month'], '%Y-%m')
        item['month'] = meses_nombres[fecha.month]
    
    return data

def send_monthly_consumption_nivel_update():
    fecha_inicio = datetime.datetime.now() - datetime.timedelta(days=30)
    
    # Primero obtenemos todos los niveles disponibles
    niveles = Nivel.objects.values_list('nivel', flat=True)
    
    # Obtener consumo por nivel y mes, incluyendo todos los niveles
    result = RegistroConsumo.objects.filter(
        fecha__range=(fecha_inicio, datetime.datetime.now())
    ).values(
        'habitacion__nivel__nivel'
    ).annotate(
        mes=TruncMonth('fecha')
    ).values(
        'mes',
        'habitacion__nivel__nivel'
    ).annotate(
        consumo_total=Sum('consumo'),
        consumo_maximo=Max('consumo'),
        consumo_promedio=Avg('consumo'),
        registros_count=Count('id')
    ).order_by('mes', 'habitacion__nivel__nivel')

    # Transformar los datos para el frontend
    meses = {}
    for item in result:
        mes_str = item['mes'].strftime('%Y-%m')
        nivel = item['habitacion__nivel__nivel']
        
        if mes_str not in meses:
            meses[mes_str] = {
                'month': mes_str,
                'niveles': {},
                'consumo_total_mes': 0
            }
            
            # Inicializar todos los niveles con valores en cero
            for nivel_disponible in niveles:
                meses[mes_str]['niveles'][f'Nivel {nivel_disponible}'] = {
                    'max': 0,
                    'avg': 0,
                    'total': 0,
                    'count': 0
                }
        
        meses[mes_str]['niveles'][f'Nivel {nivel}'] = {
            'max': round(item['consumo_maximo'], 2),
            'avg': round(item['consumo_promedio'], 2),
            'total': round(item['consumo_total'], 2),
            'count': item['registros_count']
        }
        meses[mes_str]['consumo_total_mes'] += item['consumo_total']
    
    # Convertir a lista y ordenar por mes
    data = [meses[mes] for mes in sorted(meses.keys())]
    
    # Mapear nombres de meses
    meses_nombres = {
        1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
        5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
        9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
    }
    
    # Reemplazar fechas con nombres de meses
    for item in data:
        fecha = datetime.datetime.strptime(item['month'], '%Y-%m')
        item['month'] = meses_nombres[fecha.month]
        item['consumo_total_mes'] = round(item['consumo_total_mes'], 2)
    
    return data

class RecordsViewSet(ViewSet):
    @action(detail=False, methods=['GET'], url_path='record_consumption_week', permission_classes=[IsAuthenticated])
    def record_consumption_week(self, request):
        data = send_weekly_consumption_update()
        return Response(data)
    
    @action(detail=False, methods=['GET'], url_path='record_consumption_month', permission_classes=[IsAuthenticated])
    def record_consumption_month(self, request):
        data = send_monthly_consumption_update()
        return Response(data)
    
    @action(detail=False, methods=['GET'], url_path='record_consumption_nivel_month', permission_classes=[IsAuthenticated])
    def record_consumption_nivel_month(self, request):
        data = send_monthly_consumption_nivel_update()
        return Response(data)
