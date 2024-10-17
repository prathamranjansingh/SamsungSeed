import { db } from '../../index.js'; // Ensure this path is correct

export const getEmpProjects = async (req, res) => {
  // Retrieve projectId from the request body instead of URL parameters
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  try {
    const result = await db`
      SELECT t.team_lead_id, t.team_members, p.due_date
      FROM projects p
      JOIN teams t ON p.team_id = t.id
      WHERE p.id = ${projectId};
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json(result[0]); // Return the first project found
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
