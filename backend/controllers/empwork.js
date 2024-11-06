import { db } from '../db/connectDB.js';
import jwt from 'jsonwebtoken';

//Function to fetch employees not in assignwork table
export async function getEmployeesToAssign(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Please login again.",
        });
    }

    const token = authHeader.split(" ")[1];
    let user;

    try {
        user = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch team lead id from user.id
        const teamLeadIdResult = await db`SELECT id FROM Teamlead WHERE email = ${user.id}`;
        const teamLeadId = teamLeadIdResult[0]?.id;

        // Fetch team members' ids from Teams table for the team lead
        const teamMembersResult = await db`SELECT team_members FROM Teams WHERE team_lead_id = ${teamLeadId}`;
        const teamMembers = teamMembersResult[0]?.team_members || [];

        if (teamMembers.length === 0) {
            return res.status(404).json({ success: false, message: "No team members found for this team lead." });
        }

        // Fetch team members not in empwork table
        const employees = await db`
            SELECT * 
            FROM employee
            WHERE id = ANY(${teamMembers})
            AND id NOT IN (SELECT team_member_id FROM empwork);
        `;
        
        return res.status(200).json({
            success: true,
            employees,
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ error: "Invalid token" });
    }
}


//Function to assign work to team members
export async function assignWork(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Please login again.",
        });
    }

    const token = authHeader.split(" ")[1];
    let user;

    try {
        user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("User:", user);

        const { path, team_member } = req.body;

        if (!path || !team_member) {
            return res.status(400).json({
                success: false,
                message: "Path and team_member are required.",
            });
        }

        // Fetch team lead ID using the user ID
        const teamLeadResult = await db`SELECT id FROM Teamlead WHERE email = ${user.id}`;
        const team_lead_id = teamLeadResult[0]?.id;

        if (!team_lead_id) {
            return res.status(404).json({
                success: false,
                message: "Team lead not found.",
            });
        }

        // Insert path, team_member, and team_lead_id into empwork table
        await db`
            INSERT INTO empwork (folder_path, team_member_id, team_lead_id, status)
            VALUES (${path}, ${team_member}, ${team_lead_id}, 'pending')
        `;

        return res.status(200).json({
            success: true,
            message: "Work assigned successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ error: "Invalid token" });
    }
}


//

export async function getEmployeesWorkFolder(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Please login again.",
        });
    }

    const token = authHeader.split(" ")[1];
    let user;
    try {
        user = jwt.verify(token, process.env.JWT_SECRET);

      const email = user.id;  
  
      const employee = await db`
        SELECT id
        FROM employee
        WHERE email = ${email}
      `;
      
      if (employee.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      const employeeId = employee[0].id;
  
      // Fetch the folder path assigned to the employee from the empwork table
      const empwork = await db`
        SELECT folder_path
        FROM empwork
        WHERE team_member_id = ${employeeId}
      `;
  
      if (empwork.length === 0) {
        return res.status(404).json({ message: "No folder assigned to this employee" });
      }
  
      // Respond with the folder path
      res.status(200).json({ folderPath: empwork[0].folder_path });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }