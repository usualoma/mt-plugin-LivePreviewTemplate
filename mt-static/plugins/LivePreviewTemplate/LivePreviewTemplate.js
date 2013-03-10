(function($) {
    $.event.props.push('dataTransfer');
    
    
    var $form    = $('#title').closest('form');
    var $mode    = $form.find('[name="__mode"]');
    var $outfile = $('#outfile');
    
    var preview_window = null;
    
    var check_by_content = window.navigator.userAgent.toLowerCase().indexOf('gecko') != -1;
    var last_content = '';
        
    
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
                function window_open() {
                    return window.open(url, 'LivePreviewTemplateWindow', [
                        'width=' + $(window).outerWidth(),
                        'height=' + $(window).outerHeight()
                    ].join(','));
                }
            
                if (preview_window && ! preview_window.closed) {
                    preview_window.location.href = url;
                }
                else {
                    preview_window = window_open();
                }

                if (preview_window && ! preview_window.closed) {
                    preview_window.focus();

                    try {
                        if (! preview_url && preview_window.document) {
                            preview_window.document.open();
                            preview_window.document.write(data);
                            preview_window.document.close();
                        }
                    }
                    catch (e) {
                        alert($(data).find('#generic-error p').html());
                        preview_window.close();
                    }
                }
                else if (! preview_url) {
                    alert($(data).find('#generic-error p').html());
                }
                else {
                    $('<div />')
                        .append($('<a href="#" />')
                                    .css('font-size', '200%')
                                    .click(function() {
                                        preview_window = window_open();
                                        $(this).remove();
                                        return false;
                                    })
                                    .text('A pop-up window was not able to be opened. Please click to open a window.'))
                        .appendTo($drop);
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
        
        if (f.size > 1024*1024) {
            $drop.empty();
            $('<div />')
                .css({
                    color: 'red'
                })
                .text('Too large file: ' + Math.round(f.size / (1024*1024)))
                .appendTo($drop);
            return;
        }
            
        function update(modified, content) {
            var modified_time = modified.getTime();
            if (modified_time == window['LivePreviewTemplate']['modified']) {
                return;
            }
            window['LivePreviewTemplate']['modified'] = modified_time;
            
            $drop.empty();
            $('<div />').css('font-size', '150%')
                .text(f.name)
                .appendTo($drop);
            $('<div />')
                .css({
                    color: '#444'
                })
                .text(modified.toLocaleString())
                .appendTo($drop);

            if ($outfile.val() == '') {
                $outfile.val(f.name);
            }
            
            try {
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
            }
            catch (e) {
                // Ignore
            }
            
            if (content) {
                window['editor'].setValue(content);
                $('#text').val(content);
                
                update_preview_window();
            }
            else {
                var reader = new FileReader();
                reader.onload = function() {
                    var text = reader.result;
                    window['editor'].setValue(text);
                    $('#text').val(text);
                    
                    update_preview_window();
                };
                reader.readAsText(f);
            }
        }
        
        if (check_by_content) {
            (function() {
                var reader = new FileReader();
                reader.onload = function() {
                    if (reader.result != last_content) {
                        last_content = reader.result;
                        update(new Date(), last_content);
                    }
                };
                reader.readAsText(f);
            })();
        }
        else {
            update(f.lastModifiedDate);
        }
    }, check_by_content ? 1000 : 500);
    
    
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
