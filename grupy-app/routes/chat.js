var express = require('express');
var router = express.Router();
var controllerChat = require('../controllers/chat');


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('chat', { title: 'Chat' });
// });
// chat "room" for chat with id_chat, messages are now sent to chat with id_chat
router.get('/', async function(req, res, next) {
    let a = await controllerChat.getNChatMessages(1,0);
    console.log("[getNChatMessages]", a);
    res.render('chat', { title: 'Chat' });
  });
router.get('/:id_chat', controllerChat.createChatFor);

module.exports = router;