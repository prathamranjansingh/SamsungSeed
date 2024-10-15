import { db } from "../../index.js";


export async function addTeamMember(req, res) {
    console.log(req.body);
    try {
        const { team_id, employee_id } = req.body;
        const teamExists = await db`SELECT * FROM Teams WHERE id = ${team_id}`;
        if (teamExists.length === 0) {
            return res.status(404).send("Team not found");
        }

        const employeeExists = await db`SELECT * FROM Employee WHERE id = ${employee_id}`;
        if (employeeExists.length === 0) {
            return res.status(404).send("Employee not found");
        }

        await db`INSERT INTO Team_Members (team_id, employee_id) VALUES (${team_id}, ${employee_id})`;

        return res.status(200).send("Team member added successfully");
    } catch (err) {
        console.error("Error adding team member:", err);
        return res.status(500).send("Database error");
    }
}