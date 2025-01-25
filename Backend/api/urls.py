from django.urls import path ,include
from rest_framework.routers import DefaultRouter
from .views import *

router= DefaultRouter()
router.register(r'hotel',HotelViewSet)
router.register(r'habitacion',HabitacionViewSet)
router.register(r'dispositivo',DispisitivoViewSet)
router.register(r'resgistrosConsumo',RegistroConsumoViewSet)
router.register(r'alertas',AlertaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
