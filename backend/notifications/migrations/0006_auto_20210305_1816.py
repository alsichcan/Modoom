# Generated by Django 3.1.5 on 2021-03-05 18:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_profile_reset_code"),
        ("notifications", "0005_auto_20210305_1758"),
    ]

    operations = [
        migrations.AlterField(
            model_name="email",
            name="recipient",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="emails",
                to="users.profile",
            ),
            preserve_default=False,
        ),
    ]
