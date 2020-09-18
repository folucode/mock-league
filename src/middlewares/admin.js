const admin = (req, res, next) => {
	try {
		const adminUser = req.user.role === 'admin';

		if (adminUser) {
			return next();
		}

		throw new Error('Page not found');
	} catch (error) {
		res.status(404).send({ error: 'Page not found' });
	}
};

module.exports = admin;
