let cart = [];

function addToCart(productId) {
    const product = getProductById(productId);
    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: getUserId(), product })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              alert(`${product.name} has been added to the cart.`);
              updateCartCount();
          } else {
              alert('Error adding to cart.');
          }
      });
}

function getProductById(productId) {
    const products = [
        { id: 1, name: 'Product 1', price: 10000 },
        { id: 2, name: 'Product 2', price: 20000 }
    ];
    return products.find(product => product.id === productId);
}

function updateCartCount() {
    fetch('/cart').then(response => response.json())
                  .then(cart => {
                      const cartCountElement = document.getElementById('cart-count');
                      if (cartCountElement) {
                          cartCountElement.textContent = cart.length;
                      }
                  });
}

function displayCart() {
    fetch('/cart').then(response => response.json())
                  .then(cart => {
                      const cartItemsContainer = document.getElementById('cart-items');
                      cartItemsContainer.innerHTML = '';
                      cart.forEach(product => {
                          const item = document.createElement('div');
                          item.className = 'cart-item';
                          item.innerHTML = `
                              <h3>${product.name}</h3>
                              <p>${product.price.toLocaleString()} RWF</p>
                          `;
                          cartItemsContainer.appendChild(item);
                      });
                  });
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
    } else {
        alert('Thank you for your purchase!');
        cart = [];
        displayCart();
        updateCartCount();
    }
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function openProfile() {
    document.getElementById("profile-modal").style.display = "block";
}

function closeProfile() {
    document.getElementById("profile-modal").style.display = "none";
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Login successful');
              closeProfile();
          } else {
              alert('Invalid credentials');
          }
      });
});

function getUserId() {
    // Mock function to return a user ID for demonstration purposes
    return 1;
}
