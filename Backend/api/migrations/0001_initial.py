# Generated by Django 5.1.2 on 2025-01-12 21:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Habitacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero', models.PositiveIntegerField()),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Piso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nivel', models.PositiveIntegerField()),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Dispositivo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(choices=[('AIRE', 'Aire Acondicionado'), ('VENTILADOR', 'Ventilador'), ('TELEVISOR', 'Televisor'), ('FOCO_HABITACION', 'Foco Habitación'), ('FOCO_BANO', 'Foco Baño')], max_length=50)),
                ('consumo_actual', models.FloatField(default=0.0)),
                ('apagado_remoto', models.BooleanField(default=False)),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
                ('habitacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dispositivos', to='api.habitacion')),
            ],
        ),
        migrations.AddField(
            model_name='habitacion',
            name='piso',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='habitaciones', to='api.piso'),
        ),
    ]