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

// const rangeInput = document.querySelectorAll(".range-input input"),
// priceInput = document.querySelectorAll(".price-input input"),
// range = document.querySelector(".slider .progress");

// let priceGap = 1000;
// priceInput.forEach(input =>{
//     input.addEventListener("input", e =>{
//         let minVal = parseInt(priceInput[0].value),
//         maxVal = parseInt(priceInput[1].value);
        
//         if((maxVal - minVal >= priceGap) && maxVal <= rangeInput[1].max){
//             if(e.target.className === "input-min"){
//                 rangeInput[0].value = minVal;
//                 range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
//             }else{
//                 rangeInput[1].value = maxPrice;
//                 range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
//             }
//         }
//     });
// });
// rangeInput.forEach(input =>{
//     input.addEventListener("input", e =>{
//         let minVal = parseInt(rangeInput[0].value),
//         maxVal = parseInt(rangeInput[1].value);
//         if((maxVal - minVal) < priceGap){
//             if(e.target.className === "range-min"){
//                 rangeInput[0].value = maxVal - priceGap
//             }else{
//                 rangeInput[1].value = minVal + priceGap;
//             }
//         }else{
//             priceInput[0].value = minVal;
//             priceInput[1].value = maxVal;
//             range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
//             range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
//         }
//     });
// });



// Get DOM elements for the price range slider
const rangevalue = document.querySelector(".slider .price-slider"); // The colored progress bar between sliders
const rangeInputvalue = document.querySelectorAll(".range-input input"); // The range input sliders
const priceInputvalue = document.querySelectorAll(".price-input input"); // The number input fields

// Set minimum price difference between min and max values
let priceGap = 500;

// Initialize slider values on page load
function initializeSliderValues() {
    // Get initial values from number inputs
    let minVal = parseInt(priceInputvalue[0].value);
    let maxVal = parseInt(priceInputvalue[1].value);
    
    // Set range slider values
    rangeInputvalue[0].value = minVal;
    rangeInputvalue[1].value = maxVal;
    
    // Update progress bar
    rangevalue.style.left = `${(minVal / rangeInputvalue[0].max) * 100}%`;
    rangevalue.style.right = `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSliderValues);

// Add event listeners to number input fields
for (let i = 0; i < priceInputvalue.length; i++) {
    priceInputvalue[i].addEventListener("input", e => {
        // Get current min and max values from number inputs
        let minp = parseInt(priceInputvalue[0].value);
        let maxp = parseInt(priceInputvalue[1].value);
        let diff = maxp - minp;

        // Prevent negative minimum price
        if (minp < 0) {
            alert("minimum price cannot be less than 0");
            priceInputvalue[0].value = 0;
            minp = 0;
        }

        // Prevent maximum price above 10000
        if (maxp > 10000) {
            alert("maximum price cannot be greater than 10000");
            priceInputvalue[1].value = 10000;
            maxp = 10000;
        }

        // Ensure minimum price doesn't exceed maximum price minus gap
        if (minp > maxp - priceGap) {
            priceInputvalue[0].value = maxp - priceGap;
            minp = maxp - priceGap;

            // If adjusted minimum price is negative, set to 0
            if (minp < 0) {
                priceInputvalue[0].value = 0;
                minp = 0;
            }
        }

        // Update range sliders and progress bar if price gap is maintained
        if (diff >= priceGap && maxp <= rangeInputvalue[1].max) {
            if (e.target.className === "min-input") {
                // Update minimum range slider and progress bar
                rangeInputvalue[0].value = minp;
                let value1 = rangeInputvalue[0].max;
                rangevalue.style.left = `${(minp / value1) * 100}%`;
            } else {
                // Update maximum range slider and progress bar
                rangeInputvalue[1].value = maxp;
                let value2 = rangeInputvalue[1].max;
                rangevalue.style.right = `${100 - (maxp / value2) * 100}%`;
            }
        }
    });

    // Add event listeners to range input sliders
    for (let i = 0; i < rangeInputvalue.length; i++) {
        rangeInputvalue[i].addEventListener("input", e => {
            // Get current values from range sliders
            let minVal = parseInt(rangeInputvalue[0].value);
            let maxVal = parseInt(rangeInputvalue[1].value);
            let diff = maxVal - minVal;
            
            // Check if price gap is maintained
            if (diff < priceGap) {
                // Adjust values to maintain minimum gap
                if (e.target.className === "min-range") {
                    // If minimum slider moved, adjust it down
                    rangeInputvalue[0].value = maxVal - priceGap;
                } else {
                    // If maximum slider moved, adjust it up
                    rangeInputvalue[1].value = minVal + priceGap;
                }
            } else {
                // Update number inputs and progress bar with new values
                priceInputvalue[0].value = minVal;
                priceInputvalue[1].value = maxVal;
                rangevalue.style.left = `${(minVal / rangeInputvalue[0].max) * 100}%`;
                rangevalue.style.right = `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
            }
        });
    }
}