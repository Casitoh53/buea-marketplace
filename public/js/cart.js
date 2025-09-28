function formatPrice(price) {
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadCart() {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	const cartItemsContainer = document.getElementById("cart-items");
	const emptyCart = document.getElementById("empty-cart");
	const subtotalEl = document.getElementById("subtotal");
	const totalEl = document.getElementById("total");

	cartItemsContainer.innerHTML = "";

	if (cart.length === 0) {
		emptyCart.style.display = "block";
		subtotalEl.textContent = "0";
		totalEl.textContent = "0";
		return;
	}

	emptyCart.style.display = "none";

	let subtotal = 0;

	cart.forEach((item, index) => {
		const itemSubtotal = item.price * item.quantity;
		subtotal += itemSubtotal;

		const row = document.createElement("tr");
		row.innerHTML = `
        <td>
          <img src="${item.image_url}" alt="${item.name}" width="60" />
          ${item.name}
        </td>
        <td class="price">${formatPrice(item.price)}</td>
        <td class="quantity">
          <input type="number" value="${item.quantity}" min="1" disabled />
        </td>
        <td class="subtotal">${formatPrice(itemSubtotal)}</td>
        <td>
          <button class="btn btn-red" onclick="removeFromCart(${index})">Remove</button>
        </td>
      `;
		cartItemsContainer.appendChild(row);
	});

	subtotalEl.textContent = formatPrice(subtotal);
	totalEl.textContent = formatPrice(subtotal);
}

function removeFromCart(index) {
	let cart = JSON.parse(localStorage.getItem("cart")) || [];
	cart.splice(index, 1);
	localStorage.setItem("cart", JSON.stringify(cart));
	loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);
