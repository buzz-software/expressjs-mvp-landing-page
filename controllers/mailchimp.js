const models = require('../models')


const rp = require('request-promise');

const sidepanel = require('../helpers/sidepanel');
const panel = sidepanel.panel

const searchAndAdd = (searchUrl, auth, listUrl, email) => {
    return rp({
        method: 'GET',
        uri: searchUrl,
        headers: {
            Authorization: auth
        },
    }).then(s => {
        s = JSON.parse(s);
        if(s.exact_matches.members.length > 0) {
            return Promise.resolve({msg: 'Email already in subscriber list'});
        } else {
            return rp(
                {
                    method: 'POST',
                    uri: listUrl,
                    body: {
                        "email_address": email,
                        "status": "subscribed",
                    },
                    headers: {
                        Authorization: auth
                    },
                    json: true
                }
            );
        }
    });
}

exports.addSubscriberToMailchimp = (email, mc) => {
    const mailchimpBaseApiUrl = `https://${mc.api_key.slice(-3)}.api.mailchimp.com/3.0`;
    const listUrl = mailchimpBaseApiUrl + '/lists/' + mc.listid + '/members';
    const auth = "Basic " + new Buffer("anystring:" + mc.api_key).toString("base64");
    const searchUrl = mailchimpBaseApiUrl + `/search-members?query=${email}`;
    return searchAndAdd(searchUrl, auth, listUrl, email);
}

exports.show_mailchimp_settings = function(req, res, next) {
	return models.Mailchimp.findOne({where: { name: 'landing'}}).then(mc => {
		if (!mc) {
			let mc = { listid: null, api_key: null }
			res.render("mailchimp/mailchimp", { mc, panel })
		} else {
			res.render("mailchimp/mailchimp", { mc, panel })
		}
	});
}

exports.update_mailchimp_settings = function(req, res, next) {
	return models.Mailchimp.findOne({where: {name: 'landing'}}).then(mc => {
		if (mc) {
			return mc.update({
				listid: req.body.mc_listid,
				api_key: req.body.mc_api_key
			}).then(result => {
				res.redirect("/mailchimp");
			})
		} else {
			return models.Mailchimp.create({
				name: 'landing',
				listid: req.body.mc_listid,
				api_key: req.body.mc_api_key
			}).then(result => {
				res.redirect("/mailchimp");
			})
		}
	})
}