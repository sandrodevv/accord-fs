const API_KEY = 'a208c4e08362424af4a4d429';
const BASE_URL = 'https://v6.exchangerate-api.com/v6/';

class CurrencyConverter {
    constructor() {
        this.currentCurrency = 'USD';
        this.prices = {
            usd: { min: [], max: [] },
            gel: { min: [], max: [] }
        };
        this.apartmentPrices = [];
        this.exchangeRateUSD = null;
        this.initialize();
    }

    async initialize() {
        try {
            const responseUSD = await fetch(`${BASE_URL}${API_KEY}/latest/USD`);
            const dataUSD = await responseUSD.json();
            this.exchangeRateUSD = dataUSD.conversion_rates.GEL;
            console.log('Exchange rate data:', dataUSD);
            console.log('GEL rate:', this.exchangeRateUSD);
            
            await this.fetchDetails();
            // Set initial state to USD
            this.setInitialState();
        } catch (error) {
            console.error('Error initializing:', error);
        }
    }

    setInitialState() {
        const inputCurrency = document.querySelector('.input-currency');
        const usdCurrency = document.querySelector('.usdcurrency');
        const gelCurrency = document.querySelector('.gel-currency');
        const productPrice = document.querySelector('.productPrice');

        // Force checkbox to checked state (USD)
        inputCurrency.checked = true;
        
        // Set initial colors
        usdCurrency.style.color = 'Green';
        gelCurrency.style.color = 'Black';

        // Set initial prices to USD
        if (productPrice) {
            productPrice.innerHTML = `${this.prices.usd.min} $ - ${this.prices.usd.max} $`;
        }
        
        // Set initial apartment prices to USD
        this.updateApartmentPrices(true);
    }

