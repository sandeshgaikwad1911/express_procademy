import express from 'express';
import { authController } from '../controllers/authController.js';
import { userController } from '../controllers/userController.js';

const router = express.Router();

router.route('/all-users').get(userController.allUsers)
router.route('/update-password').patch(authController.protectedtRoute, userController.updatePassword)
router.route('/update-me').patch(authController.protectedtRoute, userController.updateMe)
router.route('/deactive-account').delete(authController.protectedtRoute, userController.deactive_account)

export default router;