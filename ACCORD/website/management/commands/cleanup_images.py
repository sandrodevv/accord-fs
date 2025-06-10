from django.core.management.base import BaseCommand
from website.models import ProductImage

class Command(BaseCommand):
    help = 'Delete all existing images to prepare for model change'

    def handle(self, *args, **options):
        try:
            # Delete all images
            count = ProductImage.objects.count()
            ProductImage.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} images'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}')) 