import { Route, Routes } from 'react-router-dom';
import Layout from '../../components/others/TeamLead/Layout';
import ProjectDetail from '../TeamLead/ProjectDetail'
import QualityCheckerPage from '../TeamLead/QualityChecking';
import ProjectList from '../TeamLead/ProjectList';
import EmployeeHome from '../TeamLead/Home';
Layout
const TeamLeadRoute = () => {
  return (
    <div>
       <Routes>
       <Route element={<Layout />}>
       <Route path="home" element={<EmployeeHome />} />
       <Route path="projectdetail" element={<ProjectList />} />
       <Route path="projects/:projectId" element={<ProjectDetail />} />
      <Route path="quality" element={<QualityCheckerPage />} />
       </Route>
       </Routes>
    </div>
  )
}

export default TeamLeadRoute
