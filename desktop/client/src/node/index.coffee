

beanie = require 'beanie'
loader = beanie.loader()
soda = require "soda"


loader.
require(__dirname + "/plugins").
params({
	browsers: {
		directory: '~/Desktop/browsers',
		firefox: {
			commands: {
				'crtl+t': 'ctrl+t'
			},
			chromeless: {

			}
		},
		ie: {
			chromeless: {

			}
		},
		chrome: {
			chromeless: {

			}
		}
	}
}).
load()