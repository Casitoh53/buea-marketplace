const nodemailer = require("nodemailer");
require("dotenv").config();

const credentials = {
	user: process.env.EMAIL_USER,
	pass: process.env.EMAIL_PASS,
};

async function sendContactFormEmail({ name, subject, email, phone, message }) {
	const to = "caesyadi628@gmail.com";
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: credentials,
		});

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
	const to = "caesyadi628@gmail.com"; // admin email
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: credentials,
		});

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
