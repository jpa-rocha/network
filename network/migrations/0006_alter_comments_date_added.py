# Generated by Django 3.2 on 2021-05-27 18:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0005_auto_20210527_2053'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comments',
            name='date_added',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
