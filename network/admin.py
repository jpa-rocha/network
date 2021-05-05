from django.contrib import admin
from .models import User, Post, Comments, Likes, Following 

# Register your models here.
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comments)
admin.site.register(Likes)
admin.site.register(Following)