//
//  scene_write_menu.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {
    $('#menu').myMenu();

/* サイドメニューからcontentsAreaのhtmlを入れ替える */
    $('.sidebutton').click(function(){
        var loadContents = $(this).attr('id');
        window.parent.$('#contents').attr('src','scene_'+loadContents+'.html');
        window.parent.$('#contents').css('height','100%');
    });
});