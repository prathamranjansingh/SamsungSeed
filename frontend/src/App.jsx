import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRoutes from './pages/Dashboard/AdminRoutes';
import ProtectedRoute from './components/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
