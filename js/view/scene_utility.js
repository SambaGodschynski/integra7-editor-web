//
//  scene_utility.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

    var ctrl = window.parent.globals.controller.utility;

	var snsOpt = [
		"<option>Partial 1</option>",
		"<option>Partial 2</option>",
		"<option>Partial 3</option>"
	];
	var pcmsOpt = [
		"<option>Partial 1</option>",
		"<option>Partial 2</option>",
		"<option>Partial 3</option>",
		"<option>Partial 4</option>"
	];

	var snd = { min : 27, max : 88};
	var pcmd = {min : 21, max : 108};

	/**
	*	param{number} note
	*/
	var	strPutNoteName = function (note) {

		var _noteName = [
			"C ","C#","D ","Eb","E ","F ","F#","G ","G#","A ","Bb","B "
		];
		var _octaveName = [
			'-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
		];

		var	name, octave;

		if (note < 0 || note > 127) {
			return '-';
		} else {
			name   = (note % 12);
			octave = parseInt(note / 12, 10);
			return	_noteName[name] + _octaveName[octave];
		}

	};

	var pcmdOpt = '';
    for (var i = pcmd.min; i <= pcmd.max; i++) {
		pcmdOpt += (
			'<option>('+i+strPutNoteName(i)+')</option>'
		);
    }

	var sndOpt = '';
	for (var i = snd.min; i <= snd.max; i++) {
		sndOpt += (
			'<option>('+i+strPutNoteName(i)+')</option>'
		);
    }

	var groupOpt = '';
	groupOpt = '<option>Temporary</option>' +
				'<option>Preset</option>' +
				'<option>User</option>';
/*
	var usrOpt = '';

    for (var i = snd.min; i <= snd.max; i++) {
    	sndOpt += (
       	 '<option>('+i+strPutNoteName(i)+')</option>'
        );
    }

	var preOpt = '';
    for (var i = snd.min; i <= snd.max; i++) {
    	sndOpt += (
       	 '<option>('+i+strPutNoteName(i)+')</option>'
        );
    }
*/

	var getOptionPartial = function (p) {
		var ret;
		switch (p) {
		case "SN-D": ret = sndOpt; break;
		case "SN-S": ret = snsOpt;	break;
		case "PCM-S": ret = pcmsOpt;	break;
		case "PCM-D": ret = pcmdOpt;	break;
		default: ret = null; break;
		}
		return ret;
	};

