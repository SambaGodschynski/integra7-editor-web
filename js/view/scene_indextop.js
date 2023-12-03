//
//  scene_indextop.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

	var ctrl =  window.parent.globals.controller.indextop;
	window.parent.globals.controller.indextop.curId = '';

    $('#tabset').buttonset();

/* CSS */
    $('input[name=partNum]').find('label').width(40);
    $('input[type=radio]').button();
    $('#label_ex').hide();

    $('input[type=radio][name=menu]').click(function(){
        $('#label_ex').hide();
		var loadContents = $(this).attr("title");
		window.parent.globals.controller.indextop.updateContents(loadContents);
		var curPart = window.parent.globals.parameter.db.curPart;

 /*
  	    for (i = 1; i <= 16; i++) {
  	    	if (i === curPart+1) {
  		  	    document.getElementById('part' + i).checked = true;
  	    	} else {
  	    		document.getElementById('part' + i).checked = false;
  	    	}
  	    }
  	    document.getElementById('ex').checked = false;
 */
		for (i = 1; i <= 16; i++) {
			$('#part' + i).prop('checked', (i === curPart+1) ? true : false);
		}
		$('#ex').prop('checked', false);
		window.parent.globals.parameter.db.curExtPartSw = false;

		$('input[type=radio]').button('refresh');

        if ( loadContents === 'motionalsurround' ) {
            $('#label_ex').show();
        }
    });

    $('input#read').button().click(function(){
		window.parent.$('#readConfirm').text('Are you sure?');
		window.parent.$(".ui-dialog-content").dialog('close');
		window.parent.$('#readDialog').dialog('open');
    });

	function getNumStr (v) {
		return ('000'+(v+1)).slice(-4) + ' : ';
	}

	window.parent.globals.controller.indextop.studiosetUpdate = function () {
		/* Studio Set Select */
		$('select#studioSetSelect').empty();
		var studioSetArray = window.parent.globals.parameter.db.studioSet;

		for (var i = 0; i < studioSetArray.length; i++) {
			var name = getNumStr(i);
            $('#studioSetSelect').append('<option value='+i+'>'+ name + studioSetArray[i].text + '</option>');
		}
		/* Studio Set Name */
		var num = ctrl.getValue("studioSetSelect");
		var selectedStudioSet = window.parent.globals.parameter.db.studioSet[num];
		$('#studioSetSelect').val(num);
		$('#currentStudioSet').val(getNumStr(num) + selectedStudioSet.text);

	};
	window.parent.globals.controller.indextop.studiosetUpdate();



/* Change Current StudioSet */
    $('#studioSetSelect').change(function() {
		$(this).blur();
		window.parent.globals.controller.indextop.curId = "PRM-_SETUP-_STP-NESTP_PRF_PC_SD1";//this.id;
		window.parent.globals.controller.indextop.put(this.id, this.selectedIndex);
		window.parent.globals.controller.indextop.curId = '';

		var val = ctrl.getValue("studioSetSelect");
		var selectedStudioSet = window.parent.globals.parameter.db.studioSet[val];
		$('#currentStudioSet').val(getNumStr(val) + selectedStudioSet.text);

		var part = window.parent.globals.parameter.db.curPart;

	//	window.parent.globals.model.abortRead();
	//	window.parent.globals.model.read("PRM-_PRF", "PRM-_FPART" + (part+1) );
		window.parent.$(".ui-dialog-content").dialog('close');
		window.parent.$("#readConfirm").html('<span>Studioset has changed.</span><br><span>Reading is started.</span>');
		window.parent.$('#readDialog').dialog('open');
		window.parent.globals.parameter.readPartFlag = 0xFFFF & ~(1 << part);

    });

/* Tone Category Select */
    $('select#category').empty();
    $.each(window.parent.globals.parameter.snaCategoryArray, function(i){
        this.value = i;
        $('select#category').append($('<option>', this));
    });

