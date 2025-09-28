const form = document.getElementById("contactForm");
const errorDiv = document.getElementById("errorMessage");
const submitBtn = document.getElementById("submitBtn");
const btnText = submitBtn.querySelector(".btn-text");
const btnLoader = submitBtn.querySelector(".btn-loader");

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	// Hide previous error
	errorDiv.style.display = "none";

	// Show loader
	btnText.style.display = "none";
	btnLoader.style.display = "inline-block";
	submitBtn.disabled = true;

	const formData = {
		name: form.name.value.trim(),
		email: form.email.value.trim(),
		phone: form.phone.value.trim(),
		message: form.message.value.trim(),
	};

	try {
		const response = await fetch("/api/mail/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (!result.success) {
			errorDiv.textContent = result.error;
			errorDiv.style.display = "block";
			btnText.style.display = "inline-block";
			btnLoader.style.display = "none";
			submitBtn.disabled = false;
		} else {
			// Redirect to success page
			window.location.href = "/email-sent";
		}
	} catch (err) {
		errorDiv.textContent = "Network error. Please try again later.";
		errorDiv.style.display = "block";
		console.error(err);
		btnText.style.display = "inline-block";
		btnLoader.style.display = "none";
		submitBtn.disabled = false;
	}
});
