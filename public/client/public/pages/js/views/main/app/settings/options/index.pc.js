module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ element("ul", {}, [ text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return this.call("showHideBrowserChrome", []).value();
                },
                refs: [ "showHideBrowserChrome" ]
            }
        } ]
    }, [ text("show/hide browser chrome") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return this.call("toggleQuality", []).value();
                },
                refs: [ "toggleQuality" ]
            }
        } ]
    }, [ text("toggle playback quality") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return this.call("toggleSound", []).value();
                },
                refs: [ "toggleSound" ]
            }
        } ]
    }, [ text("toggle sound") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("browsers");
                },
                refs: []
            }
        } ]
    }, [ text("show browser switcher") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("extension");
                },
                refs: []
            }
        } ]
    }, [ text("tools & extensions") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("payment");
                },
                refs: []
            }
        } ]
    }, [ text("payment options") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("reportBug");
                },
                refs: []
            }
        } ]
    }, [ text("report bug") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("help");
                },
                refs: []
            }
        } ]
    }, [ text("help & documentation") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "mailto:support@browsertap.com" ]
    }, [ text("contact support") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("logout");
                },
                refs: []
            }
        } ]
    }, [ text("Log out") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return this.call("pauseBrowser", []).value();
                },
                refs: [ "pauseBrowser" ]
            }
        } ]
    }, [ text("Pause Browser") ]), text(" ") ]), text(" "), element("li", {
        "class": [ "settings-options-cell" ]
    }, [ text(" "), element("a", {
        href: [ "#" ],
        "data-bind": [ {
            onClick: {
                fn: function() {
                    return modifiers.redirect("tunnel");
                },
                refs: []
            }
        } ]
    }, [ text("setup local tunnel") ]), text(" ") ]), text(" ") ]) ]);
};