/* tone Update */
	window.parent.globals.controller.indextop.toneUpdate = function () {
//		ctrl.setEditMode(0);
		ctrl.typeSelectUpdate();
		ctrl.bankSelectUpdate();
		ctrl.toneSelectUpdate();
		ctrl.categorySelectUpdate();
		ctrl.selectedSelUpdate();
	};

/* Change Current Tone */
    $('#toneNoSelect').change(function() {
		window.parent.globals.controller.indextop.curId = this.id;
		window.parent.globals.controller.indextop.put(this.id, this.selectedIndex);
        var toneName = $('option:selected', this).text();
        $('#currentToneName').val(toneName);
		window.parent.globals.controller.indextop.curId = '';

		if ( window.parent.globals.parameter.db.curContents === 'utility' ) {
			window.parent.globals.controller.indextop.updateContents();
		}
    });

/* Current Tone Rename */
    $('#currentToneName').mousedown(function(){
		window.parent.globals.controller.indextop.curId = this.id;
        var currentToneName = $('#currentToneName').val().slice(7); // remove number
        window.parent.$('#toneRename').val(currentToneName);
        window.parent.$(".ui-dialog-content").dialog('close');
        window.parent.$('#toneRenameDialog').dialog('open');
        currentToneName = $('#currentToneName').val().slice(7);
        var id = getCurToneNameId();
        ctrl.put(id, currentToneName);
		window.parent.globals.controller.indextop.curId = '';
    });
 
/* Studio Set Rename */
    $('#currentStudioSet').mousedown(function(){
		window.parent.globals.controller.indextop.curId = this.id;
		var currentStudioSetName = $('#currentStudioSet').val().slice(7); // remove number
		window.parent.$('#studioSetRename').val(currentStudioSetName);
		window.parent.$('.ui-dialog-content').dialog('close');
		window.parent.$('#studioSetRenameDialog').dialog('open');
		window.parent.globals.controller.indextop.curId = '';
	});

	var toneNameId = 'PRM-_FPART1-_SNTONE-_SNTC-SNTC_NAME';

	var getCurToneNameId = function() {

		var curToneType = ctrl.getCurTone().type;

		switch (curToneType) {
		case 'SN-A':
			toneNameId = 'PRM-_FPART1-_SNTONE-_SNTC-SNTC_NAME';
			break;
		case 'SN-S':
			toneNameId = 'PRM-_FPART1-_SHPAT-_SHPC-SHPC_NAME';
			break;
		case 'SN-D':
			toneNameId = 'PRM-_FPART1-_KIT-_KC-SDKC_NAME';
			break;
		case 'PCM-S':
			toneNameId = 'PRM-_FPART1-_PAT-_PC-RFPC_NAME';
			break;
		case 'PCM-D':
			toneNameId = 'PRM-_FPART1-_RHY-_RC-RFRC_NAME';
		break;
		}
		return toneNameId;
	};

    var EX_PART = -1;
	/*	Select Part */
    $('input[name="partNum"]').click(function(){
		window.parent.globals.controller.indextop.curId = this.id;
		var num = this.id.match(/\d+/) ? parseInt(this.id.match(/\d+/), 10) - 1 : EX_PART;
		var cur = window.parent.globals.parameter.db.curPart;

		if (num !== EX_PART ) {
			window.parent.globals.parameter.db.curPart = num;
		}

		if (cur !== num || window.parent.globals.parameter.db.curExtPartSw) {

			var curContents = window.parent.globals.parameter.db.curContents;
			ctrl.cateModeStop();
			ctrl.toneUpdate();
			switch (curContents) {
				case 'studioset':
				case 'system':
				case 'exp':
				case 'utility':
					if ( window.parent.$('#contents').attr('src') === 'scene_write_tone.html' ) {
						window.parent.globals.controller.indextop.updateContents(curContents);

					} else {
						return;
					}
					break;
				default :
					window.parent.globals.controller.indextop.updateContents(curContents);
					break;
			}

			if (num === EX_PART) {
				window.parent.globals.parameter.db.curExtPartSw = true;
			} else {
				window.parent.globals.parameter.db.curExtPartSw = false;
			}

			if (window.parent.globals.parameter.readPartFlag & (1 << num)) {
		//		ctrl.requestPartParam();
		//		window.parent.globals.parameter.readPartFlag &= ~(1 << num);
			}
		}

		window.parent.globals.controller.indextop.curId = '';

    });

