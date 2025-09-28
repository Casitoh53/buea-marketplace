const form = document.getElementById("form");
const formSubmitBtn = form.querySelector("button[type='submit']");
const toggleShowPasswordBtn = form.querySelector(".show-password-btn");

toggleShowPasswordBtn.addEventListener("click", (e) => {
	const passwordInput = form.querySelector("#password");
	const iconElem = e.currentTarget.querySelector("i");
	if (passwordInput.getAttribute("type") === "text") {
		passwordInput.setAttribute("type", "password");
		iconElem.className = "ri-eye-close-line";
	} else {
		passwordInput.setAttribute("type", "text");
		iconElem.className = "ri-eye-line";
	}
});

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const formData = new FormData(form);
	const email = formData.get("email").trim();
	const password = formData.get("password").trim();

	if (!email || !password) {
		alert("❌ Please fill in all required fields.");
		return;
	}

	// Disable button and show loading
	formSubmitBtn.disabled = true;
	const originalText = formSubmitBtn.innerText;
	formSubmitBtn.innerText = "please wait...";

	const formType = formSubmitBtn.dataset.form_type;
	console.log(formSubmitBtn, formType);

	try {
		const res = await fetch(`api/auth/${formType}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await res.json();

		if (data.success) {
			window.location.href =
				formType === "signup" ? "/email-confirmation" : "/";
		} else {
			alert(`❌ ${data.error}`);
		}
	} catch (err) {
		alert("❌ Something went wrong. Try again.");
		console.error(err);
	} finally {
		formSubmitBtn.disabled = false;
		formSubmitBtn.innerText = originalText;
	}
});

document.addEventListener("DOMContentLoaded", () => {
	const hash = window.location.hash.substring(1); // remove #
	const params = new URLSearchParams(hash);

	if (params.get("access_token")) {
		// Found token → redirect to login
		window.location.replace("/login");
	}
});
