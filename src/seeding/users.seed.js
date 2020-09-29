const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const faker = require('faker');
const jwt = require('jsonwebtoken');

const algoliaclient = require('../search/algolia');

const userIndex = algoliaclient.initIndex('users');

router.post('/users/seed', async (req, res) => {
	try {
		let users = [];

		for (let index = 0; index <= 100; index++) {
			user = new User();

			role = ['user', 'admin'];

			token = jwt.sign(
				{
					_id: user._id.toString(),
				},
				process.env.JWT_SECRET,
			);

			let name = faker.name.findName();
			let email = faker.internet.email(name).toLowerCase();

			let newUser = {
				_id: user._id,
				name,
				email,
				password: await bcrypt.hash('Yx52RKRB!', 8),
				role: role[Math.floor(Math.random() * Math.floor(2))],
				tokens: user.tokens.concat({
					token,
				}),
				objectID: user._id,
			};

			users.push(newUser);
		}

		await userIndex.saveObjects(users, {
			autoGenerateObjectIDIfNotExist: true,
		});

		await User.insertMany(users);

		res.send(users);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;
