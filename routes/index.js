var express = require('express');
var router = express.Router();

let landing = require('../controllers/landing');
let user = require('../controllers/user');

let {isLoggedIn, hasAuth} = require('../middleware/hasAuth.js')

router.get('/signup/twitter/return', passport.authenticate('twitter'), (req, res, next) => {
    res.redirect("/");
});

router.get('/o/oauth/google', passport.authenticate('google'), (req, res, next) => {
    res.redirect("/");
});

router.get('/o/oauth/facebook', passport.authenticate('facebook'), (req, res, next) => {
    res.redirect("/");
});


router.get('/o/user-signup/twitter', passport.authenticate('twitter'));
router.get('/o/user-signup/google', passport.authenticate('google', { scope: ['profile', 'email']}));
router.get('/o/user-signup/facebook', passport.authenticate('facebook', { scope: ['email']}));

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
module.exports = router;