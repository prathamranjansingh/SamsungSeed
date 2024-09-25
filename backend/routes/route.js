import express from 'express';
import { login, register, resetPassword } from '../Auth/auth.js';
import { forgotPassword } from '../utils/mailSend.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:id/:token', resetPassword);

export { router };
