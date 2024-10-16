import { db } from "../../index.js";

//Function to delete project
export async function deleteProject(req, res) {
    try{
        const { project_id } = req.body;

        const project = await db`DELETE FROM Projects WHERE id = ${project_id}`;

        return res.status(200).send("Deleted!!");
    }
    catch (err){
        console.error("Error deleting project:", err);
        return res.status(500).send("Database error");
    }
}