import React from 'react';
import { Route, Routes } from "react-router-dom";
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
const App = () => {
  return (  
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route path="/employee" element={<Employee />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reviews" element={<Review />} />
        <Route path="/emp" element={<EmployeeDashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/team" element={<TeamManagement />} />
      </Route>
    </Routes>
  );
};

export default App;