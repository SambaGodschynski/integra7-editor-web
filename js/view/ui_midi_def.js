//
//  ui_midi_def.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

var TYPE_SNA_MSB 	= [89], 
	TYPE_SNS_MSB	= [95],
	TYPE_SND_MSB 	= [88],
	TYPE_PCMS_MSB 	= [87, 93, 97, 121],
	TYPE_PCMD_MSB 	= [86, 92, 96, 120];

var SNA_INFO = {
	msb : TYPE_SNA_MSB, 
	str : "SN-A"
};

var SNS_INFO = {
	msb : TYPE_SNS_MSB, 
	str : "SN-S"
};

var SND_INFO = {
	msb : TYPE_SND_MSB, 
	str : "SN-D"
};

var PCMS_INFO = {
	msb : TYPE_PCMS_MSB, 
	str : "PCM-S"
};

var PCMD_INFO = {
	msb : TYPE_PCMD_MSB, 
	str : "PCM-D"
};

var UI_TYPE_INFO = [
	SNA_INFO,
	SNS_INFO,
	SND_INFO,
	PCMS_INFO,
	PCMD_INFO
];

var userToneInfo = {
	"SN-A" : 256,
	"SN-S" : 512,
	"SN-D" : 64,
	"PCM-S" : 256,
	"PCM-D" : 32
};

var userToneMsbBank = {
	"SN-A" : 89,
	"SN-S" : 95,
	"SN-D" : 88,
	"PCM-S" : 87,
	"PCM-D" : 86
};
	
var gm2ToneMsbBank = {
	"PCM-S" : 121,
	"PCM-D" : 120
};
	
var gm2EToneMsbBank = {
	"PCM-S" : 121,
	"PCM-D" : 120
};	

var exPcmToneMsbBank = {
	"PCM-S" : 97,
	"PCM-D" : 96
};	

var srxLsbOffset = [
  0,
  1,
  2,
  4,
  7,
  11,
  15,
  19,
  23,
  24,
  26
];

function isExPCMExist() {
	
	var e = window.parent.globals.parameter.db.curExpansion;

	for (var i in e) {
		if (e[i] >= 19) {
			return true;
		}
	}
	return false;
};

/**
 * 	param {Object}  ex) {"PCM-D", "PRESET", 8 }
 */
function getToneMidiInfo(info) {
	
	var type = info.type;
	var bank = info.bank;
	var index = info.index;
	
	var msb, lsb, pc;
	
	if ("USER" === bank) {
		msb = userToneMsbBank[type];
		lsb = parseInt(index/128);
		pc = index % 128;
	} else if ("PRESET" === bank) {
		msb = userToneMsbBank[type];
		lsb = parseInt(index/128) + 64;
		pc = index % 128;
	} else if ("GM2" === bank) {
		msb = gm2ToneMsbBank[type];
		lsb = parseInt(index/128);
		pc = index % 128;
	} else if ("GM2#" === bank) {
		msb = gm2EToneMsbBank[type];
		lsb = parseInt(index/128);
		pc = index % 128;
	} else if ("ExSN6" === bank) {
		msb = 88;
		lsb = 101;
		pc = index;
	} else if (bank.indexOf("ExPCM") >= 0 ) {
		if (type > "PCM-D") {
			msb = 96;
			lsb = 0;
			pc = index;					
		} else {
			msb = 97;
			lsb = parseInt(index/128);
			pc = index % 128;
		}
	} else if (bank.indexOf("SRX") >= 0) {		
		var num = parseInt(bank.slice(-2));		
		if (type > "PCM-D") {
			msb = 92;
			lsb = parseInt(index / 128) + srxLsbOffset[num-1];
			pc = index % 128;			
		} else {
			msb = 93;
			lsb = parseInt(index / 128) + srxLsbOffset[num-1];
			pc = index % 128;	
		}
	} else if (bank.indexOf("ExSN") >= 0) {
		msb = 89;
		lsb = parseInt(index/128) + parseInt(bank.slice(-1))+95;
		pc = index % 128;
	}

	var ret = [msb, lsb, pc];

	return ret;
}

