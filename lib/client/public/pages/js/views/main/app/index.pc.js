module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ block({
        html: {
            fn: function() {
                return this.ref("sections.app").value();
            },
            refs: [ "sections.app" ]
        }
    }), text(" "), block({
        html: {
            fn: function() {
                return this.ref("sections.settings").value();
            },
            refs: [ "sections.settings" ]
        }
    }) ]);
};