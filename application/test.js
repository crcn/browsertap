var sift = require("sift");

var sifter = sift({$or: [{ "owner": 1 }, { "owner": null }]});


var res = [{
	owner: null
},
{
	owner: 1
}]

console.log(sifter(res))



setTimeout(function() {
	console.log("G");
}, Math.min(2147483647, 9999999 * 1000 * 60));
