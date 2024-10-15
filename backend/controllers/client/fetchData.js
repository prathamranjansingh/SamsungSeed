
import { db } from '../../index.js';

// Function to fetch data from PostgreSQL
export async function fetchData(req, res) {
  try {
    // Access session data
    const user = req.session.user;
    
    // Check if the user exists in the session
    if (!user || !user.email) {
      return res.status(401).send('Unauthorized');
    }

    // Parameterized query to fetch name from the employee table
    const result = await db `SELECT name,email,id,role,skill,experience FROM employee WHERE email=${user.email}`;

  res.send(result)

  } catch (err) {
    // Handle any errors
    console.error('Error fetching data:', err);
    res.status(500).send('Server error');
  }
};
