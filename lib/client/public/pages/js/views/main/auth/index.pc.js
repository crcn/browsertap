module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ text("AUTH "), block({
        html: {
            fn: function() {
                return this.ref("sections.auth").value();
            },
            refs: [ "sections.auth" ]
        }
    }) ]);
};