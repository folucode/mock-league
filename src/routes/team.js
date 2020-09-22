const express = require('express');
const Team = require('../models/team');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = new express.Router();

router.post('/teams/add', auth, admin, async (req, res) => {
	const team = new Team(req.body);

	try {
		await team.save();

		res.status(201).send(team);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

router.patch('/team/:id/update', auth, admin, async (req, res) => {
	const { params, body } = req;

	const updates = Object.keys(body);

	try {
		const team = await Team.findById(params.id);

		if (!team) {
			return res.status(404).send();
		}

		updates.forEach((update) => (team[update] = body[update]));

		await team.save();

		res.send(team);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;
