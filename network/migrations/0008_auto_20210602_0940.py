# Generated by Django 3.2 on 2021-06-02 07:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0007_following_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='following',
            name='user',
        ),
        migrations.RemoveField(
            model_name='following',
            name='follow',
        ),
        migrations.AddField(
            model_name='following',
            name='follow',
            field=models.OneToOneField(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='following', to='network.user'),
            preserve_default=False,
        ),
    ]