/*
	var getOptionToneNames = function () {
	};

	var getOptionToneGroup = function () {
	};
*/
	var TONE_NAME = 5;
	var ctrl = window.parent.globals.controller.utility;

	/**
	*	updatePartDialog
	*/
	window.parent.globals.controller.utility.updatePartDialog = function () {

		window.parent.$("#partInit table").empty();

		var curTone = ctrl.getCurTone();
		var doc = '';
		var toneNum = curTone.index;
		var partNum = window.parent.globals.parameter.db.curPart;
		var type = curTone.type;
//		var toneName = window.parent.globals.parameter.getCurToneInfo(type, toneNum).text;

		var tbl = ctrl.parseToneBank(curTone.type, curTone.bank);
		toneName = tbl[curTone.index][TONE_NAME];


		doc += (
			'<tr><td>Part : </td><td>Temporary</td><td>' + ("000"+(toneNum+1)).slice(-4) + ':' + toneName + '</td><td>Part ' + (partNum+1) + '</td></tr>'
		);
		window.parent.$("#partInit table").append(doc);
	};



	/**
	*	updatePartialDialog
	*/
	window.parent.globals.controller.utility.updatePartialDialog = function () {

//		window.parent.globals.parameter.db.pcmsSelectedPartial = 0;

		var curPartial = window.parent.globals.parameter.db.selectedPartial;
		window.parent.$("#partialInit table").empty();

		var curTone = ctrl.getCurTone();
		var doc = '';
		var opt = '';
		var toneNum = curTone.index;
		var partNum = window.parent.globals.parameter.db.curPart;
		var type = curTone.type;
		//var toneName = window.parent.globals.parameter.getCurToneInfo(type, toneNum).text;

		var toneName;

		var tbl = ctrl.parseToneBank(curTone.type, curTone.bank);
		toneName = tbl[curTone.index][TONE_NAME];

		var type = curTone.type;

		if (type === "SN-S" || type === "PCM-S") {
			window.parent.globals.parameter.db.selectedPartial = 0;
		} else if (type === "SN-D") {
			window.parent.globals.parameter.db.selectedPartial = 0x1b;
		} else if (type == "PCM-D") {
			window.parent.globals.parameter.db.selectedPartial = 0x15;
		}
		opt = getOptionPartial(type);



	//	if (opt === null) {
	//		return;
	//	}
		doc += (
			'<tr><td>Part : </td><td>Temporary</td><td>' + ("000"+(toneNum+1)).slice(-4) + ':' + toneName + '</td><td><select id="partial">'+ opt + '</select>'+'</td></tr>'
		);

		window.parent.$("#partialInit table").append(doc);

		window.parent.$('#partial').change(function(obj) {
			function isDrumTone(num) {
				if (num > 4) {
					return true;
				}
				return false;
			}
			var txt = obj.target.options[obj.target.selectedIndex].text;
			var _partial =  txt.match(/\d+/) - 1;
			if (isDrumTone(_partial)) _partial += 1;
			//if (ctrl.getCurTone())
			window.parent.globals.parameter.db.selectedPartial = _partial;
		});
	};


	window.parent.globals.controller.utility.updatePartialCopyDialog = function () {

		window.parent.$("#partialCopy table").empty();

		var curTone = ctrl.getCurTone();
		var doc = '';
		var opt = '';
		var toneNum = curTone.index;
		var partNum = window.parent.globals.parameter.db.curPart;
		var type = curTone.type;
		var toneName = window.parent.globals.parameter.getCurToneInfo(type, toneNum).text;

		var type = ctrl.getCurToneType();
		opt = getOptionPartial(type);

		var optToneName = opt;	// getOptionToneNames(type);
		var optGroup = opt;	// getOptionToneGroup(type);

		doc += (
		'<tr><td>Source : </td><td><select id="groupSrc">'+optGroup+'</select></td><td><select id="toneNameSrc">'+optToneName+'</select></td><td><select id="partialSrc">'+opt+'</select></td></tr>' +
		'<tr><td>Destination : </td><td> Temporary </td><td>'+("000"+(toneNum+1)).slice(-4)+':'+toneName+'</td><td><select id="partialDest">'+opt+'</select></td></tr>'
		);

		window.parent.$("#partialCopy table").append(doc);

	};



