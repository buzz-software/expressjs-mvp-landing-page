var express = require('express');
var router = express.Router();

let lead = require('../controllers/lead');
let user = require('../controllers/user');
let plan = require('../controllers/plan');
let product = require('../controllers/product');
let checkout = require('../controllers/checkout');
let mc = require('../controllers/mailchimp');
let social = require('../controllers/social');
let landing = require('../controllers/landing');

let {isLoggedIn, hasAuth} = require('../middleware/hasAuth.js')

var passport = require('passport');

router.get('/signup/twitter/return', passport.authenticate('twitter'), (req, res, next) => {
    res.redirect(req.session.returnTo);
});

router.get('/o/oauth/google', passport.authenticate('google'), (req, res, next) => {
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
router.get('/landing', landing.show_landing_settings);
router.post('/landing', landing.update_landing_settings);

/* Leads */
router.get('/leads', hasAuth, lead.show_leads);
router.get('/lead/:lead_id', hasAuth, lead.show_lead);
router.get('/lead/:lead_id/edit', hasAuth, lead.show_edit_lead);
router.post('/lead/:lead_id/edit', hasAuth, lead.edit_lead);
router.post('/lead/:lead_id/delete', hasAuth, lead.delete_lead);
router.post('/lead/:lead_id/delete-json', hasAuth, lead.delete_lead_json)

/* Plans */
router.get('/plan/new', hasAuth, plan.show_create_plan)
router.post('/plan/new', hasAuth, plan.submit_plan);
router.get('/plans', hasAuth, plan.show_plans);
router.get('/plan/:plan_id', hasAuth, plan.show_plan);
router.get('/plan/:plan_id/edit', hasAuth, plan.show_edit_plan);
router.post('/plan/:plan_id/edit', hasAuth, plan.edit_plan);
router.post('/plan/:plan_id/delete', hasAuth, plan.delete_plan);
/*router.post('/plan/:plan_id/delete-json', plan.delete_plan_json)*/

/* Products */
router.get('/d/product/new', hasAuth, product.show_create_product)
router.post('/d/product/new', hasAuth, product.submit_product);
router.get('/d/products', hasAuth, product.show_products);
router.get('/d/product/:product_id', hasAuth, product.show_product);
router.get('/d/product/:product_id/edit', hasAuth, product.show_edit_product);
router.post('/d/product/:product_id/edit', hasAuth, product.edit_product);
router.post('/d/product/:product_id/delete', hasAuth, product.delete_product);
/*router.post('/product/:product_id/delete-json', product.delete_product_json)*/

/* Visitor route for products */
router.get('/products', product.show_user_products);

router.get('/social-settings', hasAuth, social.show_social_settings);
router.post('/social-settings', hasAuth, social.post_social_settings);

/* Mailchimp */
router.get('/mailchimp', hasAuth, mc.show_mailchimp_settings)
router.post('/mailchimp', hasAuth, mc.update_mailchimp_settings);

module.exports = router;