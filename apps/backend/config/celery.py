import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("pallad")

# lit CELERY_* depuis settings.py (namespace CELERY)
app.config_from_object("django.conf:settings", namespace="CELERY")

# autodécouverte des tasks.py dans les apps Django
app.autodiscover_tasks()