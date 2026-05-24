from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, UnidadeSaude, Agendamento, Lembrete


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ['nome', 'cpf', 'cidade', 'ubs_preferida', 'criado_em']
    search_fields = ['nome', 'cpf', 'email']
    ordering = ['-criado_em']
    fieldsets = (
        (None, {'fields': ('cpf', 'password')}),
        ('Informações Pessoais', {'fields': ('nome', 'data_nascimento', 'telefone', 'email')}),
        ('Endereço', {'fields': ('rua', 'numero', 'bairro', 'complemento', 'cidade', 'estado')}),
        ('Saúde', {'fields': ('ubs_preferida',)}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('cpf', 'nome', 'password1', 'password2'),
        }),
    )


@admin.register(UnidadeSaude)
class UnidadeSaudeAdmin(admin.ModelAdmin):
    list_display = ['nome', 'tipo', 'cidade', 'ativa']
    list_filter = ['tipo', 'ativa']


@admin.register(Agendamento)
class AgendamentoAdmin(admin.ModelAdmin):
    list_display = ['numero_senha', 'usuario', 'unidade', 'servico', 'data', 'hora', 'status']
    list_filter = ['status', 'tipo_atendimento', 'data']
    search_fields = ['usuario__nome', 'usuario__cpf', 'servico']


@admin.register(Lembrete)
class LembreteAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'texto', 'data_referencia', 'criado_em']
