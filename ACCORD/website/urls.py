from django.urls import path, include
from . import views
from .views import ProductList, home, products,  ProductDetailList, ProductApartamentList, ProductImageList, product, product_template, ApartmentsWithImages

urlpatterns = [
    path('', home, name='home'),
    path('api/home/', ProductList.as_view(), name='api_home'),
    path('api/products/', product.as_view(), name='api_products'),
    path('api/product-details/', ProductDetailList.as_view(), name='api_product_details'),
    path('api/apartaments/', ProductApartamentList.as_view(), name='api_apartaments'),
    path('api/images/', ProductImageList.as_view(), name='api_images'),
    path('api/apartments-with-images/', ApartmentsWithImages.as_view(), name='api_apartments_with_images'),
    path('product/', product_template.as_view(), name='product'),
    path('api/get-api-key/', views.get_api_key, name='get_api_key'),
]
