from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Usuario, UnidadeSaude, Agendamento, Lembrete
from .serializers import (UsuarioSerializer, RegistroSerializer,
                           UnidadeSaudeSerializer, AgendamentoSerializer, LembreteSerializer)


@api_view(['POST'])
@permission_classes([AllowAny])
def registro(request):
    serializer = RegistroSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response({
            'usuario': UsuarioSerializer(user).data,
            'message': 'Conta criada com sucesso!'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def fazer_login(request):
    import re
    cpf = re.sub(r'\D', '', request.data.get('cpf', ''))  # remove pontos e traço
    password = request.data.get('password', '')
    
    # busca pelo CPF normalizado ou formatado
    from .models import Usuario
    try:
        user = Usuario.objects.get(cpf__in=[cpf, f'{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}'])
        from django.contrib.auth import authenticate as auth_check
        if not user.check_password(password):
            user = None
    except Usuario.DoesNotExist:
        user = None

    if user and user.is_active:
        login(request, user)
        return Response({'usuario': UsuarioSerializer(user).data})
    return Response({'error': 'CPF ou senha inválidos.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def fazer_logout(request):
    logout(request)
    return Response({'message': 'Logout realizado.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil(request):
    return Response(UsuarioSerializer(request.user).data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def atualizar_perfil(request):
    serializer = UsuarioSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnidadeSaudeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UnidadeSaude.objects.filter(ativa=True)
    serializer_class = UnidadeSaudeSerializer
    permission_classes = [AllowAny]


class AgendamentoViewSet(viewsets.ModelViewSet):
    serializer_class = AgendamentoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Agendamento.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    def cancelar(self, request, pk=None):
        agendamento = self.get_object()
        if agendamento.status not in ['ATIVA', 'PENDENTE']:
            return Response({'error': 'Não é possível cancelar este agendamento.'},
                            status=status.HTTP_400_BAD_REQUEST)
        agendamento.status = 'CANCELADA'
        agendamento.save()
        return Response(AgendamentoSerializer(agendamento).data)


class LembreteViewSet(viewsets.ModelViewSet):
    serializer_class = LembreteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Lembrete.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
