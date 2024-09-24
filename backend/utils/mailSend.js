import nodemailer from 'nodemailer';
import { db } from '../index.js';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: env.EMAIL_USER, // Consider using environment variables for sensitive info
        pass: env.EMAIL_PASS // Consider using environment variables for sensitive info
    }
});

export function registerMail(to, subject, email) {
    const msg = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f0f8ff; padding: 20px; border: 1px solid #d3d3d3; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0056b3; text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">Welcome to Samsung SEED</h1>
        <p style="font-size: 18px; color: #333;">Dear <span style="color: #0056b3;">${email}</span>,</p>
        <p style="font-size: 16px; color: #333;">Thank you for registering with us. We are excited to have you on board!</p>
        <p style="font-size: 16px; color: #333;">If you have any questions, feel free to reach out to our support team.</p>
        <p style="font-size: 16px; color: #333;">Best regards,</p>
        <p style="font-size: 18px; font-weight: bold; color: #333;">SAMSUNG SEED Team</p>
    </div>
    `;

    transporter.sendMail({
        to: to,
        subject: subject,
        html: msg
    }).then(() => {
        console.log("Email sent");
    }).catch(err => {
        console.error("Error sending email:", err);
    });
}

export function forgotPassword(req, res) {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).send("Email is required");
    }

    db`SELECT * FROM ADMIN WHERE email = ${email}`
        .then(result => {
            if (result.length === 0) {
                return res.status(404).send("Email not found");
            }

            const user = result[0];
            const secret = process.env.JWT_SECRET + user.password;
            const token = jwt.sign({ email: user.email }, secret, { expiresIn: '10m' });

            // Print token to the console instead of sending an email
            console.log(`Reset token for ${user.email}: ${token}`);

            // Optionally, return the token in the response for testing (remove in production)
            res.status(200).send(`Token generated for password reset. Check the console.`);
        })
        .catch(err => {
            console.error("Error processing request:", err);
            if (!res.headersSent) {
                res.status(500).send("Internal server error");
            }
        });
}
