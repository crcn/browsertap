var sift = require("sift");

module.exports = function(window) {

	var padding = [
		{
			test: { className: "Chrome_WidgetWin_0", parent: 0 },
			padding: {
				top: 78,
				left: 4,
				right: 4,
				bottom: 4
			}
		},
		{
			test: { className: {$ne:null}},
			padding: {
				top: 24,
				left: 4,
				right: 4,
				bottom: 4
			}
		}
	];

	for(var i = 0, n = padding.length; i < n; i++) {
		var pd = padding[i];
		if(sift(pd.test).test(window)) {
			return pd.padding;
		}
	}
}