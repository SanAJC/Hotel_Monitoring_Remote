# Generated by Django 5.1.5 on 2025-02-23 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('websocket', '0003_habitacion_consumo_desperdicio_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='dispositivo',
            name='off_image',
            field=models.ImageField(default='photos/off_aire.gif', upload_to='photos/'),
        ),
        migrations.AddField(
            model_name='dispositivo',
            name='on_image',
            field=models.ImageField(default='photos/on_aire.gif', upload_to='photos/'),
        ),
    ]
