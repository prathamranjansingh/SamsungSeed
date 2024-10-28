import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRoutes from './pages/Dashboard/AdminRoutes';
import ProtectedRoute from './components/PrivateRoute';
import TeamLeadRoute from './pages/Dashboard/TeamLeadRoute'
import EmployeeRoute from './pages/Dashboard/EmployeeRoute';
import { ProjectRoute } from './pages/Dashboard/ProjectRoute';
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['teamlead']} />}>
            <Route path="/teamlead/*" element={<TeamLeadRoute />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
            <Route path="/employee/*" element={<EmployeeRoute />} />
        </Route>
        <Route path="/projectmgr/*" element={<ProjectRoute />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
