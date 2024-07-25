//
//  scene_studioset_view_controller.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

//////////////////////////////////////////////////////////////////////

(function() {

	globals.controller.base_studioset_view = function(){};
	globals.controller.base_studioset_view.prototype = new globals.controller.base_midi();

	var TONE_INDEX 	= 0,
		TONE_BANK_M = 1,
		TONE_BANK_L	= 2,
		TONE_PC 	= 3,
		TONE_CATE 	= 4,
		TONE_NAME 	= 5;

	var TONE_LONG_NAME = 0,
		TONE_SHORT_NAME = 1;

	var expExPCM = 19;

	var bankNamePre 	= 'PRESET',
		bankNameUser	= 'USER',
		bankNameGM2 	= 'GM2',
		bankNameGM2_EXP = 'GM2#';

	var msbId	= "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB",
		lsbId 	= "PRM-_PRF-_FP1-NEFP_PAT_BS_LSB",
		pcId 	= "PRM-_PRF-_FP1-NEFP_PAT_PC";

	var bankName		= new Array(16),
		toneDataArray 	= new Array(16),
		$typeSelect 	= new Array(16),
		$bankSelect 	= new Array(16),
		$toneSelect 	= new Array(16),
		$categorySelect = new Array(16),
		selectedType 	= new Array(16),
		selectedBank 	= new Array(16),
		selectedTone	= new Array(16);

	var expName = window.parent.globals.parameter.presetExp.expansionName;
	var baseCtrl = window.parent.globals.controller.base.prototype;

	globals.controller.base_studioset_view.curId;

	globals.controller.base_studioset_view.prototype.init = function (part, $type, $bank, $tone, $cate) {

		$typeSelect[part] = $type;
		$bankSelect[part] = $bank;
		$toneSelect[part] = $tone;
		$categorySelect[part] = $cate;

		var msb = baseCtrl.get(msbId.replace(/\d+/, part+1)).value;//msb
		var lsb = baseCtrl.get(lsbId.replace(/\d+/, part+1)).value;//lsb
		var pc = baseCtrl.get(pcId.replace(/\d+/, part+1)).value;//pc
		var data = getToneInfo(msb, lsb, pc);

		selectedType[part] = data.type;
		selectedBank[part] = data.bank;
		selectedTone[part] = data.index;
	};


	globals.controller.base_studioset_view.prototype.get = function (id) {
		return baseCtrl.get(id);
	};

	globals.controller.base_studioset_view.prototype.put = function (id, v) {
		console.log(id, v);
		var cnvId = id.replace(/\d+/, 1); // PART* -> PART1
		switch (cnvId) {
		case msbId:
			this.typeChange(id, v);
			break;
		case lsbId:
			this.bankChange(id, v);
			break;
		case pcId:
			this.toneChange(id, v);
			break;
		default:
			baseCtrl.put(id, v);
			return;
		}
	};

	globals.controller.base_studioset_view.prototype.typeChange = function (id, v) {

		var part = id.match(/\d+/) - 1;

		selectedType[part] = UI_TYPE_INFO[v].str;
		selectedBank[part] = 'PRESET';
		selectedTone[part] = 0;

		//update select list
		toneDataArray[part] = this.parseToneBank(selectedType[part], selectedBank[part]);

		//edit model
		if (toneDataArray[part].length) this.toneChange(id, selectedTone[part]);


		//view update
//		this.typeSelectUpdate();
		this.bankSelectUpdate(part);
		this.toneSelectUpdate(part);
		this.categorySelectUpdate(part);
	};

	globals.controller.base_studioset_view.prototype.bankChange = function (id, v) {

		var part = id.match(/\d+/) - 1;

		selectedBank[part] = bankName[part][v];
		selectedTone[part] = 0;

		//update select list
		toneDataArray[part] = this.parseToneBank(selectedType[part], selectedBank[part]);

		//edit model
		if (toneDataArray[part].length) this.toneChange(pcId.replace(/\d+/, part+1), selectedTone[part]);

		//view update
		this.typeSelectUpdate(part);
//		this.bankSelectUpdate(part);
		this.toneSelectUpdate(part);
		this.categorySelectUpdate(part);
	};

	globals.controller.base_studioset_view.prototype.toneChange = function (id, v) {

		var part = id.match(/\d+/) - 1;

		selectedTone[part] = v;

		toneDataArray[part] = this.parseToneBank(selectedType[part], selectedBank[part]);

		//copy
		var msb = toneDataArray[part][v][TONE_BANK_M];
		var lsb = toneDataArray[part][v][TONE_BANK_L];
		var pc = toneDataArray[part][v][TONE_PC];

		this.curId = msbId.replace(/\d+/, part+1);
		baseCtrl.put(msbId.replace(/\d+/, part+1), msb, false);//msb
		this.curId = lsbId.replace(/\d+/, part+1);
		baseCtrl.put(lsbId.replace(/\d+/, part+1), lsb, false);//lsb
		this.curId = pcId.replace(/\d+/, part+1);
		baseCtrl.put(pcId.replace(/\d+/, part+1), pc, false); //pc
		this.curId = "";

		this.curId = msbId.replace(/\d+/, part+1);
		var d = this.curId;
		addr =  window.parent.globals.controller.base.prototype.getAddr(d);
		window.parent.globals.communicator.dt1(addr, [msb, lsb, pc]);


		this.categorySelectUpdate(part);

	};

	globals.controller.base_studioset_view.prototype.typeSelectUpdate = function (part) {

		var msb = baseCtrl.get(msbId.replace(/\d+/, part+1)).value;//msb
		var lsb = baseCtrl.get(lsbId.replace(/\d+/, part+1)).value;//lsb
		var pc = baseCtrl.get(pcId.replace(/\d+/, part+1)).value;//pc
		var data = getToneInfo(msb, lsb, pc);
		var index = 0;

		if (data.index === undefined ) return; // the state is not right

		$typeSelect[part].empty();

		var doc = '';

		for (var i = 0; i< UI_TYPE_INFO.length; i++) {
			doc += '<option value='+ i + '>' + UI_TYPE_INFO[i].str + "</option>";
		}

		for ( var i in UI_TYPE_INFO) {
			if (UI_TYPE_INFO[i].str === data.type) {
				index = i;
				break;
			}
		}
		$typeSelect[part].append(doc);
		$typeSelect[part].val(index);
	};

	globals.controller.base_studioset_view.prototype.getBankNameArray = function(type, exp){

		var array = [];

		array.push(bankNamePre);
		array.push(bankNameUser);

//		var e = exp;

		var e = exp.slice(0);

		e.sort(
			function(a,b){
				if( a < b ) return -1;
				if( a > b ) return 1;
				return 0;
			}
		);


		/* Expansion */
		switch (type) {
		case "PCM-D":
			if ( isExPCMExist()) {
				array.push(bankNameGM2_EXP);
				array.push(expName[window.parent.SRXID_TTS2][1]);
			} else {
				array.push(bankNameGM2);
				for (var i in e) {
					if (e[i] === window.parent.SRXID_01 ||
						e[i] === window.parent.SRXID_03 ||
						( e[i] >= window.parent.SRXID_05 && e[i] <= window.parent.SRXID_09 ) ) {

						array.push(expName[e[i]][1]);
					//	break;
					}
				}
			}
			break;
		case "PCM-S":
			if ( isExPCMExist()) {
				array.push(bankNameGM2_EXP);
				array.push(expName[window.parent.SRXID_TTS2][1]);
			} else {
				array.push(bankNameGM2);
				for (var i in e) {
					if ( e[i] >= window.parent.SRXID_01 && e[i] <= window.parent.SRXID_12 ) {
						array.push(expName[e[i]][1]);
					//	break;
					}
				}
			}
			break;
		case "SN-A":
			for (var i in e) {
				if (e[i] >= window.parent.SRXID_SN01 &&  e[i] <= window.parent.SRXID_SN05) {
					array.push(expName[e[i]][1]);
					//break;
				}
			}
			break;
		case "SN-S":
			break;
		case "SN-D":
			for (var i in e) {
				if (e[i] === window.parent.SRXID_SN06) {
					array.push(expName[e[i]][1]);
					//break;
				}
			}
			break;
		}

		return array;
	};

	globals.controller.base_studioset_view.prototype.bankSelectUpdate = function(part) {

		var msb = baseCtrl.get(msbId.replace(/\d+/, part+1)).value;//msb
		var lsb = baseCtrl.get(lsbId.replace(/\d+/, part+1)).value;//lsb
		var pc = baseCtrl.get(pcId.replace(/\d+/, part+1)).value;//pc
		var data = getToneInfo(msb, lsb, pc);

		if (data.index === undefined ) return; // the state is not right

		selectedType[part] = data.type;
		selectedBank[part] = data.bank;

		var exp = window.parent.globals.parameter.db.curExpansion;

		bankName[part] = this.getBankNameArray(selectedType[part], exp);

		var index = (function() {
			for (var i in bankName[part]) {
				if (bankName[part][i] === data.bank) {
					return i;
				}
			}
		})();

		$bankSelect[part].empty();
		var doc = '';
		for (var i = 0; i< bankName[part].length; i++) {
			doc += '<option value='+ i + '>' + bankName[part][i] + "</option>";
		}

		$bankSelect[part].append(doc);
		$bankSelect[part].val(index);
	};

	function getNumStr (v) {
		return ('000'+(v+1)).slice(-4) + ' : ';
	};
	
	globals.controller.base_studioset_view.prototype.toneSelectUpdate = function(part) {

		var msb = baseCtrl.get(msbId.replace(/\d+/, part+1)).value;
		var lsb = baseCtrl.get(lsbId.replace(/\d+/, part+1)).value;
		var pc = baseCtrl.get(pcId.replace(/\d+/, part+1)).value;
		var data = getToneInfo(msb, lsb, pc);

		if (data.index === undefined ) return; // the state is not right

		selectedType[part] = data.type;
		selectedBank[part] = data.bank;
		selectedTone[part] = data.index;

		toneDataArray[part] = this.parseToneBank(selectedType[part], selectedBank[part]);

		$toneSelect[part].empty();

		var doc = '';
		for (var i in toneDataArray[part]) {
			doc += '<option value='+ i + '>' + getNumStr(toneDataArray[part][i][TONE_INDEX ]) + toneDataArray[part][i][TONE_NAME] + "</option>";
		}

		$toneSelect[part].append(doc);
		$toneSelect[part].val(selectedTone[part]);

	};

	globals.controller.base_studioset_view.prototype.categorySelectUpdate = function (part) {

		var msb = baseCtrl.get(msbId.replace(/\d+/, part+1)).value;//msb
		var lsb = baseCtrl.get(lsbId.replace(/\d+/, part+1)).value;//lsb
		var pc = baseCtrl.get(pcId.replace(/\d+/, part+1)).value;//pc
		var data = getToneInfo(msb, lsb, pc);

		if (data.index === undefined ) return; // the state is not right

		var index = data.index;

		toneDataArray[part] = this.parseToneBank(selectedType[part], selectedBank[part]);

		if ( data.bank === undefined ) return; // for safty
		if ( index === undefined ) return;
		if ((toneDataArray[part].length) - 1 < index || index < 0 ) return;

		var cate = toneDataArray[part][index][TONE_CATE];
		var cate36 = window.parent.globals.parameter.ToCategory36(cate);
		var nameArray = window.parent.globals.parameter.presetCategory.categoryName2[cate36];

		$categorySelect[part].empty();
		$categorySelect[part].append(nameArray[TONE_SHORT_NAME]);

	};

	globals.controller.base_studioset_view.prototype.parseToneBank = function(type, bank) {

		var presetTone = window.parent.globals.parameter.presetTone;
		var user = window.parent.globals.parameter.db;

		switch (bank) {
		case "PRESET":
			switch (type) {
			case "SN-A":
				return presetTone.snAcousticPreset;
			case "SN-S":
				return presetTone.snSynthPreset;
			case "SN-D":
				return presetTone.snDrumKitPreset;
			case "PCM-S":
				return presetTone.pcmSynthPreset;
			case "PCM-D":
				return presetTone.pcmDrumKitPreset;
			}
			break;
		case "USER":
			switch (type) {
			case "SN-A":
				return user.sna;
			case "SN-S":
				return user.sns;
			case "SN-D":
				return user.snd;
			case "PCM-S":
				return user.pcms;
			case "PCM-D":
				return user.pcmd;
			}
			break;
		case "GM2":
			switch (type) {
			case "PCM-S":
				return presetTone.pcmSynthGm2;
			case "PCM-D":
				return presetTone.pcmDrumKitGm2;
			default:
				return presetTone.pcmSynthGm2;
			}
			break;
		case "GM2#":
			switch (type) {
			case "PCM-S":
				return presetTone.pcmSynthTts2Gm2;
			case "PCM-D":
				return presetTone.pcmDrumKitTts2Gm2;
			default:
				return presetTone.pcmSynthTts2Gm2;
			}
			break;
		case "SRX-02":
		case "SRX-04":
		case "SRX-10":
		case "SRX-11":
		case "SRX-12":
			return eval( 'presetTone.pcmSynthSrx'+ bank.slice(-2));
		case "SRX-01":
		case "SRX-03":
		case "SRX-05":
		case "SRX-06":
		case "SRX-07":
		case "SRX-08":
		case "SRX-09":
			switch (type) {
			case "PCM-S":
				return eval('presetTone.pcmSynthSrx'+bank.slice(-2));
			case "PCM-D":
				var o = eval('presetTone.pcmDrumKitSrx'+bank.slice(-2));
				return o;
			default:
				return eval('presetTone.pcmSynthSrx'+bank.slice(-2));
			}
			break;
		case "ExSN1":
		case "ExSN2":
		case "ExSN3":
		case "ExSN4":
		case "ExSN5":
			return eval('presetTone.snAcousticExpSn0'+bank.slice(-1));
		case "ExSN6":
			return eval('presetTone.snDrumKitExpSn0'+bank.slice(-1));
		case "ExPCM":
			switch (type) {
			case "PCM-S":
				return eval('presetTone.pcmSynthTts2Ex');
			case "PCM-D":
				return eval('presetTone.pcmDrumKitTts2Ex');
			default:
				return eval('presetTone.pcmSynthTts2Ex');
			}
			break;
		default:
			break;
		}
	};

})();

