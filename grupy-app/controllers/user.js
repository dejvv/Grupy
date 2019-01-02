let request = require('request');

module.exports.login = function(req, res) {
    let forwardedJson = {};
    let email = 

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
                res.redirect("/user-profile")
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
  
/*var path = '/api/challenges/post';
var passedJson = {
    title: req.body.title,
    user: {
    username: "challenger",
    id: "5c0d0f5e6b60e1d39eabfbf1"
    },
    content: req.body.content,
    testdata: [
    {
        "in": req.body.in1,
        out: req.body.out1,
        expl: req.body.expl1
    },
    {
        "in": req.body.in2,
        out: req.body.out2,
        expl: req.body.expl2
    },
    {
        "in": req.body.in3,
        out: req.body.out3,
        expl: req.body.expl3
    } 
    ],
    tag: req.body.tag,
    comments : []
};
var queryParams = {
    url: apiParams.server + path,
    method: 'POST',
    json: passedJson
};
if (!passedJson.title || !passedJson.testdata) {
    res.redirect('/challenges/post/?error=value');
} else {
    request(
    queryParams,
    function(error, answer, content) {
        if (answer.statusCode === 201) {
        res.redirect('/challenges/');
        } else if (answer.statusCode === 400 && 
        content.name && content.name === "ValidationError") {
            res.redirect('/challenges/post/?error=value');
        } else {
        showError(req, res, answer.statusCode);
        }
    }
    );
}*/