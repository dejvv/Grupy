let request = require('request');

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