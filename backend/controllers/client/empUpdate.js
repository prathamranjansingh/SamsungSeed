import { db } from '../../index.js';

// Function to fetch data from PostgreSQL
export async function empAdd(req, res) {
  try {
    // Access session data
    const user = req.session.user;
    const { skill } = req.body;
    // const contentString = JSON.stringify(content, null, 2);
    // Parameterized query to fetch name from the employee table
    await db`UPDATE employee SET skill=${skill}  WHERE email=${user.email}`;

    res.send("Updated...")

  } catch (err) {
    // Handle any errors
    console.error('Error fetching data:', err);
    res.status(500).send('Server error');
  }
};
