from rest_framework.viewsets import ViewSet
from websocket.models import *
from openpyxl import Workbook
from rest_framework.decorators import action ,permission_classes
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated, AllowAny

class ReporteViewSet(ViewSet):
    @action(detail=False, methods=['get'] , url_path='file', permission_classes=[IsAuthenticated]) 
    def generar_reporte_excel(self ,request): 
        wb = Workbook()
        
        ws_hotel = wb.create_sheet(title="Hotel")
        ws_hotel.append(['Usuario', 'Consumo Total', 'Presupuesto', 'Fecha Actualización'])
        hotel_data = Hotel.objects.all()
    
        ws_nivel = wb.create_sheet(title="Consumo - Pisos")
        ws_nivel.append(['nivel', 'çonsumo','fecha_actualizacion'])
        nivel_data = Nivel.objects.all()

        ws_habitacion = wb.create_sheet(title="Consumo - Habitaciones")
        ws_habitacion .append(['habitaciones','numero ', 'consumo', 'nivel ','images','presencia_humana','temperatura','humedad','fecha_actualizacion']) 
        habitacion_data = Habitacion.objects.all()

        ws_dispositivos = wb.create_sheet(title="Consumo - Dispositivos")
        ws_dispositivos.append(['habitacion', 'tipo','consumo_actual','estado_remoto','fecha_actualizacion '])
        dispositivos_data = Dispositivo.objects.all()

        ws_consumo = wb.create_sheet(title="RegistroConsumo")
        ws_consumo.append(['dispositivo', 'consumo','fecha'])
        consumo_data = RegistroConsumo.objects.all()

        ws_alerta = wb.create_sheet(title="Alertas")
        ws_alerta.append(['habitacion', 'tipo','fecha_creacion'])
        alerta_data = Alerta.objects.all()


        # Escribir datos de Hoteles
        for item in hotel_data:
            fecha_actualizacion = item.fecha_actualizacion.replace(tzinfo=None) if item.fecha_actualizacion else None
            ws_hotel.append([item.user.username, item.consumo_total, item.presupuesto, fecha_actualizacion])

        # Escribir datos de Niveles
        for item in nivel_data:
            fecha_actualizacion = item.fecha_actualizacion.replace(tzinfo=None) if item.fecha_actualizacion else None
            ws_nivel.append([item.nivel, item.consumo, fecha_actualizacion])

        # Escribir datos de Habitaciones
        for item in habitacion_data:
            fecha_actualizacion = item.fecha_actualizacion.replace(tzinfo=None) if item.fecha_actualizacion else None
            ws_habitacion.append([item.numero, item.consumo, item.nivel.nivel, item.presencia_humana, item.temperatura, item.humedad, fecha_actualizacion])

        # Escribir datos de Dispositivos
        for item in dispositivos_data:
            fecha_actualizacion = item.fecha_actualizacion.replace(tzinfo=None) if item.fecha_actualizacion else None
            ws_dispositivos.append([item.habitacion.numero, item.get_tipo_display(), item.consumo_actual, item.estado_remoto, fecha_actualizacion])

        # Escribir datos de RegistroConsumo
        for item in consumo_data:
            fecha = item.fecha.replace(tzinfo=None) if item.fecha else None
            ws_consumo.append([item.dispositivo.get_tipo_display(), item.consumo, fecha])

        # Escribir datos de Alertas
        for item in alerta_data:
            fecha_creacion = item.fecha_creacion.replace(tzinfo=None) if item.fecha_creacion else None
            ws_alerta.append([item.habitacion.numero, item.get_tipo_display(), fecha_creacion])

        # Eliminar la hoja por defecto (si no se usa)
        if 'Sheet' in wb.sheetnames:
            del wb['Sheet']


        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=reporte_hotel_kamila.xlsx'

        wb.save(response)

        return response