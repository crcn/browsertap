module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ block({
        html: {
            fn: function() {
                return this.ref("sections.auth").value();
            },
            refs: [ "sections.auth" ]
        }
    }) ]);
};