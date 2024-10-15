import express from 'express';
import { login, resetPassword } from '../Auth/auth.js';
import {registerEmployee, getEmployees } from '../controllers/employee.js'
import { forgotPassword } from '../utils/mailSend.js';
import multer from 'multer';
import { handleAttendanceUpload, handleGetAttendance } from '../controllers/attendance.js';
import { fetchData } from '../controllers/client/fetchData.js';
import { empAdd } from '../controllers/client/empUpdate.js';
import { createTeam } from '../controllers/teams/createTeam.js';
import { createProject } from '../controllers/projects/createProject.js';
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
router.get('/get-team', getTeams)
export { router };
