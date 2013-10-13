module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ element("div", {
        "class": [ "app-menu app-menu-", {
            fn: function() {
                return this.ref("position").value();
            },
            refs: [ "position" ]
        } ]
    }, [ text(" "), element("span", {}, [ block({
        fn: function() {
            return this.ref("label").value();
        },
        refs: [ "label" ]
    }) ]), text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("settings");
                },
                refs: []
            }
        } ]
    }, [ text(" options ") ]), text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return this.call("nextPosition", []).value();
                },
                refs: [ "nextPosition" ]
            }
        } ]
    }, [ text(" next ") ]), text(" ") ]) ]);
};