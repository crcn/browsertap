module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ text("Signup "), element("form", {
        "data-bind": [ {
            onSubmit: {
                fn: function() {
                    return this.call("signup", []).value();
                },
                refs: [ "signup" ]
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
        type: [ "password" ],
        name: [ "password" ],
        placeholder: [ "Password" ],
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
        value: [ "Signup" ]
    }), text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("login");
                },
                refs: []
            }
        } ]
    }, [ text("login") ]), text(" ") ]) ]);
};