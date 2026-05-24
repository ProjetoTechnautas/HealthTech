from rest_framework import serializers
from .models import Usuario, UnidadeSaude, Agendamento, Lembrete


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'cpf', 'nome', 'data_nascimento', 'telefone', 'email',
                  'rua', 'numero', 'bairro', 'complemento', 'cidade', 'estado', 'ubs_preferida']
        read_only_fields = ['id']


class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Usuario
        fields = ['cpf', 'nome', 'data_nascimento', 'telefone', 'email',
                  'rua', 'numero', 'bairro', 'complemento', 'cidade', 'estado', 'ubs_preferida', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UnidadeSaudeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadeSaude
        fields = '__all__'


class AgendamentoSerializer(serializers.ModelSerializer):
    unidade_nome = serializers.CharField(source='unidade.nome', read_only=True)
    usuario_nome = serializers.CharField(source='usuario.nome', read_only=True)
    usuario_cpf = serializers.CharField(source='usuario.cpf', read_only=True)
    usuario_nasc = serializers.DateField(source='usuario.data_nascimento', read_only=True)

    class Meta:
        model = Agendamento
        fields = ['id', 'usuario', 'usuario_nome', 'usuario_cpf', 'usuario_nasc',
                  'unidade', 'unidade_nome', 'tipo_atendimento', 'servico',
                  'data', 'hora', 'motivo', 'numero_senha', 'status', 'criado_em', 'atualizado_em']
        read_only_fields = ['id', 'usuario', 'numero_senha', 'criado_em', 'atualizado_em',  # <-- 'usuario' aqui
                            'usuario_nome', 'usuario_cpf', 'usuario_nasc', 'unidade_nome']


class LembreteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lembrete
        fields = ['id', 'usuario', 'texto', 'data_referencia', 'criado_em']
        read_only_fields = ['id', 'criado_em']
