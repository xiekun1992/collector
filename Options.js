const Options = function(hostname = '', path = ''){
	this.protocol = 'http:';
	this.hostname = hostname;
	this.port = 80;
	this.path = path;
	this.method = 'GET';
	this.headers = {
		'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'accept-language':'zh-CN,zh;q=0.8',
		'cache-control':'no-cache',
		// 'cookie':'__cfduid=db0c14340ddf86e115e8ba245e6a2b1911491145567',
		'pragma':'no-cache',
		// 'upgrade-insecure-requests':1,
		'user-agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'
	};
};

module.exports = Options;