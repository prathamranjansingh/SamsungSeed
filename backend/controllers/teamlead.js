import { db } from "../db/connectDB.js";// Adjust path if necessary
import { z } from "zod";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';

export const countTeamLeadStats = async (req, res) => {
  const { teamLeadId } = req.body;

  if (!teamLeadId) {
    return res.status(400).json({ error: 'Team Lead ID is required' });
  }

  try {
    const result = await db`
      SELECT 
        (SELECT COUNT(DISTINCT p.id) 
         FROM projects p 
         JOIN teams t ON p.team_id = t.id 
         WHERE t.team_lead_id = ${teamLeadId}) AS total_projects,
        
        (SELECT COUNT(DISTINCT member) 
         FROM teams t, 
         LATERAL unnest(t.team_members) AS member 
         WHERE t.team_lead_id = ${teamLeadId}) AS total_unique_members;
    `;


    if (result.length === 0) {
      return res.status(404).json({ error: 'Team Lead not found' });
    }

    return res.status(200).json(result[0]); // Return the total projects and unique members
  } catch (error) {
    console.error('Error fetching team lead stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to fetch details of all projects and members working in those projects under the specified team lead
export async function getTeamLead(req, res) {
    try {
        const { teamLeadId } = req.body;

        // Fetch the details of all projects across all teams led by the specified team lead
        const result = await db`
            SELECT p.id AS project_id, p.project_name, p.due_date, t.team_members
            FROM Projects p
            JOIN Teams t ON p.team_id = t.id
            WHERE t.team_lead_id = ${teamLeadId};
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "No projects found for the given team lead" });
        }

        // Send the result back as a response
        return res.json(result);
    } catch (err) {
        console.error("Database error on getTeamLead:", err);
        return res.status(500).send("Database error");
    }
}

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

export async function fetchTeamLead(req, res) {
    try {
        const teamlead = await db`SELECT id, name, email, password, skill, experience FROM Teamlead`; // Select necessary fields
        return res.json(teamlead); // Return team lead data as JSON
    } catch (err) {
        console.error("Error retrieving team lead:", err);
        return res.status(500).send("Error retrieving team lead");
    }
}

export async function updateTeamLead(req, res){
    try{
        const { emp_id } = req.body;

        //fetch team lead details from employee table based on the id
        const teamleadResult = await db`SELECT * FROM Employee WHERE id = ${emp_id}`;

        if (teamleadResult.length === 0) {
            return res.status(404).send("Team lead not found");
        }

        const {id, name, email, password, skill, experience } = teamleadResult[0];
        
        const result = await db`INSERT INTO Teamlead (id, name, email, password, skill, experience) VALUES (${id}, ${name}, ${email}, ${password}, ${skill}, ${experience})`;

        //delete this from the Employee table
        await db`DELETE FROM Employee WHERE id = ${id}`;

        return res.send("Team lead updated successfully !");
    } catch (err) {
        console.error("Error updating team lead:", err);
        return res.status(500).send("Error updating team lead");
    }
}










//NEW TEAM LEAD ROUTESSSSS

export async function getTeamLeadTasks(req, res) {
    // Extract token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        // Verify the JWT token and extract the decoded information
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded); // Log the decoded token for debugging

        const teamLeadEmail = decoded.id; // Assuming the JWT contains the email field

        // Step 1: Get the team lead ID using the email from the token
        const teamLeadResult = await db`
            SELECT id FROM teamlead WHERE email = ${teamLeadEmail}
        `;

        if (teamLeadResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Team lead not found' });
        }

        const teamLeadId = teamLeadResult[0].id; // Get the team lead ID from the result

        // Step 2: Query to get task details for the team lead
        const tasks = await db`
            SELECT
                t.id AS task_id,
                t.team_lead_id,
                t.team_id,
                t.task_name,
                t.due_date,
                tm.id AS member_id,
                tm.name AS member_name,
                ew.folder_path
            FROM
                tasks t
                LEFT JOIN teams te ON te.id = t.team_id
                LEFT JOIN employee tm ON tm.id = ANY(te.team_members)
                LEFT JOIN empwork ew ON ew.team_member_id = tm.id AND ew.team_lead_id = t.team_lead_id
            WHERE
                t.team_lead_id = ${teamLeadId}
        `;

        // Step 3: Organize the tasks with the correct structure
        const tasksWithFolders = tasks.reduce((acc, task) => {
            let taskEntry = acc.find((t) => t.task_id === task.task_id);

            if (!taskEntry) {
                taskEntry = {
                    team_lead_id: task.team_lead_id,
                    team_id: task.team_id,
                    task_id: task.task_id,
                    task_name: task.task_name,
                    due_date: task.due_date,
                    team_members: [],
                    folders: [],
                };
                acc.push(taskEntry);
            }

            if (task.member_id && task.member_name) {
                taskEntry.team_members.push({
                    id: task.member_id,
                    name: task.member_name,
                });
            }

            if (task.folder_path) {
                taskEntry.folders.push({
                    path: task.folder_path,
                    assignedTo: task.member_id,
                });
            }

            return acc;
        }, []);

        // Send the structured data back to the client
        res.json({ tasksWithFolders });

    } catch (error) {
        // Handle errors like token verification or database errors
        console.error("Error fetching team lead tasks:", error);
        res.status(500).json({ success: false, message: "Failed to fetch tasks." });
    }
}