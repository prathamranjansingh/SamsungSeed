import { db } from "../db/connectDB.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALT, 10) || 10;
const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//Function to add admin to the database
export async function adminRegister(req, res) {
    try {
        const { username, email, password } = req.body;
        console.log(username + " " + email + " " + password);

        if (!username || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        const adminResult = await db`SELECT * FROM Admin WHERE email = ${email}`;
        if (adminResult.length > 0) {
            return res.status(400).send("Admin already exists");
        }

        const hash = await bcrypt.hash(password, saltRounds);
        console.log(hash);

        await db`INSERT INTO Admin (username, email, password) VALUES (${username}, ${email}, ${hash})`;

        return res.status(201).send("Admin registered successfully");
    } catch (err) {
        console.error("Error registering admin:", err);
        return res.status(500).send("Database error");
    }
}