import * as Login from '../models/Login';

export async function getStats(req, res) {
	const overallLogins = await Login.model.countDocuments();
	const overallCustomerLogins = await Login.model.countDocuments({
		customer_id: req.userId,
	});
	const now = Date.now();
	const week = 604800000;
	const weeklyCustomerLogins = await Login.model.countDocuments({
		date: { $gt: now - week },
	});

	res.json({
		overallLogins,
		overallCustomerLogins,
		weeklyCustomerLogins,
	});
}
