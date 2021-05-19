
from django.urls import path

from . import views

urlpatterns = [
    path("<int:page>", views.index, name="index"),
    path("create", views.createpost, name="create"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

# API calls
    path('posts/<int:page_num>',views.posts, name="posts"),
    path('likes', views.likes, name="likes"),
]
