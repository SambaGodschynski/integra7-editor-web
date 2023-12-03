//
//  parameter.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

//////////////////////////////////////////////////////////////////////



var TONE_DATA_ARRAY_INDEX 		= 0,
	TONE_DATA_ARRAY_BANK_MSB 	= 1,
	TONE_DATA_ARRAY_BANK_LSB 	= 2,
	TONE_DATA_ARRAY_BANK_PC 	= 3,
	TONE_DATA_ARRAY_CATEGORY	= 4,
	TONE_DATA_ARRAY_NAME		= 5;


(function() {

	var initDB = function() {
		var range;
		range = globals.parameter.range("studioSet");

		for ( var i = range.min - 1; i <= range.max - 1; i++) {
			(function(i) {
				globals.parameter.db.studioSet[i] = globals.parameter.initStudioName;
			})(i);
		}

		var bank = {
				"SN-A" : 0x59,
				"SN-S" : 0x5F,
				"SN-D" : 0x58,
				"PCM-S" : 0x57,
				"PCM-D" : 0x56
		};

		range = globals.parameter.range("SN-A");
		for ( var i = range.min - 1; i <= range.max - 1; i++) {
			(function(i) {
				globals.parameter.db.sna[i] =
					[ i, bank["SN-A"], parseInt(i/0x80), (i%0x80), globals.parameter.initToneName.cate, globals.parameter.initToneName.text];
			})(i);
		}

		range = globals.parameter.range("SN-S");
		for ( var i = range.min - 1; i <= range.max - 1; i++) {
			(function(i) {
				globals.parameter.db.sns[i] =
					[ i, bank["SN-S"], parseInt(i/0x80), (i%0x80), globals.parameter.initToneName.cate, globals.parameter.initToneName.text];
			})(i);
		}

		range = globals.parameter.range("SN-D");
		for ( var i = range.min - 1; i <= range.max - 1; i++) {
			(function(i) {
				globals.parameter.db.snd[i] =
					[ i, bank["SN-D"], parseInt(i/0x80), (i%0x80), globals.parameter.initToneName.cate, globals.parameter.initToneName.text];
			})(i);
		}
		range = globals.parameter.range("PCM-S");
		for ( var i = range.min - 1; i <= range.max - 1; i++) {
			(function(i) {
				globals.parameter.db.pcms[i] =
					[ i, bank["PCM-S"], parseInt(i/0x80), (i%0x80), globals.parameter.initToneName.cate, globals.parameter.initToneName.text];
			})(i);
		}

		range = globals.parameter.range("PCM-D");
		for ( var i = range.min - 1; i <= range.max - 1; i++) {
			(function(i) {
				globals.parameter.db.pcmd[i] =
					[ i, bank["PCM-D"], parseInt(i/0x80), (i%0x80), globals.parameter.initToneName.cate, globals.parameter.initToneName.text];
			})(i);
		}

	};

	globals.parameter = {
		wave : [],
		phrase : [],
		scaleTbl : [],
		presetTone : [],
		wavePreset : [],
		presetCategory : [],
		presetExp  : [],
		snaInstPreset : [],
		sndInstPreset : [],
		initStudioName : {
			text : "INIT"
		},
		initToneName : {
			text : "INIT",
			cate : 1
		},

		db : {
			toneCopy : { // for edit
				srcGroup : 'PRESET', // for edit
				srcTone : 0, // for edit
				srcPartial : 0, // for edit
				destPartial : 0
			// for edit
			}, // for edit
			selectedTone : 0, // for edit
			selectedStudioset : 0, // for edit
			selectedToneType : "SN-A", // for edit
			selectedPartial : 0, // for edit
			curCursor : 0,
			curPart : 0,
			sndCurPartial : 36,
			pcmdCurPartial : 36,
			snsSelectedPartial : [0, 0, 0],
			pcmsSelectedPartial : [0, 0, 0, 0],
			pcmdSelectedWave : [0, 0, 0, 0],
			studioSet : [],
			sna : [],
			sns : [],
			snd : [],
			pcms : [],
			pcmd : [],
			studioPartContents : null,
			effectPartContents : null,
			effectMasterContents : null,
			tonePcmsContents : null,
			curContents : "studioset",
			curExpansion : [ 0, 0, 0, 0],
			curExtPartSw : false,
			effectsAnchor : '',
			contentsAreaScene : {},
			midiErrorFlg : 0,
			readPartFlag : 0,
			pcmsWaveList : [0, 0, 0, 0],
			pcmdWaveList : [0, 0, 0, 0]
		},
		/**
		 * param {string} id
		 */
		get : function(id) {
			switch (id) {
			case "curPart":
				return this.db.curPart;
			}
			return 0;
		},
		/**
		 * param {string} id param {number} val
		 */
		put : function(id, val) {

			var r = this.range(id);

			if (r.min > val) {
				val = r.min;
			} else if (r.max < val) {
				val = r.max;
			}

			switch (id) {
			case "curPart":
				this.db.curPart = val;
			}
		},
		/**
		 * param {string} id param {number} val
		 */
		getValName : function(id, val, subVal) {
			switch (id) {
			case "studioSet":
				return this.db.studioSet[val - 1];
			}
		},

		/**
		 * param {string} id param {string} str or object
		 */
		putValName : function(id, val, param) {
			switch (id) {
			case "studioSet":
				this.db.studioSet[val] = param;
				break;
			case "SN-A":
				for (var i in param) {
					if (param[i] !== -1) {
						this.db.sna[val][i] = param[i];
					}
				}
				break;
			case "SN-S":
				for (var i in param) {
					if (param[i] !== -1) {
						this.db.sns[val][i] = param[i];
					}
				}
				break;
			case "SN-D":
				for (var i in param) {
					if (param[i] !== -1) {
						this.db.snd[val][i] = param[i];
					}
				}
				break;
			case "PCM-S":
				for (var i in param) {
					if (param[i] !== -1) {
						this.db.pcms[val][i] = param[i];
					}
				}
				break;
			case "PCM-D":
				for (var i in param) {
					if (param[i] !== -1) {
						this.db.pcmd[val][i] = param[i];
					}
				}
				break;
			default:
				break;
			}
		},
		/**
		 * param {string} id
		 */
		range : function(id) {
			var range = {
				min : 0,
				max : 127
			};
			switch (id) {
			case "curPart":
				range.min = 1;
				range.max = 16;
				break;
			case "studioSet":
				range.min = 1;
				range.max = 64;
				break;
			case "SN-A":
				range.min = 1;
				range.max = 256;
				break;
			case "SN-S":
				range.min = 1;
				range.max = 512;
				break;
			case "SN-D":
				range.min = 1;
				range.max = 64;
				break;
			case "PCM-S":
				range.min = 1;
				range.max = 256;
				break;
			case "PCM-D":
				range.min = 1;
				range.max = 32;
				break;
			default:
				break;
			}
			return range;
		},

		getStudioSetNames : function() {
			return this.db.studioSet;
		},

		/**
		 * param{String} id
		 */
		getNameObject : function(id) {
			switch (id) {
			case "studioSet":
				return this.db.studioSet;
			case "SN-A":
				return this.db.sna;
			case "SN-S":
				return this.db.sns;
			case "SN-D":
				return this.db.snd;
			case "PCM-S":
				return this.db.pcms;
			case "PCM-D":


				return this.db.pcmd;
			default:
				break;
			}
		},
		getCurToneInfo : function(type, num) {
			switch (type) {
			case "SN-A":
				return this.db.sna[num][TONE_DATA_ARRAY_NAME];
			case "SN-S":
				return this.db.sns[num][TONE_DATA_ARRAY_NAME];
			case "SN-D":
				return this.db.snd[num][TONE_DATA_ARRAY_NAME];
			case "PCM-S":
				return this.db.pcms[num][TONE_DATA_ARRAY_NAME];
			case "PCM-D":
				return this.db.pcmd[num][TONE_DATA_ARRAY_NAME];
			default:
				break;
			}
		},

		startup : function(func) {
			var midi = new globals.controller.base_midi();			
			midi.read_quick(function () {
				if (func) 
					func();
			});	
		}

	};

	initDB();

})();