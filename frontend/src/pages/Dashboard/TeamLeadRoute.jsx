import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Layout from '../../components/others/TeamLead/Layout';
import ProjectDetails from '../../components/others/TeamLead/ProjectDetail';
Layout
const TeamLeadRoute = () => {
  return (
    <div>
       <Routes>
       <Route element={<Layout />}>
       <Route path="projectdetail" element={<ProjectDetails />} />
       </Route>
       </Routes>
    </div>
  )
}

export default TeamLeadRoute
