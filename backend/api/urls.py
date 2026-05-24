from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'unidades', views.UnidadeSaudeViewSet, basename='unidade')
router.register(r'agendamentos', views.AgendamentoViewSet, basename='agendamento')
router.register(r'lembretes', views.LembreteViewSet, basename='lembrete')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/registro/', views.registro, name='registro'),
    path('auth/login/', views.fazer_login, name='login'),
    path('auth/logout/', views.fazer_logout, name='logout'),
    path('auth/perfil/', views.perfil, name='perfil'),
    path('auth/perfil/atualizar/', views.atualizar_perfil, name='atualizar_perfil'),
    path('agendamentos/<int:pk>/cancelar/', views.AgendamentoViewSet.as_view({'post': 'cancelar'}), name='cancelar_agendamento'),
]
