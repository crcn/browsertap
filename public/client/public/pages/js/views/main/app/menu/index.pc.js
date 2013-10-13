module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ element("div", {
        "class": [ "app-menu app-menu-", {
            fn: function() {
                return this.ref("position").value();
            },
            refs: [ "position" ]
        } ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return this.call("nextPosition", []).value();
                },
                refs: [ "nextPosition" ]
            },
            show: {
                fn: function() {
                    return this.ref("position").value() == 1 || this.ref("position").value() == 2;
                },
                refs: [ "position" ]
            }
        } ]
    }, [ text(" "), block({
        fn: function() {
            return this.ref("position").value() == 2 ? "left" : "up";
        },
        refs: [ "position" ]
    }), text(" ") ]), text(" "), block({
        fn: function() {
            return this.ref("label").value();
        },
        refs: [ "label" ]
    }), text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return this.call("nextPosition", []).value();
                },
                refs: [ "nextPosition" ]
            },
            show: {
                fn: function() {
                    return this.ref("position").value() == 0 || this.ref("position").value() == 3;
                },
                refs: [ "position" ]
            }
        } ]
    }, [ text(" "), block({
        fn: function() {
            return this.ref("position").value() == 0 ? "right" : "down";
        },
        refs: [ "position" ]
    }), text(" ") ]), text(" ") ]) ]);
};