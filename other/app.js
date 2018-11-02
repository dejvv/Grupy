let url = require('url'); // helper funkcije za parsanje urlja
let fs = require('fs'); // filesystem

function renderHTML(path, response){
	fs.readFile(path, null, function(error, data) {
		if (error) {
			response.writeHead(404); 
			response.writeHead("File not found!");
		} else {
			response.write(data); // zapiši kaj je fs prebral
		}
		response.end(); // konec
	});
}

module.exports = {
	handleRequest: function(request, response) {
		response.writeHead(200, {'Content-Type': 'text/html'});

		// pathname
		let path = url.parse(request.url).pathname;

		switch(path) {
			case '/':
				renderHTML('./index.html', response);
				break;
			case '/login':
				renderHTML('./login.html', response);
				break;
			default:
				response.writeHead(404);
				response.write('Route not defined');
				response.end();
		}
	}
}