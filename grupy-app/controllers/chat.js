let request = require('request');

// doda skupino, ko je dodajanje skupine uspešno, še doda chat za to skupino
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