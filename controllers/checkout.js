
const models = require('../models')

// Gets picked plan as query string &plan=<planid>
exports.show_checkout = function(req, res, next) {
	let stripe_public_key; // Key used by JS client.

	if (process.env.NODE_ENV != "production")
		stripe_public_key = "pk_test_1WWvpFogQomy62mp9pXcS4jR";
	else if (process.env.NODE_ENV == "production")
		stripe_public_key = "pk_live_7mg8Fl0aQxKeJ8q99Si3E4yK";

	return models.Plan.findOne({where: { id: req.query.plan }}).then(plan => {
		if (!plan)
			next();
		res.render("checkout", { stripe_public_key, plan });		
	})
}

const delete_stripe_subscription = (subscriptionId) => {
	return new Promise(function(resolve, reject) {
		stripe.subscriptions.del(subscriptionId, (err, confirmation) => {
			if(err) {
				reject(err);
			}
			resolve(confirmation);
		});
	});
}

function stripe_create_customer_subscription(company, token, coupon, next) {
	return new Promise(function(resolve, reject) {
		// Create customer on stripe and save token to Stripe
		stripe.customers.create({
		  email: company.email,
		  source: token,
		}).then(function(customer) {
			// Subscribe customer to plan.
			// Plan was previously manually set up and is in sync with Stripe.
			console.log("Date", company.billing_date);
			stripe.subscriptions.create({
				customer: customer.id,
				  items: [{
					  plan: company.Plan.stripe_planId,
				  }],
				  trial_end: Math.floor(moment(company.billing_date).unix()),
				  coupon: coupon
			  }).then(res => {
				  console.log(res.id, {stripe_subscription_id: res.id})
				// Save stripe customer ID and subscription ID to our database
				console.log(company)
				company.updateAttributes({
					stripe_customerId: customer.id,
					is_onboarded: true,
					stripe_subscription_id: res.id
				}).then(() => {
					console.log('done')
					resolve(res);
				}).catch(err => { next(err); });
			  }).catch(err => { next(err); });
		}).catch(err => { next(err); });
	});
}


// Process cc info. Check coupon code passed and call subscription create accordingly.
exports.process_cc = function(req, res, next) {
	models.Company.findOne({ where: { slug : req.params.company }, include: [{ model: models.Plan }]}).then(c => {
		if (req.body.coupon) {
			console.log("Coupon:", req.body.coupon);

			// If coupon was invalid, rerender CC page.
			return stripe.coupons.retrieve(req.body.coupon).then(coupon => {
				if (coupon.valid == true) {
					return stripe_create_customer_subscription(c, req.body.stripeToken, req.body.coupon, next).then(result => {
						res.redirect("/o" + '/' + req.params.company + "/setup-profile");
					}).catch(err => { next(err)})
				} else {
					req.errors = {};

					req.errors.coupon = "Invalid, expired or non-existent coupon code. If you were promised one, please contact our team."
					show_rerender_company_enter_cc(req, res, next)
				}
			}).catch(err => { 
				req.errors = {};
				req.errors.coupon = "Invalid, expired or non-existent coupon code. If you were promised one, please contact our team."
				show_rerender_company_enter_cc(req, res, next) 
			});
		} else {
			return stripe_create_customer_subscription(c, req.body.stripeToken, null, next).then(result => {
				res.redirect("/o/" + req.params.company + "/setup-profile");
			}).catch(err => { next(err)})
		}
	}).catch(err => { next(err); });
}
