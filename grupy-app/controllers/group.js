let request = require('request');
let user = require('./user');
let chat = require('./chat');

// pridobi vse skupine
module.exports.getGroups= function(req, res, next) {
    let forwardedJson = {};

    request({
        headers: {
            'Content-Type': 'application/json'
        },
        uri: "http://grupyservice.azurewebsites.net/GroupService.svc/project/1",
        json: forwardedJson,
        method: 'GET'
    }, function (error, answer, content) {
        if (answer.statusCode === 201 || answer.statusCode === 200) {
            // shrani dobljene podatke
            req.mydata = content; 
            // izvedi naslednjo metodo
            return next();
        } else {
            res.redirect('/groups/list/?error=' + answer.statusCode);
        }
    });
};

// vrne podatke o skupini z določenim idjem
module.exports.getGroupById= function(id) {
    return new Promise( (resolve, reject )  => {
        let forwardedJson = {};

        request({
            headers: {
                'Content-Type': 'application/json'
            },
            uri: "http://grupyservice.azurewebsites.net/GroupService.svc/" + id,
            json: forwardedJson,
            method: 'GET'
        }, function (error, answer, content) {
            if (answer.statusCode === 201 || answer.statusCode === 200) 
                content.ID_GROUP === 0 ? reject("error") : resolve(content);
            reject("error")
        });
    });
}


// sprocesiraj podatke(array skupin) iz requesta
module.exports.processGroups= async function(req, res, next) {
    let content = req.mydata;
    // pridobi podatke o uporabnikih asinhrono: created_by_user in hosted_by_user
    await Promise.all(content.map(async (group) => {
        group.created_by_user = await user.getUserWithId(group.created_by_user_id);
        group.hosted_by_user = await user.getUserWithId(group.hosted_by_user_id);
        console.log(group.ID_GROUP, group.name);
        })).then(() => {
        res.render('findGroups', { title: 'List of groups', content: content });
        });
    
};

// doda skupino, ko je dodajanje skupine uspešno, še doda chat za to skupino
module.exports.addGroup = async function(req, res, next) {
    // return new Promise( (resolve, reject )  => {
        
            let forwardedJson = {
                created_by_user_id: req.body.created_by_user_id,
                description: req.body.group_description,
                group_photo: req.body.group_photo,
                hosted_by_user_id: req.body.hosted_by_user_id,
                name: req.body.group_name,
                number_of_people: req.body.group_num_of_people,
                photos: "photos",
                place_to_stay: req.body.group_place_to_stay,
                place_to_visit: req.body.group_place_to_visit,
                project: 1
            };

            request({
                headers: {
                    'Content-Type': 'application/json',
                },
                uri: 'http://grupyservice.azurewebsites.net/GroupService.svc/',
                method: 'POST',
                json: forwardedJson
            }, async function (error, answer, content) {
                // console.log("[addGroup]", content);
                if (answer.statusCode === 201 || answer.statusCode === 200) 
                    if (content.ID_GROUP > 0){
                        let id_chat = await chat.addChat();
                        let group_add_chat = await chat.addChatToGroup({id_chat: id_chat.ID_CHAT, id_group:content.ID_GROUP})();
                        
                        // console.log("[addGroup] id of chat for you:", id_chat);
                        // console.log("[addGroup] groupAddChat response", group_add_chat);
                        return res.send({content: content})
                    }
                    else 
                     return res.send({content: "error"}) ;
                return res.send({content: "error"});
            });
    // }).catch(function(error) {
    //     console.log(error);
    //     res.send(reject("error"));
    // });
    
};