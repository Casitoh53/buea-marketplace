const express = require("express");
const path = require("path");
const { pageRoutesMiddleware } = require("./middleware");
const pagesRoutes = require("./routes/pages.js");
const userRoutes = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const app = express();
const authRoutes = require("./routes/auth");
const mailRoutes = require("./routes/mail.js");

// Middleware to parse form + JSON
app.use(express.urlencoded({ extended: true })); // handles form submissions
app.use(express.json()); // handles JSON

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(pagesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/auth", authRoutes);
// File not found middleware should be last
app.use(pageRoutesMiddleware);

module.exports = app;
