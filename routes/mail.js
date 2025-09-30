const express = require("express");
const { sendCheckoutEmail, sendContactFormEmail } = require("../mailer"); // adjust path
const router = express.Router();

router.post("/checkout", async (req, res) => {
	try {
		const order = req.body;
		await sendCheckoutEmail(order);
		res.json({ success: true, message: "Order email sent!" });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			error: "Failed to send order email",
		});
	}
});

router.post("/contact", async (req, res) => {
	try {
		const payload = req.body;

		// Validate input
		if (
			!payload?.email ||
			!payload.phone ||
			!payload.name ||
			!payload.message
		) {
			return res
				.status(400)
				.json({ success: false, error: "All fields are required" });
		}

		await sendContactFormEmail({
			subject: "New Contact Form Message",
			...payload,
		});

		// Success
		return res
			.status(200)
			.json({ success: true, message: "Email sent successfully" });
	} catch (error) {
		console.error("Error:", error);
		return res
			.status(500)
			.json({ success: false, error: "Something went wrong" });
	}
});

module.exports = router;
