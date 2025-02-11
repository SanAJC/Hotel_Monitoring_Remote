from rest_framework.routers import DefaultRouter
from .views import ReporteViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'reporte', ReporteViewSet, basename='reporte')

urlpatterns = [
    path('', include(router.urls)),
]
