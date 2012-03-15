var connect = require('connect'),
app = connect.createServer();

console.log(process.cwd());

app.use(connect.static(process.cwd()))

app.use(function(req, res, next) {
	req.url = '/app.html';
	next();
});

app.use(connect.static(process.cwd()))

console.log('listening on port 8081');

app.listen(8081);
