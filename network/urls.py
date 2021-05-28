
from django.urls import path

from . import views

urlpatterns = [
    path("", views.init, name="init"),
    path("<int:page>", views.index, name="index"),
    path("create", views.createpost, name="create"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("user/<str:username>", views.userpage, name="user"),

# API calls
    path('posts/<int:page_num>',views.posts, name="posts"),
    path('likes', views.likes, name="likes"),
    path('edit/<int:post_id>', views.edit, name='edit'),
    path('comment/<int:post_id>', views.comment, name='comment')
]
