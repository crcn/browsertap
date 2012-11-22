var sift = require("sift");

module.exports = {
	"def check": {
		"run": function(context, next) {

			var condition = this.get("if"),
			thenRun       = this.get("thenRun"),
			elseRun       = this.get("elseRun");

			if(sift(condition).test(context.get())) {
				if(thenRun) {
					return this.caller.runChild(thenRun, context, next);
				}
			} else {
				if(elseRun) {
					return this.caller.runChild(elseRun, next);
				}
			}

			next();
		}
	}
};