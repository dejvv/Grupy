var express = require('express');
var router = express.Router();

/* Controllers  */
var ctrLogin = require("../controllers/user");

router.get('/', ctrLogin.renderLoginPage);
router.post('/process-login', ctrLogin.login);

module.exports = router;
