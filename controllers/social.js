



const models = require('../models')

const sidepanel = require('../helpers/sidepanel');

const panel = sidepanel.panel



// Get App instance and domain field, if it exists, if not return "" for domain.
exports.show_social_settings = function(req, res, next) {
	return models.App.findOne().then(app => {
		if (app)
			res.render('social/social-settings', { user: req.user, panel, domain: app.domain});
		else
			res.render('social/social-settings', { user: req.user, panel, domain: "yourdomain.com" });
	});
}

// Update or create App instance with submitted domain field.
exports.post_social_settings = function(req, res, next) {
	return models.App.findOne().then(app => {
		if (app) {
			return app.update({ domain: req.body.domain }).then(result => {
				res.redirect("/social-settings");
			})
		} else {
			return models.App.create({domain: req.body.domain}).then(result => {
				res.redirect("/social-settings");
			})
		}
	});
}