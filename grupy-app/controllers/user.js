let request = require('request');

module.exports.login = function(req, res) {
    let forwardedJson = {};

    request({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.body.username+':'+req.body.password
        },
        uri: 'http://grupyservice.azurewebsites.net/UserService.svc/login/',
        json: forwardedJson,
        method: 'GET'
    }, function (error, answer, content) {
        if (answer.statusCode === 201 || answer.statusCode === 200) {
            console.log(content.ID_USER);
            if(content.ID_USER == -1) {
                res.redirect("/login");
            } else {
                res.redirect("/user-profile");
                req.session.ID_USER = content.ID_USER;
            }
        } else if (answer.statusCode === 400) {
            res.redirect('/login?error=400');
        } else {
            res.redirect('/login?error=unknown');
        }
    });
};

module.exports.renderLoginPage = function(req, res) {
    res.render('login', { title: 'Login' });
};

module.exports.renderRegisterPage = function(req, res) {
    res.render('register', { title: 'Register' });
};

module.exports.register = function(req, res) {
    var newDate = new Date();

    let forwardedJson = {
        email: req.body.username,
        email_verified: 0,
        introduction: "This is how I would describe myself...",
        name: req.body.name,
        password: req.body.password,
        phone: req.body.phone,
        phone_verified: 0,
        profile_pic: "profile.png",
        register_date: null,
        sex: req.body.sex,
        surname: req.body.surname
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
            console.log(content.ID_USER);
            if(content.ID_USER == -1) {
                res.redirect("/register");
            } else {
                res.redirect("/user-profile")
                req.session.ID_USER = content.ID_USER;
            }
        } else if (answer.statusCode === 400) {
            res.redirect('/register?error=400');
        } else {
            res.redirect('/register?error='+answer.statusCode);
            console.log(content);
        }
    });
};