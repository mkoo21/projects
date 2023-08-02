from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="polls index"),
    path("create", views.create, name="polls create"),
    path("consume", views.consume, name="polls consume")
]