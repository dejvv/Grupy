var express = require('express');
var router = express.Router();
let controllerGroup = require('../controllers/group');

// pridobi vse skupine
router.get('/', controllerGroup.getGroups);
// sprocesiraj skupine, ta routa se izvede, ko se v prejšnji pokliče next()
router.get('/', controllerGroup.processGroups);
// dodaj skupino
router.post('/add', controllerGroup.addGroup);



// -- testing --
router.get('/list/', function(req, res, next) {
    console.log(req.mydata);
    let err = req.query.error || "hehe"; // $_GET["id"]
    res.render('findGroups', { title: 'Find group ' + err });
});

module.exports = router;