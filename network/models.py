from django.contrib.auth.models import AbstractUser
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    post = models.TextField(max_length=500)
    added = models.DateTimeField(auto_now_add=True)
    user = ForeignKey(User, on_delete=models.CASCADE, related_name="posted")
    def serialize(self):
        return {
            "id": self.id,
            "post": self.post,
            "user" : self.user.username,
            "timestamp" : self.added.strftime("%b %d %Y, %I:%M %p"),
        }

class Comments(models.Model):
    class Meta:
        verbose_name_plural = "comments"
    user = ForeignKey(User, on_delete=models.PROTECT, related_name="ucomments")
    post = ForeignKey(Post, on_delete=models.CASCADE, related_name="pcomments")
    comment = models.TextField(max_length=750)
    date_added = models.DateField(auto_now_add=True)
    def serialize(self):
        return {
            "comment" : self.comment,
            "post_id" : self.post.id,
            "username" : self.user.username,
            "timestamp" : self.date_added.strftime("%b %d %Y, %I:%M %p"),
        }

class Likes(models.Model):
    class Meta:
        verbose_name_plural = "likes"
    post = ForeignKey(Post, on_delete=models.CASCADE, related_name="plikes")
    user = ForeignKey(User, on_delete=models.PROTECT, related_name="ulikes")
    def serialize(self):
        return {
            "post_id" : self.post.id,
            "username" : self.user.username
        }

class Following(models.Model):
    follow = ManyToManyField(User, related_name="following")