var mkdirp = require('mkdirp'),
step       = require('stepc'),
fs         = require('fs');

var defaults = {
	"email":"email",
	"author":"author"
};


step(
	function() {
		mkdirp(process.env.HOME + '/.mesh', 0777, this);
	},
	function() {
		fs.writeFileSync(process.env.HOME + '/.mesh/config.json', JSON.stringify(defaults, null, 2));
		this();
	}
);

