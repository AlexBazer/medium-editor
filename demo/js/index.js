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

ImageDerived.prototype = {

        getTemplate: function () {
            // Put file input in here
            var template = [
                '<form enctype="multipart/form-data">',
                '<input type="file" class="medium-editor-toolbar-input">',
                '</form>'
            ];

            template.push(
                '<a href="#" class="medium-editor-toolbar-save">',
                this.base.options.buttonLabels === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
                '</a>'
            );

            template.push('<a href="#" class="medium-editor-toolbar-close">',
                this.base.options.buttonLabels === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
                '</a>');

            // both of these options are slightly moot with the ability to
            // override the various form buildup/serialize functions.

            if (this.base.options.anchorTarget) {
                // fixme: ideally, this options.anchorInputCheckboxLabel would be a formLabel too,
                // figure out how to deprecate? also consider `fa-` icon default implcations.
                template.push(
                    '<input type="checkbox" class="medium-editor-toolbar-anchor-target">',
                    '<label>',
                    this.base.options.anchorInputCheckboxLabel,
                    '</label>'
                );
            }

            if (this.base.options.anchorButton) {
                // fixme: expose this `Button` text as a formLabel property, too
                // and provide similar access to a `fa-` icon default.
                template.push(
                    '<input type="checkbox" class="medium-editor-toolbar-anchor-button">',
                    '<label>Button</label>'
                );
            }
            return template.join('');
        },

        doFormSave: function () {
            var form = this.getInput().parentNode,
                formData = new FormData(form);;

            $.ajax({
                url: 'http://beta.queen-time.ru/upload/',  //Server script to process data
                type: 'POST',
                // xhr: function() {  // Custom XMLHttpRequest
                //     var myXhr = $.ajaxSettings.xhr();
                //     if(myXhr.upload){ // Check if upload property exists
                //         myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
                //     }
                //     return myXhr;
                // },
                //Ajax events
                // beforeSend: beforeSendHandler,
                success: function(data){
                    console.log(data);
                },
                // error: errorHandler,
                // Form data
                data: formData,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });
        },

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