const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const router = new express.Router();

router.post('/users/signup', async (req, res) => {
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
		res.status(400).send(error.message);
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
	const { user, body } = req;

	const updates = Object.keys(body);
	const allowedUpdates = ['name', 'email', 'password'];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update),
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		updates.forEach((update) => (user[update] = body[update]));

		await user.save();

		if (!user) {
			return res.status(404).send();
		}

		res.send(req.user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;
