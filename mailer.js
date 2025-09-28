const nodemailer = require("nodemailer");
require("dotenv").config();

const credentials = {
	user: process.env.EMAIL_USER,
	pass: process.env.EMAIL_PASS,
};

const MAIL_TO = process.env.MAIL_TO;
// ✅ Create transporter instance once with explicit config (better for Render)
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465, // use 465 for SSL, 587 for STARTTLS
	secure: true, // true for 465, false for 587
	auth: credentials,
	connectionTimeout: 10000, // 10s timeout (helps avoid hanging on Render)
});

async function sendContactFormEmail({ name, subject, email, phone, message }) {
	const to = MAIL_TO;
	try {
		const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;

		return await transporter.sendMail({
			from: `"BUMACE Contact Form" <${process.env.EMAIL_USER}>`,
			to,
			subject,
			html: htmlBody,
		});
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

async function sendCheckoutEmail(order) {
	const to = MAIL_TO; // admin email
	try {
		const itemsHtml = order.items
			.map(
				(item) =>
					`<li>${item.name} x ${item.quantity} = ${
						item.price * item.quantity
					} CFA</li>`
			)
			.join("");

		const htmlBody = `
      <h2>New Order Received</h2>
      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Payment:</strong> ${order.payment}</p>
      <p><strong>Date:</strong> ${order.date}</p>
      <h3>Order Items</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Total:</strong> ${order.total} CFA</p>
    `;

		return await transporter.sendMail({
			from: `"BUMACE Orders" <${process.env.EMAIL_USER}>`,
			to,
			subject: `New Order - ${order.name}`,
			html: htmlBody,
		});
	} catch (error) {
		console.error("Error sending checkout email:", error);
		throw error;
	}
}

module.exports = { sendContactFormEmail, sendCheckoutEmail };
