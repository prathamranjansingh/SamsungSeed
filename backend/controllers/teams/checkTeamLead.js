import { db } from '../../index.js';

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