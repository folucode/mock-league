const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth')
const router = new express.Router();

router.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();

		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

module.exports = router;
