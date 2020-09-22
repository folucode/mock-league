const express = require('express');
const Team = require('../../models/team');
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');
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

module.exports = router;