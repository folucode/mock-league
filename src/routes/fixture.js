const express = require('express');
const Fixture = require('../models/fixture');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const randomstring = require('randomstring');
const router = new express.Router();

router.post('/fixtures/new', auth, admin, async (req, res) => {
	const { team_a, team_b, date, status } = req.body;

	try {
		const team_a_formatted = Fixture.formatTeamName(team_a);
		const team_b_formatted = Fixture.formatTeamName(team_b);

		const fixture_id = randomstring.generate({
			length: 15,
			charset: 'alphanumeric',
		});

		const link = `/fixtures/${team_a_formatted}-v-${team_b_formatted}/${fixture_id}`;

		const computedFixture = {
			team_a,
			team_b,
			date,
			status,
			link,
			fixture_id,
		};

		const fixture = new Fixture(computedFixture);

		await fixture.save();

		res.status(201).send(fixture);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

router.get('/fixtures/:id', auth, async (req, res) => {
	const { params } = req;

	try {
		const fixture = await Fixture.findById(params.id);

		const { team_a, team_b, date, status } = fixture;

		const parsedFixture = {
			home_team: home_team.fullname,
			away_team: away_team.fullname,
			date,
			status,
		};

		res.send(parsedFixture);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;