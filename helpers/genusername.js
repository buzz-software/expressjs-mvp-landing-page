const models = require('../models');


const { random_digits } = require('../helpers/random');
const { sanitizeName } = require('../helpers/generic');


// Test if username exists, if it does, add 5 random digits in the end.
const checkUsernameAddDigits = function(username) {
	return models.User.findOne({where: { username : username }}).then(exists => {
		// A user with this name, lastname pair exists
		if (exists) {
			const suffix = random_digits(5);
			return username+suffix;
		} else {
			return username;
		}
	});
}

// Try random digits 2 times to generate unique username.
// Not guaranteed unique but low probability of collusion.
// TODO: Good enough for now. Make this guaranteed later on, e.g. use UUID in 3rd attempt.
exports.generate_unique_username = function(firstname, lastname) {
	let username = sanitizeName(firstname, lastname);
	// Check and add some digits if it already exists.
	return checkUsernameAddDigits(username).then(first => {
		// Add some more digits if it exists in 2nd attempt.
		return checkUsernameAddDigits(first);
	});
}

exports.generate_unique_from_username = function(username) {
	// Check and add some digits if it already exists.
	return checkUsernameAddDigits(username).then(first => {
		// Add some more digits if it exists in 2nd attempt.
		return checkUsernameAddDigits(first);
	});
}