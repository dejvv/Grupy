var express = require('express');
var router = express.Router();
var controllerChat = require('../controllers/chat');


/* GET home page. */
// router.get('/addmsg', async function(req, res, next) {
//   let a = await controllerChat.addMessageToChat("hello world", 1, 110);
//   console.log("[addmsgtochat]", a);
//   res.send("ok");
// });
// chat "room" for chat with id_chat, messages are now sent to chat with id_chat
router.get('/', async function(req, res, next) {
    let a = await controllerChat.getNChatMessages(1,0);
    //console.log("[getNChatMessages]", a);
    res.render('chat', { title: 'Grupy - Chat' });
  });
router.get('/:id_chat', controllerChat.createChatWithId);

module.exports = router;