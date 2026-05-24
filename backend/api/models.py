from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UsuarioManager(BaseUserManager):
    def create_user(self, cpf, nome, password=None, **extra_fields):
        if not cpf:
            raise ValueError('CPF é obrigatório')
        user = self.model(cpf=cpf, nome=nome, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, cpf, nome, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(cpf, nome, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    cpf = models.CharField(max_length=14, unique=True)
    nome = models.CharField(max_length=200)
    data_nascimento = models.DateField(null=True, blank=True)
    telefone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    rua = models.CharField(max_length=200, blank=True)
    numero = models.CharField(max_length=10, blank=True)
    bairro = models.CharField(max_length=100, blank=True)
    complemento = models.CharField(max_length=100, blank=True)
    cidade = models.CharField(max_length=100, blank=True)
    estado = models.CharField(max_length=2, blank=True)
    ubs_preferida = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELDS = ['nome']
    objects = UsuarioManager()

    def __str__(self):
        return f"{self.nome} ({self.cpf})"

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'


class UnidadeSaude(models.Model):
    TIPO_CHOICES = [('UBS', 'UBS'), ('SECRETARIA', 'Secretaria de Saúde'), ('CLINICA', 'Clínica')]
    nome = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='UBS')
    endereco = models.CharField(max_length=300, blank=True)
    cidade = models.CharField(max_length=100, blank=True)
    ativa = models.BooleanField(default=True)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = 'Unidade de Saúde'
        verbose_name_plural = 'Unidades de Saúde'


class Agendamento(models.Model):
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('ATIVA', 'Ativa'),
        ('CANCELADA', 'Cancelada'),
        ('CONCLUIDA', 'Concluída'),
    ]
    TIPO_CHOICES = [
        ('PRESENCIAL', 'Presencial'),
        ('TELEMEDICINA', 'Telemedicina'),
    ]
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='agendamentos')
    unidade = models.ForeignKey(UnidadeSaude, on_delete=models.CASCADE, related_name='agendamentos')
    tipo_atendimento = models.CharField(max_length=20, choices=TIPO_CHOICES, default='PRESENCIAL')
    servico = models.CharField(max_length=200)
    data = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField(blank=True)
    numero_senha = models.CharField(max_length=10)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDENTE')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.numero_senha:
            from django.db.models import Count
            count = Agendamento.objects.filter(
                unidade=self.unidade, data=self.data
            ).count()
            self.numero_senha = str(count + 1).zfill(3)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Senha {self.numero_senha} - {self.usuario.nome} - {self.data}"

    class Meta:
        verbose_name = 'Agendamento'
        verbose_name_plural = 'Agendamentos'
        ordering = ['-criado_em']


class Lembrete(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='lembretes')
    texto = models.CharField(max_length=300)
    data_referencia = models.DateField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lembrete de {self.usuario.nome}: {self.texto}"

    class Meta:
        verbose_name = 'Lembrete'
        verbose_name_plural = 'Lembretes'
        ordering = ['-criado_em']
