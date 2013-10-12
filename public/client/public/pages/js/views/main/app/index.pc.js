module.exports = function(fragment, block, element, text, parse, modifiers) {
    return fragment([ text("APP "), block({
        html: {
            fn: function() {
                return this.ref("sections.app").value();
            },
            refs: [ "sections.app" ]
        }
    }) ]);
};