var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css',
	'.7z' : 'application/x-7z-compressed',
	'.pdf' : 'application/x-pdf'
}

http.createServer(function ( request, response ) {

	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    var today = dd+'/'+mm+'/'+yyyy+'['+h+':'+m+':'+s+']';

	var f = decodeURI(request.url);
	f = f === '/' ? 'index.html' : '.' + f;

	var lookup = path.basename(f) || 'index.html';

	var cIP = request.connection.remoteAddress;

	cIP === '84.232.62.167' ? console.log("\033[1;36m/*** " + cIP + " ***/\033[0m Requests for " + f + " received.") : console.log("\033[1;33m/*** " + cIP + " ***/\033[0m Requests for " + f + " received.");

	fs.exists(f, function ( exists ) {
		if (exists)
		{
			if (path.extname(lookup) === '.7z')
			{
				var stream = fs.createReadStream(f, {bufferSize: 64 * 1024});
				stream.pipe(response);
				console.log("\033[1;37m[" + today + "]\033[1;32mFile: " + f + " correctly send.\033[0m");
				return;
			}

			if (path.extname(lookup) === '.pdf')
			{
				var stream = fs.createReadStream(f);
				stream.pipe(response);
				console.log("\033[1;37m[" + today + "]\033[1;32mFile: " + f + " correctly send.\033[0m");
				return;
			}

			fs.readFile(f, function ( err, data ) {
				if (err)
				{
					response.writeHead(500);
					response.end('Server Error!');
					console.log("(500) Server Error");
					return;
				}

				var headers = {'Content-Type' : mimeTypes[path.extname(lookup)]};

				response.writeHead(200, headers);
				response.end(data);
				console.log("\033[1;37m[" + today + "]\033[1;32mFile: " + f + " correctly send.\033[0m");
			});
			return;
		}
		response.writeHead(404);
		response.end("HTTP: 404 File Not Found.");
		console.log("\033[1;37m[" + today + "]\033[1;31mFile: " + f + " Not Found.\033[0m");
	});
}).listen(1337);

console.log("Server started at \"http://127.0.0.1:1337\"");