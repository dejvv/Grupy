var express = require('express');
var router = express.Router();

/* Controllers  */
var ctrUser = require("../controllers/user");

router.get('/', function(req, res, next) {
    if(req.session.ID_USER)
        res.redirect("/user-profile/"+req.session.ID_USER);
    else
        res.redirect("/login");
});
router.get('/:id', ctrUser.renderUserPage);
router.post('/update', ctrUser.updateInfo);

module.exports = router;