import { db } from "../../index.js";

//FUnction to create project
export async function createProject(req, res) {
    try{
        const {project_name, team_name, due_date} = req.body;

        //Getting team id from team_name in teams table
        const team_id = await db`SELECT id FROM Teams WHERE team_name = ${team_name}`;
        const teamid = team_id[0].id;

        console.log(teamid);

        //Insert the project into the Projects table
        const project = await db`INSERT INTO Projects (project_name, team_id, due_date) VALUES (${project_name}, ${teamid}, ${due_date}) RETURNING *`;
        return res.status(200).send(project);
    }
    catch (err) {
        console.error("Error creating project:", err);
        return res.status(500).send("Database error");
    }
}