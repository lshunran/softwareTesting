var express = require('express');
var router = express.Router();
var charging = require('./src/phoneCharging');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/charging',charging.charging);
router.post('/bill', charging.bill);
router.post('/charge',charging.charge);


router.post('/payway',charging.payway);

module.exports = router;
