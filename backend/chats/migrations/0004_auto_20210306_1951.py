# Generated by Django 3.1.5 on 2021-03-06 19:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("chats", "0003_auto_20210304_0129"),
    ]

    operations = [
        migrations.AlterField(
            model_name="directchatroomstatus",
            name="chat_room",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="statuses",
                to="chats.directchatroom",
            ),
        ),
        migrations.AlterField(
            model_name="modoomchatroomstatus",
            name="chat_room",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="statuses",
                to="chats.modoomchatroom",
            ),
        ),
    ]
