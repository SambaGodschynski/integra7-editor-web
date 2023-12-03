//
//  expansion_name.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

var	SRXID_NONE 	=	 0;
var	SRXID_01	=	 1;
var	SRXID_02	=	 2;
var	SRXID_03	=	 3;
var	SRXID_04	=	 4;
var	SRXID_05	=	 5;
var	SRXID_06	=	 6;
var	SRXID_07	=	 7;
var	SRXID_08	=	 8;
var	SRXID_09	=	 9;
var	SRXID_10	=	10;
var	SRXID_11	=	11;
var	SRXID_12	=	12;
var	SRXID_SN01	=	13;
var	SRXID_SN02	=	14;
var	SRXID_SN03	=	15;
var	SRXID_SN04	=	16;
var	SRXID_SN05	=	17;
var	SRXID_SN06	=	18;
var	SRXID_TTS2	=	19;
                 

(function() {
	// ID, string, name
	// -------------------------------------------------------
	globals.parameter.presetExp.expansionName = [
		["NO ASSIGN",			"",			],
		["Dynamic Drum Kits",	"SRX-01",	],
		["Concert Piano",		"SRX-02",	],
		["Studio SRX",			"SRX-03",	],
		["Symphonique Strings",	"SRX-04",	],
		["Supreme Dance",		"SRX-05",	],
		["Complete Orchestra",	"SRX-06",	],
		["Ultimate Keys",		"SRX-07",	],
		["Platinum Trax",		"SRX-08",	],
		["World Collection",	"SRX-09",	],
		["Big Brass Ensemble",	"SRX-10",	],
		["Complete Piano",		"SRX-11",	],
		["Classic EPs",			"SRX-12",	],
		["Ethnic",				"ExSN1",	],
		["Wood Winds",			"ExSN2",	],
		["Session",				"ExSN3",	],
		["A.Guitar",			"ExSN4",	],
		["Brass",				"ExSN5",	],
		["SFX",					"ExSN6",	],
		["ExPCM",				"ExPCM",	]
	];
	
	
	var t = window.parent.globals.parameter.presetTone;
	globals.parameter.presetExp.expansionArray = [
		[  null,				null		     	],     // SRXID_NONE
		[  t.pcmSynthSrx01, 	t.pcmDrumKitSrx01  	],     // SRXID_01
		[  t.pcmSynthSrx02,		null		    	],     // SRXID_02
		[  t.pcmSynthSrx03,		t.pcmDrumKitSrx03  	],     // SRXID_03
		[  t.pcmSynthSrx04,	    null		     	],     // SRXID_04
		[  t.pcmSynthSrx05,     t.pcmDrumKitSrx05  	],     // SRXID_05
		[  t.pcmSynthSrx06,     t.pcmDrumKitSrx06  	],     // SRXID_06
		[  t.pcmSynthSrx07,     t.pcmDrumKitSrx07  	],     // SRXID_07
		[  t.pcmSynthSrx08,     t.pcmDrumKitSrx08  	],     // SRXID_08
		[  t.pcmSynthSrx09,     t.pcmDrumKitSrx09  	],     // SRXID_09
		[  t.pcmSynthSrx10,    	null			 	],     // SRXID_10
		[  t.pcmSynthSrx11, 	null		     	],     // SRXID_11
		[  t.pcmSynthSrx12, 	null		     	],     // SRXID_12
		[  t.snAcousticExpSn01,	null	         	],     // SRXID_SN01
		[  t.snAcousticExpSn02, null     			],     // SRXID_SN02
		[  t.snAcousticExpSn03, null	     		],     // SRXID_SN03
		[  t.snAcousticExpSn04, null	     		],     // SRXID_SN04
		[  t.snAcousticExpSn05, null	     		],     // SRXID_SN05
		[  null,				t.snDrumKitExpSn06 	],     // SRXID_SN06
		[  null, 				null			 	],     // SRXID_TTS2
	];  

})();
                                  