/* Preview */
    $('#preview').button().change(function(){
		var curPart;

		if (this.checked) {
			curPart = window.parent.globals.parameter.db.curPart;
			ctrl.preview(curPart);
		} else {
			curPart = window.parent.globals.parameter.db.curPart;
			ctrl.preview(-1); // off
		}
	});


/* currentToneType */
	$('select#type').change(function(){
		window.parent.globals.controller.indextop.curId = this.id;
		ctrl.put(this.id, this.selectedIndex);
		window.parent.globals.controller.indextop.curId = '';
		var curContents =  window.parent.globals.parameter.db.curContents;
		switch (curContents) {
			case 'tone_sna':
			case 'effects':
				window.parent.globals.controller.indextop.updateContents();
				break;
			case 'utility':
				if ( window.parent.globals.parameter.db.contentsAreaScene[curContents] === 1 ) {
					window.parent.globals.controller.indextop.updateContents();
				}
				break;
			default :
				break;
		}
	});

/* currentToneBank */
	$('select#bank').change(function(){
		window.parent.globals.controller.indextop.curId = this.id;
		ctrl.put(this.id, this.selectedIndex);
		window.parent.globals.controller.indextop.curId = '';
		var curContents =  window.parent.globals.parameter.db.curContents;
		switch (curContents) {
			case 'tone_sna':
			case 'effects':
				window.parent.globals.controller.indextop.updateContents();
				break;
			default :
				break;
		}
	});

