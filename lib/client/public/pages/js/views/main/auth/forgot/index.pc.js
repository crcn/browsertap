module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ element("h1", {}, [ text("password reset") ]), text(" "), block({
        "if": {
            fn: function() {
                return this.ref("loading").value();
            },
            refs: [ "loading" ]
        }
    }, function(fragment, block, element, text, parse, modifiers) {
        return fragment([ text(' console.log "resetting" ') ]);
    }), text(" "), element("form", {
        "data-bind": [ {
            onSubmit: {
                fn: function() {
                    return this.call("reset", []).value();
                },
                refs: [ "reset" ]
            }
        } ]
    }, [ text(" "), element("input", {
        type: [ "text" ],
        name: [ "email" ],
        placeholder: [ "Email" ],
        "data-bind": [ {
            model: {
                fn: function() {
                    return this.ref("user").value();
                },
                refs: [ "user" ]
            }
        } ]
    }), text(" "), element("input", {
        type: [ "submit" ],
        value: [ "reset" ]
    }), text(" ") ]), text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("login");
                },
                refs: []
            }
        } ]
    }, [ text("login") ]) ]);
};