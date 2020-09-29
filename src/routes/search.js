const express = require('express');
const router = new express.Router();
const algoliaclient = require('../search/algolia');

router.get('/search/:query', async (req, res) => {
	const { query } = req.params;

	try {
		const queries = [
			{
				indexName: 'teams',
				query,
			},
			{
				indexName: 'fixtures',
				query,
			},
		];

		const results = await algoliaclient.multipleQueries(queries);

		res.send(results);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;