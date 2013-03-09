(function($) {
    $.event.props.push('dataTransfer');
    
    
    var $form = $('#title').closest('form');
    var $mode = $form.find('[name="__mode"]');
    var preview_window = null;
    
    
    if (
        window['LivePreviewTemplate'] &&
        window['LivePreviewTemplate']['check_file_interval_id']
    ) {
        clearInterval(window['LivePreviewTemplate']['check_file_interval_id']);
    }
    
    window['LivePreviewTemplate'] = {
        file: null,
        modified: null,
        check_file_interval_id: null
    };
    
    
    function update_preview_window() {
        var orig_mode = $mode.val();
        $mode.val('preview_template');
        
        $.post($form.attr('action'), $form.serialize())
            .done(function(data) {
                var preview_url = $(data).find('iframe').attr('src');
                if (preview_url) {
                    var url = preview_url;
                }
                else {
                    var url = StaticURI + 'html/blank.html';
                }
                preview_window =
                    window.open(url, 'LivePreviewTemplateWindow', [
                        'width=' + $(window).outerWidth(),
                        'height=' + $(window).outerHeight()
                    ].join(','));
                preview_window.focus();
            
                if (! preview_url && preview_window.document) {
                    preview_window.document.open();
                    preview_window.document.write(data);
                    preview_window.document.close();
                }
            });

        $mode.val(orig_mode);
    }
    $('[name="preview_template"]').on('click', function() {
        update_preview_window();
        return false;
    });
    
    
    window['LivePreviewTemplate']['check_file_interval_id'] = setInterval(function() {
        if (! window['LivePreviewTemplate']['file']) {
            return;
        }
        var f = window['LivePreviewTemplate']['file'];
        var modified = f.lastModifiedDate.getTime();
        if (modified != window['LivePreviewTemplate']['modified']) {
            
            $drop.empty();
            $('<div />').css('font-size', '150%')
                .text(f.name)
                .appendTo($drop);
            if (f.size > 1024*1024) {
                $('<div />')
                    .css({
                        color: 'red'
                    })
                    .text('Too large file: ' + Math.round(f.size / (1024*1024)))
                    .appendTo($drop);
            }
            else {
                $('<div />')
                    .css({
                        color: '#444'
                    })
                    .text(f.lastModifiedDate.toLocaleString())
                    .appendTo($drop);
            }
            
            if (preview_window && preview_window.document) {
                (function() {
                    var $body = $('body', preview_window.document);
                    $('<div />')
                        .css({
                            width: '100%',
                            height: $(preview_window.document).outerHeight() + 'px',
                            position: 'absolute',
                            opacity: '0.9',
                            top: '0px',
                            left: '0px',
                            background: 'white',
                            'z-index': 1000
                        }).prependTo($body);
                })();
            }
            
            var reader = new FileReader();
            reader.onload = function() {
                var text = reader.result;
                window['editor'].setValue(text);
                $('#text').val(text);
                
                update_preview_window();
            };
            reader.readAsText(f);
        }
        window['LivePreviewTemplate']['modified'] = modified;
    }, 500);
    
    
    var droparea_id = 'LivePreviewTemplateDrop';
    $('#' + droparea_id).remove();
    var $drop = $('<div id="' + droparea_id + '" />')
        .text('Please drag and drop a template file here from a desktop.')
        .css({
            border: '1px solid #ccc',
            'border-radius': '5px',
            '-webkit-border-radius': '5px',
            '-moz-border-radius': '5px',
            margin: '0 0 10px 0',
            background: '#eee',
            padding: '15px 0',
            width: '100%',
            'text-align': 'center'
        })
        .on('dragenter', function(ev) {
            $drop.css('background', '#fff');
            return false;
        })
        .on('dragleave', function(ev) {
            $drop.css('background', '#eee');
            return false;
        })
        .on('dragover', function(ev) {
            return false;
        })
        .on('drop', function(ev) {
            $drop.css('background', '#eee');
            var dt = ev.dataTransfer;
            window['LivePreviewTemplate']['file']     = dt.files[0];
            window['LivePreviewTemplate']['modified'] = null;
            return false;
        });
    $('#title-field').after($drop);
})(jQuery);
