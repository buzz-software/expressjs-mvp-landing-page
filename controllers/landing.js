
const models = require('../models')

const sidepanel = require('../helpers/sidepanel');

const panel = sidepanel.panel

const { addSubscriberToMailchimp } = require('./mailchimp');

exports.get_landing = function(req, res, next) {
	return models.Landing.findOne({where: { name: "landing" }}).then(landing => {
		res.render('landing', { landing, user: req.user });		
	})
}

exports.signin_basik = function(req, res, next) {
	res.render('user/signin-basik', { });
}

exports.submit_lead = function(req, res, next) {
	return models.Lead.create({
		email: req.body.lead_email
	}).then(lead => {
		return models.Mailchimp.findOne({where: {name: "landing"}}).then(mc => {
			return addSubscriberToMailchimp(req.body.lead_email, mc).then(result => {
				return models.Landing.findOne({where: {name: "landing"}}).then(landing => {
					res.redirect(landing.redirect_url);	
				})
					
			})
		})
	})
}

// Dashboard side:

exports.show_landing_settings = function(req, res, next) {
	return models.Landing.findOne({where: { name: "landing" }}).then(landing => {
		res.render("landing/edit_landing", { panel, landing });
	})
}


// this will work for all video of youtube and vimeo
const commonURLValidator = /\/v\/(.{11})|\/embed\/(.{11})|v=(.{11})|/gm;

function getEmbedUrl(url) {
	const regYoutubeExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	const regVimeoExp = /vimeo\.com\/([0-9]{1,10})|player\.vimeo\.com\/video\/([0-9]*)/gm;
    let match = url.match(regYoutubeExp);
    if (match) {
        return 'https://www.youtube.com/embed/' + match[2];
    } else {
		match = url.match(regVimeoExp);
		if (match) {
			match = match[0].split('/');
        	return 'https://player.vimeo.com/video/'+match[match.length -1];
    	} else {
    		return null;
    	}
    }
}

// Just validate title is not empty.
const setVideoEmbedUrl = function(req, res, next) {
	let errors = {};

	// FIXME: Validate req.body.video_url to be a valid url: http or https.
	// In fact convert it to valid vimeo player url.
	if (req.body.video_url) {
		const urlData = req.body.video_url.match(commonURLValidator);
		if(urlData == null) {
			errors["video_url"] = "Please provide a valid video url.";
		} else {
			let embed_url = getEmbedUrl(req.body.video_url);
			if (embed_url) {
				req.body.video_url = embed_url;
			} else {
				errors["video_url"] = "Video url not recognized. Make sure this is a youtube or vimeo video."
			}
		}
	}
	return errors;
}

// TODO: Sanitize Landing:
exports.update_landing_settings = function(req, res, next) {
	return models.Landing.findOne({where: { name: "landing" }}).then(landing => {
		setVideoEmbedUrl(req, res, next);
		return landing.update(req.body).then(result => {
			res.redirect("/landing");
		})
	})
}

