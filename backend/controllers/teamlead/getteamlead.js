import { db } from '../../index.js';

// Function to fetch details of all projects and members working in those projects under the specified team lead
export async function getTeamLead(req, res) {
    try {
        const { teamLeadId } = req.body;

        // Fetch the details of all projects across all teams led by the specified team lead
        const result = await db`
            SELECT p.id AS project_id, p.project_name, p.due_date, t.team_members
            FROM Projects p
            JOIN Teams t ON p.team_id = t.id
            WHERE t.team_lead_id = ${teamLeadId};
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "No projects found for the given team lead" });
        }

        // Send the result back as a response
        return res.json(result);
    } catch (err) {
        console.error("Database error on getTeamLead:", err);
        return res.status(500).send("Database error");
    }
}
