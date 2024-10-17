import { db } from "../../index.js";

// Function to edit the project due date
export async function editDueDate(req, res) {
    const { date, id } = req.body;

    try {
        const newDueDate = new Date(date);
        const result = await db `UPDATE Projects SET due_date = ${ newDueDate } WHERE id = ${ id } RETURNING *`;

        res.status(200).json(result);
    } catch (error) {
        // Handle any errors
        console.error("Error updating the due date:", error);
        res.status(500).send("Server error");
    }
}