let request = require('request');
let ctrGroup = require("./group");

// ustvari chat
module.exports.addChat = function(req, res, next) {
    return new Promise( (resolve, reject )  => {
        
            let forwardedJson = {
                chat_name: "Group chat",
                project: 1
            };

            request({
                headers: {
                    'Content-Type': 'application/json',
                },
                uri: 'http://grupyservice.azurewebsites.net/ChatService.svc/',
                method: 'POST',
                json: forwardedJson
            }, function (error, answer, content) {
                // console.log("[addChat]", content);
                if (answer.statusCode === 201 || answer.statusCode === 200) 
                    content.ID_USER === 0 ? reject("error") : resolve(content);
                reject("error") 
            });
    }).catch(function(error) {
        console.log(error);
        reject("error");
    });
};

// doda chat k skupini (v bazi v vmesno tabelo med group in chat)
module.exports.addChatToGroup = function(args) {
    console.log("[addChatToGroup] args:", args);
    if (!args)
        return function (){};
    return function(req, res, next) {
            return new Promise((resolve, reject) => {
                let forwardedJson = {
                    ID_CHAT: args.id_chat,
	                ID_GROUP: args.id_group
                };
                request({
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    uri: 'http://grupyservice.azurewebsites.net/AGroupHasChat.svc/',
                    method: 'POST',
                    json: forwardedJson
                }, function (error, answer, content) {
                    // console.log("[addChatToGroup]", content);
                    if (answer.statusCode === 201 || answer.statusCode === 200)
                        content.ID_USER === 0 ? reject("error") : resolve(content);
                    reject("error");
                });
            }).catch(function(error) {
                console.log(error);
                reject("error");
            });
        }
};


// vrne vse chate za določeno skupino http://grupyservice.azurewebsites.net/ChatService.svc/ID_GROUP/{ID_GROUP}
module.exports.getChatsForGroups = function(id_group) {
    console.log("[getChatsForGroups] id_group:", id_group);
    return new Promise((resolve, reject) => {
        let forwardedJson = {};
        request({
            headers: {
                'Content-Type': 'application/json',
            },
            uri: 'http://grupyservice.azurewebsites.net/ChatService.svc/ID_GROUP/' + id_group,
            method: 'GET',
            json: forwardedJson
        }, function (error, answer, content) {
            //console.log("[getChatsForGroups] content:", content);
            if (answer.statusCode === 201 || answer.statusCode === 200)
                content.ID_USER === 0 ? reject("error") : resolve(content);
            reject("error");
        });
    }).catch(function(error) {
        console.log(error);
        reject("error");
    });       
};

module.exports.createChatWithId = async function(req, res, next) {
    _id = req.params.id_chat;
    let previous_messages = await exports.getNChatMessages(_id,0);
    //rabimo še group id
    //let group_info = await group.getGroupById(id_group);  - za sliko
    //let users_for_group = await group.getUsersForGroup(id_group);  - za slike od memberjev
    console.log(previous_messages);
    res.render('group-chat', { title: 'Chat', chat_name: 'Cool chat', chat_id: req.params.id_chat, user_id: req.session.ID_USER, user:req.session.ID_USER, messages: previous_messages, name: req.session.username });
};

module.exports.createChatFor = function(req, res, next) {
    // console.log("[createChatFor] user session", req.session.ID_USER);
    if(!req.session.ID_USER)
        return res.redirect('../login');
    res.render('chat', { title: 'Chat', chat_name: 'Cool chat', chat_id: req.params.id_chat, user_id: req.session.ID_USER, user:req.session.ID_USER, name: req.session.username });
    
};
      
//metoda za dodajanje sporočila v chat, vrne id od sporočila če uspešno, drugače 0
module.exports.addMessageToChat = function(message, chatId, userId) {
    return new Promise ((resolve, reject) => {
        let forwardedJson = {
            project: 1,
            contained_in_id_chat: chatId,
            datetime: null,
            send_by_id_user: userId,
            text: message
        };
        request({
            headers: {
                'Content-Type': 'application/json',
            },
            uri: 'http://grupyservice.azurewebsites.net/MessageService.svc/',
            method: 'POST',
            json: forwardedJson
        }, function (error, answer, content) {
            if (answer.statusCode === 201 || answer.statusCode === 200) {
                resolve(content.ID_MESSAGE);
            }
            else
                reject(-1);
        });
    }).catch(function(error) {
        console.log(error);
        reject(-1);
    });
}

//vrne zadnjih quantity sporočil za chat z id-jem chatId
module.exports.getNChatMessages = function(chatId, quantity) {
    return new Promise ((resolve, reject) => {
        let forwardedJson = {}
        request({
            headers: {
                'Content-Type': 'application/json',
            },
            uri: 'http://grupyservice.azurewebsites.net/MessageService.svc/ID_CHAT/'+chatId,
            method: 'GET',
            json: forwardedJson
        }, function (error, answer, content) {
            if (answer.statusCode === 201 || answer.statusCode === 200) {
                if(quantity == 0) {
                    resolve(content);
                }
                else {
                    let n = Object.keys(content).length;
                    resolve(content.slice(n-1-quantity,n-1));
                }
            }
            else
                reject(null);
        });
    }).catch(function(error) {
        console.log(error);
        reject(null);
    });
}


