//
//  scene_tone_sns_menu.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {
    $('#menu').myMenu();

/* Replace html */
    $('.link').click(function(){
		var loadLink = window.parent.$('#contents').attr('src');
		var anchor = $(this).attr('id');
		var url = loadLink +'#' + anchor;
		window.open(url, 'contents');
    });
});