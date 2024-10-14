import jwt from 'jsonwebtoken'; // Ensure you have this imported
import { db } from '../../index.js'; // Ensure db is configured properly


export async function empAdd(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { content } = req.body; 
    if (!content) {
      return res.status(400).send('Content cannot be empty');
    }

      const result = await db`UPDATE employee SET skill = ${content} WHERE email = ${decoded.id}`; // Use tagged template literals

    if (result.count === 0) {
      return res.status(404).send('Employee not found');
    }

    res.send("Skill updated successfully");
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).send('Server error');
  }
}
