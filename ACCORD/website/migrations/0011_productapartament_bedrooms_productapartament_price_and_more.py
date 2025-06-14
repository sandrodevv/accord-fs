# Generated by Django 5.2 on 2025-05-26 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0010_remove_productapartament_is_primary'),
    ]

    operations = [
        migrations.AddField(
            model_name='productapartament',
            name='bedrooms',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='productapartament',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
        migrations.AddField(
            model_name='productapartament',
            name='square_meter',
            field=models.CharField(default=0, max_length=20),
        ),
    ]
