from django.core.management.base import BaseCommand
from website.models import ProductApartament, ProductImage, ProductDetail
from django.db import transaction

class Command(BaseCommand):
    help = 'Clean up data by removing specific apartment and its related data'

    def add_arguments(self, parser):
        parser.add_argument('apartment_id', type=int, help='ID of the apartment to delete')

    def handle(self, *args, **options):
        apartment_id = options['apartment_id']
        
        try:
            with transaction.atomic():
                # Get the apartment
                apartment = ProductApartament.objects.get(id=apartment_id)
                product_detail = apartment.product_detail
                
                # First, update any images to point to a different product_detail
                # or delete them if that's what you want
                images = ProductImage.objects.filter(product_detail=product_detail)
                image_count = images.count()
                
                # Delete images first
                for image in images:
                    image.delete()
                
                self.stdout.write(f'Deleted {image_count} images')
                
                # Then delete the apartment
                apartment.delete()
                self.stdout.write(f'Successfully deleted apartment {apartment_id}')
                
        except ProductApartament.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Apartment with ID {apartment_id} does not exist'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}')) 