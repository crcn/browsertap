var config = require('../lib').file(__dirname +'/yay.json');

config.set('address:zip',55237);

var addressHandler = config.child('address');



console.log(config.get('address:zip'));
console.log(config.get('address'));
console.log(config.get(''));