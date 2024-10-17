import { db } from "../../index.js";

// Function to create a new team
export async function createTeam(req, res) {
    try{
        const {team_name, team_lead_id, members} = req.body;
        
        const team = await db`INSERT INTO Teams (team_name, team_lead_id, team_members) VALUES (${team_name}, ${team_lead_id}, ${members}) RETURNING *`;

        const teamLead = await db`UPDATE Employee SET role = 'teamlead' WHERE id = ${team_lead_id}`;

        return res.status(200).send(team);

    } catch (err) {
        console.error("Error creating team:", err);
        return res.status(500).send("Database error");
    }
}

//db query to get team members details
// SELECT e.*
// FROM teams t
// JOIN LATERAL UNNEST(t.team_members) AS member_id ON TRUE
// JOIN employee e ON e.id = member_id
// WHERE t.id = 1;