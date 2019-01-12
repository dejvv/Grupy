var express = require('express');
var router = express.Router();
let controllerGroup = require('../controllers/group');

// pridobi vse skupine
router.get('/', controllerGroup.getGroups);
// sprocesiraj skupine, ta routa se izvede, ko se v prejšnji pokliče next()
router.get('/', controllerGroup.processGroups);
// dodaj skupino
router.post('/add', controllerGroup.addGroup);
// uporabnik se joina skupini
router.get('/join/:id_group', controllerGroup.userJoinsGroup);
router.get('/join/:id_group', controllerGroup.userIsAddedToGroup);
// pokaži vse skupine v katere je uporabnik joinan
router.get('/list', controllerGroup.getUserGroups);
router.get('/list', controllerGroup.listUserGroups);

module.exports = router;