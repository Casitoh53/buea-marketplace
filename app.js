const express = require("express");
const path = require("path");
const { pageRoutesMiddleware, authMiddleware } = require("./middleware");
const { ROUTES, PROTECTED_ROUTES } = require("./constants");
const { sendContactFormEmail } = require("./sendmail");
const cookieParser = require("cookie-parser");
const app = express();
const authRoutes = require("./auth");

// Middleware to parse form + JSON
app.use(express.urlencoded({ extended: true })); // handles form submissions
app.use(express.json()); // handles JSON

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
// Serve routes
ROUTES.forEach((route) => {
	app.get(route, (req, res) => {
		const fileName = route.find(
			(value) => path.extname(value) === ".html"
		);
		res.status(200).sendFile(path.join(__dirname, "views", fileName));
	});
});

PROTECTED_ROUTES.forEach((route) => {
	app.get(route, authMiddleware, (req, res) => {
		const fileName = route.find(
			(value) => path.extname(value) === ".html"
		);
		res.status(200).sendFile(path.join(__dirname, "views", fileName));
	});
});

app.post("/contact", async (req, res) => {
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

app.use("/auth", authRoutes);
// File not found middleware should be last
app.use(pageRoutesMiddleware);

module.exports = app;
