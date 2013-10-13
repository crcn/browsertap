module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ element("li", {
        "class": [ "screen-switcher-option" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return this.call("selectOption", [ this.ref("model").value() ]).value();
                },
                refs: [ "selectOption", "model" ]
            },
            css: {
                fn: function() {
                    return {
                        "screen-switcher-option-selected": this.ref("model.selected").value()
                    };
                },
                refs: [ "model.selected" ]
            }
        } ]
    }, [ text(" "), block({
        fn: function() {
            return this.ref("model.name").value();
        },
        refs: [ "model.name" ]
    }), text(" ") ]), text("  ") ]) ]);
};