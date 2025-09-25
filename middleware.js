const fs = require("fs");
const path = require("path");
const { ROUTES, PROTECTED_ROUTES } = require("./constants");

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

exports.authMiddleware = (req, res, next) => {
	next();
};
