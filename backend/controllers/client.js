import bcrypt from "bcrypt";
import { db } from "../db/connectDB.js";
import { z } from "zod";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken"
const saltRounds = parseInt(process.env.SALT, 10) || 10;
const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
  }
});


const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

export async function getEmployees(req, res) {
  try {
    const employees = await db`
      SELECT e.id, e.name, e.email, e.skill, e.experience
      FROM Employee e
      LEFT JOIN Teams t ON e.id = ANY(t.team_members)
      WHERE t.team_members IS NULL
    `;
    return res.json(employees); // Return employee data as JSON
  } catch (err) {
    console.error("Error retrieving employees:", err);
    return res.status(500).send("Error retrieving employees");
  }
}

export async function getOwnEmployeeDetail(req, res) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
  }


  try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
    const employees = await db`SELECT id, name, email, skill, experience FROM Employee where email = ${decoded.id}`; // Select necessary fields
    return res.json(employees); // Return employee data as JSON
  } catch (err) {
    console.error("Error retrieving employees:", err);
    return res.status(500).send("Error retrieving employees");
  }
}





export async function registerEmployee(req, res) {
    const { name, email} = registerSchema.parse(req.body); // Only name and email required
  
    if (!name || !email) {
      return res.status(400).send("All fields are required");
    }
  
    try {
      const employeeResult = await db`SELECT * FROM Employee WHERE email = ${email}`;
      if (employeeResult.length > 0) {
        return res.status(400).send("Employee already exists");
      }
  
      const defaultPassword = "12345678"; 
      const hash = await bcrypt.hash(defaultPassword, saltRounds);

      console.log(name, email, hash);
  
      await db`INSERT INTO Employee (name, email, password) VALUES (${name}, ${email}, ${hash})`;
  
      // Send a welcome email with the employee's login details
      await transporter.sendMail({
        to: email,
        subject: "Welcome to Samsung SEED Team!",
        html: `
                  <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f0f8ff; padding: 20px; border: 1px solid #d3d3d3; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                      <h1 style="color: #0056b3; text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">Welcome to Samsung SEED</h1>
                      <p style="font-size: 18px; color: #333;">Dear ${name},</p>
                      <p style="font-size: 16px; color: #333;">You have been successfully registered as an employee at Samsung SEED.</p>
                      <p style="font-size: 16px; color: #333;"><b>Your login credentials are as follows:</b></p>
                      <p style="font-size: 16px; color: #333;"><b>Email:</b> ${email}</p>
                      <p style="font-size: 16px; color: #333;"><b>Password:</b> ${defaultPassword}</p>
                      <p style="font-size: 16px; color: #333;">Please change your password after logging in for the first time.</p>
                      <p style="font-size: 16px; color: #333;">Use the following link to log in: <a href="http://localhost:5173/login">Login</a></p>
                      <p style="font-size: 16px; color: #333;">If you have any questions, feel free to reach out to our support team.</p>
                      <p style="font-size: 16px; color: #333;">Best regards,</p>
                      <p style="font-size: 18px; font-weight: bold; color: #333;">SAMSUNG SEED Team</p>
                  </div>
              `,
      });
  
      return res.send("Employee registered successfully and email sent");
    } catch (err) {
      console.error("Error saving employee:", err);
      return res.status(500).send("Error saving employee");
    }
  }


  // Function to fetch data from PostgreSQL
export async function empSkillAdd(req, res) {
    try {
      // Access session data
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
          return res.status(401).json({ success: false, message: 'No token provided' });
      }
      
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { skill } = req.body;
      await db`UPDATE employee SET skill=${skill}  WHERE email=${decoded.id}`;
  
      res.send("Updated...")
  
    } catch (err) {
      // Handle any errors
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
    }
  };
  
//Function to change role from employee to project manager
export async function updateRole(req, res) {
    const { id, role } = req.body; // Get id and role from request body

    if (!id || !role) {
        return res.status(400).send("All fields are required");
    }

    try {
        await db`UPDATE Employee SET role = ${role} WHERE id = ${id}`; // added role with ENUM('Team Lead', 'Member') DEFAULT 'Member' to emp table
        return res.send("Role updated successfully");
    } catch (err) {
        console.error("Error updating role:", err);
        return res.status(500).send("Error updating role");
    }
}


// new endpoint

export async function getEmployeeTeamProjectDetails(req, res)  {
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
      const Email = user.id;
      const Employee = await db`SELECT id FROM employee WHERE email = ${Email}`;
      const empId = Employee[0].id;
      
      if (!empId) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await db`
      SELECT 
          te.id, 
          te.team_name,
          tl.name AS team_lead_name,
          pr.project_name,
          json_object_agg(em.id, em.name) AS team_members,
          json_agg(DISTINCT ts.task_name) AS tasks
      FROM 
          teams AS te
      JOIN 
          employee AS em ON em.id = ANY(te.team_members)
      JOIN 
          teamlead AS tl ON te.team_lead_id = tl.id
      JOIN 
          tasks AS ts ON ts.team_id = te.id
      JOIN 
          projects AS pr ON pr.id = ts.project_id
      WHERE 
          ${empId} = ANY(te.team_members)
      GROUP BY 
          te.id, tl.name, pr.project_name
      `;

      if (result.length === 0) {
          return res.status(404).json({ message: "No team found for this employee" });
      }

      return res.status(200).json(result);
  } catch (error) {
      console.error('Error fetching team:', error);
      return res.status(500).json({
          message: "Internal server error",
          error: error.message
      });
  }
}



//Function to edit status of work assigned to team members
export async function editWorkStatus(req, res) {
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

      // Fetch team member id from auth token
      const teamMemberResult = await db`SELECT id FROM employee WHERE email = ${user.id}`;
      // console.log("teamMemberResult:", teamMemberResult);

      const team_member_id = teamMemberResult[0]?.id;
      // console.log("team_member_id:", team_member_id);

      const { status } = req.body;

      if (!status) {
          return res.status(400).json({
              success: false,
              message: "status is required.",
          });
      }

      // Update status in empwork table
      await db`
          UPDATE empwork
          SET status = ${status}
          WHERE team_member_id = ${team_member_id}
      `;

      return res.status(200).json({
          success: true,
          message: "Work status updated successfully",
      });
  } catch (err) {
      console.error(err);
      return res.status(403).json({ error: "Invalid token" });
  }
}

