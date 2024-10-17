import { db } from '../../index.js';

// Function to delete a team
export async function deleteTeam(req, res) {
    try {
        const { teamId } = req.body;

        // Fetch the team_lead_id of the team to be deleted
        const teamLeadResult = await db`SELECT team_lead_id FROM Teams WHERE id = ${teamId}`;
        if (teamLeadResult.length === 0) {
            return res.status(404).send("Team not found");
        }

        const teamLeadId = teamLeadResult[0].team_lead_id;

        // Delete the team from Teams table
        await db`DELETE FROM Teams WHERE id = ${teamId}`;

        // Check if the team lead is leading any other teams
        const otherTeams = await db`SELECT id FROM Teams WHERE team_lead_id = ${teamLeadId}`;
        
        // If the team lead has no other teams, reset their role to 'employee'
        if (otherTeams.length === 0) {
            await db`UPDATE Employee SET role = 'employee' WHERE id = ${teamLeadId}`;
        }

        return res.status(200).send("Team deleted successfully");
    }
    catch (err) {
        console.error("Database error on deleteTeam:", err);
        return res.status(500).send("Database error");
    }
}
