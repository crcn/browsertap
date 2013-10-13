module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ element("div", {
        "class": [ "center-outer" ],
        "data-bind": [ {
            show: {
                fn: function() {
                    return this.ref("models.states.settings").value();
                },
                refs: [ "models.states.settings" ]
            }
        } ]
    }, [ text(" "), element("div", {
        "class": [ "settings center-inner" ]
    }, [ text(" "), block({
        html: {
            fn: function() {
                return this.ref("sections.settings").value();
            },
            refs: [ "sections.settings" ]
        }
    }), text(" ") ]), text(" ") ]) ]);
};