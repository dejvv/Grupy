var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/process-login', function(req, res, next) {
  //tukaj pokliči api in daj v spremenljivko valid rezultat
  console.log(req.body.username);
  let valid = true;
  if(valid) {
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
