import { db } from "../db/connectDB.js";
import { z } from "zod";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken"
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


export async function getTeamNameAndCount(req, res) {
    const authHeader = req.headers.authorization;

    // Check for Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Please login again.",
        });
    }

    const token = authHeader.split(" ")[1];
    let user;

    try {
        // Verify JWT and extract user information
        user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded user:", user);

        // Fetch project manager ID from the projectmanager table using the user's email
        const projectManagerResult = await db`SELECT id FROM projectmanager WHERE email = ${user.id}`;
        if (projectManagerResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project manager not found.",
            });
        }
        const projectManagerId = projectManagerResult[0].id;

        // Fetch team name and count of team members working under the project manager
        const teams = await db`
            SELECT t.team_name, COUNT(tm.member_id) AS members
            FROM teams t
            LEFT JOIN LATERAL UNNEST(t.team_members) AS tm(member_id) ON TRUE
            WHERE t.project_manager_id = ${projectManagerId}
            GROUP BY t.team_name
        `;
        console.log("Teams with team member count:", teams);

        // Send back the teams in the response
        return res.status(200).json(teams);
    } catch (err) {
        console.error("Error fetching teams:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}


export async function getTaskEmpName(req, res){
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Please login again.",
        });
    }

    const token = authHeader.split(" ")[1];
    let user;

    try {
        // Decode and verify the token
        user = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = user.id; // user.id contains the email

        // Get the project manager ID based on the user's email
        const projectManager = await db`SELECT id FROM projectmanager WHERE email = ${userEmail}`;
        if (projectManager.length === 0) {
            return res.status(404).send({ error: "Project manager not found." });
        }
        const projectManagerId = projectManager[0].id;

        // Fetch task id and task name from tasks table, status from empwork table and team name from teams table
        const taskDetails = await db`
            SELECT ts.id AS id, ts.task_name AS name, ts.status, te.team_name AS team
            FROM tasks AS ts
            JOIN teams AS te ON ts.team_id = te.id
            WHERE te.project_manager_id = ${projectManagerId}
        `;

        res.status(200).send(taskDetails);
    } catch (err) {
        console.error(err);

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({ error: "Invalid token" });
        }

        res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function getTeamLeadNameAndCount(req, res) {
    const authHeader = req.headers.authorization;

    // Check for Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Please login again.",
        });
    }

    const token = authHeader.split(" ")[1];
    let user;

    try {
        // Verify JWT and extract user information
        user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded user:", user);

        // Fetch project manager ID from the projectmanager table using the user's email
        const projectManagerResult = await db`SELECT id FROM projectmanager WHERE email = ${user.id}`;
        if (projectManagerResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project manager not found.",
            });
        }
        const projectManagerId = projectManagerResult[0].id;

        // Fetch the team details, count of completed tasks, total tasks, and team lead name
        const teams = await db`
            SELECT 
                t.id AS id,
                tl.name AS name,
                t.team_name AS team,
                COUNT(ts.id) AS totalTasks,
                COUNT(CASE WHEN ts.status = 'completed' THEN 1 END) AS tasksCompleted
            FROM teams t
            LEFT JOIN tasks ts ON t.id = ts.team_id
            LEFT JOIN teamlead tl ON t.team_lead_id = tl.id
            WHERE t.project_manager_id = ${projectManagerId}
            GROUP BY t.id, t.team_name, tl.name
        `;
        return res.status(200).json(teams);
    } catch (err) {
        console.error("Error fetching team information:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}