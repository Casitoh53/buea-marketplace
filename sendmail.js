const nodemailer = require("nodemailer");
require("dotenv").config();

const credentails = {
	user: process.env.EMAIL_USER,
	pass: process.env.EMAIL_PASS,
};

async function sendContactFormEmail({ name, subject, email, phone, message }) {
	const to = "caesyadi628@gmail.com";
	try {
		// 1. Create a transporter
		const transporter = nodemailer.createTransport({
			service: "gmail", // Or use custom SMTP settings
			auth: {
				...credentails,
			},
		});

		// 2. Define HTML template
		const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <!-- Header with Logo -->
        <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
          <img src="/images/bumace_logo.jpeg" alt="Company Logo" style="max-width: 150px; margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 22px; color: white;">New Contact Form Submission</h1>
        </div>

        <!-- Contact Details -->
        <div style="padding: 20px; color: #333;">
          <p style="font-size: 16px; line-height: 1.5;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 16px; line-height: 1.5;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 16px; line-height: 1.5;"><strong>Phone:</strong> ${phone}</p>
          <p style="font-size: 16px; line-height: 1.5;"><strong>Message:</strong><br/>${message}</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          © ${new Date().getFullYear()} BUMACE. All rights reserved.
        </div>
      </div>
    `;

		// 3. Send mail
		const info = await transporter.sendMail({
			from: `"BUMACE Contact Form" <${process.env.EMAIL_USER}>`,
			to,
			subject,
			html: htmlBody,
		});

		console.log("Message sent: %s", info.messageId);
		return info;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

module.exports = { sendContactFormEmail };
