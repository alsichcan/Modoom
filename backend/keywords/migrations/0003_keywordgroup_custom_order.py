# Generated by Django 3.1.5 on 2021-03-06 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("keywords", "0002_auto_20210306_1843"),
    ]

    operations = [
        migrations.AddField(
            model_name="keywordgroup",
            name="custom_order",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
