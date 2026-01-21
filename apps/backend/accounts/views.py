import os
from django.contrib.auth import authenticate, login, logout
from django.contrib.sessions.models import Session
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


SESSION_REMEMBER_SECONDS = int(os.getenv("DJANGO_SESSION_REMEMBER_SECONDS", "604800"))  # 7 jours


# ---------- helpers ----------

def _delete_sessions_for_user(user_id: int) -> None:
    # Simple au début (OK à petite échelle). On optimisera plus tard.
    now = timezone.now()
    for s in Session.objects.filter(expire_date__gt=now):
        data = s.get_decoded()
        if str(data.get("_auth_user_id")) == str(user_id):
            s.delete()


# ---------- schema ----------

login_request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["email", "password"],
    properties={
        "email": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL, example="admin@pallad.fr"),
        "password": openapi.Schema(type=openapi.TYPE_STRING, example="ChangeMe_123!"),
        "remember_me": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
    },
)

ok_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "ok": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
    },
)

me_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "authenticated": openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
        "user": openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL),
                "organization": openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                        "plan": openapi.Schema(type=openapi.TYPE_STRING, example="business"),
                    },
                ),
            },
        ),
    },
)

error_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "detail": openapi.Schema(type=openapi.TYPE_STRING),
    },
)


# ---------- views ----------


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_id="auth_csrf",
        operation_description="Sets the CSRF cookie.",
        responses={200: ok_response_schema},
    )
    def get(self, request):
        return Response({"ok": True})


class LoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_id="auth_login",
        request_body=login_request_schema,
        responses={
            200: ok_response_schema,
            400: error_response_schema,
            403: error_response_schema,
        },
    )
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        remember_me = bool(request.data.get("remember_me", False))

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({"detail": "Invalid credentials"}, status=400)
        if not user.is_active:
            return Response({"detail": "Account not active"}, status=403)

        # 1 session par user : purge des autres sessions
        _delete_sessions_for_user(user.id)

        login(request, user)
        request.session.set_expiry(SESSION_REMEMBER_SECONDS if remember_me else 0)

        return Response({"ok": True})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="auth_me",
        responses={200: me_response_schema, 401: error_response_schema},
    )
    def get(self, request):
        u = request.user
        return Response(
            {
                "authenticated": True,
                "user": {
                    "email": u.email,
                    "organization": {
                        "id": u.organization_id,
                        "name": u.organization.name,
                        "plan": u.organization.plan,
                    },
                },
            }
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="auth_logout",
        responses={200: ok_response_schema},
    )
    def post(self, request):
        logout(request)
        return Response({"ok": True})


class LogoutAllView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="auth_logout_all",
        responses={200: ok_response_schema},
    )
    def post(self, request):
        _delete_sessions_for_user(request.user.id)
        logout(request)
        return Response({"ok": True})