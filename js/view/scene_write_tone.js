//
//  scene_write_tone.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//


$(function() {

	var contents = window.parent.globals.parameter.db.curContents;
	window.parent.globals.parameter.db.contentsAreaScene[contents] = 1;


    var sceneWriteTone;

    var curCtrl = window.parent.globals.controller.indextop;
    var prm = window.parent.globals.parameter;
    var type = curCtrl.getCurToneType();
    var toneVar;

    switch (type) {
        case 'SN-A':
            toneVar = 256;
            break;
        case 'SN-S':
            toneVar = 512;
            break;
        case 'SN-D':
            toneVar = 64;
            break;
        case 'PCM-S':
            toneVar = 256;
            break;
        case 'PCM-D':
            toneVar = 32;
            break;
        default:
            break;
    }

    var category = window.parent.globals.parameter.presetCategory.categoryName2;

    sceneWriteTone = function(names) {
        $('#writeToneTable').removeClass().addClass(type);
        $('#writeTone tr').remove();
        var doc = '';
        for (var i = 0; i < toneVar; i++) {
            var cate = names[i][window.parent.TONE_DATA_ARRAY_CATEGORY];
            cate = window.parent.globals.parameter.ToCategory36(cate);
            doc +=  (
                '<tr>'+
                '<td>'+(i+1)+'</td>'+
                '<td>'+type+'</td>'+
                '<td>USER</td>'+
                '<td>'+category[cate][0]+'</td>'+
                '<td id="no_'+(i+1)+'">'+names[i][window.parent.TONE_DATA_ARRAY_NAME]+'</td>'+
                '<td><input type="radio" name="execute" id="execute'+(i+1)+'" /><label for="execute'+(i+1)+'">WRITE</label></td>'+
                '</tr>'
            );
        }
        $('#writeTone').append(doc);
    };

	sceneWriteTone(prm.getNameObject(type));

/* write execute */
    $('input[id*="execute"]').button().click(function(){
        var curTone = window.parent.globals.controller.base_midi.prototype.getCurTone();
        var bank = curTone.bank;
        if ( bank === 'GM2#' || bank === 'ExPCM' ) {
            window.parent.$(".ui-dialog-content").dialog('close');
            window.parent.$('#writeToneDialogError').dialog('open');
        } else {
            window.parent.globals.parameter.db.selectedTone = this.id;
            window.parent.$(".ui-dialog-content").dialog('close');
            var number = this.id.match(/\d+/);
            var name = $(this).parent('td').prev('td').text();
            var curName = window.parent.header.$('#currentToneName').val().slice(7);
            window.parent.$('#writeToneFrom').text(curName);
            window.parent.$('#writeToneDest').prev('td').text(number+' : ');
            window.parent.$('#writeToneDest').text(name);
            window.parent.$('#writeToneDialog').dialog('open');
        }
    });

/* table css */
    $('td:first-child').css({'text-align':'center', 'width':'40px','min-width':'40px'});
    $('td:nth-child(2), td:nth-child(3), td:nth-child(4)').css({'padding-left':'5px', 'min-width':'50px'});
    $('td:nth-child(5)').css({'padding-left':'5px', 'width':'50%','min-width':'110px'});
    $('td:last-child').css({'text-align':'center', 'min-width':'60px'});
});