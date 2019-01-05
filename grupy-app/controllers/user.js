let request = require('request');

// vrne podatke o uporabniku z določenim idjem ali error, če je kaj narobe
module.exports.getUserWithId= function(id) {
    return new Promise( (resolve, reject )  => {
        let forwardedJson = {};

        request({
            headers: {
                'Content-Type': 'application/json'
            },
            uri: "http://grupyservice.azurewebsites.net/UserService.svc/" + id,
            json: forwardedJson,
            method: 'GET'
        }, function (error, answer, content) {
            if (answer.statusCode === 201 || answer.statusCode === 200) 
                content.ID_USER === 0 ? reject("error") : resolve(content);
            reject("error")
        });
    });
};