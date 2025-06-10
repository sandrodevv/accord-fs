from django.db import models

# Create your models here.

# categories
class Category(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    name = models.CharField(max_length=40)
    square_meter = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    description = models.CharField(max_length=400, default='', blank=True,)
    image = models.ImageField(upload_to='uploads/product/')
    # location
    # estimate price

    def __str__(self):
        return self.name

class ProductDetail(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_details')
    price_min = models.IntegerField(default=0)
    price_max = models.IntegerField(default=0)
    bedrooms_min = models.IntegerField()
    bedrooms_max = models.IntegerField()
    square_meter_min = models.CharField(max_length=20,)
    square_meter_max = models.CharField(max_length=20,)
    floor = models.IntegerField()

    def __str__(self):
        return f"Details for {self.product.name}"

    @property
    def price_range(self):
        return f"{self.price_min}-{self.price_max}"

    @property
    def bedrooms_range(self):
        return f"{self.bedrooms_min}-{self.bedrooms_max}"
    
    @property
    def square_meter_range(self):
        return f"{self.square_meter_min}-{self.square_meter_max}"


class ProductApartament(models.Model):
    product_detail = models.ForeignKey(ProductDetail, on_delete=models.CASCADE, related_name='apartament_details')
    square_meter = models.CharField(max_length=20, default=0)
    bedrooms = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Apartment for {self.product_detail.product.name}"

class ProductImage(models.Model):
    product_apartament = models.ForeignKey(ProductApartament, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='uploads/product_apartaments/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product_apartament}"