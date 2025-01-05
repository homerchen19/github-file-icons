var http = require('http');
var yaml = require('yamlparser');

http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type' : 'text/plain' });
	
	var fs = require('fs');
	var fileContents = fs.readFileSync('example.yml', 'utf8');
	var data = yaml.eval(fileContents);
	res.end(JSON.stringify(data));
}).listen(8080, "127.0.0.1");

console.log('Server running at http://127.0.0.1:8080');