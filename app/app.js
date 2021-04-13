import express from 'express';

import connectDB from './DB/Connection';

import cors from 'cors';
import * as authController from './BL/auth';
import statsRouter from './routes/stats';

connectDB();

const app = express();

app.use(cors());

/**
 * data middleware
 */
const dataMW = (function (app) {
	app.use(express.json({ extended: false }));
	app.use(express.urlencoded({ extended: true }));
})(app);

/**
 * Routes
 */

app.put(
	'/register',
	authController.signupMiddleware,
	authController.postCreateUser
);
app.post('/login', [
	authController.validateLoginEmail,
	authController.validateLoginPassword,
	authController.postLogin,
]);
app.use('/stats', statsRouter);

/**
 * Error handling
 */
app.use(function notFound(req, res) {
	res.status(404).end();
});

app.use(function errorHandler(error, req, res, next) {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message, data });
});

const connect = (async function (app) {
	const PORT = process.env.PORT || 8080;
	const server = app.listen(PORT, () => {
		console.log(`app is listening on port http://localhost:${PORT}`);
	});
})(app);
