import { db } from "../db/connectDB.js";
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

export async function getProjectManager(req, res) {
    try {
        const projectmanager = await db`SELECT id, name, email, skill, experience FROM Projectmanager`; // Select necessary fields
        return res.json(projectmanager); // Return project manager data as JSON
    } catch (err) {
        console.error("Error retrieving project manager:", err);
        return res.status(500).send("Error retrieving project manager");
    }
}

export async function updateprojectmanager(req, res){
    try{
        const { emp_id } = req.body;

        //fetch project manager details from employee table based on the id
        const projectmanagerResult = await db`SELECT * FROM Employee WHERE id = ${emp_id}`;

        if (projectmanagerResult.length === 0) {
            return res.status(404).send("Project manager not found");
        }

        const {id, name, email, password, skill, experience } = projectmanagerResult[0];
        
        const result = await db`INSERT INTO Projectmanager (id, name, email, password, skill, experience) VALUES (${id}, ${name}, ${email}, ${password}, ${skill}, ${experience})`;

        //delete this from the Employee table
        await db`DELETE FROM Employee WHERE id = ${id}`;

        return res.send("Project manager updated successfully !");
    } catch (err) {
        console.error("Error updating project manager:", err);
        return res.status(500).send("Error updating project manager");
    }
}