let request = require('request');
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
    }, function (error, answer, content) {
        if (answer.statusCode === 201 || answer.statusCode === 200) {
            if(content.ID_USER == -1) {
                req.session.error = "Username or password are incorrect.";
                res.redirect("/login");
            } else {
                req.session.ID_USER = content.ID_USER;
                res.redirect("/user-profile");
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
    res.render('login', { title: 'Grupy - Login', error: _error });
};

module.exports.renderRegisterPage = function(req, res) {
    let _error = req.session.error;
    req.session.error = null;
    res.render('register', { title: 'Grupy - Register', error: _error });
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
            console.log(content);
            if(content.status == -1) {
                req.session.error = "Not all data you entered was correct, please try again.";
                res.redirect("/register");
            } else if (content.status == -2){
                req.session.error = "User with this email already exists. Please pick another email.";
                res.redirect("/register");
            } else {
                req.session.ID_USER = content.ID_USER;
                res.redirect("/user-profile");
            }
        } else if (answer.statusCode === 400) {
            res.redirect('/register?error=400');
        } else {
            res.redirect('/register?error='+answer.statusCode);
        }
    });
};

module.exports.renderUserPage = function(req, res) {
    let USER_ID = req.params.id;
    let forwardedJson = {};



    console.log("Current user: "+USER_ID);
    console.log("loggedin user: "+req.session.USER_ID);



    request({
        headers: {
            'Content-Type': 'application/json',
        },
        uri: 'http://grupyservice.azurewebsites.net/UserService.svc/' + USER_ID,
        method: 'GET',
        json: forwardedJson
    }, function (error, answer, content) {
        if (answer.statusCode === 201 || answer.statusCode === 200) {
            console.log("pridobljeno za userja "+content.ID_USER);
            if(content.ID_USER == -1) {
                req.session.error = "User does not exist.";
                res.redirect("/login");
            } else {
                console.log(content);
                res.render('user-profile', { title: 'Grupy - My profile'});
            }
        } else if (answer.statusCode === 400) {
            res.redirect('/user-profile?error=400');
        } else {
            res.redirect('/user-profile?error='+answer.statusCode);
        }
    });
};