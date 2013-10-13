module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ element("div", {
        "class": [ "screen-switcher-outer center-outer" ]
    }, [ text(" "), element("div", {
        "class": [ "screen-switcher-inner center-inner" ]
    }, [ text(" "), block({
        html: {
            fn: function() {
                return this.ref("sections.platforms").value();
            },
            refs: [ "sections.platforms" ]
        }
    }), text(" ") ]), text(" ") ]), text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return this.ref("visible").value(!this.ref("visible").value());
                },
                refs: [ "visible" ]
            }
        } ]
    }, [ text("toggle") ]) ]);
};