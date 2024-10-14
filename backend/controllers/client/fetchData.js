
import { db, app } from '../../index.js';

import jwt from 'jsonwebtoken';

export async function fetchData(req, res) {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) {
      return res.status(401).send('No token provided');
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decodedis",decoded)
    // Use the email from the decoded token
    const result = await db`SELECT name, email, id, role, skill, experience FROM employee WHERE email = ${decoded.id}`;
    console.log(result)
    res.send(result);

  } catch (err) {
    console.error('Error fetching data:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token');
    }
    res.status(500).send('Server error');
  }
}