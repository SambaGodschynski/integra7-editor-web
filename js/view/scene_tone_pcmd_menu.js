//
//  scene_tone_pcmd_menu.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {
    $('#menu').myMenu();

    var partialList = [
        {text:' ( A 0 )'},
        {text:' ( Bb0 )'},
        {text:' ( B 0 )'},
        {text:' ( C 1 )'},
        {text:' ( C#1 )'},
        {text:' ( D 1 )'},
        {text:' ( Eb1 )'},
        {text:' ( E 1 )'},
        {text:' ( F 1 )'},
        {text:' ( F#1 )'},
        {text:' ( G 1 )'},
        {text:' ( G#1 )'},
        {text:' ( A 1 )'},
        {text:' ( Bb1 )'},
        {text:' ( B 1 )'},
        {text:' ( C 2 )'},
        {text:' ( C#2 )'},
        {text:' ( D 2 )'},
        {text:' ( Eb2 )'},
        {text:' ( E 2 )'},
        {text:' ( F 2 )'},
        {text:' ( F#2 )'},
        {text:' ( G 2 )'},
        {text:' ( G#2 )'},
        {text:' ( A 2 )'},
        {text:' ( Bb2 )'},
        {text:' ( B 2 )'},
        {text:' ( C 3 )'},
        {text:' ( C#3 )'},
        {text:' ( D 3 )'},
        {text:' ( Eb3 )'},
        {text:' ( E 3 )'},
        {text:' ( F 3 )'},
        {text:' ( F#3 )'},
        {text:' ( G 3 )'},
        {text:' ( G#3 )'},
        {text:' ( A 3 )'},
        {text:' ( Bb3 )'},
        {text:' ( B 3 )'},
        {text:' ( C 4 )'},
        {text:' ( C#4 )'},
        {text:' ( D 4 )'},
        {text:' ( Eb4 )'},
        {text:' ( E 4 )'},
        {text:' ( F 4 )'},
        {text:' ( F#4 )'},
        {text:' ( G 4 )'},
        {text:' ( G#4 )'},
        {text:' ( A 4 )'},
        {text:' ( Bb4 )'},
        {text:' ( B 4 )'},
        {text:' ( C 5 )'},
        {text:' ( C#5 )'},
        {text:' ( D 5 )'},
        {text:' ( Eb5 )'},
        {text:' ( E 5 )'},
        {text:' ( F 5 )'},
        {text:' ( F#5 )'},
        {text:' ( G 5 )'},
        {text:' ( G#5 )'},
        {text:' ( A 5 )'},
        {text:' ( Bb5 )'},
        {text:' ( B 5 )'},
        {text:' ( C 6 )'},
        {text:' ( C#6 )'},
        {text:' ( D 6 )'},
        {text:' ( Eb6 )'},
        {text:' ( E 6 )'},
        {text:' ( F 6 )'},
        {text:' ( F#6 )'},
        {text:' ( G 6 )'},
        {text:' ( G#6 )'},
        {text:' ( A 6 )'},
        {text:' ( Bb6 )'},
        {text:' ( B 6 )'},
        {text:' ( C 7 )'},
        {text:' ( C#7 )'},
        {text:' ( D 7 )'},
        {text:' ( Eb7 )'},
        {text:' ( E 7 )'},
        {text:' ( F 7 )'},
        {text:' ( F#7 )'},
        {text:' ( G 7 )'},
        {text:' ( G#7 )'},
        {text:' ( A 7 )'},
        {text:' ( Bb7 )'},
        {text:' ( B 7 )'},
        {text:' ( C 8 )'},
    ];

    var curPartial = window.parent.globals.parameter.db.pcmdCurPartial;

    $('select#currentPartial').empty();
    $.each(partialList, function(i){
        $('select#currentPartial').append($('<option>', { value : i+21, text : (i+21) + this.text}));
    });
    $('select#currentPartial').val(curPartial);

    $('select#currentPartial').change(function(){
        curPartial = $('option:selected', this).val();
        window.parent.globals.parameter.db.pcmdCurPartial = parseInt(curPartial, 10);
        window.parent.globals.controller.tone_pcmd.curPartialChanged();
    });

    $('.link').click(function(){
        var loadLink = window.parent.$('#contents').attr('src');
        var anchor = $(this).attr('id');
        var url = loadLink +'#' + anchor;
        window.open(url, 'contents');
    });
});