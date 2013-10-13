module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ element("div", {
        "class": [ "center-outer" ],
        "data-bind": [ {
            show: {
                fn: function() {
                    return this.ref("loading").value();
                },
                refs: [ "loading" ]
            }
        } ]
    }, [ text(" "), element("div", {
        "class": [ "center-inner app-loader" ]
    }, [ text(" "), element("img", {}), text(" ") ]), text(" ") ]) ]);
};