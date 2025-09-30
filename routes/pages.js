const { Router } = require("express");
const { ROUTES, PROTECTED_ROUTES } = require("../constants");
const { authMiddleware } = require("../middleware");
const path = require("path");

const router = Router();
ROUTES.forEach((route) => {
	router.get(route, (req, res) => {
		const fileName = route.find(
			(value) => path.extname(value) === ".html"
		);
		res.status(200).sendFile(
			path.join(path.dirname(__dirname), "views", fileName)
		);
	});
});

PROTECTED_ROUTES.forEach((route) => {
	router.get(route, authMiddleware, (req, res) => {
		const fileName = route.find(
			(value) => path.extname(value) === ".html"
		);
		res.status(200).sendFile(
			path.join(path.dirname(__dirname), "views", fileName)
		);
	});
});

module.exports = router;
