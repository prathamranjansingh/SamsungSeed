import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/others/Layout';
import Employee from './pages/Employee';
import Projects from './pages/Projects';
import Analytics from './pages/Analytics';
import Home from './pages/Home';
import Review from './pages/Review';
import TeamManagement from './pages/TeamManagement';
import AttendanceUpload from './pages/AttendanceUpload';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProtectedRoute from './components/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/employee" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Review /></ProtectedRoute>} />
          <Route path="/emp" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><AttendanceUpload /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
