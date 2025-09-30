async function loadDashboardData() {
	try {
		// ---- Get logged in user ----
		const res = await fetch("/api/user/me", {
			method: "GET",
			credentials: "include",
		});

		if (!res.ok) throw new Error("Failed to fetch user");

		const data = await res.json();
		const user = data.user;

		const productRes = await fetch("/data/products.json");
		const productsData = await productRes.json();

		// Welcome section
		document.getElementById(
			"welcome-email"
		).textContent = ` ${user.email}`;

		// ---- Load localStorage data ----
		const orders = JSON.parse(localStorage.getItem("orders")) || [];
		const cart = JSON.parse(localStorage.getItem("cart")) || [];
		const products = productsData.products || [];

		// ---- Update summary cards ----
		document.getElementById("orders-count").textContent = orders.length;
		document.getElementById("cart-count").textContent = cart.reduce(
			(sum, item) => sum + item.quantity,
			0
		);
		document.getElementById("products-count").textContent =
			products.length;
	} catch (err) {
		console.error("❌ Dashboard load error:", err);
		alert("Unable to load dashboard. Please login again.");
		// window.location.href = "/login";
	}
}

document.addEventListener("DOMContentLoaded", loadDashboardData);

document.addEventListener("cartUpdated", updateCartTotal);

function updateCartTotal() {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	document.getElementById("cart-count").textContent = cart.reduce(
		(sum, item) => sum + item.quantity,
		0
	);
}
