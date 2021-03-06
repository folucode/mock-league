const express = require('express');
const Fixture = require('../models/fixture');
const Team = require('../models/team');
const router = new express.Router();
const { v4: uuidv4 } = require('uuid');

const algoliaclient = require('../search/algolia');

const fixtureIndex = algoliaclient.initIndex('fixtures');

function randomDate(start, end) {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	);
}

router.post('/fixtures/seed', async (req, res) => {
	try {
		const team = await Team.find({});

		const statusList = ['pending', 'ongoing', 'completed'];

		const teamNames = [];

		const fixtures = [];

		for (let i = 0; i < team.length; i++) {
			teamNames[i] = team[i]['fullname'];
		}

		for (let i = 0; i < teamNames.length - 1; i++) {
			const team_a = teamNames[i];
			const team_b = teamNames[i + 1];
			const date = randomDate(new Date(2020, 0, 10), new Date(2020, 10, 10));
			const status = statusList[Math.floor(Math.random() * Math.floor(3))];

			const team_a_formatted = Fixture.formatTeamName(team_a);
			const team_b_formatted = Fixture.formatTeamName(team_b);

			const fixture_id = uuidv4();

			const link = `/fixtures/${team_a_formatted}-v-${team_b_formatted}/${fixture_id}`;

			let objectID = uuidv4();

			const computedFixture = {
				team_a,
				team_b,
				date,
				status,
				link,
				fixture_id,
				objectID,
			};

			fixtures.push(computedFixture);
		}

		await Fixture.insertMany(fixtures);

		await fixtureIndex.saveObjects(fixtures, {
			autoGenerateObjectIDIfNotExist: true,
		});

		res.send({ response: 'Data seeding successful', fixtures });
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;
