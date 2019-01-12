var express = require('express');
var router = express.Router();
let ctrChat = require('../controllers/chat');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let a = await ctrChat.getNChatMessages(1,4);
  console.log(a);
  res.render('chat', { title: 'Chat' });
});

module.exports = router;