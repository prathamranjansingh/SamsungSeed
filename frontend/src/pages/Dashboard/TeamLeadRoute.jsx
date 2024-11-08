import { Route, Routes } from 'react-router-dom';
import Layout from '../../components/others/TeamLead/Layout';

import QualityCheckerPage from '../TeamLead/QualityChecking';

import EmployeeHome from '../TeamLead/Home';
import DistributeWork from '../TeamLead/DistributeWork';


const TeamLeadRoute = () => {
  return (
    <div>
       <Routes>
       <Route element={<Layout />}>
       <Route path="home" element={<EmployeeHome />} />
       <Route path="distributework" element={<DistributeWork />} />

      <Route path="quality" element={<QualityCheckerPage />} />
       </Route>
       </Routes>
    </div>
  )
}

export default TeamLeadRoute
