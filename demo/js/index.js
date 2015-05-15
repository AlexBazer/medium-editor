var ImageExtention;

function copyInto(dest, source, overwrite) {
    "use strict";
    var prop;
    dest = dest || {};
    for (prop in source) {
        if (source.hasOwnProperty(prop) && (overwrite || dest.hasOwnProperty(prop) === false)) {
            dest[prop] = source[prop];
        }
    }
    return dest;
}

function derives(base, derived) {
    "use strict";
    var origPrototype = derived.prototype;
    function Proto() { }
    Proto.prototype = base.prototype;
    derived.prototype = new Proto();
    derived.prototype.constructor = base;
    derived.prototype = copyInto(derived.prototype, origPrototype);
    return derived;
}

/*jslint plusplus: true */
function ImageDerived(options) {
    "use strict";
    this.parent = true;
    this.hasForm = true;
    this.options = copyInto({
        name: 'image',
        action: function(){
            console.log('Image created');
        },
        aria: 'image',
        tagNames: ['img'],
        contentDefault: '<b>I</b>',
        contentFA: '<i class="fa fa-picture-o"></i>'
    }, options || {}, true);
}


ImageExtention = derives(MediumEditor.statics.AnchorExtension, ImageDerived);



var editor = new MediumEditor('.editable', {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'image'],
        buttonLabels: 'fontawesome',
        // staticToolbar: true,
        extensions: {
            'image': new ImageExtention(),
        }
    }),
    cssLink = document.getElementById('medium-editor-theme');

document.getElementById('sel-themes').addEventListener('change', function () {
    cssLink.href = '../dist/css/' + this.value + '.css';
});