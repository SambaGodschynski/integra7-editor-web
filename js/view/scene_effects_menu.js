//
//  scene_effects_menu.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {
    $('#menu').myMenu();

    $('.sidebutton').click(function(){
        var loadContents = $(this).attr('id');
        var curTone = window.parent.globals.controller.base_midi.prototype.getCurTone();
        var bank = curTone.bank;
        if ( ( bank === 'GM2#' || bank === 'ExPCM' ) && loadContents === 'effects_part' ) {
            window.parent.$('#contents').attr('src','scene_noneditable.html');
        } else {
            window.parent.$('#contents').attr('src','scene_'+loadContents+'.html#top');
        }
        window.parent.$('#contents').css('height','100%');
    });

    $('.link').click(function(){
        var src = window.parent.$('#contents').attr('src');
        var loadLink = src;
        // if 'src' has anchor
        if ( src.indexOf("#") !== -1 ) {
            loadLink = src.slice(0, src.indexOf('#')); // remove anchor
        }
        var anchor = $(this).attr('id');
        window.parent.globals.parameter.db.effectsAnchor = anchor;

        if ( loadLink !== 'scene_effectsmaster.html') {
            switch ( anchor ) {
                case 'chorus_' :
                case 'reverb' :
                case 'masterEq' :
                case 'compEqOut' :
                    window.parent.$('#contents').attr('src','scene_effects_master.html');
                    window.parent.$('#contents').css('height','100%');
                    break;
                default :
                    var curTone = window.parent.globals.controller.base_midi.prototype.getCurTone();
                    var bank = curTone.bank;
                    if ( bank === 'GM2#' || bank === 'ExPCM' ) {
                        loadLink = 'scene_noneditable.html';
                        anchor = '';
                        var contents = window.parent.globals.parameter.db.curContents;
                        window.parent.globals.parameter.db.contentsAreaScene[contents] = 0;
                    } else {
                        loadLink = 'scene_effects_part.html';
                    }
                    window.parent.$('#contents').attr('src', loadLink+'#'+anchor);
                    break;
            }
        } else if ( loadLink === 'scene_effects_master.html') {
            switch ( anchor ) {
                case 'chorus_' :
                case 'reverb' :
                case 'masterEq' :
                case 'compEqOut' :
                    window.parent.$('#contents').attr('src', loadLink+'#'+anchor);
                    break;
                default :
                    var curTone = window.parent.globals.controller.base_midi.prototype.getCurTone();
                    var bank = curTone.bank;
                    if ( bank === 'GM2#' || bank === 'ExPCM' ) {
                        window.parent.$('#contents').attr('src','scene_noneditable.html');
                    } else {
                        window.parent.$('#contents').attr('src','scene_effects_part.html');
                    }
                    window.parent.$('#contents').css('height','100%');
                    break;
            }
        }
    });
});