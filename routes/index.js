var express = require('express');
var router = express.Router();

let landing = require('../controllers/landing');

/* GET home page. */
router.get('/', landing.get_landing);
router.post('/', landing.submit_lead);

module.exports = router;