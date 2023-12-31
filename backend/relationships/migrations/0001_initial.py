# Generated by Django 3.1.5 on 2021-03-01 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="FriendRequest",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Friendship",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Modoomship",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Review",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("modoom_title", models.CharField(blank=True, max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "rating",
                    models.SmallIntegerField(
                        choices=[(1, "좋아요"), (0, "글쎄요"), (-1, "싫어요")]
                    ),
                ),
                ("message", models.TextField(max_length=500)),
            ],
        ),
    ]
