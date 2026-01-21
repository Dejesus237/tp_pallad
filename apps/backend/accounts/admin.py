from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User, Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "plan", "created_at")
    search_fields = ("name",)
    list_filter = ("plan",)


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("email",)
    list_display = ("email", "organization", "is_active", "is_staff", "last_login")
    search_fields = ("email", "organization__name")
    list_filter = ("is_active", "is_staff", "organization__plan")

    fieldsets = (
        (None, {"fields": ("email", "password", "organization")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {"fields": ("email", "password1", "password2", "organization", "is_staff", "is_active")}),
    )

    readonly_fields = ("date_joined", "last_login")

    # DjangoUserAdmin attend ces champs
    username_field = "email"