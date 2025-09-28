// products.js - Refactored with Cookie Auth Check
class ProductManager {
	constructor() {
		this.products = [];
		this.filteredProducts = [];
		this.currentFilter = "all";
		this.cart = JSON.parse(localStorage.getItem("cart")) || [];
		this.init();
	}

	init() {
		this.loadProducts();
		this.setupEventListeners();
		this.setupAuthManagement();
		this.updateCartUI();
	}

	// ---------- Product Loading ----------
	async loadProducts() {
		const res = await fetch("/data/products.json");
		const productsData = await res.json();
		this.products = productsData.products.map((product) => ({
			...product,
			isNew: this.isProductNew(product.timestamp),
			isBestSeller: product.quantity_sold > 20,
		}));

		this.applyFilter("all");
	}

	isProductNew(timestamp) {
		const productDate = new Date(timestamp);
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		return productDate > thirtyDaysAgo;
	}

	// ---------- Event Listeners ----------
	setupEventListeners() {
		// Tab filtering
		document.querySelectorAll(".products .tab").forEach((tab) => {
			tab.addEventListener("click", () => {
				this.applyFilter(tab.dataset.filter);
			});
		});
	}

	// ---------- Filtering ----------
	applyFilter(filter) {
		this.currentFilter = filter;

		// Update active tab
		document.querySelectorAll(".products .tab").forEach((tab) => {
			const isActive = tab.dataset.filter === filter;
			tab.classList.toggle("is-active", isActive);
			tab.setAttribute("aria-selected", isActive);
		});

		// Filter products
		switch (filter) {
			case "new":
				this.filteredProducts = this.products.filter(
					(product) => product.isNew
				);
				break;
			case "best":
				this.filteredProducts = this.products
					.filter((product) => product.isBestSeller)
					.sort((a, b) => b.quantity_sold - a.quantity_sold);
				break;
			case "top":
				this.filteredProducts = [...this.products].sort(
					(a, b) => b.rating - a.rating
				);
				break;
			default:
				this.filteredProducts = this.products;
		}

		this.renderProducts();
	}

	// ---------- Rendering ----------
	renderProducts() {
		const productGrid = document.querySelector(".product-grid");
		productGrid.innerHTML = "";

		this.filteredProducts.forEach((product) => {
			const productElement = this.createProductCard(product);
			productGrid.appendChild(productElement);
		});

		this.setupProductInteractions();
	}

	createProductCard(product) {
		const article = document.createElement("article");
		article.className = "product";
		article.dataset.id = product.id;
		article.dataset.category = product.category.toLowerCase();

		const isNew = this.isProductNew(product.timestamp);
		const isBestSeller = product.quantity_sold > 100;

		article.innerHTML = `
      <figure class="product-media">
        <img src="${product.image_url}" alt="${product.name}" />
        ${isNew ? '<span class="badge">New</span>' : ""}
        ${
			isBestSeller
				? '<span class="badge best-seller">Best Seller</span>'
				: ""
		}
        
        <div class="product-info-overlay">
          <span class="quantity-sold">${product.quantity_sold} sold</span>
          <span class="timestamp">${this.formatDate(product.timestamp)}</span>
        </div>
        
        <div class="product-actions">
          <button class="wishlist-btn" aria-label="Add to wishlist">
            <i class="ri-heart-3-line"></i>
          </button>
          <button class="quick-view-btn" aria-label="Quick view">
            <i class="ri-eye-line"></i>
          </button>
        </div>
      </figure>
      
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-meta">
          <span class="price">${this.formatPrice(product.price)} XAF</span>
          <span class="rating" aria-label="${product.rating} out of 5">
            ${this.generateStarRating(product.rating)}
          </span>
        </div>
        <button class="add-to-cart-btn" data-product-id="${product.id}">
          <i class="ri-shopping-cart-line"></i>
          Add to Cart
        </button>
      </div>
    `;

		return article;
	}

	formatPrice(price) {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	formatDate(timestamp) {
		const date = new Date(timestamp);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "1 day ago";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		return `${Math.floor(diffDays / 30)} months ago`;
	}

	generateStarRating(rating) {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;

		for (let i = 0; i < fullStars; i++) {
			stars.push('<i class="ri-star-fill"></i>');
		}

		if (hasHalfStar) {
			stars.push('<i class="ri-star-half-line"></i>');
		}

		const emptyStars = 5 - stars.length;
		for (let i = 0; i < emptyStars; i++) {
			stars.push('<i class="ri-star-line"></i>');
		}

		return stars.join("");
	}

	// ---------- Interactions ----------
	setupProductInteractions() {
		// Add to cart functionality
		document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				const productId = button.dataset.productId;
				this.addToCart(productId);
			});
		});

		// Wishlist functionality
		document.querySelectorAll(".wishlist-btn").forEach((button) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				button.classList.toggle("active");
				button.innerHTML = button.classList.contains("active")
					? '<i class="ri-heart-3-fill"></i>'
					: '<i class="ri-heart-3-line"></i>';
			});
		});
	}

	// ---------- Cart Management ----------
	addToCart(productId) {
		// ✅ check for cookie auth
		const authToken = this.getCookie("sb-access-token");
		if (!authToken) {
			// no cookie → redirect to Express login
			window.location.href = "/login";
			return;
		}

		const product = this.products.find((p) => p.id === productId);
		if (!product) return;

		const existingItem = this.cart.find((item) => item.id === productId);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			this.cart.push({
				...product,
				quantity: 1,
			});
		}

		this.saveCart();
		this.updateCartUI();
		this.showCartNotification(product.name);

		// Dispatch custom event
		document.dispatchEvent(
			new CustomEvent("cartUpdated", { detail: { product } })
		);
	}

	showCartNotification(productName) {
		const notification = document.createElement("div");
		notification.className = "cart-notification";
		notification.innerHTML = `
      <i class="ri-checkbox-circle-fill"></i>
      ${productName} added to cart
    `;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.classList.add("show");
		}, 100);

		setTimeout(() => {
			notification.classList.remove("show");
			setTimeout(() => {
				document.body.removeChild(notification);
			}, 300);
		}, 3000);
	}

	saveCart() {
		localStorage.setItem("cart", JSON.stringify(this.cart));
	}

	updateCartUI() {
		const cartCount = this.cart.reduce(
			(total, item) => total + item.quantity,
			0
		);
		const cartBadge = document.querySelector(".nav-actions .badge");

		if (cartBadge) {
			cartBadge.textContent = cartCount;
			cartBadge.style.display = cartCount > 0 ? "flex" : "none";
		}
	}

	// ---------- Auth ----------
	setupAuthManagement() {
		// Now use cookie auth instead of localStorage
		const authToken = this.getCookie("auth_token");
		if (authToken) {
			document.getElementById("auth-buttons").style.display = "none";
			document.getElementById("user-info").style.display = "flex";
			document.getElementById("welcome-user").textContent =
				"Welcome back!";
		}
	}

	// ---------- Cookie Helper ----------
	getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(";").shift();
		return null;
	}
}

// Tab Filtering (Standalone function for backward compatibility)
function initTabFilter() {
	const tabs = document.querySelectorAll(".products .tab");

	tabs.forEach((tab) => {
		tab.addEventListener("click", function () {
			const filter = this.dataset.filter;

			// Update active state
			tabs.forEach((t) => {
				t.classList.toggle("is-active", t === this);
				t.setAttribute("aria-selected", t === this);
			});

			// If ProductManager is available, use it
			if (window.productManager) {
				window.productManager.applyFilter(filter);
			}
		});
	});
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	window.productManager = new ProductManager();
	initTabFilter();
});
