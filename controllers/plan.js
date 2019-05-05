
var env  = process.env.NODE_ENV || 'development';
//let configs = { development, production, beta } = require('./config/cloud_config');
//const {twitter, google, facebook} = configs[env];
const models = require('../models')

const sidepanel = require('../helpers/sidepanel');
const panel = sidepanel.panel


const productPrefix = "SaaS_";

var stripe = require("stripe")("sk_test_NJ73Ciw9UF0TNSERdKlZWXgH");

exports.show_create_plan = function(req, res, next) {
	res.render('plan/create_plan', { panel });
}

// Query existing plan with name, if exists, attach this plan to existing product.
// If plan with same name doesn't exist, create new product.
const createStripePlan = function(req, res, next, plan) {

	// Check if there is a plan with the same name
	return models.Plan.findOne({where: { name: plan.name }}).then(existingPlan => {
		// Use existing plan's product's ID
		if (existingPlan) {
			return stripe.plans.create({
				amount: plan.price_per_period*100,	// In Cents.
				interval: plan.billing_period.slice(0,-2), // Convert e.g. monthly to month
				product: existingPlan.stripe_ProductId,	// Pass product ID if existing plan with same name.
				currency: "usd",
			}).then(result => {
				return result;
			}).catch(err => { next(err); });
		// Create new product
		} else {
			return stripe.plans.create({
				amount: plan.price_per_period*100,	// In Cents.
				interval: plan.billing_period.slice(0,-2), // Convert e.g. monthly to month
				product: {
					name: productPrefix + plan.name 	// Create new product
				},
				currency: "usd",
			}).then(result => {
				return result;
			}).catch(err => { next(err); });
		}
	})
}

// Create sanitized version of submitted plan
const sanitizedPlan = function(req, res, next) {
	let plan = {
		name: req.body.plan_name,
		price_per_period : (req.body.plan_price_per_period == "") ? 0 : Number(req.body.plan_price_per_period),
		billing_period : (req.body.plan_billing_period) ? req.body.plan_billing_period.toLowerCase() : null,
		discount_pct : (req.body.plan_discount_pct == "") ? 0 : Number(req.body.plan_discount_pct),
		cta: req.body.plan_cta,
		feature1: req.body.plan_feature1,
		feature2: req.body.plan_feature2,
		feature3: req.body.plan_feature3,
		feature4: req.body.plan_feature4,
		feature5: req.body.plan_feature5,
		feature6: req.body.plan_feature6,
		feature7: req.body.plan_feature7,
		feature8: req.body.plan_feature8,
		feature9: req.body.plan_feature9,
		feature10: req.body.plan_feature10,	
		rank : (req.body.plan_rank == "") ? 0 : Number(req.body.plan_rank),	
	}
	return plan;
}

exports.submit_plan = function(req, res, next) {

	let plan = sanitizedPlan(req);

	return createStripePlan(req, res, next, plan).then(stripe_plan => {
		plan.stripe_PlanId = stripe_plan.id;
		plan.stripe_ProductId = stripe_plan.product;

		return models.Plan.create( plan ).then(result => {
			res.redirect('/plans');
		}).catch(err => next(err));
	})
}

exports.show_plans = function(req, res, next) {
	return models.Plan.findAll().then(plans => {
 		res.render('plan/plans', { title: 'Express', plans : plans, panel });		
	})
}

exports.show_plan = function(req, res, next) {
	return models.Plan.findOne({
		where : {
			id : req.params.plan_id
		}
	}).then(plan => {
		res.render('plan/plan', { plan : plan, panel });
	});
}


exports.show_edit_plan = function(req, res, next) {
	return models.Plan.findOne({
		where : {
			id : req.params.plan_id
		}
	}).then(plan => {
		res.render('plan/edit_plan', { plan : plan, panel });
	});
}


// First delete the plan, then create new one with updated values.
const stripeUpdatePlan = function(req, res, next, plan) {
	// Delete original Stripe plan
	return stripe.plans.del(plan.stripe_PlanId).next(result => {
		// Create new Stripe plan
		return createStripePlan(req, res, next, plan).then(stripe_plan => {
			// Modify our existing plan record with new Stripe plan and product id.
			plan.stripe_PlanId = stripe_plan.id;
			plan.stripe_ProductId = stripe_plan.id
			return plan;
		})
	}).catch(err => next(err))
}


// Update our record of a pricing plan.
const updatePlan = function(req, res, next, plan) {
	return models.Plan.update(plan, { 
		where: {
			id: req.params.plan_id
		}
	}).then(result => {
		res.redirect('/plan/' + req.params.plan_id);
	})
}

exports.edit_plan = function(req, res, next) {
	let updateParams = sanitizedPlan(req);

	// Re-create stripe plan if price/period has changed.
	return models.Plan.findOne({
		where: {
			id: req.params.plan_id}
		}).then(existingPlan => {
		// If plan requires re-creating a stripe plan
		if ((updateParams.price_per_period != existingPlan.price_per_period) ||
			(updateParams.billing_period != existingPlan.billing_period)) {
			return stripeUpdatePlan(req, res, next, updateParams).then(newParams => {
				// Save existing plan with new stripe ids.
				return models.Plan.update(newParams, {where: { id: req.params.plan_id }}).then(result => {
					res.redirect('/plan/' + req.params.plan_id);
				})
			})
		} else {
			// Save existing plan, no stripe updates were needed.
			return models.Plan.update(updateParams, { where: { id: req.params.plan_id }}).then(result => {
				res.redirect('/plan/' + req.params.plan_id);
			})
		}
	});
}

// Deletes plan, if noone else uses plan's product id, delete product as well.
exports.delete_plan = function(req, res, next) {
	return models.Plan.findOne({
		where: { id: req.params.plan_id}
		}).then(plan => {
			console.log("My plan:", plan);
			return stripe.plans.del(plan.stripe_PlanId).then(result => {
			
			let stripe_ProductId = plan.stripe_ProductId;
			return plan.destroy().then(result => {
				// If this was the last plan with this name,
				// also delete the root product:
				return models.Plan.findOne({where: { stripe_ProductId: stripe_ProductId }}).then(plan => {
					// If no plan exists with this product Id
					if (!plan) {
						return stripe.products.del(stripe_ProductId).then(result =>{
							res.redirect('/plans');
						})
					} else {
						res.redirect('/plans');
					}
				})
			})
		})
	}).catch(err => next(err))
}

exports.show_pricing = function(req, res, next) {
	return models.Plan.findAll({where: {billing_period: "monthly"}}).then(plans => {
		res.render("pricing", { plans : plans });
	});
}

exports.show_pricing_yearly = function(req, res, next) {
	return models.Plan.findAll({where: {billing_period: "yearly"}}).then(plans => {
		res.render("pricing", { plans : plans });
	});
}

exports.pick_plan = function(req, res, next) {
	return models.Plan.findOne({where: { id: req.body.planId }}).then(plan => {
		console.log("Plan:", plan)
		if (!plan) {
			next();
		}
		if (req.session) {
			req.session.planId = plan.id
		} else {
			req.session = {};
			req.session.planId = plan.id;
		}
		return res.redirect("/checkout");
	}).catch(err => next(err));
}




