from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.forms.widgets import Textarea
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.core.paginator import Paginator
import json

from .models import User, Post, Comments, Likes, Following


class NewPost(forms.ModelForm):
    class Meta:  
         model = Post
         fields = ['post']
         labels = {
            'post': '',
        }
         widgets = {
             'post' : Textarea(attrs={
                 'id' : 'newpost',
                 'rows' : '4'
             })
         }

def index(request, page):
    posts = Post.objects.all()
    posts = posts.order_by("-added").all()
    p = Paginator(posts,10)
    pagenums = p.page_range
    return render(request, "network/index.html", {
        'post' : NewPost(),
        'pagenums' : pagenums,
    })

def createpost (request):
    if request.method == "POST":
        post = NewPost(request.POST)
        if post.is_valid():
            user = request.user
            newpost = Post.objects.create(post = post.cleaned_data['post'], user=user)
            newpost.save()
            return HttpResponseRedirect(reverse("index", kwargs={'page':1}))

def posts(request, page_num):
    posts = Post.objects.all()
    posts = posts.order_by("-added").all()
    page = Paginator(posts,10)
    return JsonResponse([post.serialize() for post in page.page(page_num)], safe=False)

def likes(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data['username']
        post = data['post']
        user = User.objects.get(username=username)
        post = Post.objects.get(id = post)
        like = Likes.objects.filter(user_id=user.id, post_id=post.id)
        if like:
            like.delete()
        else:
            newlike = Likes.objects.create(user_id=user.id, post_id=post.id)
            newlike.save()
        return JsonResponse({"message": "Like data sent successfully."}, status=201)
    else:
        likes = Likes.objects.all()
        return JsonResponse([like.serialize() for like in likes], safe=False)

def edit(request, post_id):
    editpost = Post.objects.get(id = post_id)
    if request.method == "PUT":
        data = json.loads(request.body)
        print(data['post'])
        editpost.post = data['post']
        editpost.save()
        return HttpResponse(status=204)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index", kwargs={'page':1}))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index", kwargs={'page':1}))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
