// routes/user.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
// Create a Supabase service client (use service role key here, NOT anon key)

router.get("/me", async (req, res) => {
	try {
		const token = req.cookies["sb-access-token"];
		if (!token) {
			// No cookie → not logged in
			return res.redirect("/login.html");
		}

		// Verify the token
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error) {
			return res.status(401).json({ error: error.message });
		}

		res.json({ user });
	} catch (err) {
		console.error("Fetch user error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
