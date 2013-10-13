module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ text(" "), element("ul", {
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