var express = require('express');
var router = express.Router();

let landing = require('../controllers/landing');
let user = require('../controllers/user');
let plan = require('../controllers/plan');
let checkout = require('../controllers/checkout');
let mc = require('../controllers/mailchimp');

let {isLoggedIn, hasAuth} = require('../middleware/hasAuth.js')

var passport = require('passport');

router.get('/signup/twitter/return', passport.authenticate('twitter'), (req, res, next) => {
    res.redirect(req.session.returnTo);
});

router.get('/o/oauth/google', passport.authenticate('google'), (req, res, next) => {
	console.log("Google Redirecting....")
    res.redirect(req.session.returnTo);
});

router.get('/o/oauth/facebook', passport.authenticate('facebook'), (req, res, next) => {
    res.redirect(req.session.returnTo);
});

router.get('/signin-basik', landing.signin_basik)
router.get('/checkout', isLoggedIn, checkout.show_checkout);
router.post('/checkout', isLoggedIn, checkout.process_cc);
router.get('/pricing', plan.show_pricing);
router.get('/pricing-yearly', plan.show_pricing_yearly);
router.post('/pick-plan', plan.pick_plan);


router.get('/signup-twitter', passport.authenticate('twitter'));
router.get('/signup-google', passport.authenticate('google', { scope: ['profile', 'email']}));
router.get('/signup-facebook', passport.authenticate('facebook', { scope: ['email']}));

router.get('/login', user.show_login);
router.get('/signup', user.show_signup);
router.post('/login', user.login);
router.post('/signup', user.signup);
router.post('/logout', user.logout);
router.get('/logout', user.logout);

/* GET home page. */
router.get('/', landing.get_landing);
router.post('/', landing.submit_lead);
router.get('/leads', hasAuth, landing.show_leads);
router.get('/lead/:lead_id', hasAuth, landing.show_lead);
router.get('/lead/:lead_id/edit', hasAuth, landing.show_edit_lead);
router.post('/lead/:lead_id/edit', hasAuth, landing.edit_lead);
router.post('/lead/:lead_id/delete', hasAuth, landing.delete_lead);
router.post('/lead/:lead_id/delete-json', hasAuth, landing.delete_lead_json)

/* Plans */
router.get('/plan/new', hasAuth, plan.show_create_plan)
router.post('/plan/new', hasAuth, plan.submit_plan);
router.get('/plans', hasAuth, plan.show_plans);
router.get('/plan/:plan_id', hasAuth, plan.show_plan);
router.get('/plan/:plan_id/edit', hasAuth, plan.show_edit_plan);
router.post('/plan/:plan_id/edit', hasAuth, plan.edit_plan);
router.post('/plan/:plan_id/delete', hasAuth, plan.delete_plan);
/*router.post('/plan/:plan_id/delete-json', plan.delete_plan_json)*/



/* Mailchimp */
router.get('/mailchimp', hasAuth, mc.show_mailchimp_settings)
router.post('/mailchimp', hasAuth, mc.update_mailchimp_settings);

module.exports = router;