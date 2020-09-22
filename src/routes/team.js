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

router.patch('/teams/:id/update', auth, admin, async (req, res) => {
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

router.get('/teams/:id', auth, admin, async (req, res) => {
	try {
		const team = await Team.findById(req.params.id);

		if (!team) {
			res.status(404).send({ Error: 'Team not found' });
		}

		res.send(team);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

router.get('/teams', auth, admin, async (req, res) => {
	try {
		const team = await Team.find({});

		res.send(team);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.delete('/teams/:id/delete', auth, admin, async (req, res) => {
	const { params } = req;

	try {
		const team = await Team.findById(params.id);

		if (team) {
			await Team.findByIdAndDelete(params.id);

			res.send({ message: 'team successfully deleted', team });
		}

		res.send({ Error: 'Team not found' });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

module.exports = router;
