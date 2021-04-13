import { check, body } from 'express-validator/check';
import { validationResult } from 'express-validator/check';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as User from '../models/User';
import * as Login from '../models/Login';

export async function postLogin(req, res, next) {
	const errors = validationResult(req);
	const { email, password } = req.body;

	if (errors.isEmpty()) {
		signInUser();
		const id = req.user.id.toString();
		Login.createLogin({
			date: Date.now(),
			customer_id: id,
		});
	} else cancelSignIn();

	function signInUser() {
		const { email, id } = req.user;
		const userId = id.toString();
		var token = jwt.sign(
			{
				email,
				userId,
			},
			'parserdepracated',
			{ expiresIn: '1h' }
		);
		let user = { email, id };
		res.status(200).json({ token, user });
	}

	function cancelSignIn() {
		res.status(400).json({
			errorMessage: errors.array(), //[0].msg,
			oldInput: {
				email,
			},
		});
	}
}

export async function postCreateUser(req, res, next) {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		var { email, password, gender, status } = req.body;
		let hashedPassword = await bcrypt.hash(password, 12);
		await User.createUser({
			email,
			password: hashedPassword,
		});
		res.status(200).end();
	} else {
		res.status(406).json({ errors });
	}
}

/**Middleware functions */
export var validateLoginEmail = body('email').custom(async (email, { req }) => {
	try {
		var user = await User.findByEmail(email);
	} catch (error) {
		console.log(error);
	}
	if (!user) {
		var error = new Error('user not found');
		error.statusCode = 401;
		throw error;
	} else {
		req.user = user;
		return true;
	}
});
export var validateLoginPassword = body('password').custom(
	async (password, { req }) => {
		if (req.user) {
			try {
				var doMatch = await bcrypt.compare(password, req.user.password);
			} catch (error) {
				console.log(error);
			}

			if (doMatch) return true;
			else {
				var error = new Error('Incorrect password');
				error.statusCode = 401;
				throw error;
			}
		}
	}
);

export var validateSignupEmail = body('email') //validate email
	.not()
	.isEmpty()
	.isEmail()
	.withMessage('illegal email address')
	.custom(async email => {
		let user;
		try {
			user = await User.findByEmail(email);
		} catch (error) {
			error.statusCode = 500;
			next(error);
		}

		if (user) {
			const error = new Error('Email already exist');

			throw error;
		}
	});

export var validateSignupPassword = body('password') // validate password
	.custom((password, { req }) => {
		if (password !== req.body.passwordConfirmation) {
			throw new Error('Password confirmation not match password');
		}
		return true;
	})
	.isLength({
		min: 5,
	})
	.withMessage('password must be 5 chars or more')
	.isAlphanumeric()
	.withMessage('password must contain only letters and numbers');

export const signupMiddleware = [validateSignupEmail, validateSignupPassword];
