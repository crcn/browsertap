
exports.plugin = function(ops, params) {
	
	
	var self = {
		
		init: function() {
			
			DNode.connect(function(remote) {
				
				console.log("CONNECT")
			})
		}
	}
}