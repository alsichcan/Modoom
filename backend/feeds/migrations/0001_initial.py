# Generated by Django 3.1.5 on 2021-03-01 17:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Comment",
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
                ("text", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted", models.BooleanField(default=False)),
                ("n_likes", models.PositiveSmallIntegerField(default=0)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Enrollment",
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
                ("is_leader", models.BooleanField(default=False)),
                ("message", models.TextField(blank=True, max_length=200)),
                ("accepted", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True, null=True)),
                ("deleted", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Modoom",
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
                ("title", models.CharField(blank=True, max_length=40)),
                ("content", models.TextField(blank=True)),
                ("image", models.ImageField(blank=True, upload_to="modoom_img")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True, null=True)),
                ("start_at", models.DateField(null=True)),
                ("end_at", models.DateField(null=True)),
                ("accom", models.PositiveSmallIntegerField(default=6)),
                ("location", models.CharField(blank=True, max_length=20)),
                ("recruit", models.BooleanField(default=True)),
                ("ongoing", models.BooleanField(default=True)),
                ("deletable", models.BooleanField(default=True)),
                ("deleted", models.BooleanField(default=False)),
                ("n_comments", models.PositiveSmallIntegerField(default=0)),
                ("n_likes", models.PositiveSmallIntegerField(default=0)),
                ("n_views", models.PositiveSmallIntegerField(default=0)),
                ("n_members", models.PositiveSmallIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="SubComment",
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
                ("text", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("deleted", models.BooleanField(default=False)),
                ("n_likes", models.PositiveSmallIntegerField(default=0)),
                (
                    "comment",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="subcomments",
                        to="feeds.comment",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
