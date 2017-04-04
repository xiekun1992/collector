const collect = require('./collect.js'),
	  fs	  = require('fs');


let log = fs.readFileSync('images/log.log', {encoding: 'utf8'});

let logArr = log.split('\r\n');
let regx = /.+?\s-\s(.+?\s-\s.+?),[\s\S]+?/g;
let failedLog = [];

for(let i of logArr){
	let res = regx.exec(i);
	if(res && res.length > 1){
		failedLog.push(res.pop());
	}
}

fs.writeFileSync('failed.log', failedLog.join('\r\n'));