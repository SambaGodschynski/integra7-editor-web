//
//  scene_indextop_controller.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

//////////////////////////////////////////////////////////////////////

(function(){

	window.parent.globals.controller.indextop = new window.parent.globals.controller.base_studioset_view();

	window.parent.globals.controller.indextop.getValue = function (id, v) {

		var ret;

		switch (id) {
		case "studioSetSelect":
			var d = "PRM-_SETUP-_STP-NESTP_PRF_PC_SD1";
			var addr =  window.parent.globals.controller.base.prototype.getAddr(d);
			ret = window.parent.globals.model.getValue(addr);
			break;
		default:
			ret = window.parent.globals.controller.base.prototype.getValue(id);
		}

		return ret;
	};

	window.parent.globals.controller.indextop.put = function (id, v) {

		switch (id) {
		case "studioSetSelect":
			var d = "PRM-_SETUP-_STP-NESTP_PRF_PC_SD1";
			var addr =  window.parent.globals.controller.base.prototype.getAddr(d);
			window.parent.globals.model.put(addr, v, false);

			d = "PRM-_SETUP-_STP-NESTP_PRF_BS_MSB_SD1";
			addr =  window.parent.globals.controller.base.prototype.getAddr(d)
			window.parent.globals.communicator.dt1(addr, [0x55, 0x00, v]);

			break;
		case "currentStudioSet":
			var d = "PRM-_PRF-_FC-NEFC_NAME";
			var addr =  window.parent.globals.controller.base.prototype.getAddr(d);
			window.parent.globals.model.put(addr, v);
			break;
		case "currentToneName":
			var type = this.getCurToneType();
			var d;
			if (type in this.typeToNameID) {
				d = this.typeToNameID[type];
			}
			var addr =  window.parent.globals.controller.base_tone.prototype.getAddr(d);
			window.parent.globals.model.put(addr, v);
			break;
		case "toneNoSelect":
			this.toneChange(v);
			this.categorySelectUpdate(false);
			break;
		case "bank":
			this.bankChange(v);
			this.selectedSelUpdate();
			break;
		case "category":
			this.categoryChange(v);
			this.selectedSelUpdate();
			break;
		case "type":
			this.typeChange(v);
			this.selectedSelUpdate();
			break;
		default:
			window.parent.globals.controller.base.prototype.put(id, v);
			break;
		}

	};

	var TONE_INDEX 	= 0,
		TONE_BANK_M = 1,
		TONE_BANK_L	= 2,
		TONE_PC 	= 3,
		TONE_CATE 	= 4,
		TONE_NAME 	= 5;

	var NORMAL_MODE = 0,
		CATE_MODE = 1;

	var TONE_LONG_NAME = 0,
		TONE_SHORT_NAME = 1;

	var bankNamePre 	= 'PRESET',
		bankNameUser	= 'USER',
		bankNameGM2 	= 'GM2',
		bankNameGM2_EXP = 'GM2#';

	var msbId	= "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB",
		lsbId 	= "PRM-_PRF-_FP1-NEFP_PAT_BS_LSB",
		pcId 	= "PRM-_PRF-_FP1-NEFP_PAT_PC";

	var bankName		= [],
		toneDataArray 	= [],
		$typeSelect 	= [],
		$bankSelect 	= [],
		$toneSelect 	= [],
		$curToneText 	= [],
		$categorySelect = [];

	var selectedType,
		selectedBank,
		selectedTone,
		selectedCategory;

	var expName = window.parent.globals.parameter.presetExp.expansionName;
	var baseCtrl = window.parent.globals.controller.base.prototype;

	function getNumStr (v) {
		return ('000'+(v+1)).slice(-4) + ' : ';
	};

	
	window.parent.globals.controller.indextop.cateModeStop = function() {
		selectedCategory = -1;
		this.editMode = NORMAL_MODE;
	};

	window.parent.globals.controller.indextop.editMode; // 0 = Normal, 1 = CategoryEdit

	window.parent.globals.controller.indextop.init = function ( $type, $bank, $cate, $tone, $curTone) {

		$typeSelect= $type;
		$bankSelect= $bank;
		$toneSelect= $tone;
		$curToneText = $curTone;
		$categorySelect = $cate;

		var curTone = window.parent.globals.controller.base_midi.prototype.getCurTone();

		selectedType = curTone.type;
		selectedBank = curTone.bank;
		selectedTone = curTone.index;

		selectedCategory = -1;
		this.editMode = NORMAL_MODE;

	};

	window.parent.globals.controller.indextop.typeChange = function (v) {

		part = window.parent.globals.parameter.db.curPart;

		selectedType = UI_TYPE_INFO[v].str;
		selectedBank = 'PRESET';
		selectedTone = 0;
		selectedCategory = -1;

		this.editMode = NORMAL_MODE;

		//update select list
		toneDataArray = this.selectToneList(this.editMode);//this.parseToneBank(selectedType, selectedBank);

		//edit model
		if (toneDataArray.length) this.toneChange(selectedTone);

		//view update
//		this.typeSelectUpdate();
		this.bankSelectUpdate(false);
		this.toneSelectUpdate(false);
		this.categorySelectUpdate(false);

	};


	window.parent.globals.controller.indextop.bankChange = function (v) {

		part = window.parent.globals.parameter.db.curPart;

		selectedBank = bankName[v];
		selectedTone = 0;
		selectedCategory = -1;

		this.editMode = NORMAL_MODE;

		//update select list
		toneDataArray = this.selectToneList(this.editMode);//this.parseToneBank(selectedType, selectedBank);

		//edit model
		if (toneDataArray.length) this.toneChange(selectedTone);

		//view update
		this.typeSelectUpdate(false);
//		this.bankSelectUpdate(false);
		this.toneSelectUpdate(false);
		this.categorySelectUpdate(false);

	};

	window.parent.globals.controller.indextop.selectToneList = function (sel) {

		if (sel) {
			//var cate = window.parent.globals.parameter.ToCategory50(selectedCategory);
			return this.parseToneListByCategory(selectedCategory);
		} else {
			return this.parseToneBank(selectedType, selectedBank);
		}

	};

	window.parent.globals.controller.indextop.categoryChange = function (v) {

		part = window.parent.globals.parameter.db.curPart;

		selectedType = null;
		selectedBank = null;
		selectedTone = 0;
		selectedCategory = v;

		this.editMode = CATE_MODE;

//		var cate = window.parent.globals.parameter.ToCategory50(v);
		toneDataArray = this.selectToneList(this.editMode);//this.parseToneListByCategory(cate);

		//edit model
		if (toneDataArray.length) {
			this.toneChange(selectedTone);
		}

		//view update
//		this.typeSelectUpdate(false);
//		this.bankSelectUpdate(false);
		this.toneSelectUpdate(false);
//		this.categorySelectUpdate();
		this.selectedSelUpdate();

	};

	/**
	 *  param {Number} index of selector
	 */
	window.parent.globals.controller.indextop.toneChange = function (v) {

		part = window.parent.globals.parameter.db.curPart;

		toneDataArray = this.selectToneList(this.editMode);
		var msb = toneDataArray[v][TONE_BANK_M];
		var lsb = toneDataArray[v][TONE_BANK_L];
		var pc = toneDataArray[v][TONE_PC];
		window.parent._app_.report("toneChange", `_msb=${msb} _lsb=${lsb} _pc=${pc}`);
		this.curId = msbId.replace(/\d+/, part+1);
		baseCtrl.put(msbId.replace(/\d+/, part+1), msb, false);//msb
		this.curId = lsbId.replace(/\d+/, part+1);
		baseCtrl.put(lsbId.replace(/\d+/, part+1), lsb, false);//lsb
		this.curId = pcId.replace(/\d+/, part+1);
		baseCtrl.put(pcId.replace(/\d+/, part+1), pc, false); //pc
		this.curId = '';

		this.curId = msbId.replace(/\d+/, part+1);
		var d = this.curId;
		addr =  window.parent.globals.controller.base.prototype.getAddr(d);
		window.parent.globals.communicator.dt1(addr, [msb, lsb, pc]);

	};

	window.parent.globals.controller.indextop.typeSelectUpdate = function(/* toneDataArray update disable */){

		if  (this.editMode === CATE_MODE) return;

		part = window.parent.globals.parameter.db.curPart;

		var msb = baseCtrl.get(msbId.replace(/\d+/, part+1)).value;//msb
		var lsb = baseCtrl.get(lsbId.replace(/\d+/, part+1)).value;//lsb
		var pc = baseCtrl.get(pcId.replace(/\d+/, part+1)).value;//pc
		var data = getToneInfo(msb, lsb, pc);

		if (data.index === undefined ) return; // the state is not right

		var type = data.type;
		var index = 0;

		selectedType = data.type;
		selectedBank = data.bank;

		//update select list
		toneDataArray = this.selectToneList(this.editMode);//this.parseToneBank(selectedType, selectedBank);

		$typeSelect.empty();

		var doc = '';
		for (var i = 0; i< UI_TYPE_INFO.length; i++) {
			doc += '<option value='+ i + '>' + UI_TYPE_INFO[i].str + "</option>";
		}

		for ( var i in UI_TYPE_INFO) {
			if (UI_TYPE_INFO[i].str === type) {
				index = i;
				break;
			}
		}

		$typeSelect.append(doc);
		$typeSelect.val(index);
	};

	window.parent.globals.controller.indextop.bankSelectUpdate = function(/* toneDataArray update disable */) {

		if  (this.editMode === CATE_MODE) return;

		part = window.parent.globals.parameter.db.curPart;

		var msb = baseCtrl.get(msbId.replace(/\d+/, part+1)).value;//msb
		var lsb = baseCtrl.get(lsbId.replace(/\d+/, part+1)).value;//lsb
		var pc = baseCtrl.get(pcId.replace(/\d+/, part+1)).value;//pc
		var data = getToneInfo(msb, lsb, pc);

		if (data.index === undefined ) return; // the state is not right

		selectedType = data.type;
		selectedBank = data.bank;

		//update select list
		toneDataArray = this.selectToneList(this.editMode);//this.parseToneBank(selectedType, selectedBank);

		var exp = window.parent.globals.parameter.db.curExpansion;

		bankName = this.getBankNameArray(selectedType, exp);

		var index = (function() {
			for (var i in bankName) {
				if (bankName[i] === data.bank) {
					return i;
				}
			}
		})();

		$bankSelect.empty();
		var doc = '';

		for (var i  in bankName) {
			doc += '<option value='+ i + '>' + bankName[i] + "</option>";
		}

		$bankSelect.append(doc);
		$bankSelect.val(index);

	};

	window.parent.globals.controller.indextop.toneSelectUpdate = function(/* toneDataArray update disable */) {

//		this.editMode = 0;

		part = window.parent.globals.parameter.db.curPart;

		var msb = baseCtrl.get(msbId.replace(/\d+/, part+1)).value;//msb
		var lsb = baseCtrl.get(lsbId.replace(/\d+/, part+1)).value;//lsb
		var pc = baseCtrl.get(pcId.replace(/\d+/, part+1)).value;//pc
		var data = getToneInfo(msb, lsb, pc);

		if (data.index === undefined ) return; // the state is not right

		var arrayIndex = this.parseToneIndexByToneArray(msb, lsb, pc);

		selectedType = data.type;
		selectedBank = data.bank;
		selectedTone = arrayIndex;//data.index;

		if (data.bank === undefined) return;

		if (arguments.length === 0) {
			toneDataArray = this.selectToneList(this.editMode);//this.parseToneBank(selectedType, selectedBank);
		}

		$toneSelect.empty();
		var doc = '';
		for (var i = 0; i < toneDataArray.length; i++) {
			doc += '<option value='+ i + '>'+ getNumStr(i) + toneDataArray[i][TONE_NAME] + "</option>";
		}
		$toneSelect.append(doc);
		$toneSelect.val(selectedTone);

		var selectedToneName = $toneSelect.children(':selected').text();
		$curToneText.val(selectedToneName);

		var curContents = window.parent.globals.parameter.db.curContents;
		if ( curContents === 'utility' && window.parent.globals.parameter.db.contentsAreaScene[curContents] === 1 ) {
			if ( window.parent.$('#writeToneTable').attr('class') !== selectedType) {
				window.parent.globals.controller.indextop.updateContents();
			}
		}
	};

	window.parent.globals.controller.indextop.categorySelectUpdate = function (/* toneDataArray update disable */) {

		part = window.parent.globals.parameter.db.curPart;

		if (toneDataArray === undefined) return;

		if (this.editMode === NORMAL_MODE) {
			var curTone = window.parent.globals.controller.base_midi.prototype.getCurTone();
			selectedType = curTone.type;
			selectedBank = curTone.bank;
			selectedTone = curTone.index;
		}

		//update select list
		toneDataArray = this.selectToneList(this.editMode);//this.parseToneBank(selectedType, selectedBank);

		if ( selectedTone === undefined ) return
		if ( (toneDataArray.length - 1) < selectedTone || selectedTone < 0) return;

		var cate = toneDataArray[selectedTone][TONE_CATE];
		var cate36 = window.parent.globals.parameter.ToCategory36(cate);
		var nameArray = window.parent.globals.parameter.presetCategory.categoryName2

		var doc = '';
		for (var i = 0; i< nameArray.length; i++) {
			doc += '<option value='+ i + '>' + nameArray[i][TONE_LONG_NAME] + "</option>";
		}
		$categorySelect.empty();
		$categorySelect.append(doc);
		$categorySelect.val(cate36);
	}

	window.parent.globals.controller.indextop.selectedSelUpdate = function () {

		if ( selectedCategory === -1 ) {
			var cate = document.getElementById('category');
	//		cate.selectedIndex = -1;
		} else {
			var type = document.getElementById('type');
			type.selectedIndex = -1;

			var bank = document.getElementById('bank');
			bank.selectedIndex = -1;
		}
	}

	window.parent.globals.controller.indextop.parseToneListByCategory = function(category) {

		var array = [];
		var e = window.parent.globals.parameter.db.curExpansion;
		var usrTone = window.parent.globals.parameter.db;
		var preTone = window.parent.globals.parameter.presetTone;
		var presetArray = [];

		presetArray.push(preTone.snAcousticPreset);
		presetArray.push(preTone.snSynthPreset);
		presetArray.push(preTone.snDrumKitPreset);
		presetArray.push(preTone.pcmSynthPreset);
		presetArray.push(preTone.pcmDrumKitPreset);

		if (window.parent.isExPCMExist()) {
			presetArray.push(preTone.pcmSynthTts2Gm2);
			presetArray.push(preTone.pcmDrumKitTts2Gm2);
			presetArray.push(usrTone.sna);
			presetArray.push(usrTone.sns);
			presetArray.push(usrTone.snd);
			presetArray.push(usrTone.pcms);
			presetArray.push(usrTone.pcmd);
		} else {
			presetArray.push(preTone.pcmSynthGm2);
			presetArray.push(preTone.pcmDrumKitGm2);
			presetArray.push(usrTone.sna);
			presetArray.push(usrTone.sns);
			presetArray.push(usrTone.snd);
			presetArray.push(usrTone.pcms);
			presetArray.push(usrTone.pcmd);

			/* Add EXP */
			for (var i in e) {
				for (var j  in window.parent.globals.parameter.presetExp.expansionArray[e[i]]) {
					var t = window.parent.globals.parameter.presetExp.expansionArray[e[i]][j];
					if (t) 	presetArray.push(t);
				}
			}
		}


		var cate36;
		/*parse selected category tone*/
		for (var i in presetArray) {
			for (var j in presetArray[i]) {
				cate36 = window.parent.globals.parameter.ToCategory36(presetArray[i][j][TONE_CATE]);
				if (cate36 === category) {
					array.push(presetArray[i][j]);
				}
			}
		}
		return array;
	};

	window.parent.globals.controller.indextop.parseToneIndexByToneArray = function(msb, lsb, pc) {

		for (var i in toneDataArray) {
			if (toneDataArray[i][TONE_BANK_M] === msb &&
					toneDataArray[i][TONE_BANK_L] === lsb &&
					toneDataArray[i][TONE_PC] === pc) {
				return i;
			}
		}
		return -1;

	};
})();

