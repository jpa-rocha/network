from django.contrib.auth.models import AbstractUser
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    post = models.TextField(max_length=500)
    added = models.DateField(auto_now_add=True)
    

class Comments(models.Model):
    class Meta:
        verbose_name_plural = "comments"
    user = ForeignKey(User, on_delete=models.PROTECT, related_name="comments")
    post = ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField(max_length=750)
    date_added = models.DateField(auto_now_add=True)

class Likes(models.Model):
    class Meta:
        verbose_name_plural = "likes"
    likes = models.IntegerField
    post = ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    user = ForeignKey(User, on_delete=models.PROTECT, related_name="likes")

class Following(models.Model):
    follow = ManyToManyField(User, related_name="following")