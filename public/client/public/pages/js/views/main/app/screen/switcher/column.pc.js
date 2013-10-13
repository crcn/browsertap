module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ text(" "), block({
        "if": {
            fn: function() {
                return this.ref("openBrowserRequest").value();
            },
            refs: [ "openBrowserRequest" ]
        }
    }, function(fragment, block, element, text, parse, modifiers) {
        return fragment([ text(" opening platform ") ]);
    }), text(" "), element("ul", {
        "class": [ "screen-switcher-column" ]
    }, [ text(" "), block({
        html: {
            fn: function() {
                return this.ref("sections.options").value();
            },
            refs: [ "sections.options" ]
        }
    }), text(" ") ]), text(" "), block({
        html: {
            fn: function() {
                return this.ref("sections.child").value();
            },
            refs: [ "sections.child" ]
        }
    }) ]);
};