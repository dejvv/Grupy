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
            res.redirect('/groups/?error=' + answer.statusCode);
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
            console.log("[processGroups] user is signed in:", req.session.ID_USER ? req.session.ID_USER : "nope");
            console.log("query:",req.query.joined);
            res.render('findGroups', { title: 'List of groups', content: content, user: req.session.ID_USER, errors: req.query.joined });
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
// preglej če se uporanbik lahko doda v skupino
module.exports.userJoinsGroup = async function(req, res, next) {
    console.log("[userJoinsGroup] session:", req.session.ID_USER);
    if (!req.session.ID_USER)
        return res.redirect("../../login");
    
    // extract params
    let id_group = req.params.id_group;
    // preveri če skupina sploh obstaja
    // todo ...

    // preveri če je user že v tej skupini
    let groups = await user.getUserGroups(req.session.ID_USER);
    //console.log("[userJoinsGroup] getUserGroups said:", groups);
    let allright = true;
    groups.forEach(group => {
        //console.log("checking:", group.ID_GROUP, "target:", id_group);
        if (group.ID_GROUP == id_group){
            allright = false;
            return;
        }    
            // return res.redirect('/groups?joined=failiure-match');
            //console.log("[userJoinsGroup] groups match! fail");
    });
    
    if (!allright)
        return res.redirect('/groups?joined=match');
    // dodaj userja v skupino
    else
        next();
}

// dodaj uporabnika v skupino
module.exports.userIsAddedToGroup = function(req, res, next) {
    // extract params
    let id_group = req.params.id_group;
    let id_user = req.session.ID_USER;

    console.log("user", id_user, "group", id_group);
    //return res.redirect('/groups?joined=success');

    let forwardedJson = {
        ID_GROUP: id_group,
        ID_USER: id_user
    };

    request({
        headers: {
            'Content-Type': 'application/json',
        },
        uri: 'http://grupyservice.azurewebsites.net/AMember.svc/',
        method: 'POST',
        json: forwardedJson
    }, function (error, answer, content) {
        // console.log("[addGroup]", content);
        if (answer.statusCode === 201 || answer.statusCode === 200) 
            if (content.status === 1)
                return res.redirect('/groups?joined=success');
            else 
                return res.redirect('/groups?joined=failure');
        return res.redirect('/groups?joined=failure');
    });
    
}

// pridobi vse skupine v katere je uporabnik joinan in jih da naslednji routi
module.exports.getUserGroups = function(req, res, next) {
    console.log("[getUserGroups] session:", req.session.ID_USER);
    if (!req.session.ID_USER)
        return res.redirect("../login");

    let id_user = req.session.ID_USER;

    let forwardedJson = {};

    request({
        headers: {
            'Content-Type': 'application/json',
        },
        uri: 'http://grupyservice.azurewebsites.net/GroupService.svc/ID_USER/' + id_user,
        method: 'GET',
        json: forwardedJson
    }, function (error, answer, content) {
        //console.log("[getUserGroups] content:", content);
        if (answer.statusCode === 201 || answer.statusCode === 200) {
            req.mydata = content;
            return next();
        }
        return res.redirect('/list/?error=something-wrong');
    });    
}

// vrne vse skupine v katere je uporabnik joinan
module.exports.listUserGroups = function(req, res, next) {
    let user_groups = req.mydata;
    //console.log("[list user groups]",user_groups);
    res.render('userGroups', { title: 'List of groups you are joined in', groups: user_groups });
}

// vrne vse chata, ki pripadajo skupini
module.exports.listGroupChats = async function(req, res, next) {
    if (!req.session.ID_USER)
        return res.redirect("../../../login");
    let id_group = req.params.id_group;
    //console.log("[listGrupChats] for:", id_group);

    let chats = await chat.getChatsForGroups(id_group);
    console.log(chats);
    
    res.render('groupChats', { title: 'List of chats for the group', chats: chats });
}

module.exports.showGroupProfile = async function (req,res,next) {
    let id_group = req.params.id_group;
    let group_info = await exports.getGroupById(id_group);
    let users_for_group = await exports.getUsersForGroup(id_group);
    console.log(group_info);
    res.render('group-profile', { title: 'Groupy - Group profile ', infos: group_info, users: users_for_group });
};

module.exports.getUsersForGroup = function (id_group) {
    return new Promise((resolve, reject) => {
        let forwardedJson = {};

        request({
            headers: {
                'Content-Type': 'application/json',
            },
            uri: 'http://grupyservice.azurewebsites.net/UserService.svc/ID_GROUP/' + id_group,
            method: 'GET',
            json: forwardedJson
        }, function (error, answer, content) {
            //console.log("[getChatsForGroups] content:", content);
            if (answer.statusCode === 201 || answer.statusCode === 200)
                content === null ? reject("error") : resolve(content);
            reject("error");
        });
    }).catch(function(error) {
        console.log(error);
        reject("error");
    });   
    
};