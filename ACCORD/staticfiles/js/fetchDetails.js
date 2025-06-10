async function fetchDetails() {
    try {
        
        const response = await fetch('/api/product-details/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const details = await response.json();
        
        
        // Display the product details
        displayProductDetails(details);
        // After displaying details, fetch and display apartments
        await fetchimgApart();
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

async function fetchimgApart() {
    try {
        
        const response = await fetch('/api/apartments-with-images/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imgApart = await response.json();
       
        
        // Display the apartment details
        displayimgApart(imgApart);
    } catch (error) {
        console.error('Error fetching apartment details:', error);
    }
}

function displayProductDetails(details) {
    const container = document.getElementById('wrapp');
    if (!container) {
        
        return;
    }

    console.log('All product details:', details);

    if (!details || details.length === 0) {
        container.innerHTML = '<p class="no-details">No product details available at the moment.</p>';
        return;
    }

    container.innerHTML = details.map(detail => {
        
        return `
        <div class="productCard">
          <div class="description">
              <div class="title">
                  <p class="productTxt">Product</p>
                  <p class="productName" >${detail.product_name || 'N/A'}</p>
              </div>
              <div class="price">
                  <p class="productTxt">Price Range</p>
                  <p class="productPrice">${detail.price_min} $ - ${detail.price_max} $</p>
              </div>
              <div class="bedrooms">
                  <p class="productTxt">Bedrooms</p>
                  <p class="productBedrooms">${detail.bedrooms_min} - ${detail.bedrooms_max}</p>
              </div>
              <div class="square-meter">
                  <p class="productTxt">Square Meter</p>
                  <p class="productSquareMeter">${detail.square_meter_min} - ${detail.square_meter_max}</p>
              </div>
              <div class="floor">
                  <p class="productTxt">Floor</p>
                  <p class="productFloor">${detail.floor}</p>
              </div>
          </div>
          <div class="apartamentinfo">
          </div>
      </div>
    `}).join('');
}

function displayimgApart(imgApart) {
    const container = document.querySelector('.apartamentinfo');
    
    if (!container) {
        console.error('img and info container not found');
        return;
    } 

    // Process apartment prices with the currency converter
    if (window.converter) {
        // Wait for exchange rate to be initialized
        const checkExchangeRate = setInterval(() => {
            if (window.converter.exchangeRateUSD) {
                clearInterval(checkExchangeRate);
                window.converter.processApartmentPrices(imgApart);
            }
        }, 100);

        // Clear interval after 5 seconds if exchange rate is not initialized
        setTimeout(() => clearInterval(checkExchangeRate), 5000);
    }

    for (let i = 0; i < imgApart.length; i++) {
        const apartment = imgApart[i];
        console.log('Processing apartment:', apartment);

        // Find primary image or fall back to first image
        let displayImage = null;
        if (apartment.images && apartment.images.length > 0) {
            // Try to find primary image
            const primaryImage = apartment.images.find(img => img.is_primary);
            // If no primary image found, use first image
            displayImage = primaryImage || apartment.images[0];
        }
        
        container.innerHTML += `
        <div class="apartment-card">
          <div class="apartment-images">
            <div class="main-image-container">
                <img src="${displayImage.image}" alt="Apartment image" class="main-image">
            </div>
          </div>
            <div class="apartment-details">
                <div class="apartment-square-meter">
                  <label for="sq">Square Meter</label>
                  <p>${apartment.square_meter}</p>
                </div>
                <div class="apartment-bedrooms">
                  <label for="bed">Bedrooms</label>
                  <p>${apartment.bedrooms}</p>
                </div>
                <div class="apartment-price">
                  <label for="price">Price</label>
                  <p>${apartment.price} $</p> 
                </div>
            </div>              
        </div>
        `;
    }
    
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchDetails);