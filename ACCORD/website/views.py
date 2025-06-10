from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models import Product, ProductDetail, ProductApartament, ProductImage
from .serializers import ProductSerializer, ProductDetailsSerializer, ProductApartamentSerializer, ProductImageSerializer
from django.conf import settings
from django.http import JsonResponse
import os
from dotenv import load_dotenv

# Create your views here.

class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailList(generics.ListAPIView):
    queryset = ProductDetail.objects.all()
    serializer_class = ProductDetailsSerializer

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"message": "No product details found"}, status=status.HTTP_200_OK)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductApartamentList(generics.ListAPIView):
    queryset = ProductApartament.objects.all()
    serializer_class = ProductApartamentSerializer

    def get_queryset(self):
        queryset = ProductApartament.objects.all()
        product_detail_id = self.request.query_params.get('product_detail', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if product_detail_id is not None:
            queryset = queryset.filter(product_detail_id=product_detail_id)
        
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)
        
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)
            
        return queryset


class ProductImageList(generics.ListAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer

    def get_queryset(self):
        queryset = ProductImage.objects.all()
        product_apartament_id = self.request.query_params.get('product_apartament', None)
        if product_apartament_id is not None:
            queryset = queryset.filter(product_apartament_id=product_apartament_id)
        return queryset

# class ProductList(APIView):

#     # handle get requests
#     def get(self, request):
#         products = Product.objects.all()
#         serializer = ProductSerializer(products, many=True)
#         return Response(serializer.data)


def get_api_key(request):
    load_dotenv()
    api_key = os.getenv('EXCHANGE_RATE_API_KEY')
    if not api_key:
        return JsonResponse({'error': 'API key not found'}, status=400)
    return JsonResponse({'api_key': api_key})

        



def home(request):
    
    return render(request, 'index.html')

def products(request):
    if request.method == 'GET':
        products = Product.objects.all()
        product_details = ProductDetail.objects.all()
        apartments = ProductApartament.objects.all()
        images = ProductImage.objects.all()

        data = {
            'products': ProductSerializer(products, many=True).data,
            'product_details': ProductDetailsSerializer(product_details, many=True).data,
            'apartments': ProductApartamentSerializer(apartments, many=True).data,
            'images': ProductImageSerializer(images, many=True).data
        }
        return Response(data, status=status.HTTP_200_OK)
    return render(request, 'product.html')


class product(APIView):
    """
    API endpoint that returns all products and related data
    """
    def get(self, request, format=None):
        product_details = ProductDetail.objects.all()
        apartments = ProductApartament.objects.all()
        images = ProductImage.objects.all()

        data = {
            'product_details': ProductDetailsSerializer(product_details, many=True).data,
            'apartments': ProductApartamentSerializer(apartments, many=True).data,
            'images': ProductImageSerializer(images, many=True).data
        }
        # return Response(data, status=status.HTTP_200_OK)

        return Response(data, status=status.HTTP_200_OK)
    
class product_template(APIView):
    def get(self, request, format=None):
        return render(request, 'product.html')

class ApartmentsWithImages(generics.ListAPIView):
    serializer_class = ProductApartamentSerializer

    def get_queryset(self):
        # Use select_related to optimize the query for product_detail
        # Use prefetch_related to optimize the query for images
        queryset = ProductApartament.objects.select_related('product_detail').prefetch_related('images')
        
        product_detail_id = self.request.query_params.get('product_detail', None)
        if product_detail_id is not None:
            queryset = queryset.filter(product_detail_id=product_detail_id)
        return queryset



