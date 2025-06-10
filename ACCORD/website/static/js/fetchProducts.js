async function fetchProducts() {
    try {
        console.log('Fetching products...');
        const response = await fetch('/api/home/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        console.log('Products received:', products);
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        const container = document.getElementById('wrapp');
        if (container) {
            container.innerHTML = '<p class="error-message">Error loading products. Please try again later.</p>';
        }
    }
}

function displayProducts(products) {
    const container = document.getElementById('wrapp');
    if (!container) {
        console.error('Products container not found');
        return;
    }

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="no-products">No products available at the moment.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="productCard" data-id="${product.id}" style="cursor: pointer;">
            <div class="imgCard">
                <img src="${product.image}" alt="">
            </div>
            <div class="description">
                <div class="title">
                    <p class="productTxt">Title: ${product.name || 'N/A'}</p>
                </div>
                <div class="locationName">
                    <p class="productTxt">Location: ${product.location || 'N/A'}</p>
                </div>
                <div class="category">
                    <p class="productTxt">Category: ${product.category || 'N/A'}</p>
                </div>
            </div>
        </div>
    `).join('');
        
}



// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchProducts); 
console.log('aadsa')





