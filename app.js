const querystring = require('querystring');
const fs = require('fs');
const url = require('url');
const collect = require('./collect.js');


const Options = function(){
	this.protocol = 'http:';
	this.hostname = 'e-hentai.org';
	this.port = 80;
	this.path = '/g/576886/8938d6a3f2/';
	this.method = 'GET';
	this.headers = {
		'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'accept-language':'zh-CN,zh;q=0.8',
		'cache-control':'no-cache',
		'cookie':'__cfduid=db0c14340ddf86e115e8ba245e6a2b1911491145567',
		'pragma':'no-cache',
		'upgrade-insecure-requests':1,
		'user-agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'
	};
};
let options = new Options();


// get every list page, totally 13 pages.
let listOpsPath = options.path;
for(let p = 0; p < 13; p++){
	let obj = {p: p};
	if(p == 0){
		obj.p = null;
	}
	let params = querystring.stringify(obj);
	options.path = `${listOpsPath}?${params}`;

	collect.construct(options, function(err, window, $){
		if(err) throw err;
		let links = $(".gdtm a"), a = links[0];
		$.each(links, (i, a) => {
			// console.log(a)
			let detailLink = $(a).attr('href');
			// console.log(detailLink);
			getDetailPage(detailLink);
		});
	});
}
let count = 0;
function getDetailPage(detailLink){
	let detailOps = new Options();
	detailOps.path = detailLink.split(detailOps.hostname).pop();

	collect.construct(detailOps, function(err, window, $){
		if(err) throw err;
		let imageLink = $("#i3 a img").attr('src');
		// console.log(imageLink)
		count++;
		setTimeout(function(){
			getImage(imageLink);
		}, 2000 * count);
	});
}
function getImage(imageLink){
	// let res = /^(http:|https:|ftp:)\/\/(.+?):(\d+?)(\/.+)$/.exec(imageLink), location;
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
				fs.appendFileSync(`images/log.log`, `${new Date().toLocaleString()} - ${imageLink} - failed to save, reason: ${err.message}\r\n`);
			}
			fs.writeFile(`images/${imageName}`, image, "binary", err => {
				if(err) throw err;
				fs.appendFileSync(`images/log.log`, `${new Date().toLocaleString()} - ${imageLink} - saved succcessfully\r\n`);
				console.log(`${imageName} saved`);
			});
		});
	}
}