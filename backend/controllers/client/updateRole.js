import { db } from "../../index.js";

//Function to change role from employee to project manager
export async function updateRole(req, res) {
    const { id, role } = req.body; // Get id and role from request body

    if (!id || !role) {
        return res.status(400).send("All fields are required");
    }

    try {
        await db`UPDATE Employee SET role = ${role} WHERE id = ${id}`; // Update role in database
        return res.send("Role updated successfully");
    } catch (err) {
        console.error("Error updating role:", err);
        return res.status(500).send("Error updating role");
    }
}