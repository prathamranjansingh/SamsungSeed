import express, { Router } from 'express';
import multer from 'multer';


import { adminRegister } from '../controllers/admin.js';
import {registerEmployee, getEmployees, updateRole, empSkillAdd, getOwnEmployeeDetail, getEmployeeTeamProjectDetails, editWorkStatus } from '../controllers/client.js'
import { handleAttendanceUpload, handleGetAttendance } from '../controllers/attendance.js';
import { createTeam,checkTeamLead,deleteTeam, getTeams, getTaskUnassignedTeams } from '../controllers/teams.js';
import { createProject, deleteProject, editDueDate, getProject, getAllProjects} from '../controllers/project.js';
import { countTeamLeadStats, getTeamLead, fetchTeamLead, updateTeamLead, getTeamLeadTasks, getTaskEmp } from '../controllers/teamlead.js';
import { updateprojectmanager , getProjectManager, getTeamNameAndCount, getTaskEmpName, getTeamLeadNameAndCount} from '../controllers/projectmanager.js';
import { createTask, deleteTask, getTasks } from '../controllers/tasks.js';
import { assignWork, getEmployeesToAssign, getEmployeesWorkFolder } from "../controllers/empwork.js"

import { login, resetPassword } from '../Auth/auth.js';
import { forgotPassword } from '../utils/mailSend.js';


//middleware
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/register-admin', adminRegister);

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:id/:token', resetPassword);
router.post('/register-employee', registerEmployee);

router.get('/getProjectManager', getProjectManager);   //new
router.post('/updateProjectManager', updateprojectmanager);  //new
router.post('/fetchTeamLead', fetchTeamLead);  //new
router.post('/updateTeamLead', updateTeamLead);  //new
router.get('/getEmployees', getEmployees);   
router.get('/personalEmpDetail', getOwnEmployeeDetail)  //same as fetchData


router.post('/emp-add',empSkillAdd);
router.post('/createTeam', authMiddleware, createTeam);
router.post('/delete-team', deleteTeam);  
router.post('/create-project', createProject); //@-- working (changed naming convention)

//not tested yet
router.post('/delete-project', deleteProject);  //@-- working
router.get('/get-project',getProject); //@--  working get details of project by its id 
router.get('/getLeadDetails', countTeamLeadStats); //@-- working ---??
 router.get('/getTeamLead', getTeamLead); //@ working
 router.post('/edit-project', editDueDate); //@-- working
router.post('/update-role', updateRole); //@-- working
// router.get('/check-teamLead', checkTeamLead);
 router.get('/getTeams', getTeams); //@-- working
router.get('/getUnassignedTeams',getTaskUnassignedTeams)

 router.get('/getProjects', getAllProjects); //@-- working

router.post('/upload', upload.single('file'), handleAttendanceUpload);
router.get('/attendance', handleGetAttendance);


router.post('/create-task', createTask);
router.get('/getTasks', getTasks);
router.post('/delete-task', deleteTask);





//team lead 

router.get('/teamleadDetail', getTeamLeadTasks)


router.get('/getempDetails',getEmployeeTeamProjectDetails)

//WORK EMPLOYEE
router.post('/assignWork', assignWork);
router.get('/displayEmployees', getEmployeesToAssign);
router.get('/folderPath', getEmployeesWorkFolder)
router.post('/editStatus', editWorkStatus);
router.post('/getLeadTaskEmp',getTaskEmp)

router.get('/getTeamNameAndCount',getTeamNameAndCount)
router.get('/getTaskEmpName',getTaskEmpName)

router.get('/teamLeadNameCount', getTeamLeadNameAndCount);


export { router };
