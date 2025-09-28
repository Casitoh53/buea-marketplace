function formatPrice(price) {
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadSummary() {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	const orderItemsDiv = document.getElementById("orderItems");
	let subtotal = 0;

	orderItemsDiv.innerHTML = cart
		.map((item) => {
			const itemTotal = item.price * item.quantity;
			subtotal += itemTotal;
			return `<p>${item.name} x ${item.quantity} = ${formatPrice(
				itemTotal
			)} CFA</p>`;
		})
		.join("");

	document.getElementById("subtotal").innerText = formatPrice(subtotal);
	document.getElementById("total").innerText = formatPrice(subtotal);
}

async function placeOrder(e) {
	e.preventDefault();

	const btn = document.getElementById("placeOrderBtn");
	btn.disabled = true;
	btn.innerText = "Loading..."; // 🔄 show loading state

	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	if (cart.length === 0) {
		alert("Your cart is empty.");
		btn.disabled = false;
		btn.innerText = "Place Order"; // reset
		return;
	}

	const order = {
		name: document.getElementById("name").value,
		email: document.getElementById("email").value,
		phone: document.getElementById("phone").value,
		address: document.getElementById("address").value,
		payment: document.getElementById("payment").value,
		items: cart,
		total: document.getElementById("total").innerText,
		date: new Date().toLocaleString(),
		status: "Pending",
	};

	try {
		const res = await fetch("/api/mail/checkout", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(order),
		});

		if (res.ok) {
			let orders = JSON.parse(localStorage.getItem("orders")) || [];
			orders.push(order);
			localStorage.setItem("orders", JSON.stringify(orders));

			localStorage.removeItem("cart");
			alert("✅ Order placed successfully!");
			window.location.href = "/orders";
		} else {
			alert("❌ Failed to place order.");
		}
	} catch (err) {
		console.error(err);
		alert("❌ Error placing order.");
	} finally {
		btn.disabled = false;
		btn.innerText = "Place Order"; // reset on error
	}
}

document.addEventListener("DOMContentLoaded", () => {
	loadSummary();
	document
		.getElementById("checkout-form")
		.addEventListener("submit", placeOrder);
});