//	function isDrumTone(num) {
//		if (num > 4) {
//			return true;
//		}
//		return false;
//	}
//
//	window.parent.$('#partialInit').change(function(obj) {
//
//  //      var val = obj.target.options[obj.target.selectedIndex].value;
//        var txt = obj.target.options[obj.target.selectedIndex].text;
//
//		var partial =  txt.match(/\d+/) - 1;
//
//
//		if (isDrumTone(partial)) partial += 1;
//
//		if (ctrl.getCurTone())
//
//		window.parent.globals.parameter.db.selectedPartial = partial;
//    });

	var inputs  = [];
	var outputs = [];

	/**
	*	updateDeviceInfo
	*/
	window.parent.globals.controller.utility.updateDeviceInfo = function () {

		var cur = window.parent.globals.device.current();
		var found = window.parent.globals.device.search();

		var cur_input  = null,
			cur_output = null;

		if ('midi' in found) {
			inputs  = found.midi[0];
			outputs = found.midi[1];
		}

		for (var i = 0, num = cur.length; i < num; i++) {
			if (cur[i].type == 'input') {
				cur_input = cur[i];
			} else
			if (cur[i].type == 'output') {
				cur_output = cur[i];
			}
		}

		window.parent.$('#inputDevice' ).empty().append('<option></option>');
		window.parent.$('#outputDevice').empty().append('<option></option>');
		window.parent.$('#deviceId' ).empty().append('<option></option>');

		var doc, selected;

		doc = '';
		for (var i = 0, num = inputs.length; i < num; i++) {
			selected = (cur_input && cur_input.id == inputs[i].id) ? "selected='selected'" : '';
			doc += (
				'<option ' + selected + '>' + inputs[i].name + '</option>'
			);
		}

		window.parent.$('#inputDevice').append(doc);

		doc = '';
		for (var i = 0, num = outputs.length; i < num; i++) {
			selected = (cur_output && cur_output.id == outputs[i].id) ? "selected='selected'" : '';
			doc += (
				'<option ' + selected + '>' + outputs[i].name + '</option>'
			);
		}

		window.parent.$('#outputDevice').append(doc);


		var deviceId = window.parent.globals.communicator.deviceId();
		deviceId = parseInt(deviceId, 16) + 1;

		/* update widget */
		for (var i = 16; i < 32; i++) {
			selected = (deviceId === (i+1)) ? "selected='selected'" : '';
			window.parent.$('#deviceId').append('<option ' + selected + '>' + (i+1) + '</option>');
		}

	};

	var ver = window.parent.$("#versionNumber");
	ver.empty();
	ver.append(window.parent.globals.version);

	var build = window.parent.$("#buildNumber");
	build.empty();
	build.append(window.parent.globals.buildNo);

	var copyright = window.parent.$("#copyrightText");
	copyright.empty();
	copyright.append(window.parent.globals.copyright);

	
	var vst_copyright = window.parent.$("#vst_copyrightText");
	
	if (vst_copyright) {
		vst_copyright.empty();
		vst_copyright.append(window.parent.globals.vst_copyright);
	}
	
	var other_copyright = window.parent.$("#other_copyrightText");
	
	if (other_copyright) {
		other_copyright.empty();
		other_copyright.append(window.parent.globals.other_copyright);
	}
	
	window.parent.globals.controller.utility.setMidiDev = function() {

		var val =   window.parent.$('#deviceId' ).prop("selectedIndex") + 0x10 - 1;

		window.parent.globals.communicator.deviceId(val.toString(16));
//		window.parent.globals.parameter.saveDeviceId(val.toString(16));

		window.parent.globals.device.disconnect();

		var index = -1;

		index = window.parent.$('#inputDevice' ).prop("selectedIndex") - 1;

		if (index >= 0) {
			window.parent.globals.device.connect(inputs[index]);
		}
//		window.parent.globals.parameter.saveDevice();
		index = window.parent.$('#outputDevice').prop("selectedIndex") - 1;

		if (index >= 0) {
			window.parent.globals.device.connect(outputs[index]);
		}
	};


	var intervalCount = 0;
	var intervalHdr = null;

	var readData = function() {

		var func = [];

		function readNames() {
			switch (intervalCount) {
			case 0: ctrl.readExpansion();
				break;
			case 1: ctrl.readStudiosetNameAll(function (){
				window.parent.globals.controller.indextop.studiosetUpdate();

			});
				break;
			case 2: ctrl.readUserToneName("SN-A");
				break;
			case 3: ctrl.readUserToneName("SN-S");
				break;
			case 4: ctrl.readUserToneName("SN-D");
				break;
			case 5: ctrl.readUserToneName("PCM-S");
				break;
			case 6: ctrl.readUserToneName("PCM-D", function () {
				window.parent.globals.controller.indextop.toneUpdate();
			});
				break;
			default:
				clearInterval(intervalHdr);
				intervalHdr = null;
				break;
			}
			intervalCount++;
		}

		intervalCount = 0;
		intervalHdr = setInterval(readNames, 50);
	};

});