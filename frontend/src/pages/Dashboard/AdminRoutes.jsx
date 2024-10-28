import { Route, Routes } from 'react-router-dom';
import Layout from '../../components/others/Admin/Layout';
import Employee from '../Admin/employee';
import Projects from '../Admin/projects';
import Analytics from '../Admin/analytics';
import Home from '../Admin/home';
import Review from '../Admin/Review';
import TeamManagement from '../Admin/TeamManagement';
import AttendanceUpload from '../Admin/AttendanceUpload';
import EmployeeDashboard from '../Admin/employeeDashboard';

const AdminRoutes = () => {
  return (
    
    <Routes>
      <Route element={<Layout />}>
      <Route path="employee" element={<Employee />} />
      <Route path="projects" element={<Projects />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="reviews" element={<Review />} />
      <Route path="emp-dashboard" element={<EmployeeDashboard />} />
      <Route path="home" element={<Home />} />
      <Route path="team" element={<TeamManagement />} />
      <Route path="attendance" element={<AttendanceUpload />} />
      </Route>
    </Routes>
  
  );
};

export default AdminRoutes;
