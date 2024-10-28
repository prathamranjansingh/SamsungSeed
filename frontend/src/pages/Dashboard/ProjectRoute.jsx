import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProjectManagerHome from '../ProjectManager/Home'
import Layout from '../../components/others/ProjectManager/Layout'
import TasksPage from '../ProjectManager/Tasks'
import TeamLeadManagement from '../ProjectManager/TeamLeadManagement'

export const ProjectRoute = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
      <Route path="/home" element={<ProjectManagerHome />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/team" element={<TeamLeadManagement />} />
      </Route>
      </Routes>
  )
}
