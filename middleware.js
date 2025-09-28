const fs = require("fs");
const path = require("path");
const supabase = require("./supabase"); // make sure this exports your supabase client
const { ROUTES, PROTECTED_ROUTES } = require("./constants");

// Serve only declared routes
exports.pageRoutesMiddleware = (req, res, next) => {
	let url = req.url;

	if (url.includes("?")) {
		url = req.url.split("?")[0];
	}

	const route = [...PROTECTED_ROUTES, ...ROUTES].find((value) =>
		value.includes(url)
	);

	if (!route) {
		return res
			.status(200)
			.sendFile(path.join(__dirname, "views", "404.html"));
	}
	const files = fs.readdirSync(path.join(__dirname, "views"));
	const fileExist = files.some((value) => route.includes(`/${value}`));
	if (!fileExist) {
		return res
			.status(200)
			.sendFile(path.join(__dirname, "views", "404.html"));
	}
	next();
};

// 🔒 Authentication middleware
exports.authMiddleware = async (req, res, next) => {
	try {
		const token = req.cookies["sb-access-token"];
		if (!token) {
			// No cookie → not logged in
			return res.redirect("/login.html");
		}

		// Validate token with Supabase
		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data?.user) {
			// Invalid or expired token
			return res.redirect("/login.html");
		}

		// Attach user to request for later use
		req.user = data.user;
		next();
	} catch (err) {
		console.error("Auth error:", err);
		return res.redirect("/login.html");
	}
};
