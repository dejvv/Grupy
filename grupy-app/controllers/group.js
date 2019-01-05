let request = require('request');
let user = require('./user');

// pridobi vse skupine
module.exports.getGroups= function(req, res, next) {
    let forwardedJson = {};

    request({
        headers: {
            'Content-Type': 'application/json'
        },
        uri: "http://grupyservice.azurewebsites.net/GroupService.svc/",
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

// sprocesiraj skupine
module.exports.processGroups= async function(req, res, next) {
    //return new Promise( (resolve, reject) => {
        let content = req.mydata;
        // pridobi podatke o uporabnikih asinhrono: created_by_user in hosted_by_user

        // content.forEach(async group => {
        //     group.created_by_user = await user.getUserWithId(group.created_by_user_id);
        //     group.hosted_by_user = await user.getUserWithId(group.hosted_by_user_id);
        //     console.log(group.created_by_user.email);
        // });

        // boljše
        await Promise.all(content.map(async (group) => {
            group.created_by_user = await user.getUserWithId(group.created_by_user_id);
            group.hosted_by_user = await user.getUserWithId(group.hosted_by_user_id);
            console.log(group.created_by_user.email);
          })).then(() => {
            res.render('findGroups', { title: 'Find group finished executing ' + (content.length ? "there is something" : "there is nothing"), content: content });
          });
        
    //});
};