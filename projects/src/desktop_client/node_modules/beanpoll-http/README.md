

### Features

- expose your beanpole routes over HTTP
- easy to specify HTTP Middleware


### Plugins

- `http.gateway` exposes your beanpole routes over HTTP.
- `http.server` starts up the http server.
- `http.middleware` middleware for http specific routes



### Usage

Basic Configuration:

```javascript

//sets add a require path to the app

var loader = require('beanie');


loader.params({
	publicDir: __dirname + "/public"
	http: {
		port: 8080
	}
});

loader.
require('beanpoll-http').
load();
```


### Middleware


#### Basic Auth Middleware


```javascript


router.on({
	
	/**
	 */
	
	'pull basic/auth/user/pass -> secret/route': function() {
		return "authorized!";
	},
	
	
	/**
	 */
	
	'pull secret/route': function(request) {

		function login(user, pass, callback) {

			if(user == 'user' && pass == 'pass') return callback(false, { user: 'user' });
			
			callback('wrong user / pass');
		}
		
		request.forward('basic/auth', { login: login }, function(response) {

			request.end('authorized!');
		})
	}
});

```

#### Session Middleware

```javascript

router.on({
	
	/**
	 */
	
	'pull session -> account': function(request) {
		
		//should be "test" on next call
		console.log(request.session.data.username);
		
		request.session.data.username = 'test';
	},
	
})

```





