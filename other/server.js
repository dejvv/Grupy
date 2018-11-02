let http = require('http'); // http funkcije
let app = require('./app'); // importaj app.js

// poženi server, ki posluša na portu 8000, uporablja pa
// handleRequest funkcijo iz app modula(./app.js)
http.createServer(app.handleRequest).listen(8000);