    async fetchDetails() {
        try {
            console.log('Fetching product details...');
            const response = await fetch('/api/product-details/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const details = await response.json();
            console.log('Product details received:', details);
            
            this.processAllPrices(details);
            this.setupEventListeners();
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    processAllPrices(details) {
        if (details && details.length > 0) {
            for (let i = 0; i < details.length; i++) {
                let minPrice = details[i].price_min;
                let maxPrice = details[i].price_max;
                
                // Round and store USD prices
                // let roundedMin = this.rounderPrice(minPrice);
                // let roundedMax = this.rounderPrice(maxPrice);
                
                this.prices.usd.min.push(minPrice);
                this.prices.usd.max.push(maxPrice);

                // Convert and store GEL prices
                this.convertPriceUSDtoGEL(minPrice, maxPrice);
            }
        } else {
            console.log('No product details found');
        }
    }

    // New method to process apartment prices
    processApartmentPrices(apartments) {
        if (!this.exchangeRateUSD) {
            console.error('Exchange rate not initialized yet');
            return;
        }

        console.log('Processing apartments:', apartments);
        this.apartmentPrices = apartments.map(apartment => {
            // Ensure we're working with a number
            const price = Number(apartment.price);
 
            
            if (isNaN(price)) {
                console.error('Invalid price for apartment:', apartment);
                return {
                    id: apartment.id,
                    usd: 0,
                    gel: 0
                };
            }

            const usdPrice = this.rounderPrice(price);
            const gelPrice = this.rounderPrice(price * this.exchangeRateUSD);
            

            
            return {
                id: apartment.id,
                usd: usdPrice,
                gel: gelPrice
            };
        });

    }

    // New method to update apartment price displays
    updateApartmentPrices(showUSD) {
        if (!this.exchangeRateUSD) {
            console.error('Exchange rate not initialized yet');
            return;
        }

        console.log('Updating apartment prices, showUSD:', showUSD);
        console.log('Current apartment prices:', this.apartmentPrices);
        
        const apartmentCards = document.querySelectorAll('.apartment-card');
        console.log('Found apartment cards:', apartmentCards.length);
        
        apartmentCards.forEach((card, index) => {
            const priceElement = card.querySelector('.apartment-price p');
            console.log(`Processing card ${index}:`, priceElement);
            console.log(`Price data for index ${index}:`, this.apartmentPrices[index]);
            
            if (priceElement && this.apartmentPrices[index]) {

                if (showUSD) {
                    priceElement.textContent = `${this.apartmentPrices[index].usd} $`;
                } else {
                    priceElement.textContent = `${this.apartmentPrices[index].gel} ₾`;
                }
            }
        });
    }

    rounderPrice(price) {
        return Math.trunc(price);
    }

    convertPriceUSDtoGEL(minPrice, maxPrice) {
        let convertedMin = minPrice * this.exchangeRateUSD;
        let convertedMax = maxPrice * this.exchangeRateUSD;
        
        let roundedConvertedMin = this.rounderPrice(convertedMin);
        let roundedConvertedMax = this.rounderPrice(convertedMax);
        
        this.prices.gel.min.push(roundedConvertedMin);
        this.prices.gel.max.push(roundedConvertedMax);

        console.log(`convertedMin: ${roundedConvertedMin}`);
        console.log(`convertedMax: ${roundedConvertedMax}`);
    }

    setupEventListeners() {
        const inputCurrency = document.querySelector('.input-currency');
        const usdCurrency = document.querySelector('.usdcurrency');
        const gelCurrency = document.querySelector('.gel-currency');
        const productPrice = document.querySelector('.productPrice');

        inputCurrency.addEventListener('change', () => {
            if (inputCurrency.checked) {
                usdCurrency.style.color = 'green';
                gelCurrency.style.color = 'black';
                productPrice.innerHTML = `${this.prices.usd.min} $ - ${this.prices.usd.max} $`;
                this.updateApartmentPrices(true);
            } else {
                usdCurrency.style.color = 'black';
                gelCurrency.style.color = 'yellow';
                productPrice.innerHTML = `${this.prices.gel.min} ₾ - ${this.prices.gel.max} ₾`;
                this.updateApartmentPrices(false);
            }
        });
    }
}

const inputCurrency = document.querySelector('.input-currency');
const usdCurrency = document.querySelector('.usd-currency');
const gelCurrency = document.querySelector('.gel-currency');

// Initialize the converter when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.converter = new CurrencyConverter();
});


// class CurrencyConverter {
//     constructor() {
//         this.currentCurrency = 'USD';
//         this.exchangeRate = 1;
//         // this.gelvalue = 4522;
//         // this.usdvalue = 422;
//         this.initialize();
//         this.waitForElement('.productPrice');
//     }

//     waitForElement(selector) {
//         function checkElement() {
//             const element = document.querySelector(selector);
//             if (element) {
//                 const priceText = element.textContent;
//                 const [minPrice, maxPrice] = priceText.split(' - ').map(price => parseFloat(price));
//                 console.log('Min price:', minPrice);
//                 console.log('Max price:', maxPrice);
//                 return;
//             }
//             setTimeout(checkElement, 100);
//         }
//         checkElement();
//     }

//     async initialize() {
//         try {
//             const responseUSD = await fetch(`${BASE_URL}${API_KEY}/latest/USD`);
//             const responseGEL = await fetch(`${BASE_URL}${API_KEY}/latest/GEL`);
//             const dataUSD = await responseUSD.json();
//             const dataGEL = await responseGEL.json();
//             console.log('Exchange rate data:', dataUSD); // Debug log
//             console.log('Exchange rate data:', dataGEL); // Debug log
//             this.exchangeRateUSD = dataUSD.conversion_rates.GEL;
//             this.exchangeRateGEL = dataGEL.conversion_rates.USD;
//             console.log('GEL rate:', this.exchangeRateUSD); // Debug log
//             console.log('USD rate:', this.exchangeRateGEL); // Debug log
            
//             // Call debug after we have the exchange rates
//             this.debug();
            
//         } catch (error) {
//             console.error('Error fetching exchange rates:', error);
//         }
//     }

//     debug() {
//         // You can put all your debugging code here
//         this.gelvalue = 4522;
//         this.usdvalue = 422;
//         let value = this.gelvalue * this.exchangeRateUSD;
//         let rounded2 = Math.trunc(value);
//         console.log(`from gel to usd: ${rounded2}`);
//         let value2 = value * this.exchangeRateGEL;
//         let rounded = Math.trunc(value2);
//         console.log(`from usd to gel: ${rounded}`);
        
//         // Add more debug logs as needed
//     }
// }

// // Method 3: Call from outside the class
// const converter = new CurrencyConverter();


    