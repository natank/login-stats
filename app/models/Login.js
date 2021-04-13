import mongoose from 'mongoose';

const Schema = mongoose.Schema;

function today() {
	let today = new Date(Date.now());
	return today;
}

const loginSchema = new Schema({
	customer_id: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	date: {
		type: String,
		default: today(),
	},
});

const Login = mongoose.model('Login', loginSchema);

export const model = Login;

export async function createLogin({ date, customer_id }) {
	try {
		const login = new Login({ date, customer_id });

		const response = await login.save();
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getLoginsStats({ customerId }) {}
