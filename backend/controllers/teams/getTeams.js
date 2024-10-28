import { db } from "../../index.js";

export async function getTeams(req, res) {
    try {
      const teams = await db`
        SELECT 
          t.id, 
          t.team_name, 
          e.name AS lead, 
          ARRAY(
            SELECT em.name 
            FROM employee em 
            WHERE em.id = ANY(t.team_members)
          ) AS members
        FROM 
          teams t
        LEFT JOIN 
          employee e ON t.team_lead_id = e.id;
      `;

      return res.json(teams);
    } catch (error) {
      console.error("Error retrieving teams:", error);
      return res.status(500).send("Error retrieving teams");
    }
}