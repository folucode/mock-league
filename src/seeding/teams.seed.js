const express = require('express');
const Team = require('../models/team');
const router = new express.Router();
const faker = require('faker');

router.post('/teams/seed', async (req, res) => {
	try {
		let teams = [];

		for (let index = 0; index < 100; index++) {

			let fullname = faker.lorem.words(2);
			let short_name = `${fullname.charAt(0).toUpperCase()}FC`;

			let newTeam = {
				fullname,
				nickname: faker.lorem.slug(),
				short_name,
				founded: Math.floor(faker.finance.amount(1800, 2020)),
			};

			teams.push(newTeam);
		}

		await Team.insertMany(teams);

		res.send('Data seeding successful');
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;
