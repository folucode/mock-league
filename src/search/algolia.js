const algoliasearch = require('algoliasearch');

const algoliaclient = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);

module.exports = algoliaclient;