/* currentCategory */
	$('select#category').change(function(){
		window.parent.globals.controller.indextop.curId = this.id;
		ctrl.put(this.id, this.selectedIndex);
		window.parent.globals.controller.indextop.curId = '';
	});

    var toneBankArray = [
        {'value':0 ,'text':'PRST'},
        {'value':1 ,'text':'USER'},
        {'value':2 ,'text':'GM2'},
    ];

	window.parent.globals.controller.indextop.updateContents = function(/* load contents*/) {

		var loadContents;

		if (arguments.length === 0 ) {
			loadContents = window.parent.globals.parameter.db.curContents;
		} else if (arguments[0] === undefined) {
			loadContents = window.parent.globals.parameter.db.curContents;
		} else {
			loadContents = arguments[0];
		}

		window.parent.globals.parameter.db.curContents = loadContents;

		if ( loadContents === 'studioset' ) {

			var lc = window.parent.globals.parameter.db.contentsAreaScene[loadContents];

			if (lc === 9) {
				window.parent.$('#contents').attr('src','scene_studioset_partview.html');
			} else if (lc === 8) {
				window.parent.$('#contents').attr('src','scene_studioset_common.html');
			} else if (lc >= 0 && lc <= 8) {
				window.parent.$('#contents').attr('src','scene_studioset_part.html');
			} else {
				window.parent.$('#contents').attr('src','scene_studioset_partview.html');
			}

			window.parent.$('#contents').css('height','100%');
			window.parent.$('#menu').attr('src', 'scene_studioset_menu.html');
			window.parent.$('#menu').css('height','100%');
		} else if ( loadContents === 'effects' ) {
			switch (window.parent.globals.parameter.db.contentsAreaScene[loadContents]) {
				case 1:
					window.parent.$('#contents').attr('src','scene_effects_partEq.html');
					break;
				case 2:
					window.parent.$('#contents').attr('src','scene_effects_master.html');
					break;
				default:
					var curTone = window.parent.globals.controller.base_midi.prototype.getCurTone();
					var bank = curTone.bank;
					if ( bank === 'GM2#' || bank === 'ExPCM' ) {
						window.parent.$('#contents').attr('src','scene_noneditable.html');
					} else {
						window.parent.$('#contents').attr('src','scene_effects_part.html');
					}
					break;
			}
			window.parent.$('#contents').css('height','100%');
			window.parent.$('#menu').attr('src', 'scene_effects_menu.html');
			window.parent.$('#menu').css('height','100%');
		} else if ( loadContents === 'utility' ) {

			switch (window.parent.globals.parameter.db.contentsAreaScene[loadContents]) {
				case 0: window.parent.$('#contents').attr('src','scene_write_studioset.html');
					break;
				case 1:	window.parent.$('#contents').attr('src','scene_write_tone.html');
					break;
				default:
					window.parent.$('#contents').attr('src','scene_write_studioset.html');
			}
			window.parent.$('#contents').css('height','100%');
			window.parent.$('#menu').attr('src', 'scene_utility_menu.html');
			window.parent.$('#menu').css('height','100%');

		} else if ( loadContents === 'tone_sna' ){
			var tone = ctrl.getCurTone();
			var bank = tone.bank;
			if ( bank === 'GM2#' || bank === 'ExPCM' ) {
				loadContents = 'noneditable';
			} else {
				switch ( tone.type ) {
					case 'SN-A':
						loadContents = 'tone_sna';
						break;
					case 'SN-S':
						loadContents = 'tone_sns';
						break;
					case 'SN-D':
						loadContents = 'tone_snd';
						break;
					case 'PCM-S':
						loadContents = 'tone_pcms';
						break;
					case 'PCM-D':
						loadContents = 'tone_pcmd';
						break;
					default:
						break;
				}
			}
			window.parent.$('#contents').attr('src','scene_'+loadContents+'.html');
			window.parent.$('#contents').css('height','100%');
			window.parent.$('#menu').attr('src', 'scene_'+loadContents+'_menu.html');
			window.parent.$('#menu').css('height','100%');
		} else if ( loadContents === 'model' ) {
			window.parent.$('#contents').attr('src','scene_' + loadContents+'.html');
			window.parent.$('#contents').css('height','100%');
		} else {
			window.parent.$('#contents').attr('src','scene_'+loadContents+'.html');
			window.parent.$('#contents').css('height','100%');
			window.parent.$('#menu').attr('src', 'scene_'+loadContents+'_menu.html');
			window.parent.$('#menu').css('height','100%');
		}

		if ( loadContents === 'motionalsurround' ) {
            $('#label_ex').show();
        }
	};

	var msbId	= "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB",
		lsbId	= "PRM-_PRF-_FP1-NEFP_PAT_BS_LSB",
		pcId	= "PRM-_PRF-_FP1-NEFP_PAT_PC";

	function listner(ev, param) {
		id = param;
		if (id === window.parent.globals.controller.indextop.curId) return;//from this view

		if (id === 'PRM-_SETUP-_STP-NESTP_PRF_PC_SD1') {
			window.parent.globals.controller.indextop.studiosetUpdate();
		} else {

			var part = window.parent.globals.parameter.db.curPart;
			var num = id.match(/\d+/) - 1;
			if (part !== num) return;

			if (window.parent.globals.controller.indextop.disableUpdate) return;

			if (id.indexOf("_PAT_BS_MSB") !== -1) {
				ctrl.cateModeStop();
				ctrl.typeSelectUpdate();
				ctrl.bankSelectUpdate();
				ctrl.toneSelectUpdate();
				ctrl.categorySelectUpdate();
				ctrl.selectedSelUpdate();
			} else if (id.indexOf("_PAT_BS_LSB") !== -1 || id.indexOf("_PAT_PC") !== -1 ) {
				ctrl.cateModeStop();
				ctrl.typeSelectUpdate();
				ctrl.bankSelectUpdate();
				ctrl.toneSelectUpdate();
				ctrl.categorySelectUpdate();
				ctrl.selectedSelUpdate();
			}
		}
	}

	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_indextop');
	};

	window.parent.globals.observer.append('scene_indextop', listner);

	ctrl.init($('#type'), $('#bank'), $('#category'), $('#toneNoSelect'), $('#currentToneName') );

	ctrl.typeSelectUpdate();
	ctrl.bankSelectUpdate();
	ctrl.toneSelectUpdate();
	ctrl.categorySelectUpdate();
	ctrl.selectedSelUpdate();

});