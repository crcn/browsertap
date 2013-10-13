module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ element("div", {
        "class": [ "screen-switcher-app" ]
    }, [ text(" "), block({
        fn: function() {
            return this.ref("model.name").value();
        },
        refs: [ "model.name" ]
    }), text(" ") ]) ]);
};