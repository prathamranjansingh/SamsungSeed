import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { db } from "../index.js";
import nodemailer from "nodemailer";
import { z } from "zod";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();
const saltRounds = parseInt(process.env.SALT, 10) || 10;

// Check for required environment variables
if (
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.JWT_SECRET
) {
  throw new Error(
    "Missing environment variables. Please check your .env file."
  );
}

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER, // Consider using environment variables for sensitive info
    pass: process.env.EMAIL_PASS, // Consider using environment variables for sensitive info
  },
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password is required"),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "New password is required"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// User login
async function login(req, res) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Check if user exists in Admin table
    let results = await db`SELECT * FROM Admin WHERE admin_email = ${email}`;
    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user.email, role: "admin" },
          process.env.JWT_SECRET
        );
        return res.status(200).json({ success: true, token, role: "admin" });
      }
    }

    // Check if user exists in Employee table
    // results = await db`SELECT * FROM Employee WHERE email = ${email}`;
    // if (results.length > 0) {
    //   const user = results[0];
    //   const isMatch = await bcrypt.compare(password, user.password);
    //   if (isMatch) {
    //     const token = jwt.sign(
    //       { id: user.email, role: "employee" },
    //       process.env.JWT_SECRET
    //     );
    //     req.session.user = { email: user.email };
    //     return res.status(200).json({ success: true, token, role: "employee"});
    //   }
    // }

    //check if the user exists in the Employee table as a employee
    results = await db`SELECT * FROM Employee WHERE email = ${email} AND role = 'employee'`;
    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user.email, role: "employee" },
          process.env.JWT_SECRET
        );
        return res.status(200).json({ success: true, token, role: "employee" });
      }
    }

    // Check if user exists in Team Lead table
    results = await db`SELECT * FROM Employee WHERE email = ${email} AND role = 'teamlead'`;
    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user.email, role: "teamlead" },
          process.env.JWT_SECRET
        );
        return res
          .status(200)
          .json({ success: true, token, role: "teamlead" });
      }
    }

    //check if user exists in employee table as project manager
    results = await db`SELECT * FROM Employee WHERE email = ${email} AND role = 'projectmanager'`;
    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user.email, role: "projectmanager" },
          process.env.JWT_SECRET
        );
        return res
          .status(200)
          .json({ success: true, token, role: "projectmanager" });
      }
    }

    return res.status(401).send("Invalid credentials");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.errors);
    }
    console.error("Database error on login:", err);
    return res.status(500).send("Database error");
  }
}

// Reset password
async function resetPassword(req, res) {
  const { id, token } = req.params;

  try {
    const { newPassword, confirmPassword } = resetPasswordSchema.parse(
      req.body
    );

    if (newPassword !== confirmPassword) {
      return res.status(400).send("Passwords don't match");
    }

    const result = await db`SELECT * FROM Employee WHERE email = ${id}`;
    if (result.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = result[0];
    const secret = process.env.JWT_SECRET + user.password;

    // Verify token
    jwt.verify(token, secret);

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await db`UPDATE Employee SET password = ${hashedPassword} WHERE email = ${id}`;
    return res.send("Password has been updated");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.errors);
    }
    console.error("Error during verification or updating:", err.message);
    return res.status(500).send("Error during password reset");
  }
}

// Forgot password
async function forgotPassword(req, res) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const result = await db`SELECT * FROM Employee WHERE email = ${email}`;
    if (result.length === 0) {
      return res.status(404).send("Email not found");
    }

    const user = result[0];
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email }, secret, { expiresIn: "10m" });
    const resetLink = `http://localhost:3000/api/reset-password/${
      user.email
    }/${encodeURIComponent(token)}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f0f8ff; padding: 20px; border: 1px solid #d3d3d3; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #0056b3; text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">Password Reset Request</h1>
                    <p style="font-size: 18px; color: #333;">Dear ${user.email},</p>
                    <p style="font-size: 16px; color: #333;">You requested a password reset. Click the link below to reset your password:</p>
                    <a href="${resetLink}" style="font-size: 16px; color: #0056b3;">Reset Password</a>
                    <p style="font-size: 16px; color: #333;">The link is valid for 10 minutes only.</p>
                    <p style="font-size: 16px; color: #333;">Best regards,</p>
                    <p style="font-size: 18px; font-weight: bold; color: #333;">Your Team</p>
                </div>
            `,
    });

    return res.status(200).send("Password reset link sent to your email");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).send(err.errors);
    }
    console.error("Error processing request:", err);
    if (!res.headersSent) {
      return res.status(500).send("Internal server error");
    }
  }
}

// Export all functions and middleware
export { login, resetPassword, forgotPassword, authMiddleware };
