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
};

