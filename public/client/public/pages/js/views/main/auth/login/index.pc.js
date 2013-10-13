module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ text("Login "), element("form", {
        "data-bind": [ {
            onSubmit: {
                fn: function() {
                    return this.call("login", []).value();
                },
                refs: [ "login" ]
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
        value: [ "Login" ]
    }), text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("signup");
                },
                refs: []
            }
        } ]
    }, [ text("signup") ]), text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("forgot");
                },
                refs: []
            }
        } ]
    }, [ text("forgot") ]), text(" ") ]) ]);
};