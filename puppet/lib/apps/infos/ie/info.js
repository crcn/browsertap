module.exports = {
	"check": {
		"if": { "name": "ie" },
		"thenRun": [
			{
				"set": {
					"cache.directory": "C:/Users/Administrator/AppData/Local/IETester",
					"process.names": ["ie*"],
					"process.cannotRunWith": ["ie"],
					"window.classes": [""],
					"type": "browser",
					"window.openNew": "%s",
					"window.getAppName": function(win) {

						if(!win.process.path.match(/IETester/i)) return null;

						return "ie " + win.process.path.match(/(\w+).exe$/)[1];
					},
					"padding.top": 196,
					"padding.bottom": 23 + 5,
					"padding.left": 9,
					"padding.right": 8
				}
			}
		]
	}
}