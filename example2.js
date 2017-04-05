const querystring = require('querystring'),
			   fs = require('fs'),
			  url = require('url'),
	 	  collect = require('./collect.js'),
		  Options = require('./Options.js');

let hostname = 'www.tooopen.com';
let options = new Options(hostname, '/img/87.aspx');

let count = 0;
function getListPage(){
	collect.construct(options, function(err, window, $){
		if(err) throw err;
		let image = $(".cell img");
		// console.log(image.length);
		$.each(image, function(i, o){
			let imageLink = $(o).attr('src') || $(o).attr('data-src');
			// console.log(imageLink);
			// return ;
			count++;
			setTimeout(function(){
				getImage(imageLink);
			}, 2000 * count);
		});
		// console.log(imageLink)
	});
}
function getImage(imageLink){
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
				fs.appendFileSync(`./logs/log.log`, `${new Date().toLocaleString()} - ${imageLink} - failed to save, reason: ${err.message}\r\n`);
			}
			fs.writeFile(`images/${imageName}`, image, "binary", err => {
				if(err) throw err;
				fs.appendFileSync(`./logs/log.log`, `${new Date().toLocaleString()} - ${imageLink} - saved succcessfully\r\n`);
				console.log(`${imageName} saved`);
			});
		});
	}
}

getListPage();