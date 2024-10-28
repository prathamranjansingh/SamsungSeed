import { db } from "../../index.js";
import jwt from "jsonwebtoken";

// Function to create a new team
export async function createTeam(req, res) {
    const authHeader = req.headers.authorization;

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
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid token." });
    }

    try {
        // Fetch project manager ID from Employee table using the user's email
        const projectManagerResult = await db`SELECT id FROM Employee WHERE email = ${user.id} AND role = 'projectmanager'`;
        console.log("Project manager result:", projectManagerResult);
        if (projectManagerResult.length === 0) {
            return res.status(404).send("Project manager not found");
        }
        const projectManagerId = projectManagerResult[0].id;

        const { team_name, team_lead_id, members } = req.body;

        // Validate required fields
        if (!team_name || !team_lead_id || !members) {
            return res.status(400).send("Please provide team name, team lead id, and members");
        }

        // Fetch team lead ID from Employee table using the team lead's email
        const teamLeadResult = await db`SELECT id FROM Employee WHERE id = ${team_lead_id}`;
        if (teamLeadResult.length === 0) {
            return res.status(404).send("Team lead not found");
        }
        const teamLeadId = teamLeadResult[0].id;

        // Insert the team into the database with valid IDs
        await db`
            INSERT INTO teams (team_name, team_lead_id, team_members, project_manager_id)
            VALUES (${team_name}, ${teamLeadId}, ${members}, ${projectManagerId})
        `;

        return res.status(201).send("Team created successfully");
    } catch (err) {
        console.error("Error creating team:", err);
        return res.status(500).send("Database error");
    }
}
