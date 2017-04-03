const http         = require('http');
const jsdomEnv     = require('jsdom').env;

const request = function(options, params, encoding, cb){
	console.log(`Request send: ${options.protocol}\/\/${options.hostname}:${options.port}${options.path}`);
	let req = http.request(options, res => {
		let body = "";
		res.setEncoding(encoding || 'utf8');
		res.on('data', chunk => body += chunk);
		res.on('end', err => cb(null, body));
	});
	req.on('error', (e) => cb(e, null));
	req.write(params);
	req.end();
};

const construct = function(){
	let args = Array.from(arguments);
	let callback = args.pop();
	let [options, params, encoding] = args;
	request(options, params || "", encoding, function(err, html){
		if(err){
			callback(err, null);
		}else{
			// parse html and inject jQuery
			jsdomEnv(html, (err, window) => {
				if(err) throw err;
				let $ = require('jquery')(window);
				callback(null, window, $);
			});
		}
	});
};

module.exports = {
	construct: construct,
	request: request
};