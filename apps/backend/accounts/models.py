from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone

from .managers import UserManager


class OrganizationPlan(models.TextChoices):
    FREE = "free", "Free"
    PRO = "pro", "Pro"
    BUSINESS = "business", "Business"


class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)
    plan = models.CharField(max_length=32, choices=OrganizationPlan.choices, default=OrganizationPlan.FREE)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.PROTECT, related_name="users")

    is_active = models.BooleanField(default=False)  # on activera après vérification email
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    def __str__(self) -> str:
        return self.email