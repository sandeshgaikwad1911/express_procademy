import express from 'express';
import { authController } from '../controllers/authController.js';
const router = express.Router();

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/all_users').get(authController.allUsers)

export default router;