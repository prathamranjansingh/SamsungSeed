import { Route, Routes } from 'react-router-dom';
import Layout from '../../components/others/Employee/Layout';
import {DashboardContent} from '../Employee/DashboardContent'
import {TeamView} from '../Employee/TeamView'
import {TaskView} from '../Employee/TaskView'
import {EmployeeAttendance} from '../Employee/EmployeeAttendance'
import {ProjectView} from '../Employee/ProjectView'

const EmployeeRoute = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/home" element={<DashboardContent />} />
        <Route path="/projects" element={<ProjectView />} />
        <Route path="/tasks" element={<TaskView />} />
        <Route path="/team" element={<TeamView />} />

        <Route path="/attendance" element={<EmployeeAttendance/>} />
      </Route>
    </Routes>
  
  );
};

export default EmployeeRoute;
