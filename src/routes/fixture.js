const express = require('express');
const Fixture = require('../models/fixture');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const { v4: uuid_v4 } = require('uuid');
const router = new express.Router();

router.post('/fixtures/new', auth, admin, async (req, res) => {
	const { team_a, team_b, date, status } = req.body;

	try {
		const team_a_formatted = Fixture.formatTeamName(team_a);
		const team_b_formatted = Fixture.formatTeamName(team_b);

		const fixture_id = uuid_v4();

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

router.get('/fixtures/:fixture/:id', auth, async (req, res) => {
	const { params } = req;

	try {
		const fixture = await Fixture.where({ fixture_id: params.id }).findOne();

		if (!fixture) {
			return res.status(400).send({ Error: 'Fixture not found' });
		}

		res.send(fixture);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

router.get('/fixtures/:status', auth, async (req, res) => {
	const { params } = req;

	try {
		const fixtures = await Fixture.where({ status: params.status }).find();

		if (!fixtures) {
			return res.status(400).send({ Error: `No ${params.status} Fixtures` });
		}

		res.send(fixtures);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;
