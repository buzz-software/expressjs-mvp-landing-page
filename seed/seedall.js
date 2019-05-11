
let models = require('../models');

exports.seedAll = function(req, res, next) { 
	return models.Landing.findOne({where: {name: "landing"}}).then(landing => {
		if (landing) {
			return landing;
		} else { 
			let landing = {
				name: 'landing',
				title_tag: "Don't forget to update your title tag",
				description_tag: "And Description!",
				title: "Congratulations! Your SaaS has launched.",
				subtitle: "Now please go to your dashboard and update this landing page copy.",
				paragraph1: "Describe how your users can save time, money: Using (our product) X you can do X faster and cheaper.",
				paragraph2: "Make sure to explain bottom line benefit in the main title, so you catch user interest to read more.",
				button_cta: "Get started",
				redirect_url: "/pricing",
				video_url: "https://www.youtube.com/embed/JzEC54CqsgM",
			}
			return models.Landing.create(landing);
		}
	})
}