import express from 'express';
import * as authController from '../BL/auth';

const router = express.Router();

router.post(
	'/login',
	[authController.validateLoginEmail, authController.validateLoginPassword],
	authController.postLogin
);

module.exports = router;
