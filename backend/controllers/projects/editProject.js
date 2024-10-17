import { db } from "../../index.js";

// Function to edit the project due date
export async function editDueDate(req, res) {
    const { date, id } = req.body;
    // Get the date and id from the request body

    try {
        // Convert the date to a valid Date object (if necessary)
        const newDueDate = new Date(date);



        // Execute the query and store the result
        const result = await db `UPDATE Projects SET due_date = ${ newDueDate } WHERE id = ${ id } RETURNING *`;

        // Check if any rows were updated


        // Send the updated result back as the response
        res.status(200).json(result);
    } catch (error) {
        // Handle any errors
        console.error("Error updating the due date:", error);
        res.status(500).send("Server error");
    }
}