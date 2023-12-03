//
//  scene_write_studioset.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

	var contents = window.parent.globals.parameter.db.curContents;
	window.parent.globals.parameter.db.contentsAreaScene[contents] = 0;

    $('#writeStudioSet tr').remove();
    var doc = '';
    for (var i = 1; i <= 64; i++) {
        doc += (
            '<tr>'+
            '<td>'+i+'</td>'+
            '<td>'+window.parent.globals.parameter.getValName("studioSet", i).text+'</td>'+
            '<td><input type="radio" name="execute" id="execute'+(i)+'" /><label for="execute'+(i)+'">WRITE</label></td>'+
            '</tr>'
        );
    }
    $('#writeStudioSet').append(doc);

    $('input[id*="execute"]').button();

/* write execute */
    $('input[id*="execute"]').click(function(){
        window.parent.globals.parameter.db.selectedStudioset = this.id;
        window.parent.$('.ui-dialog-content').dialog('close');
        var number = this.id.match(/\d+/);
        var name = $(this).parent('td').prev('td').text();
        var curName = window.parent.header.$('#currentStudioSet').val().slice(7);
        window.parent.$('#writeStFrom').text(curName);
        window.parent.$('#writeStDest').prev('td').text(number+' : ');
        window.parent.$('#writeStDest').text(name);
        window.parent.$('#writeStudiosetDialog').dialog('open');
    });

/* table css */
    $('td:first-child').css({'text-align':'center', 'width':'40px','min-width':'40px'});
    $('td:nth-child(2)').css({'padding-left':'5px', 'width':'80%', 'min-width':'110px'});
    $('td:last-child').css({'text-align':'center', 'width':'20%','min-width':'60px'});
});
