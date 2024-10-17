import express from 'express';
import { login, resetPassword } from '../Auth/auth.js';
import {registerEmployee, getEmployees } from '../controllers/employee.js'
import { forgotPassword } from '../utils/mailSend.js';
import multer from 'multer';
import { handleAttendanceUpload, handleGetAttendance } from '../controllers/attendance.js';
import { fetchData } from '../controllers/client/fetchData.js';
import { empAdd } from '../controllers/client/empUpdate.js';
import { createTeam } from '../controllers/teams/createTeam.js';
import { createProject, getAllProjects } from '../controllers/projects/createProject.js';
import { deleteProject } from '../controllers/projects/deleteProject.js';
import { deleteTeam } from '../controllers/teams/deleteTeam.js';
import { getEmpProjects } from '../controllers/projects/empProjects.js';
import { countTeamLeadStats } from '../controllers/teamlead/countTeamLead.js';
import { getTeamLead } from '../controllers/teamlead/getteamlead.js';
import { editDueDate } from '../controllers/projects/editProject.js';
import  {getTeams}  from '../controllers/teams/getTeams.js';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:id/:token', resetPassword);
router.post('/register-employee', registerEmployee);
router.get('/employees', getEmployees);
router.post('/upload', upload.single('file'), handleAttendanceUpload);
router.get('/attendance', handleGetAttendance);
router.get('/emp-fetch',fetchData);
router.post('/emp-add',empAdd);
router.post('/team-create', createTeam);
router.post('/project-create', createProject);
router.post('/delete-project', deleteProject);  
router.post('/delete-team', deleteTeam);   
router.get('/get-projects',getEmpProjects); 
router.post('/get-leaddetails', countTeamLeadStats);
router.post('/getTeamLead', getTeamLead);
router.post('/edit-project', editDueDate);
router.get('/get-team', getTeams)
router.get('/get-Allprojects', getAllProjects);

export { router };
