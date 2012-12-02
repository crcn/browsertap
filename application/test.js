var sift = require("sift");

var sifter = sift({$or: [{ "owner": 1 }, { "owner": null }]});


var res = [{
	owner: null
},
{
	owner: 1
}]

console.log(sifter(res))


