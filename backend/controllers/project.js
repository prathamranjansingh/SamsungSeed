import { db } from "../db/connectDB.js";

//FUnction to create project
export async function createProject(req, res) {
    try{
        const {project_name, employee_id,due_date} = req.body;

        //check if employee_id is in employee table
        const checkEmployee = await db`SELECT * FROM Employee WHERE id = ${employee_id}`;
        if(checkEmployee.length === 0){
            return res.status(404).send("Employee not found");
        }
        
        if(!project_name || !employee_id || !due_date){
            return res.status(400).send("Missing required fields");
        }

        //get employee details
        const projectManager = await db`SELECT id,name,email,password,skill,experience FROM Employee WHERE id = ${employee_id}`;
        // console.log(projectManager);

        //delete employee from employee table
        await db`DELETE FROM Employee WHERE id = ${employee_id}`;

        const check = await db`SELECT * FROM ProjectManager WHERE email = ${projectManager[0].id}`;
        if(check.length != 0){
            return res.status(400).send("Employee is a project manager");
        }


        await db`Insert into ProjectManager (id, name, email, password, skill, experience) VALUES (${projectManager[0].id},${projectManager[0].name}, ${projectManager[0].email}, ${projectManager[0].password}, ${projectManager[0].skill}, ${projectManager[0].experience})`;

        await db`INSERT INTO Projects (project_name, project_manager_id, due_date) VALUES (${project_name}, ${projectManager[0].id}, ${due_date})`;

        return res.status(200).send("Project created successfully");
    }
    catch (err){
        console.error("Error creating project:", err);
        return res.status(500).send("Database error");
    }
}



//Function to delete project
export async function deleteProject(req, res) {
    const { project_id } = req.body;
    
    if (!project_id) {
        return res.status(400).send("Project ID is required");
    }

    try {

        // Check if the project exists and get the project manager ID
        const projectResult = await db`SELECT project_manager_id FROM Projects WHERE id = ${project_id}`;
        if (projectResult.length === 0) {
            await db.rollback();
            return res.status(404).send("Project not found");
        }

        const projectManagerId = projectResult[0].project_manager_id;

        // Get project manager details
        const projectManagerResult = await db`SELECT * FROM ProjectManager WHERE id = ${projectManagerId}`;
        if (projectManagerResult.length === 0) {
            await db.rollback();
            return res.status(404).send("Project manager not found");
        }

        const projectManager = projectManagerResult[0];

        // Delete project
        await db`DELETE FROM Projects WHERE id = ${project_id}`;

        // Insert project manager back into the Employee table
        await db`INSERT INTO Employee (id, name, email, password, skill, experience) 
                 VALUES (${projectManager.id}, ${projectManager.name}, ${projectManager.email}, 
                         ${projectManager.password}, ${projectManager.skill}, ${projectManager.experience})`;

        // Delete project manager from the ProjectManager table
        await db`DELETE FROM ProjectManager WHERE id = ${projectManager.id}`;

        return res.status(200).send("Deleted!");
    } catch (err) {
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
        SELECT * from Projects WHERE id = ${projectId}
      `;

    //   console.log(result);
      
  
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
                id,
                project_name,
                project_manager_id,
                due_date
               
            FROM 
                Projects
           
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