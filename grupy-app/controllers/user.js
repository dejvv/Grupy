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

// vrne v katerih skupinah je uporabnik z idjem
module.exports.getUserGroups= function(id) {
    return new Promise( (resolve, reject )  => {
        let forwardedJson = {};

        request({
            headers: {
                'Content-Type': 'application/json'
            },
            uri: "http://grupyservice.azurewebsites.net/GroupService.svc/ID_USER/" + id,
            json: forwardedJson,
            method: 'GET'
        }, function (error, answer, content) {
            if (answer.statusCode === 201 || answer.statusCode === 200) 
                content.ID_USER === 0 ? reject("error") : resolve(content);
            reject("error")
        });
    }).catch(function(error) {
        console.log("[getUserGroups]", error);
        reject("error");
    });
};


      
var md5 = require('md5');

module.exports.login = function(req, res) {
    let forwardedJson = {};

    request({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.username+':'+md5(req.body.password)
        },
        uri: 'http://grupyservice.azurewebsites.net/UserService.svc/login/',
        json: forwardedJson,
        method: 'GET'
    }, async function (error, answer, content) {
        if (answer.statusCode === 201 || answer.statusCode === 200) {
            if(content.ID_USER == -1) {
                req.session.error = "Username or password are incorrect.";
                res.redirect("/login");
            } else {
                req.session.ID_USER = content.ID_USER;
                let userinfo = await exports.getUserWithId(content.ID_USER);
                req.session.username = userinfo.name;
                res.redirect("/groups");
            }
        } else if (answer.statusCode === 400) {
            res.redirect('/login?error=400');
        } else {
            res.redirect('/login?error=unknown');
        }
    });
};

module.exports.renderLoginPage = function(req, res) {
    let _error = req.session.error;
    req.session.error = null;
    res.render('login', { title: 'Grupy - Login', error: _error, user_id: req.session.ID_USER, user:req.session.ID_USER, name: req.session.username });
};

module.exports.renderRegisterPage = function(req, res) {
    let _error = req.session.error;
    req.session.error = null;
    res.render('register', { title: 'Grupy - Register', error: _error, user_id: req.session.ID_USER, user:req.session.ID_USER, name: req.session.username });
};

module.exports.register = function(req, res) {
    var newDate = new Date();

    if(!req.body.username || !req.body.name || !req.body.password || !req.body.phone || !req.body.sex || !req.body.surname) {
        req.session.error = "Please enter all the needed information.";
        return res.redirect("/register");
    }

    let forwardedJson = {
        email: req.body.username,
        email_verified: 0,
        introduction: "This is how I would describe myself...",
        name: req.body.name,
        password: md5(req.body.password),
        phone: req.body.phone,
        phone_verified: 0,
        profile_pic: "profile.png",
        register_date: null,
        sex: req.body.sex,
        surname: req.body.surname,
        project: 1
    };

    request({
        headers: {
            'Content-Type': 'application/json',
        },
        uri: 'http://grupyservice.azurewebsites.net/UserService.svc/',
        method: 'POST',
        json: forwardedJson
    }, function (error, answer, content) {
        if (answer.statusCode === 201 || answer.statusCode === 200) {
            if(content.status == -1) {
                req.session.error = "Not all data you entered was correct, please try again.";
                res.redirect("/register");
            } else if (content.status == -2){
                req.session.error = "User with this username already exists. Please pick another one.";
                res.redirect("/register");
            } else {
                req.session.ID_USER = content.status;
                res.redirect("/user-profile/"+content.status);
            }
        } else if (answer.statusCode === 400) {
            res.redirect('/register?error=400');
        } else {
            res.redirect('/register?error='+answer.statusCode);
        }
    });
};

module.exports.renderUserPage = function(req, res) {
    let _user = req.params.id;
    let forwardedJson = {};
    let _error = req.session.error;

    request({
        headers: {
            'Content-Type': 'application/json',
        },
        uri: 'http://grupyservice.azurewebsites.net/UserService.svc/' + _user,
        method: 'GET',
        json: forwardedJson
    }, function (error, answer, content) {
        if (answer.statusCode === 201 || answer.statusCode === 200) {
            if(content.ID_USER == 0) {
                res.redirect("/user-profile/"+req.session.ID_USER);
            } else {
                if(_user == req.session.ID_USER) {
                    res.render('user-profile', { 
                        title: 'Grupy - My profile', 
                        name: content.name, 
                        surname: content.surname,
                        introduction: content.introduction,
                        sex: content.sex,
                        me: 1,
                        error: _error, 
                        user_id: req.session.ID_USER, 
                        user:req.session.ID_USER, 
                        name: req.session.username
                    });
                } else {
                    res.render('user-profile', { 
                        title: 'Grupy - User profile', 
                        name: content.name, 
                        surname: content.surname,
                        introduction: content.introduction,
                        sex: content.sex,
                        me: 0, 
                        user_id: req.session.ID_USER, 
                        user:req.session.ID_USER, 
                        name: req.session.username
                    });
                }
            }
        } else if (answer.statusCode === 400) {
            res.redirect('/user-profile?error=400');
        } else {
            res.redirect('/user-profile?error='+answer.statusCode);
        }
    });
};

module.exports.updateInfo = function(req, res) {
    let _desc = req.body.description;
    let forwardedJson = {}

    request({
        headers: {
            'Content-Type': 'application/json',
        },
        uri: 'http://grupyservice.azurewebsites.net/UserService.svc/' + req.session.ID_USER,
        method: 'GET',
        json: forwardedJson
    }, function (error, answer, content) {
        if (answer.statusCode === 201 || answer.statusCode === 200) {
            let forwardedJson = {
                ID_USER: req.session.ID_USER,
                email: content.email,
                email_verified: 0,
                introduction: _desc,
                name: content.name,
                password: content.password,
                phone: content.phone,
                phone_verified: 0,
                profile_pic: "profile.png",
                register_date: null,
                sex: content.sex,
                surname: content.surname,
            };

            request({
                headers: {
                    'Content-Type': 'application/json',
                },
                uri: 'http://grupyservice.azurewebsites.net/UserService.svc/',
                method: 'PUT',
                json: forwardedJson
            }, function (error, answer, content) {
                if (answer.statusCode === 201 || answer.statusCode === 200) {
                    if(content.status == 1) {
                        res.redirect("/user-profile/");
                    } else {
                        req.session.error = "Something went wrong. Please try again."
                        res.redirect("/user-profile/");
                    }
                } else if (answer.statusCode === 400) {
                    res.redirect('/user-profile?error=400');
                } else {
                    res.redirect('/user-profile?error='+answer.statusCode);
                }
            });

        } else if (answer.statusCode === 400) {
            res.redirect('/user-profile?error=400');
        } else {
            res.redirect('/user-profile?error='+answer.statusCode);
        }
    });
};

module.exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/groups');
};