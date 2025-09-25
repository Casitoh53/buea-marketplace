const express = require("express");
const supabase = require("./supabase");
const router = express.Router();

// Cookie options
const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict",
	maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
};

// Signup route
router.post("/signup", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res
			.status(400)
			.json({ success: false, error: "Email and password required" });
	}

	try {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error)
			return res
				.status(400)
				.json({ success: false, error: error.message });

		// Optionally: set cookie with access token
		res.cookie(
			"sb-access-token",
			data.session.access_token,
			COOKIE_OPTIONS
		);

		res.status(200).json({
			success: true,
			message: "Signup successful",
			user: data.user,
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// Login route
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res
			.status(400)
			.json({ success: false, error: "Email and password required" });
	}

	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error)
			return res
				.status(400)
				.json({ success: false, error: error.message });

		// Set cookie with access token
		res.cookie(
			"sb-access-token",
			data.session.access_token,
			COOKIE_OPTIONS
		);

		res.status(200).json({
			success: true,
			message: "Login successful",
			user: data.user,
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// Logout route
router.post("/logout", async (req, res) => {
	const token = req.cookies["sb-access-token"];
	if (!token)
		return res
			.status(400)
			.json({ success: false, error: "No session found" });

	try {
		await supabase.auth.signOut();
		res.clearCookie("sb-access-token");
		res.status(200).json({ success: true, message: "Logged out" });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

module.exports = router;
