//
//  scene_studioset_menu.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//
$(function() {
    $('#menu').myMenu();

/* Replace html */
    $('.sidebutton').click(function(){
        var loadContents = $(this).attr('id');
        window.parent.$('#contents').attr('src','scene_'+loadContents+'.html');
        window.parent.$('#contents').css('height','100%');
    });

/* Jump to anchor */
    $('.link').click(function(){
		var loadLink = window.parent.$('#contents').attr('src');
		var anchor = $(this).attr('id');
		var url = loadLink +'#' + anchor;

		switch (anchor) {
			case "tone":
			case "levelch":
			case "parteq":
			case "keyboard":
			case "pitch":
			case "offset":
			case "scale":
			case "midi":

			var loadLink = window.parent.$('#contents').attr('src');
			var nextScene = "scene_studioset_part.html";

			window.parent.globals.parameter.db.studioPartContents = anchor;

			if (loadLink !== nextScene) {
				window.parent.$('#contents').attr('src', nextScene);
				window.parent.$('#contents').css('height','100%');
				return;
			}

			switch (anchor) {
			case "tone": window.parent.globals.controller.studioset_part.selectTone(); break;
			case "levelch": window.parent.globals.controller.studioset_part.selectLevelCh(); break;
			case "parteq": window.parent.globals.controller.studioset_part.selectPartEq(); break;
			case "keyboard": window.parent.globals.controller.studioset_part.selectKeyboard(); break;
			case "pitch": window.parent.globals.controller.studioset_part.selectPitch(); break;
			case "offset": window.parent.globals.controller.studioset_part.selectOffset(); break;
			case "scale": window.parent.globals.controller.studioset_part.selectScale(); break;
			case "midi": window.parent.globals.controller.studioset_part.selectMidi(); break;
			}
		}
    });


});