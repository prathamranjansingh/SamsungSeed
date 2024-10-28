import { db } from '../../index.js'; // Adjust path if necessary

export const countTeamLeadStats = async (req, res) => {
  const { teamLeadId } = req.body;

  if (!teamLeadId) {
    return res.status(400).json({ error: 'Team Lead ID is required' });
  }

  try {
    const result = await db`
      SELECT 
        (SELECT COUNT(DISTINCT p.id) 
         FROM projects p 
         JOIN teams t ON p.team_id = t.id 
         WHERE t.team_lead_id = ${teamLeadId}) AS total_projects,
        
        (SELECT COUNT(DISTINCT member) 
         FROM teams t, 
         LATERAL unnest(t.team_members) AS member 
         WHERE t.team_lead_id = ${teamLeadId}) AS total_unique_members;
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Team Lead not found' });
    }

    return res.status(200).json(result[0]); // Return the total projects and unique members
  } catch (error) {
    console.error('Error fetching team lead stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
