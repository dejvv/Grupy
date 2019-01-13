var express = require('express');
var router = express.Router();

/* Controllers  */
var ctrUser = require("../controllers/user");

router.get('/', ctrUser.renderLoginPage);
router.post('/process-login', ctrUser.login);
router.get('/logout',ctrUser.logout);

module.exports = router;
