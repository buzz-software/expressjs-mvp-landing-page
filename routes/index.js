var express = require('express');
var router = express.Router();

let landing = require('../controllers/landing');
let user = require('../controllers/user');
let plan = require('../controllers/plan');
let dboard = require('../controllers/dashboard')

let {isLoggedIn, hasAuth} = require('../middleware/hasAuth.js')

var passport = require('passport');

router.get('/signup/twitter/return', passport.authenticate('twitter'), (req, res, next) => {
    res.redirect("/");
});

router.get('/o/oauth/google', passport.authenticate('google'), (req, res, next) => {
    res.redirect("/");
});

router.get('/o/oauth/facebook', passport.authenticate('facebook'), (req, res, next) => {
    res.redirect("/");
});

router.get('/pricing', plan.show_pricing);
router.get('/signup-twitter', passport.authenticate('twitter'));
router.get('/signup-google', passport.authenticate('google', { scope: ['profile', 'email']}));
router.get('/signup-facebook', passport.authenticate('facebook', { scope: ['email']}));

router.get('/login', user.show_login);
router.get('/signup', user.show_signup);
router.post('/login', user.login);
router.post('/signup', user.signup);
router.post('/logout', user.logout);
router.get('/logout', user.logout);

/* Dashboard */
router.get('/dashboard', dboard.get_dashboard)

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
router.get('/plan/new', plan.show_create_plan)
router.post('/plan/new', plan.submit_plan);
router.get('/plans', plan.show_plans);
router.get('/plan/:plan_id', plan.show_plan);
router.get('/plan/:plan_id/edit', plan.show_edit_plan);
router.post('/plan/:plan_id/edit', plan.edit_plan);
router.post('/plan/:plan_id/delete', plan.delete_plan);
/*router.post('/plan/:plan_id/delete-json', plan.delete_plan_json)*/
module.exports = router;