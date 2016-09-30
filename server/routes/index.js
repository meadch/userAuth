var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index rendering')
  res.render('index', { title: 'Members' });
});


router.get('/happy', function(req, res, next) {
  console.log('here')
  res.render('index', { title: 'Members' });
});

module.exports = router;