function getToneInfo(msb, lsb, pc) {
	
	var info = {};
	//check user tone
	for (var i in UI_TYPE_INFO) {
		for ( var j in UI_TYPE_INFO[i].msb ) {
			if (UI_TYPE_INFO[i].msb[j] === msb) {
				info.type = UI_TYPE_INFO[i].str;
				switch (info.type) {
				case "SN-A":
					if (lsb <= 1) {
						info.bank = "USER";
						info.index = pc+lsb*128;
					} else if (lsb <= 65){
						info.bank = "PRESET";
						info.index = pc+(lsb-64)*128;
					} else if (lsb >= 96 && lsb <= 100) {
						info.bank = "ExSN"+(lsb - 95);
						info.index = pc;
					}
					break;
				case "SN-S":
					if (lsb <= 3) {
						info.bank = "USER";
						info.index = pc+lsb*128;
					} else if (lsb <= 72){
						info.bank = "PRESET";
						info.index = pc+(lsb-64)*128;
					} 
					break;
				case "SN-D":
					if (lsb <= 1) {
						info.bank = "USER";
						info.index = pc+lsb*128;
					} else if (lsb <= 64){
						info.bank = "PRESET";
						info.index = pc+(lsb-64)*128;
					} else if (lsb === 101) {
						info.bank = "ExSN6";
						info.index = pc;
					}
					break;
				case "PCM-S":
					if (msb === 87) {
						if (lsb <= 1) {
							info.bank = "USER";
							info.index = pc+lsb*128;
						} else if (lsb <= 70){
							info.bank = "PRESET";
							info.index = pc+(lsb-64)*128;
						} 
					} else if (msb === 93 && lsb <= 0) {
						info.bank = "SRX-01";
						info.index = pc+(lsb-0)*128;	
					} else if (msb === 93 && lsb <= 1) {
						info.bank = "SRX-02";
						info.index = pc+(lsb-1)*128;
					} else if (msb === 93 && lsb <= 2) {
						info.bank = "SRX-03";
						info.index = pc+(lsb-2)*128;	
					} else if (msb === 93 && lsb <= 3) {
						info.bank = "SRX-04";
						info.index = pc+(lsb-3)*128;	
					} else if (msb === 93 && lsb <= 6) {
						info.bank = "SRX-05";
						info.index = pc+(lsb-4)*128;	
					} else if (msb === 93 && lsb <= 10) {
						info.bank = "SRX-06";
						info.index = pc+(lsb-7)*128;	
					} else if (msb === 93 && lsb <= 14) {
						info.bank = "SRX-07";
						info.index = pc+(lsb-11)*128;						
					} else if (msb === 93 && lsb <= 18) {
						info.bank = "SRX-08";
						info.index = pc+(lsb-15)*128;		
					} else if (msb === 93 && lsb <= 22) {
						info.bank = "SRX-09";
						info.index = pc+(lsb-19)*128;
					} else if (msb === 93 && lsb <= 23) {
						info.bank = "SRX-10";
						info.index = pc;				
					} else if (msb === 93 && lsb <= 24) {
						info.bank = "SRX-11";
						info.index = pc;
					} else if (msb === 93 && lsb <= 26) {
						info.bank = "SRX-12";
						info.index = pc;				
					} else if (msb === 97) {
						info.bank = "ExPCM";
						info.index = pc+(lsb)*128;				
					} else if (msb === 121) {
						if (isExPCMExist()) {
							info.bank = "GM2#";
							var table = window.parent.globals.parameter.presetTone.pcmSynthTts2Gm2;
							for (var i in table) {
								if (table[i][2] === lsb && table[i][3] === pc) {
									info.index = table[i][0];
									break;
								}			
							}														
						} else {
							info.bank = "GM2";
							var table = window.parent.globals.parameter.presetTone.pcmSynthGm2;
							for (var i in table) {
								if (table[i][2] === lsb && table[i][3] === pc) {
									info.index = table[i][0];
									break;
								}			
							}
						}
					} 
					break;	
				case "PCM-D":
					if (msb === 86) {
						if (lsb <= 1) {
							info.bank = "USER";
							info.index = pc+lsb*128;
						} else if (lsb <= 64) {
							info.bank = "PRESET";
							info.index = pc+(lsb-64)*128;
						} 
					} else if (msb === 92 && lsb <= 0) {
						info.bank = "SRX-01";
						info.index = pc;	
					} else if (msb === 92 && lsb <= 1) {
						info.bank = "SRX-02";
						info.index = pc;
					} else if (msb === 92 && lsb <= 2) {
						info.bank = "SRX-03";
						info.index = pc;	
					} else if (msb === 92 && lsb <= 3) {
						info.bank = "SRX-04";
						info.index = pc;	
					} else if (msb === 92 && lsb <= 6) {
						info.bank = "SRX-05";
						info.index = pc;	
					} else if (msb === 92 && lsb <= 10) {
						info.bank = "SRX-06";
						info.index = pc;	
					} else if (msb === 92 && lsb <= 14) {
						info.bank = "SRX-07";
						info.index = pc;						
					} else if (msb === 92 && lsb <= 18) {
						info.bank = "SRX-08";
						info.index = pc;		
					} else if (msb === 92 && lsb <= 22) {
						info.bank = "SRX-09";
						info.index = pc;
					} else if (msb === 92 && lsb <= 23) {
						info.bank = "SRX-10";
						info.index = pc;				
					} else if (msb === 93 && lsb <= 24) {
						info.bank = "SRX-11";
						info.index = pc;
					} else if (msb === 93 && lsb <= 26) {
						info.bank = "SRX-12";
						info.index = pc;				
					} else if (msb === 96) {
						info.bank = "ExPCM";
						info.index = pc;				
					} else if (msb === 120) {
						if (isExPCMExist()) {
							info.bank = "GM2#";
							var table = window.parent.globals.parameter.presetTone.pcmDrumKitTts2Gm2;
							for (var i in table) {
								if (table[i][2] === lsb && table[i][3] === pc) {
									info.index = table[i][0];
									break;
								}			
							}	
						} else {
							info.bank = "GM2";
							var table = window.parent.globals.parameter.presetTone.pcmDrumKitGm2;
							for (var i in table) {
								if (table[i][2] === lsb && table[i][3] === pc) {
									info.index = table[i][0];
									break;
								}			
							}	
						}
		
					}
					break;	
				}	
			}
		}			
	}

	return info;
}





function getToneType(msb) {
	
	var ret;
	//check user tone
	for (var i in UI_TYPE_INFO) {
		for ( var j in UI_TYPE_INFO[i].msb ) {
			if (UI_TYPE_INFO[i].msb[j] === msb) {
				ret = UI_TYPE_INFO[i].str;	
			}
		}			
	}
	return ret;
}
