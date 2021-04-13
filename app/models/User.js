import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
	},
});

export const User = mongoose.model('User', userSchema);

export async function findByEmail(email) {
	try {
		let user = await User.findOne({ email });
		return user;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function createUser({ email, password }) {
	let user = new User({ email, password });
	try {
		await user.save();
	} catch (error) {
		console.log(error);
		throw error;
	}
}
