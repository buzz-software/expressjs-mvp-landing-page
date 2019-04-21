
var env  = process.env.NODE_ENV || 'development';
//let configs = { development, production, beta } = require('./config/cloud_config');
//const {twitter, google, facebook} = configs[env];
const models = require('../models')

exports.show_create_plan = function(req, res, next) {
	res.render('plan/create_plan', {  });
}

exports.submit_plan = function(req, res, next) {

	console.log("Plan: ", req.body)
	let price_per_period = (req.body.plan_price_per_period == "") ? 0 : Number(req.body.plan_price_per_period)
	let discount_pct = (req.body.plan_discount_pct == "") ? 0 : Number(req.body.plan_discount_pct)
	let rank = (req.body.plan_rank == "") ? 0 : Number(req.body.plan_rank)
	let billing_period = (req.body.plan_billing_period) ? req.body.plan_billing_period.toLowerCase() : null

	return models.Plan.create({
		name: req.body.plan_name,
		price_per_period: price_per_period,
		billing_period: billing_period,
		discount_pct: discount_pct,
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
		rank: rank
	}).then(plan => {
		res.redirect('/plans');
	})
}

exports.show_plans = function(req, res, next) {
	return models.Plan.findAll().then(plans => {
 		res.render('plan/plans', { title: 'Express', plans : plans });		
	})
}

exports.show_plan = function(req, res, next) {
	return models.Plan.findOne({
		where : {
			id : req.params.plan_id
		}
	}).then(plan => {
		res.render('plan/plan', { plan : plan });
	});
}


exports.show_edit_plan = function(req, res, next) {
	return models.Plan.findOne({
		where : {
			id : req.params.plan_id
		}
	}).then(plan => {
		res.render('plan/edit_plan', { plan : plan });
	});
}

exports.edit_plan = function(req, res, next) {
	let price_per_period = (req.body.plan_price_per_period == "") ? 0 : Number(req.body.plan_price_per_period)
	let discount_pct = (req.body.plan_discount_pct == "") ? 0 : Number(req.body.plan_discount_pct)
	let rank = (req.body.plan_rank == "") ? 0 : Number(req.body.plan_rank)
	let billing_period = (req.body.plan_billing_period) ? req.body.plan_billing_period.toLowerCase() : null
	return models.Plan.update({
		name: req.body.plan_name,
		price_per_period: price_per_period,
		billing_period: billing_period,
		discount_pct: discount_pct,
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
		rank: rank,
	}, { 
		where: {
			id: req.params.plan_id
		}
	}).then(result => {
		res.redirect('/plan/' + req.params.plan_id);
	})
}
exports.delete_plan = function(req, res, next) {
	return models.Plan.destroy({
		where: {
			id: req.params.plan_id
		}
	}).then(result => {
		res.redirect('/plans');
	})
}

exports.show_pricing = function(req, res, next) {
	return models.Plan.findAll().then(plans => {
		res.render("pricing", { plans : plans });
	});
}

