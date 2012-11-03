var qs = require("querystring"),
query = {
	url: String(window.location)	
};

window.location = ["http://localhost:8082", qs.stringify(query)].join("?");