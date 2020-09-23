const mongoose = require('mongoose');
const validator = require('validator');

const fixtureSchema = mongoose.Schema({
	team_a: {
		type: String,
		required: true,
		ref: 'User',
	},
	team_b: {
		type: String,
		required: true,
		ref: 'User',
	},
	date: {
		type: Date,
		required: true,
		default: Date.now(),
		validate(value) {
			if (!validator.isDate(value)) {
				throw new Error('Date is invalid');
			}
		},
	},
	status: {
		type: String,
		required: true,
		default: 'pending',
	},
	link: {
		type: String,
		required: true,
	},
	fixture_id: {
		type: String,
		required: true,
	},
});

fixtureSchema.statics.formatTeamName = (teamName) => {
	if (teamName && teamName.includes(' ')) {
		const newTeamName = teamName.replace(' ', '-');

		return newTeamName;
	} else {
		return teamName;
	}
};

const Fixture = mongoose.model('Fixture', fixtureSchema);

module.exports = Fixture;
