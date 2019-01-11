var express = require('express');
var router = express.Router();

/* Controllers  */
var ctrUser = require("../controllers/user");

router.get('/', ctrUser.renderUserPage);
router.get('/:id', ctrUser.renderUserPage);

module.exports = router;