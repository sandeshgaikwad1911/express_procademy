import express from 'express';
import { authController } from '../controllers/authController.js';
const router = express.Router();

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/all_users').get(authController.allUsers)
router.route('/forgot-password').post(authController.forgotPassword)
router.route('/reset-password/:token').patch(authController.resetPassword)
router.route('/update-password').patch(authController.protectedtRoute, authController.updatePassword)

export default router;