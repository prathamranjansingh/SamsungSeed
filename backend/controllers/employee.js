import bcrypt from "bcrypt";
import { db } from "../index.js";
import { z } from "zod";
import nodemailer from "nodemailer";

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


const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

async function getEmployees(req, res) {
  try {
    const employees = await db`SELECT id, name, email, role, experience FROM Employee`; // Select necessary fields
    return res.json(employees); // Return employee data as JSON
  } catch (err) {
    console.error("Error retrieving employees:", err);
    return res.status(500).send("Error retrieving employees");
  }
}


async function registerEmployee(req, res) {
    const { name, email} = registerSchema.parse(req.body); // Only name and email required
    const role = req.body.role || "employee"; // Default role is employee
  
    if (!name || !email) {
      return res.status(400).send("All fields are required");
    }
  
    try {
      const employeeResult = await db`SELECT * FROM Employee WHERE email = ${email}`;
      if (employeeResult.length > 0) {
        return res.status(400).send("Employee already exists");
      }
  
      const defaultPassword = "12345678"; 
      const hash = await bcrypt.hash(defaultPassword, saltRounds);

      console.log(name, email, hash, role);
  
      await db`INSERT INTO Employee (name, email, password, role) VALUES (${name}, ${email}, ${hash}, ${role})`;
  
      // Send a welcome email with the employee's login details
      await transporter.sendMail({
        to: email,
        subject: "Welcome to Samsung SEED Team!",
        html: `
                  <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f0f8ff; padding: 20px; border: 1px solid #d3d3d3; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                      <h1 style="color: #0056b3; text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">Welcome to Samsung SEED</h1>
                      <p style="font-size: 18px; color: #333;">Dear ${name},</p>
                      <p style="font-size: 16px; color: #333;">You have been successfully registered as an employee at Samsung SEED.</p>
                      <p style="font-size: 16px; color: #333;"><b>Your login credentials are as follows:</b></p>
                      <p style="font-size: 16px; color: #333;"><b>Email:</b> ${email}</p>
                      <p style="font-size: 16px; color: #333;"><b>Password:</b> ${defaultPassword}</p>
                      <p style="font-size: 16px; color: #333;">Please change your password after logging in for the first time.</p>
                      <p style="font-size: 16px; color: #333;">Use the following link to log in: <a href="http://localhost:5173/login">Login</a></p>
                      <p style="font-size: 16px; color: #333;">If you have any questions, feel free to reach out to our support team.</p>
                      <p style="font-size: 16px; color: #333;">Best regards,</p>
                      <p style="font-size: 18px; font-weight: bold; color: #333;">SAMSUNG SEED Team</p>
                  </div>
              `,
      });
  
      return res.send("Employee registered successfully and email sent");
    } catch (err) {
      console.error("Error saving employee:", err);
      return res.status(500).send("Error saving employee");
    }
  }

  export {registerEmployee, getEmployees}