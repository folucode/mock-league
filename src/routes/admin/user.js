const express = require('express');
const admin = require('../../middlewares/admin');
const auth = require('../../middlewares/auth')
const User = require('../../models/user');
const router = new express.Router();

router.get('/users/all', auth, admin, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;