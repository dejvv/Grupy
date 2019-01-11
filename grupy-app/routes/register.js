var express = require('express');
var router = express.Router();

/* Controllers  */
var ctrUser = require("../controllers/user");

router.get('/', ctrUser.renderRegisterPage);
router.post('/process-register', ctrUser.register);

module.exports = router;