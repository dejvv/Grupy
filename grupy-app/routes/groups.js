var express = require('express');
var router = express.Router();
let controllerGroup = require('../controllers/group');

// pridobi vse skupine
router.get('/', controllerGroup.getGroups);
// sprocesiraj skupine
router.get('/', controllerGroup.processGroups);

router.get('/list/', function(req, res, next) {
    console.log(req.mydata);
    let err = req.query.error || "hehe"; // $_GET["id"]
    res.render('findGroups', { title: 'Find group ' + err });
});

module.exports = router;