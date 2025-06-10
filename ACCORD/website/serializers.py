from rest_framework import serializers
from .models import Product, Category, ProductDetail, ProductApartament, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    # Option 1: Show category name only
    category_name = serializers.StringRelatedField(source='category', read_only=True)
    
    # Option 2: Show full category details
    # category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'square_meter', 'category', 'category_name', 'description', 'image']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'created_at']

class ProductApartamentSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProductApartament
        fields = ['id', 'product_detail', 'square_meter', 'bedrooms', 'price', 'images']

class ProductDetailsSerializer(serializers.ModelSerializer):
    product_name = serializers.StringRelatedField(source='product', read_only=True)
    
    class Meta:
        model = ProductDetail
        fields = [
            'id', 
            'product_name',
            'price_min', 
            'price_max', 
            'bedrooms_min', 
            'bedrooms_max', 
            'square_meter_min', 
            'square_meter_max', 
            'floor'
        ]