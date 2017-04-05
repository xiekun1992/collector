const collect = require('./collect.js'),
	  Options = require('./Options.js'),
	      url = require('url'),
	       fs = require('fs');


let log = fs.readFileSync('images/log.log', {encoding: 'utf8'});

let logArr = log.split('\r\n');
let failedLog = [];
let counter = 0;

for(let i of logArr){
	let regx = /.+?\s-\s(.+?)\s-\s.+?,[\s\S]+?/g;
	let res = regx.exec(i);
	if(res && res.length > 1){
		// failedLog.push(res.pop());
		counter++;
		setTimeout(function(link){
			resend(link);
		}.bind(null, res.pop()), 2000 * counter);
	}
}
// fs.writeFileSync('failed.log', failedLog.join('\r\n'));

function resend(imageLink){
	if(imageLink){
		let location = url.parse(imageLink);
		let imageOps = new Options();
		imageOps.hostname = location.hostname;
		imageOps.path = location.path;
		imageOps.port = location.port;
		imageOps.protocol = location.protocol;
		let imageName = location.path.split('/').pop();

		// console.log(imageOps)
		collect.request(imageOps, "", "binary", function(err, image){
			if(err){
				fs.appendFileSync(`./logs/failed.log`, `${new Date().toLocaleString()} - ${imageLink} - failed to save, reason: ${err.message}\r\n`);
			}
			fs.writeFile(`images/${imageName}`, image, "binary", err => {
				if(err) throw err;
				fs.appendFileSync(`./logs/failed.log`, `${new Date().toLocaleString()} - ${imageLink} - saved succcessfully\r\n`);
				console.log(`${imageName} saved`);
			});
		});
	}
}