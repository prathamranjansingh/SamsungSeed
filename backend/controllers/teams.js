import { db } from "../db/connectDB.js";
import jwt from "jsonwebtoken";


//Function to check if the id is a team lead or not
export async function checkTeamLead(req, res) {
    const { id } = req.body; // Get id from request body

    if (!id) {
        return res.status(400).send("ID is required");
    }

    try {
        const results = await db`SELECT * FROM Employee WHERE id = ${id}`; // Check if the id exists in TeamLead table

        if (results.length > 0) {
            return res.send("Team Lead");
        } else {
            return res.send("Not a Team Lead");
        }
    } catch (err) {
        console.error("Error checking team lead:", err);
        return res.status(500).send("Error checking team lead");
    }
}


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
        const projectManagerResult = await db`SELECT id FROM projectmanager WHERE email = ${user.id}`;
        if (projectManagerResult.length === 0) {
            return res.status(404).send("Project manager not found");
        }
        const projectManagerId = projectManagerResult[0].id;

        const { team_name, team_lead_id, members } = req.body;

        //fetch the team lead details from Employee table
        const teamLeadDetails = await db`SELECT id, name, email, password, skill, experience FROM Employee WHERE id = ${team_lead_id}`;

        //add the team lead details to TeamLead table
        await db`INSERT INTO TeamLead (id, name, email, password, skill, experience) VALUES (${teamLeadDetails[0].id}, ${teamLeadDetails[0].name}, ${teamLeadDetails[0].email}, ${teamLeadDetails[0].password}, ${teamLeadDetails[0].skill}, ${teamLeadDetails[0].experience})`;

        //delete it from Employee table
        await db`DELETE FROM Employee WHERE id = ${team_lead_id}`;

        // Validate required fields
        if (!team_name || !team_lead_id || !members) {
            return res.status(400).send("Please provide team name, team lead id, and members");
        }

        const teamLeadResult = await db`SELECT id FROM teamlead WHERE id = ${team_lead_id}`;
        if (teamLeadResult.length === 0) {
            return res.status(404).send("Team lead not found");
        }
        const teamLeadId = teamLeadResult[0].id;

        // Insert the team into the database with valid IDs
        await db`
            INSERT INTO teams (team_name, project_manager_id, team_lead_id, team_members)
            VALUES (${team_name}, ${projectManagerId}, ${teamLeadId}, ${members})
        `;

        return res.status(201).send("Team created successfully");
    } catch (err) {
        console.error("Error creating team:", err);
        return res.status(500).send("Database error");
    }
}

// Function to delete a team
export async function deleteTeam(req, res) {
    try {
        const { teamId } = req.body;

        // Fetch the team_lead_id of the team to be deleted
        const teamLeadResult = await db`SELECT team_lead_id FROM Teams WHERE id = ${teamId}`;
        if (teamLeadResult.length === 0) {
            return res.status(404).send("Team not found");
        }

        const teamLeadId = teamLeadResult[0].team_lead_id;
        const teamLeadDetails = await db`SELECT * FROM TeamLead WHERE id = ${teamLeadId}`;
        console.log(teamLeadDetails[0]);

        // add the teamleaddetails to employee table
        await db`INSERT INTO Employee (id, name, email, password, skill, experience) VALUES (${teamLeadDetails[0].id}, ${teamLeadDetails[0].name}, ${teamLeadDetails[0].email}, ${teamLeadDetails[0].password}, ${teamLeadDetails[0].skill}, ${teamLeadDetails[0].experience})`;

        // Delete the team from Teams table
        await db`DELETE FROM Teams WHERE id = ${teamId}`;
        
        //delete the teamlead from TeamLead table
        await db`DELETE FROM TeamLead WHERE id = ${teamLeadId}`;

        return res.status(200).send("Team deleted successfully");
    }
    catch (err) {
        console.error("Database error on deleteTeam:", err);
        return res.status(500).send("Database error");
    }
}


// Function to get all teams
export async function getTeams(req, res) {
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

        // Fetch project manager ID from the projectmanager table using the user's email
        const projectManagerResult = await db`SELECT id FROM projectmanager WHERE email = ${user.id}`;
        if (projectManagerResult.length === 0) {
            return res.status(404).send("Project manager not found");
        }
        const projectManagerId = projectManagerResult[0].id;

        // Fetch teams with team lead names and team member names
        const teams = await db`
            SELECT 
                t.id AS team_id,
                t.team_name,
                tl.name AS lead_name,
                ARRAY(
                    SELECT e.name 
                    FROM employee e 
                    WHERE e.id = ANY(t.team_members)
                ) AS team_member_names
            FROM teams t
            LEFT JOIN teamlead tl ON t.team_lead_id = tl.id
            WHERE t.project_manager_id = ${projectManagerId}
        `;

        console.log("Fetched teams with leads and members:", teams);
        return res.status(200).json({ teams });
        
    } catch (err) {
        console.error("Error fetching teams:", err);
        return res.status(500).json({
            success: false,
            message: "Database error",
            error: err.message,
        });
    }
}


//ney 


export async function getTaskUnassignedTeams(req, res) {
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
        
        
        // Fetch all teams managed by the project manager that have no tasks assigned
        const teams = await db`
            SELECT t.*
            FROM teams t
            LEFT JOIN tasks ts ON t.id = ts.team_id
            WHERE t.project_manager_id = ${projectManagerId} AND ts.id IS NULL
        `;
        console.log("Teams with no tasks:", teams);

        // Send back the teams in the response
        return res.status(200).json({
 teams,
        });
    } catch (err) {
        console.error("Error fetching teams:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}
