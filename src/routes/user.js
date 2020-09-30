const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = new express.Router();
const algoliaclient = require('../search/algolia');
const { v4: uuid_v4 } = require('uuid');

const userIndex = algoliaclient.initIndex('users');

router.post('/users/signup', async (req, res) => {
	const user = new User(req.body);

	try {
		const objectID = uuid_v4();

		Object.assign(user, { objectID });

		await user.save();
		await userIndex.saveObject(user, {
			autoGenerateObjectIDIfNotExist: true,
		});

		const token = await user.generateAuthToken();

		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error.message);
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
	const isValidOperation = updates.every((update, index) =>
		allowedUpdates.includes(update),
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		updates.forEach((update) => (user[update] = body[update]));

		await user.save();

		await userIndex.partialUpdateObject(user);

		if (!user) {
			return res.status(404).send();
		}

		res.send(req.user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

router.post('/users/logout', auth, async (req, res) => {
	const { tokens } = req.user;

	try {
		req.user.tokens = tokens.filter((token) => {
			return token.token !== req.token;
		});

		await req.user.save();

		res.send();
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];

		await req.user.save();

		res.send();
	} catch (error) {
		res.status(500).send(error.message);
	}
});

// Admin only routes
router.get('/users/all', auth, admin, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

module.exports = router;
