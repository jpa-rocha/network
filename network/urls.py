
from django.urls import path

from . import views

urlpatterns = [
    path('', views.init, name='init'),
    path('<int:page>', views.index, name='index'),
    path('create', views.createpost, name='create'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name='register'),
    path('user/<str:username>/<int:page>', views.userpage, name='user'),
    path('following/<int:page>', views.following, name='following'),

# API calls
    path('posts/<int:page_num>',views.posts, name='posts'),
    path('user_posts/<str:username>/<int:page_num>',views.user_posts, name='userposts'),
    path('following_posts/<int:page_num>', views.following_posts, name='followingposts'),
    path('likes', views.likes, name='likes'),
    path('edit/<int:post_id>', views.edit, name='edit'),
    path('comment/<int:post_id>', views.comment, name='comment'),
    path('follow', views.follow, name='follow')
]
