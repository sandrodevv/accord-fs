# Generated by Django 5.2 on 2025-05-06 12:05

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0003_productdetail'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productdetail',
            name='location',
        ),
        migrations.AddField(
            model_name='product',
            name='location',
            field=models.CharField(default=django.utils.timezone.now, max_length=100),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='uploads/product_details/')),
                ('is_primary', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product_detail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='website.productdetail')),
            ],
        ),
    ]
