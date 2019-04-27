
const models = require('../models')
const moment = require('moment');
var stripe = require("stripe")("sk_test_NJ73Ciw9UF0TNSERdKlZWXgH");

// Gets picked plan as query string &plan=<planid>
exports.show_checkout = function(req, res, next) {
	let stripe_public_key; // Key used by JS client.

	console.log("User:", req.user)
	if (process.env.NODE_ENV != "production")
		stripe_public_key = "pk_test_1WWvpFogQomy62mp9pXcS4jR";
	else if (process.env.NODE_ENV == "production")
		stripe_public_key = "pk_live_7mg8Fl0aQxKeJ8q99Si3E4yK";

	console.log("Session var: req.session.plan:", req.session.planId)
	return models.Plan.findOne({where: { id: req.session.planId }}).then(plan => {
		if (!plan)
			next();
		res.render("checkout", { stripe_public_key, plan });		
	})
}

//return new Promise(function(resolve, reject) {
const delete_stripe_subscription = (subscriptionId) => {
	
		stripe.subscriptions.del(subscriptionId, (err, confirmation) => {

		});
}

const stripe_create_customer_subscription = function(user, plan, token, coupon, next) {
	// TODO: Set this by trial period stored in plan config.
	let billing_date = moment().add(1, 'M').toDate();

	// Create customer on stripe and save token to Stripe
	return stripe.customers.create({
	  email: user.email,
	  source: token,
	}).then(customer => {
		console.log("Customer:", customer)
		return stripe.subscriptions.create({
			customer: customer.id,
			  items: [{
				  plan: plan.stripe_PlanId,
			  }],
			  trial_end: Math.floor(moment(billing_date).unix()),
			  coupon: coupon
		  }).then(subs => {
		  	console.log("Subscription", subs)
		  	return plan.addUser(user).then(result => {
				return user.update({
					stripe_CustomerId: customer.id,
					stripe_SubscriptionId: subs.id,
					is_customer: true,
				});		  		
		  	});
		  }).catch(err => { next(err); });
	}).catch(err => { next(err); });
}

// Process cc info. Check coupon code passed and call subscription create accordingly.
exports.process_cc = function(req, res, next) {
	return models.Plan.findOne({where: {id: req.session.planId }}).then(plan => {
		delete req.session.planId;
		if (req.body.coupon) {
			console.log("Coupon:", req.body.coupon);

			// If coupon was invalid, rerender CC page.
			return stripe.coupons.retrieve(req.body.coupon).then(coupon => {
				if (coupon.valid == true) {
					return stripe_create_customer_subscription(req.user, plan, req.body.stripeToken, req.body.coupon, next).then(result => {
						res.redirect("/");
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
			return stripe_create_customer_subscription(req.user, plan, req.body.stripeToken, null, next).then(result => {
				res.redirect("/");
			}).catch(err => { next(err)})
		}
	})
}
