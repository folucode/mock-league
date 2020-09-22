const mongoose = require('mongoose');
const validator = require('validator');

const teamSchema = mongoose.Schema({
	fullname: {
		type: String,
		required: true,
		trim: true,
	},
	nickname: {
		type: String,
		required: true,
		trim: true,
	},
	short_name: {
		type: String,
		required: true,
		trim: true,
	},
	founded: {
		type: Number,
		required: true,
		vaidate(value) {
			if (value.length > 4 || value.length < 4) {
				throw new Error('Invalid year');
			}
		},
	},
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
