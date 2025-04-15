from django.db import models
from django.conf import settings


class Hotel(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  
        on_delete=models.CASCADE,
        related_name="hoteles"
    )
    consumo_total = models.FloatField(default=0.0)
    presupuesto = models.FloatField(default=0.0)
    consumo_desperdicio_total = models.FloatField(default=0.0) 
    eficiencia_energetica = models.FloatField(default=0.0)
    kilo_vatio_hora_costo = models.FloatField(default=1.122) 
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Hotel de {self.user} - Consumo Total {self.consumo_total}"

    def actualizar_consumo_total(self):
        self.consumo_total = sum(habitacion.consumo for habitacion in self.habitaciones.all())
        self.save()

    def actualizar_desperdicio_total(self):
        self.consumo_desperdicio_total = sum(habitacion.consumo_desperdicio for habitacion in self.habitaciones.all())
        self.save()

    def actualizar_eficiencia(self):
        if self.consumo_total == 0:
            self.eficiencia_energetica = 0.0
        else:
            self.eficiencia_energetica = (
                (self.consumo_total - self.consumo_desperdicio_total) / self.consumo_total
            ) * 100
        self.save()

    def actualizar_presupuesto(self):
        self.presupuesto = self.consumo_total * self.kilo_vatio_hora_costo
        self.save()

class Nivel(models.Model):
    nivel = models.IntegerField(default=1)
    consumo = models.FloatField(default=0.0)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Nivel {self.nivel}"
    
    def actualizar_consumo(self):
        habitaciones = Habitacion.objects.filter(nivel=self)
        self.consumo = sum(habitacion.consumo for habitacion in habitaciones)
        self.save()
    

class Habitacion(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="habitaciones", default=1)
    numero = models.PositiveIntegerField()
    consumo = models.FloatField(default=0.0)
    nivel = models.ForeignKey(Nivel,on_delete=models.CASCADE, related_name="niveles")
    images=models.ImageField(upload_to='photos/',default='photos/habitacion1.png')
    presencia_humana = models.BooleanField(default=False)
    temperatura = models.FloatField(default=0.0)
    humedad = models.FloatField(default=0.0)
    consumo_desperdicio = models.FloatField(default=0.0)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Habitación {self.numero} - Nivel {self.nivel}"
    
    def actualizar_consumo_total(self):
        dispositivos = self.dispositivos.all()
        self.consumo = sum(dispositivo.consumo_acumulado for dispositivo in dispositivos)
        self.save()

        self.nivel.actualizar_consumo()
        self.hotel.actualizar_consumo_total()
        self.hotel.actualizar_desperdicio_total()
        self.hotel.actualizar_eficiencia()
        self.hotel.actualizar_presupuesto()
        

class Dispositivo(models.Model):
    TIPOS_DISPOSITIVO = [
        ('AIRE', 'Aire Acondicionado'),
        ('VENTILADOR', 'Ventilador'),
        ('TELEVISOR', 'Televisor'),
        ('FOCO_HABITACION', 'Foco Habitación'),
        ('FOCO_BAÑO', 'Foco Baño'),
    ]
    ESTADO_APAGADO_REMOTO = [
        ('APAGAR', 'Apagar'),
        ('ENCENDER', 'Encender'),
    ]

    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE, related_name="dispositivos")
    tipo = models.CharField(max_length=50, choices=TIPOS_DISPOSITIVO)
    consumo_actual = models.FloatField(default=0.0)
    consumo_acumulado = models.FloatField(default=0.0)
    estado_remoto = models.CharField(max_length=10, choices=ESTADO_APAGADO_REMOTO, default='ENCENDER')
    on_image=models.ImageField(upload_to='photos/',default='photos/on_aire.gif')
    off_image=models.ImageField(upload_to='photos/',default='photos/off_aire.gif')
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_tipo_display()} - Habitación {self.habitacion.numero}"

class RegistroConsumo(models.Model):
    dispositivo = models.ForeignKey(Dispositivo, on_delete=models.CASCADE, related_name="registros")
    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE, related_name="registros_consumo", null=True)
    consumo = models.FloatField()
    estado_remoto = models.CharField(max_length=10, null=True, blank=True)
    
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.dispositivo.get_tipo_display()} - Hab: {self.habitacion.numero if self.habitacion else 'N/A'} - {self.consumo} kWh - {self.fecha}"

class RegistroPresencia(models.Model):
    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE, related_name="registros_presencia")
    presencia_humana = models.BooleanField(default=False)
    temperatura = models.FloatField(null=True, blank=True)
    humedad = models.FloatField(null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Registro de presencia - Habitación {self.habitacion.numero} - {self.presencia_humana} - {self.fecha}"  
    
class Alerta(models.Model):
    TIPOS_ALERTA = [
        ('CONSUMO_ALTO', 'Consumo Alto'),
        ('FALLA_SENSOR', 'Falla de Sensor'),
        ('APAGADO_MANUAL', 'Apagado Manual'),
        
    ]

    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE, related_name="alertas")
    tipo = models.CharField(max_length=50, choices=TIPOS_ALERTA)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alerta {self.tipo} - {self.habitacion}"

