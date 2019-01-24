let models = require('../models');

let validator = require('validator');


const validateCreateUserFields = function(errors, req) {
	if (!validator.isEmail(req.body.email)) {
		errors["email"] = "Please use a valid email.";
	}
	if (!validator.isAscii(req.body.password)) {
		errors["password"] = "Invalid characters in password, please try another one.";		
	}
	if (!validator.isLength(req.body.password, {min: 8, max: 25})) {
		errors["password"] = "Please ensure that your password has a minimum of 8 characters";
	}
}

exports.validateUser = function(errors, req) {
	return new Promise(function(resolve, reject) {
		validateCreateUserFields(errors, req);
		return models.User.findOne({
			where: {
				email: req.body.email
			}
		}).then(u => {
			if (u !== null) {
				errors["email"] = "Email is already in use. Please login or reset your password";
			}
			resolve(errors);
		})
	})
}