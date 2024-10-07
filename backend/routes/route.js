import express from 'express';
import { login, resetPassword } from '../Auth/auth.js';
import {registerEmployee} from '../controllers/employee.js'
import { forgotPassword } from '../utils/mailSend.js';
import multer from 'multer';
import { handleAttendanceUpload } from '../controllers/attendance.js';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:id/:token', resetPassword);
router.post('/register-employee', registerEmployee);
router.post('/upload', upload.single('file'), handleAttendanceUpload);
export { router };
