import { db } from "../db/connectDB.js";

//Function to create a new task
import jwt from 'jsonwebtoken';


export async function createTask(req, res) {
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
        // Decode and verify the token
        user = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = user.id; // user.id contains the email

        // Get the project manager ID based on the user's email
        const projectManager = await db`SELECT id FROM projectmanager WHERE email = ${userEmail}`;
        if (projectManager.length === 0) {
            return res.status(404).send({ error: "Project manager not found." });
        }
        const projectManagerId = projectManager[0].id;

        const { task_name, team_id, due_date } = req.body;

        // Log the incoming request body
        console.log("Request Body:", req.body);

        // Check for required fields
        if (!task_name || !team_id || !due_date) {
            return res.status(400).send({ error: "All fields are required: task_name, team_id, due_date" });
        }

        // Check if the team exists in the teams table
        const teamCheck = await db`SELECT * FROM teams WHERE id = ${team_id}`;
        console.log('team check', teamCheck);
        
        if (teamCheck.length === 0) {
            return res.status(400).send({ error: "Team does not exist" });
        }

        // Log the team check result
        console.log("Team Check Result:", teamCheck);

        // Retrieve project_id using project_manager_id and team_id
        const project = await db`SELECT id FROM projects WHERE project_manager_id = ${projectManagerId}`;
        if (project.length === 0) {
            return res.status(400).send({ error: "No project found for this project manager and team." });
        }
        const projectId = project[0].id;

        // Retrieve team_lead_id for the specified team_id
        const teamLead = await db`SELECT team_lead_id FROM teams WHERE id = ${team_id}`;
        if (teamLead.length === 0) {
            return res.status(400).send({ error: "Team lead not found for this team." });
        }
        const teamLeadId = teamLead[0].team_lead_id;

        // Insert new task into tasks table
        const newTask = await db`
            INSERT INTO tasks (team_lead_id, team_id, project_id, task_name, due_date)
            VALUES (${teamLeadId}, ${team_id}, ${projectId}, ${task_name}, ${due_date})
            RETURNING *
        `;

        res.status(200).send({ message: 'Task created successfully', task: newTask });
    } catch (err) {
        console.error(err);

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({ error: "Invalid token" });
        }

        res.status(500).send({ error: "Internal Server Error" });
    }
}


//Function to get all tasks
export async function getTasks(req, res) {
    try{
        const tasks = await db`SELECT * FROM tasks`;
        res.status(200).send(tasks);
    }
    catch(err){
        console.error(err);
        res.status(500).send({error: "Internal Server Error"});
    }
}

//Function to delete a task
export async function deleteTask(req, res) {
    try{
        const {task_id} = req.body;
        // console.log(req.body);

        //check if the task exists in tasks table
        const taskCheck = await db`SELECT * FROM tasks WHERE id = ${task_id}`;
        // console.log(taskCheck);
        if(taskCheck.length === 0){
            return res.status(400).send({error: "Task does not exist"});
        }

        //delete task from tasks table
        const deleteTask = await db`DELETE FROM tasks WHERE id = ${task_id}`;

        res.status(200).send('Task deleted successfully');
    }
    catch(err){
        console.error(err);
        res.status(500).send({error: "Internal Server Error"});
    }
}