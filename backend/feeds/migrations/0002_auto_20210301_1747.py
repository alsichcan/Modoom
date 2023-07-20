# Generated by Django 3.1.5 on 2021-03-01 17:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("feeds", "0001_initial"),
        ("users", "0001_initial"),
        ("keywords", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="subcomment",
            name="likes",
            field=models.ManyToManyField(
                blank=True, related_name="liked_subcomments", to="users.Profile"
            ),
        ),
        migrations.AddField(
            model_name="subcomment",
            name="profile",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="subcomments",
                to="users.profile",
            ),
        ),
        migrations.AddField(
            model_name="modoom",
            name="keywords",
            field=models.ManyToManyField(related_name="modooms", to="keywords.Keyword"),
        ),
        migrations.AddField(
            model_name="modoom",
            name="likes",
            field=models.ManyToManyField(
                blank=True, related_name="liked_modooms", to="users.Profile"
            ),
        ),
        migrations.AddField(
            model_name="modoom",
            name="profile",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="modooms",
                to="users.profile",
            ),
        ),
        migrations.AddField(
            model_name="enrollment",
            name="modoom",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="enrollments",
                to="feeds.modoom",
            ),
        ),
        migrations.AddField(
            model_name="enrollment",
            name="profile",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="enrollments",
                to="users.profile",
            ),
        ),
        migrations.AddField(
            model_name="comment",
            name="likes",
            field=models.ManyToManyField(
                blank=True, related_name="liked_comments", to="users.Profile"
            ),
        ),
        migrations.AddField(
            model_name="comment",
            name="modoom",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="comments",
                to="feeds.modoom",
            ),
        ),
        migrations.AddField(
            model_name="comment",
            name="profile",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="comments",
                to="users.profile",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="enrollment",
            unique_together={("modoom", "profile")},
        ),
    ]
