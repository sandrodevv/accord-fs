from django.contrib import admin

# Register your models here.

from .models import Product, Category, ProductDetail, ProductImage, ProductApartament  # Import the Product model

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1  # Number of empty forms to display

class ProductApartamentInline(admin.TabularInline):
    model = ProductApartament
    extra = 1

class ProductDetailAdmin(admin.ModelAdmin):
    inlines = [ProductApartamentInline]

class ProductApartamentAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    def delete_model(self, request, obj):
        # Delete all images linked to this apartment
        ProductImage.objects.filter(product_apartament=obj).delete()
        # Then delete the apartment
        obj.delete()

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(ProductDetail, ProductDetailAdmin)
admin.site.register(ProductApartament, ProductApartamentAdmin)

# Remove the direct registration of ProductImage since it will be handled through the inline
# admin.site.register(ProductImage)