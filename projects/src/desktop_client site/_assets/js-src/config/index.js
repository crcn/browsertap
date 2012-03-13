
var host = 'teamdigest.spice.io', protocol = 'https:';


if(/(localhost|\.local|10.0)/.test(String(window.location))) {
	//host     = 'teamdigest.spice.io'; //change in hosts
	//host = "10.0.1.6:8082";
	protocol = 'http:';
}

var rpc = new easyXDM.Rpc({
	remote: protocol + '//' + host + '/xdd.html'
}, {
	remote: {
		request: {}
	}
})

module.exports = {
	transport: {
		jsonp: {
			host: host,
			protocol: protocol,
			rpc: rpc
		}
	}
}