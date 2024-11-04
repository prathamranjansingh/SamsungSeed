import { db } from "../db/connectDB.js";

//FUnction to create project
export async function createProject(req, res) {
    try{
        const {project_name, project_manager_id, due_date} = req.body;
        //console.log(project_name, project_manager_id, team_name, description, due_date);

        //Getting team id from team_name in teams table
        const team_id = await db`SELECT id FROM Teams WHERE team_name = ${team_name}`;
        const teamid = team_id[0].id;

        //console.log(teamid);

        //Insert the project into the Projects table
        const project = await db`INSERT INTO Projects (project_name, project_manager_id, team_id, description, due_date) VALUES (${project_name}, ${project_manager_id},${teamid}, ${description}, ${due_date}) RETURNING *`;
        return res.status(200).send(project);
    }
    catch (err) {
        console.error("Error creating project:", err);
        return res.status(500).send("Database error");
    }
}

//Function to delete project
export async function deleteProject(req, res) {
    const { project_id } = req.body;
        if(!project_id){
            return res.status(400).send("Project id is required");
        }

    try{
        

        const result = await db`SELECT project_manager_id FROM Projects WHERE id = ${project_id}`;
        const projectManagerId = result[0].project_manager_id;
        
        const projectManager = await db`SELECT * FROM ProjectManager WHERE id = ${projectManagerId}`;
        console.log(`Project manager: ${projectManager[0].name}`);

        await db`DELETE FROM Projects WHERE id = ${project_id}`;

        return res.status(200).send("Deleted!!");
    }
    catch (err){
        console.error("Error deleting project:", err);
        return res.status(500).send("Database error");
    }
}

// Function to edit the project due date
export async function editDueDate(req, res) {
    const { date, id } = req.body;
    // Get the date and id from the request body
    if(!date || !id){
        return res.status(400).send("Missing required fields");
    }

    try {
        // Convert the date to a valid Date object (if necessary)
        const newDueDate = new Date(date);

        // Execute the query and store the result
        const result = await db `UPDATE Projects SET due_date = ${ newDueDate } WHERE id = ${ id } RETURNING *`;

        // Check if any rows were updated
        //console.log(`updated dueDate : ${result[0].due_date}`);
        // Send the updated result back as the response
        res.status(200).json(`updated dueDate : ${result[0].due_date}`);
    } catch (error) {
        // Handle any errors
        console.error("Error updating the due date:", error);
        res.status(500).send("Server error");
    }
}

export const getProject = async (req, res) => {
    // Retrieve projectId from the request body instead of URL parameters
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
  
    try {
      const result = await db`
        SELECT p.project_name, t.team_lead_id, t.team_members,  p.due_date
        FROM projects p
        JOIN teams t ON p.team_id = t.id
        WHERE p.id = ${projectId};
      `;
  
      if (result.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      return res.status(200).json(result[0]); // Return the first project found
    } catch (error) {
      console.error('Error fetching project:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  export const getAllProjects = async (req, res) => {   
    try {

        
        const results = await db`
            SELECT 
                p.id,
                p.project_name,
                t.project_manager_id,
                t.team_name,
                p.due_date,
                ARRAY(
                    SELECT em.name
                    FROM employee em
                    WHERE em.id = ANY(t.team_members)
                ) AS team_members
            FROM 
                Projects p
            JOIN 
                Teams t ON p.team_id = t.id
        `;

        if (results.length === 0) {
            return res.status(404).json({ message: 'No projects found' });
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};