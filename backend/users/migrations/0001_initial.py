# Generated by Django 3.1.5 on 2021-03-01 17:47

from django.db import migrations, models
import django.db.models.deletion
import users.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        ("keywords", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="TempUser",
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
                ("email", models.CharField(max_length=100, unique=True)),
                ("verification_code", models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="Profile",
            fields=[
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="profile",
                        serialize=False,
                        to="auth.user",
                    ),
                ),
                ("uid", models.CharField(max_length=32)),
                ("created_at", models.DateTimeField(auto_now_add=True, null=True)),
                ("updated_at", models.DateTimeField(auto_now=True, null=True)),
                ("zoom_url", models.CharField(blank=True, max_length=200)),
                ("first_name", models.CharField(blank=True, max_length=20)),
                ("last_name", models.CharField(blank=True, max_length=20)),
                ("full_name", models.CharField(blank=True, max_length=41)),
                ("nickname", models.CharField(blank=True, max_length=50, unique=True)),
                (
                    "image",
                    models.ImageField(
                        blank=True, upload_to=users.models.Profile.get_screenshot_path
                    ),
                ),
                ("bio", models.TextField(blank=True, max_length=1000)),
                ("n_modoomees", models.PositiveSmallIntegerField(default=0)),
                ("n_friends", models.PositiveSmallIntegerField(default=0)),
                ("n_reviews_received", models.PositiveSmallIntegerField(default=0)),
                ("n_reviews_written", models.PositiveSmallIntegerField(default=0)),
                ("n_modooms", models.PositiveSmallIntegerField(default=0)),
                ("n_modoom_likes", models.PositiveSmallIntegerField(default=0)),
                (
                    "keywords",
                    models.ManyToManyField(
                        blank=True, related_name="profiles", to="keywords.Keyword"
                    ),
                ),
            ],
        ),
    ]