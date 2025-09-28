async function loadUser() {
	try {
		const res = await fetch("/api/user/me");
		if (!res.ok) {
			return;
		} // not logged in
		const data = await res.json();
		const { user } = data;

		if (user && user.email) {
			const authButtons = document.getElementById("auth-buttons");
			if (authButtons) {
				authButtons.innerHTML = `
             <a href="/dashboard">
               <button class="cta">
                 <span>Dashboard</span>
                 <i class="ri-arrow-right-line" aria-hidden="true"></i>
               </button>
             </a>
           `;
			}
		}
	} catch (err) {
		console.error("❌ Failed to load user:", err);
	}
}

document.addEventListener("DOMContentLoaded", loadUser);
