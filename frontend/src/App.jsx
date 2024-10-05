import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRoutes from './pages/Dashboard/AdminRoutes';
import ProtectedRoute from './components/PrivateRoute';
import TeamLeadRoute from './pages/Dashboard/TeamLeadRoute'
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['lead']} />}>
            <Route path="/lead/*" element={<TeamLeadRoute />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
