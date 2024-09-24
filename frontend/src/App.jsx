// App.js
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/others/Layout";
import Employee from "./pages/Employee";
import Projects from './pages/Projects';
import Analytics from './pages/Analytics';
import Home from './pages/Home';
import Review from './pages/Review';
import TeamManagement from './pages/TeamManagement';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route path="/employee" element={<PrivateRoute element={<Employee />} />} />
          <Route path="/projects" element={<PrivateRoute element={<Projects />} />} />
          <Route path="/analytics" element={<PrivateRoute element={<Analytics />} />} />
          <Route path="/reviews" element={<PrivateRoute element={<Review />} />} />
          <Route path="/emp" element={<PrivateRoute element={<EmployeeDashboard />} />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/team" element={<PrivateRoute element={<TeamManagement />} />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
