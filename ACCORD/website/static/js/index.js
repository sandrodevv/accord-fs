



document.addEventListener('DOMContentLoaded', function() {
    // wait for the page to load
    document.addEventListener('click', function(event) {
        // Check if the clicked element or its parent has the imgCard class
        const imgCard = event.target.closest('.imgCard');
        const productCard = event.target.closest('.productCard');
        const productId = productCard.getAttribute('data-id');
        if (productCard) {
            window.location.href = `/product/?id=${productId}`
        }
        
    });
});
