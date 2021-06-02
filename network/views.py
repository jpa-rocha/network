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

def init(request):
    return HttpResponseRedirect(reverse("index", kwargs={'page':1}))

def index(request, page):
    posts = Post.objects.all()
    posts = posts.order_by("-added").all()
    p = Paginator(posts,10)
    pagenums = p.page_range
    return render(request, "network/index.html", {
        'post' : NewPost(),
        'pagenums' : pagenums,
    })

def createpost(request):
    if request.method == "POST":
        post = NewPost(request.POST)
        if post.is_valid():
            user = request.user
            newpost = Post.objects.create(post = post.cleaned_data['post'], user=user)
            newpost.save()
            return HttpResponseRedirect(reverse("index", kwargs={'page':1}))

def userpage(request, username, page):
    user = User.objects.get(username = username)
    posts = Post.objects.filter(user = user)
    posts = posts.order_by("-added").all()
    p = Paginator(posts,10)
    pagenums = p.page_range
    follows = Following.objects.filter(user_id = user.id)
    followed = Following.objects.filter(follow_id = user.id)
    followcount = 0
    for follow in follows:
        followcount += 1
    followedcount = 0
    for follow in followed:
        followedcount += 1
    
    
    
    return render(request, "network/user.html", {
        'pagenums' : pagenums,
        'username' : user.username,
        'joined' : user.date_joined,
        'follows' : followcount,
        'followed' : followedcount
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username = username, password = password)

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
        return HttpResponseRedirect(reverse("index", kwargs={'page':1}))
    else:
        return render(request, "network/register.html")


#API posts
def posts(request, page_num):
    posts = Post.objects.all()
    posts = posts.order_by("-added").all()
    page = Paginator(posts,10)
    return JsonResponse([post.serialize() for post in page.page(page_num)], safe=False)

#API user
def user_posts(request, username, page_num):
    user = User.objects.get(username = username)
    posts = Post.objects.filter(user = user)
    posts = posts.order_by("-added").all()
    page = Paginator(posts,10)
    return JsonResponse([post.serialize() for post in page.page(page_num)], safe=False)

#API likes
def likes(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data['username']
        post = data['post']
        user = User.objects.get(username=username)
        post = Post.objects.get(id = post)
        like = Likes.objects.filter(user_id = user.id, post_id = post.id)
        if like:
            like.delete()
        else:
            newlike = Likes.objects.create(user_id=user.id, post_id=post.id)
            newlike.save()
        return JsonResponse({"message": "Like data sent successfully."}, status=201)
    else:
        likes = Likes.objects.all()
        return JsonResponse([like.serialize() for like in likes], safe=False)

#API edit
def edit(request, post_id):
    try:
        editpost = Post.objects.get(id = post_id)
        if request.method == "PUT":
            data = json.loads(request.body)
            editpost.post = data['post']
            editpost.save()
            return HttpResponse(status=204)
    except editpost.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

#API comments
def comment(request, post_id):
    if request.method == "POST":
        post = Post.objects.get(id = post_id)
        try:
            data = json.loads(request.body)
            user = User.objects.get(username = data['username'])
            newpost = Comments.objects.create(comment = data['comment'], user = user, post = post)
            newpost.save()
            return HttpResponse(status=204)
        except post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
    else:
        comments = Comments.objects.filter(post_id = post_id)
        return JsonResponse([comment.serialize() for comment in comments], safe=False)
