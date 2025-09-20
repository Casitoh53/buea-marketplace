const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const productGrid = document.getElementById('productGrid');

    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('input', filterProducts);

    function filterProducts() {
      const selectedCategory = categoryFilter.value;
      const selectedPrice = parseInt(priceFilter.value);

      const products = productGrid.querySelectorAll('.product');
      products.forEach(product => {
        const category = product.getAttribute('data-category');
        const price = parseInt(product.getAttribute('data-price'));

        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
        const matchesPrice = price <= selectedPrice;

        product.style.display = (matchesCategory && matchesPrice) ? 'block' : 'none';
      });
    }

    // Login control
    function login() {
      const username = prompt("Enter your username:");
      if (username) {
        document.getElementById("auth-buttons").style.display = "none";
        document.getElementById("user-info").style.display = "flex";
  document.getElementById("welcome-user").innerText = `Welcome, ${username}`;
        localStorage.setItem("username", username);
      }
    }

    function signup() {
      alert("Redirecting to signup page...");
    }

    function logout() {
      localStorage.removeItem("username");
      document.getElementById("auth-buttons").style.display = "block";
      document.getElementById("user-info").style.display = "none";
    }

    window.onload = () => {
      const username = localStorage.getItem("username");
      if (username) {
        document.getElementById("auth-buttons").style.display = "none";
        document.getElementById("user-info").style.display = "flex";
  document.getElementById("welcome-user").innerText = `Welcome, ${username}`;
      }
    };

    // Cart Management
    const cart = [];
    function addToCart(productName, price) {
      cart.push({ name: productName, price });
      updateCart();
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      updateCart();
    }

    function updateCart() {
      const cartList = document.getElementById("cart-list");
      const cartTotal = document.getElementById("cart-total");
      cartList.innerHTML = "";
      let total = 0;

      cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement("li");
  li.innerHTML = `${item.name} - ${item.price} FCFA <button onclick="removeFromCart(${index})">Remove</button>`;
        cartList.appendChild(li);
      });

      cartTotal.innerText = total;
    }