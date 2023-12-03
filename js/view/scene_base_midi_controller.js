//
//  midi_util.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

//////////////////////////////////////////////////////////////////////


(function() {

	globals.controller.base_midi = function(){};
	globals.controller.base_midi.prototype = new globals.controller.base();

	var STUDIO_BANK_MSB	= 0x55,
		STUDIO_BANK_LSB	= 0x00,
		REQ_STUDIO_SET_NAME = 0x0F000302,
		REQ_TONE_NAME		= 0x0F000402,
		REQ_INITIALIZE		= 0x0F001800,
		REQ_COPY			= 0x0F001900,
		INIT_RESULT_ADDR = 0x0F001802,
		COPY_RESULT_ADDR	= 0x0F001902,
		INIT_FIXED_DATA		= 0x7F7F0000,
		WRITE_REQ_ADDR		= 0x0F001000,
		WRITE_COMPLETED		= 0x0F001002,
		REQ_LOAD_EXP_ADDR	= 0x0F003000,
		REQ_LOAD_EXP_START_ADDR = 0x0F003001,
		REQ_LOAD_EXP_END_ADDR	= 0x0F003002,
		PREVIEW_ADDR			= 0x0F002000,
		REQ_READ_EXP_ADDR	= 0x0F000010;


	var TYPE_STUDIO_SET	= 0x00,
		TYPE_SOUND_CTRL	= 0x08,
		TYPE_PART			= 0x10,
		TYPE_TONE			= 0x20,
		TYPE_PARTIAL		= 0x30;


	var isEOD = function (data) {
		var d = data.slice(0, 42);
		for (var i = 0; i < d.length; i++) {
			if (d.charAt(i) != '0') return false;
		}
		return true;
	};
	var isResult = function (data, info) {
		var d = data.slice(0, 6);
		if (d === "000000") {
			return true; // finished!
		}
		return false;
	};
	var isCompleted = function (data) {
		var d = data.slice(6, 8);
		if (d === "00") {
			return true; // finished!
		}
		return false;
	};

	/**
	*	param{Number} bankLSB
	*	param{Number} pc
	*/
	var bankToToneNum = function (bankLSB, pc ){
		return 128 * bankLSB + pc;
	};

	/**
	*	param{Number} num
	*	return{Object} tone
	*/
	var toneNumToBank = function (num) {
		var tone = {
			banklsb : num / 128,
			pc : num % 128
		};
		return tone;
	};

	var intervalHdr = null;
	var intervalCount = 0;
	

	globals.controller.base_midi.prototype.read_quick = function (next) {

		var ctrl = this;
		ctrl.readExpansion();
		
		function readNames() {
			switch (intervalCount) {
			case 0: ctrl.readStudiosetNameAll();
				break;
			case 1: ctrl.readUserToneName("SN-A");
				break;
			case 2: ctrl.readUserToneName("SN-S");
				break;
			case 3: ctrl.readUserToneName("SN-D");
				break;
			case 4: ctrl.readUserToneName("PCM-S");
				break;
			case 5: ctrl.readUserToneName("PCM-D");
				break;
			default:
				clearInterval(intervalHdr);
				intervalHdr = null;
				if (next) {
					setTimeout(next, 2000);
				}
			}
			intervalCount++;
		}
		intervalCount = 0;
		intervalHdr = setInterval(readNames, 200);

	};
	
	/**
	*	param{function} next
	*/
	globals.controller.base_midi.prototype.read = function (next) {

		var ctrl = this;

		window.parent.globals.parameter.db.readPartFlag = 0;
/*	
		ctrl.readExpansion();
		
		function readNames() {
			switch (intervalCount) {
			case 0: ctrl.readStudiosetNameAll();
				break;
			case 1: ctrl.readUserToneName("SN-A");
				break;
			case 2: ctrl.readUserToneName("SN-S");
				break;
			case 3: ctrl.readUserToneName("SN-D");
				break;
			case 4: ctrl.readUserToneName("PCM-S");
				break;
			case 5: ctrl.readUserToneName("PCM-D");
				break;
			default:
				clearInterval(intervalHdr);
				intervalHdr = null;
				if (next) {
					setTimeout(next, 1000);
				}
			}
			intervalCount++;
		}
		intervalCount = 0;
		intervalHdr = setInterval(readNames, 1000);
*/
		ctrl.readExpansion();
		
		this.readStudiosetNameAll( function () {
			$("#readPrg").progressbar('value', 4);
			ctrl.readUserToneName("SN-A", function () {
				$("#readPrg").progressbar('value', 12);
				ctrl.readUserToneName("SN-S", function () {		
					$("#readPrg").progressbar('value', 22);
					ctrl.readUserToneName("SN-D", function (){
						$("#readPrg").progressbar('value', 24);
						ctrl.readUserToneName("PCM-S" , function () {
							$("#readPrg").progressbar('value', 26);
							ctrl.readUserToneName("PCM-D", function (){
								ctrl.readExpansion( function () {
									$("#readPrg").progressbar('value', 29);
									//finished
									if (next) {
										setTimeout(next, 1000); /* */
									}
								});
							});
						});
					});
				});
			});
		});

	};


	var SEND_INTERVAL = 1;
	/**
	*	param{function} next
	*/
	globals.controller.base_midi.prototype.readStudiosetNameAll = function (next) {

		var com = globals.communicator;
		var prm = globals.prm;
		var READ_SIZE = 0x40;

		var size =  (STUDIO_BANK_MSB << 24) +
					(STUDIO_BANK_LSB << 16) +
					(0x00 << 8) + READ_SIZE;

		var func = function(data) {
			if (isEOD(data)) {
				if (next) {
					setTimeout(next, SEND_INTERVAL);
				}
				return false;
			}

			var num = data.slice(4, 6);
			var str = data.slice(10, 10+2*16); //16????

			num = parseInt(num, 16);

			var text = [];
			for (var i=0 ; i < str.length; i += 2 ) {
				text += String.fromCharCode(parseInt(str.slice(i,i+2), 16));
			}

			var o = { text : text };
			globals.parameter.putValName("studioSet", num, o);

			return true;

		};

		var sendInfo = {
			addr : REQ_STUDIO_SET_NAME,
			size : size,
			func : func
		};

		com.rq1(sendInfo);
	};


	/*
	*	param{String} type  ex) 'SN-A' ..
	*	param{function} next
	*/
	globals.controller.base_midi.prototype.readUserToneName = function (type, next) {
		var SEND_SIZE = 0x40;

		var com = globals.communicator;
		var size = userToneInfo[type];
		var bankMsb = userToneMsbBank[type];
		var sendSize = Math.floor(size /  SEND_SIZE);
		var lastSendSize = size %  SEND_SIZE;

		var index = 0;
		var tx_size = 0;

		var sendFunc = function () {

			var d = bankMsb * (1 << 24) +
			Math.floor(index/2) * (1 << 16) +
			(index %2) * SEND_SIZE * ( 1 << 8) + tx_size;

			var sendInfo = {
				addr : REQ_TONE_NAME,
				size : d,
				func : func
			};
			com.rq1(sendInfo);
		};

		var func = function(data) {

			if (isEOD(data)) {
				index++;
				if (index < sendSize) {
		//			setTimeout( sendFunc, SEND_INTERVAL, index, SEND_SIZE );
					tx_size =  SEND_SIZE;
					setTimeout( sendFunc, SEND_INTERVAL);
		//			var F = function() {sendFunc(index, SEND_SIZE); }
		//			setTimeout(F, SEND_INTERVAL);
				//	sendFunc(index, SEND_SIZE);
				} else {
					if (lastSendSize === 0) {
						if (next) {
							setTimeout( next, SEND_INTERVAL );
						}
					} else {
						if (index === sendSize) {
		//					setTimeout( sendFunc, SEND_INTERVAL, index, lastSendSize );
							tx_size =  lastSendSize;
							setTimeout( sendFunc, SEND_INTERVAL);
		//					sendFunc(index, lastSendSize);
		//					var F_Last = function() {sendFunc(index, lastSendSize); }
		//					setTimeout(F_Last, SEND_INTERVAL);
						} else {
							if (next) {
								setTimeout( next, 250 );

							}
						}
					}
				}
				return false;
			}

			var Msb	= data.slice(0, 2);
				Msb	= parseInt(Msb, 16);
			var lsb	= data.slice(2, 4);
				lsb	= parseInt(lsb, 16);
			var pc		= data.slice(4, 6);
				pc		= parseInt(pc, 16);
			var cate	= data.slice(6, 8);
				cate	= parseInt(cate, 16);

			var str		= data.slice(10, 10+2*16);
			var text	= [];
			var num	= bankToToneNum(lsb, pc);

			for (var i=0 ; i < str.length; i += 2 ) {
				text += String.fromCharCode(parseInt(str.slice(i,i+2), 16));
			}
			cate = window.parent.globals.parameter.ToCategory50(cate);
							// index   msb lsb pc cate  name
			var toneInfo = [ num, -1, -1, -1, cate, text];


			var type;
			for (var i in userToneMsbBank) {
				if ( userToneMsbBank[i] === Msb) {
					type = i;
					break;
				}
			}

			window.parent.globals.parameter.putValName(type, num, toneInfo);

			return true;
		};
		tx_size = (sendSize) ?  SEND_SIZE : lastSendSize;
		sendFunc();

	};

	globals.controller.base_midi.prototype.studioSetInit = function (next) {
		var com = globals.communicator;
		var size =  INIT_FIXED_DATA;
		var func = function(data) {
			if (isResult(data)) {
				var completed = isCompleted(data);
				if (completed) {
					//completed
					if (next) {
						setTimeout( next, 250 );
					}
				} else {
					//
				}
				return false;
			}
			return true;
		};

		var sendInfo = {
			addr : REQ_INITIALIZE + TYPE_STUDIO_SET,
			size : size,
			func : func,
			dt1addr : INIT_RESULT_ADDR
		};

		com.rq1(sendInfo);
	};

	globals.controller.base_midi.prototype.soundCtrlInit = function () {
		var com = globals.communicator;
		var size =  INIT_FIXED_DATA;
		var func = function(data) {
			if (isResult(data)) {
				var completed = isCompleted(data);
				if (completed) {
					//completed
				} else {
					//
				}
				return false;
			}
			return true;
		};
		var sendInfo = {
			addr : REQ_INITIALIZE + TYPE_SOUND_CTRL,
			size : size,
			func : func,
			dt1addr : INIT_RESULT_ADDR
		};
		com.rq1(sendInfo);
	};

	globals.controller.base_midi.prototype.partInit = function (next) {
		var num = globals.parameter.db.curPart;
		if (arguments.length === 1) {
			num = arguments[0];
		}
		var com = globals.communicator;
		var size = INIT_FIXED_DATA + (num << 8);
		var func = function(data) {
			if (isResult(data)) {
				var completed = isCompleted(data);
				if (completed) {
					//completed
					if (next) {
						setTimeout( next, SEND_INTERVAL );
					}
				} else {
					//
				}
				return false;
			}
			return true;
		};
		var sendInfo = {
			addr : REQ_INITIALIZE + TYPE_PART,
			size : size,
			func : func,
			dt1addr : INIT_RESULT_ADDR
		};
		com.rq1(sendInfo);
	};

	globals.controller.base_midi.prototype.toneInit = function (next) {
		var num = globals.parameter.db.curPart;
		if (arguments.length === 1) {
			num = arguments[0];
		}
		var com = globals.communicator;
		var size =  INIT_FIXED_DATA +  (num << 8);
		var func = function(data) {
			if (isResult(data)) {
				var completed = isCompleted(data);
				if (completed) {
					//completed
					if (next) {
						setTimeout( next, SEND_INTERVAL );
					}
				} else {
					//
				}
				return false;
			}
			return true;
		};
		var sendInfo = {
			addr : REQ_INITIALIZE + TYPE_TONE,
			size : size,
			func : func,
			dt1addr : INIT_RESULT_ADDR
		};
		com.rq1(sendInfo);
	};

	/*
	*	param {Number} partial
	*/
	globals.controller.base_midi.prototype.partialInit = function ( next) {
		var partial = globals.parameter.db.selectedPartial;
		var com = globals.communicator;
		var num = globals.parameter.db.curPart;

		var type = globals.controller.utility.getCurTone().type;


		var size =  INIT_FIXED_DATA + (num << 8) + partial;
		var info = {};
		var func = function(data) {
			if (isResult(data, info)) {
				var completed = isCompleted(data);
				if (completed) {
					if (next) {
						setTimeout( next, SEND_INTERVAL );
					}
				} else {
					//
				}
				return false;
			}
			return true;
		};
		var sendInfo = {
			addr : REQ_INITIALIZE + TYPE_PARTIAL,
			size : size,
			func : func,
			dt1addr : INIT_RESULT_ADDR
		};
		com.rq1(sendInfo);
	};

	/**
	*	param {Number} bankMsb
	*	param {Number} bankLsb
	*	param {Number} srcPc
	*	param {Number} srcPartial
	*	param {Number} destPartial
	*/
	globals.controller.base_midi.prototype.partialCopy = function (bankMsb, bankLsb, srcPc, srcPartial, destPartial) {
//		partialCopy : function (bankType, srcToneNum, srcPartialNum, destPartiaNum) {
		var num = globals.parameter.db.curPart;
		var msb = STUDIO_BANK_MSB;
		var lsb = STUDIO_BANK_LSB;
		var size =	bankMsb * ( 1 << (8 * 5)) +
					bankLsb * ( 1 << (8 * 4)) +
					num * ( 1 << (8 * 3)) +
					srcPartial * ( 1 << (8 * 2)) +
					num   * ( 1 << (8 * 1)) +
					destPartial * (1 << (8 * 0));

		var func = function(data) {
			if (isCopyResult(data, info)) {
				var completed = isCompleted(data);
				if (completed) {
					//completed
				} else {
					//
				}
				return false;
			}
			return true;
		};

		var sendInfo = {
			addr : REQ_COPY + TYPE_PARTIAL,
			size : size,
			func : func,
			bytes : 6,
			dt1addr : INIT_RESULT_ADDR
		};
		com.rq1(sendInfo);
	};


	globals.controller.base_midi.prototype.writeTone = function(val, type, next)
	{
		var com = globals.communicator;
		var num = val;
		var part = window.parent.globals.parameter.db.curPart;
		var bank = userToneMsbBank[type];
		var lsb = Math.floor(num / 128);
		var pc = (num % 128);
		var size = bank * ( 1 << 24 ) + lsb * (1 << 16) + pc * (1 << 8) + part;

		var func = function(data) {
			if (next) {
				setTimeout(next, SEND_INTERVAL);
			}
			return false;
		};

		var sendInfo = {
			addr : WRITE_REQ_ADDR,
			size : size,
			func : func,
			dt1addr : WRITE_COMPLETED
		};

		com.rq1(sendInfo);

	};

	globals.controller.base_midi.prototype.writeStudioset = function(val, next)
	{
		var com = globals.communicator;
		var num = parseInt(val.match(/\d+/), 10) - 1;

		var bank = STUDIO_BANK_MSB;
		var lsb = num;
		var part = 0x7F;
		var size = bank*(1<<24) + num*(1 << 8) + part;


		var func = function(data) {
			if (next) {
				setTimeout(next, SEND_INTERVAL);
			}
			return false;
		};

		var sendInfo = {
			addr : WRITE_REQ_ADDR,
			size : size,
			func : func,
			dt1addr : WRITE_COMPLETED
		};


		com.rq1(sendInfo);
	};


	globals.controller.base_midi.prototype.loadExpansion = function (a, b, c, d, next) {

		var com = globals.communicator;

		var size = a * (1 << 24) +
					b * (1 << 16) +
					c * (1 << 8 ) +
					d;

		var sendInfo = {
			addr : REQ_LOAD_EXP_ADDR,
			size : size,
			func : function (data) {
				if (next) {
					setTimeout(next, 50);
				}
				return false;
			},
			dt1addr : REQ_LOAD_EXP_END_ADDR
		};
		com.rq1(sendInfo);
	};

	globals.controller.base_midi.prototype.readExpansion = function (next) {

		var com = globals.communicator;
		var size = 0x0;
		var sendInfo = {
			addr : REQ_READ_EXP_ADDR,
			size : size,
			func : function (data) {
				var d = [
					parseInt( data.slice(0, 2), 16),
					parseInt( data.slice(2, 4), 16),
					parseInt( data.slice(4, 6), 16),
					parseInt( data.slice(6, 8), 16)
				];
				window.parent.globals.parameter.db.curExpansion = d;

				if (next) {
					setTimeout(next, SEND_INTERVAL);
				}
				return false;
			}
		};
		com.rq1(sendInfo);
	};

	globals.controller.base_midi.prototype.preview = function (part) {

		var d;
		if (part === -1) {
			d = 0;
		} else {
			d = part+1;
		}
		var com = globals.communicator;

		com.dt1(PREVIEW_ADDR, [d]);

	};

	globals.controller.base_midi.prototype.getCurTone = function() {

			var id = "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB";
			var part = window.parent.globals.parameter.db.curPart;

			var msb = globals.model.getValue(this.getAddr(id.replace(/\d+/, part+1)));

			id = "PRM-_PRF-_FP1-NEFP_PAT_BS_LSB";
			var lsb = globals.model.getValue(this.getAddr(id.replace(/\d+/, part+1)));

			id = "PRM-_PRF-_FP1-NEFP_PAT_PC";
			var pc = globals.model.getValue(this.getAddr(id.replace(/\d+/, part+1)));

			var info = {};

			info = getToneInfo(msb, lsb, pc);

			return info; /* info.type, info.group, info.index */
	};

	globals.controller.base_midi.prototype.putCurTone = function (info) {

			if (!info.type) {
				info.type = this.getCurToneType();
			}
			if (!info.group) {
				info.group = this.getCurToneGroup();
			}

			var data = getToneMidiInfo(info);

			var msb = data[0];
			var lsb = data[1];
			var pc = data[2];

			var part = window.parent.globals.parameter.db.curPart;

			var msbAddr = this.getAddr("PRM-_PRF-_FP1-NEFP_PAT_BS_MSB".replace(/\d+/, part+1));
			globals.model.put(msbAddr, msb, false);

			var lsbAddr = this.getAddr("PRM-_PRF-_FP1-NEFP_PAT_BS_LSB".replace(/\d+/, part+1));
			globals.model.put(lsbAddr, lsb, false);

			var pcAddr = this.getAddr("PRM-_PRF-_FP1-NEFP_PAT_PC".replace(/\d+/, part+1));
			globals.model.put(pcAddr, pc, false);

			window.parent.globals.communicator.dt1(msbAddr, [msb, lsb, pc]);

	};

	globals.controller.base_midi.prototype.getCurToneType = function() {
			var info = this.getCurTone();
			return info.type;
	};


	globals.controller.base_midi.prototype.getCurToneGroup = function() {
			var info = this.getCurTone();
			return info.group;
	};

	globals.controller.base_midi.prototype.typeToNameID = {
		'PCM-S' : "PRM-_FPART1-_PAT-_PC-RFPC_NAME",
		'PCM-D' : "PRM-_FPART1-_RHY-_RC-RFRC_NAME",
		'SN-A'  : "PRM-_FPART1-_SNTONE-_SNTC-SNTC_NAME",
		'SN-S'  : "PRM-_FPART1-_SHPAT-_SHPC-SHPC_NAME",
		'SN-D'  : "PRM-_FPART1-_KIT-_KC-SDKC_NAME"
	};


	globals.controller.base_midi.prototype.requestPartParam = function () {

		var part = globals.parameter.db.curPart;
		var tone = this.getCurTone();

		globals.model.abortRead();

		switch (tone.type) {
		case "SN-A":
			globals.model.read("PRM-_FPART" + (part+1) +  '-_SNTONE');
			break;
		case "SN-D":
			globals.model.read("PRM-_FPART" + (part+1) + '-_KIT');
			break;
		case "SN-S":
			globals.model.read("PRM-_FPART" + (part+1) + '-_SHPAT');
			break;
		case "PCM-S":
			globals.model.read("PRM-_FPART" + (part+1) +  '-_PAT');
			break;
		case "PCM-D":
			globals.model.read("PRM-_FPART" + (part+1) +  '-_RHY');
			break;
		}
	};

})();
