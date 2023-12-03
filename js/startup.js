//
//	startup.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//


$(function() {

	function quickSync() {                   
	
		var list = [];		
    	var msbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB";

    	for (var part = 0; part < 16 ; part++) {	
			var msb = window.parent.globals.controller.base.prototype.getVal(msbId.replace(/\d+/, part+1));
			var type = getToneType(msb);
					
			switch (type) {
			case "SN-A":
				list.push("PRM-_FPART" + (part+1) +  '-_SNTONE');
				break;
			case "SN-D":
				list.push("PRM-_FPART" + (part+1) +  '-_KIT');
				break;
			case "SN-S":
				list.push("PRM-_FPART" + (part+1) +  '-_SHPAT');
				break;
			case "PCM-S":
				list.push("PRM-_FPART" + (part+1) +  '-_PAT');
				break;
			case "PCM-D":
				list.push("PRM-_FPART" + (part+1) +  '-_RHY');
				break;
			}								
		}							               
     
      	var F = function() {
    		globals.model.sync(                	
           		"PRM-_SETUP",
				"PRM-_SYS",	
				"PRM-_PRF",						
				list[0], list[1], list[2], list[3],
				list[4], list[5], list[6], list[7],
				list[8], list[9], list[10], list[11],
				list[12], list[13], list[14], list[15]
    		);
    	};
    	
    	globals.controller.base_midi.prototype.read_quick(F);  
    	
	}
	
	var startupRead = true;
	var app = new Application();
	if (app.delegate) {
		app.delegate({
			applicationOnRestart: init,
			applicationOnStop: exit,

			editorGetState: function() {
				var state = {};
				state.model = globals.model.getData();
				state.expan = globals.parameter.db.curExpansion;
				app.result(JSON.stringify(state));
			},

			editorSetState: function(param) {
				globals.model.reset();
                if (param) {                	
                	var state = JSON.parse(decodeURIComponent(param));
                     if (param.charAt(0) === '[' ) { /* old data  */
                        globals.model.setData(state);
                     } else {
                        globals.model.setData(state.model);
                        
                        if (state.expan) {
                            var exp = state.expan;   
                            
                        	globals.communicator.clear_rq1();
                        	
                            globals.controller.base_midi.prototype.readExpansion( function (){    
                            	var cur = globals.parameter.db.curExpansion;                            	
//                            	alert("CUR" + cur);                            	
//                           	alert("SAVED" + exp);
                            	if ( cur[0] == exp[0] && cur[1] == exp[1] && 
                            			cur[2] == exp[2] && cur[3] == exp[3]) {                            	
                            		quickSync();	                            		
                            	} else {     
                               		globals.controller.base_midi.prototype.loadExpansion(exp[0], exp[1], exp[2], exp[3], quickSync);
                            	}	
                            });		
                     	}
                     }  	
                }
			}
		});
		if (window.native) {
			init();
		}
		app.ready();
	}

	function init() {
		
		
		globals.pref = app.loadState();

		if ('deviceId' in globals.pref) {
			var val = globals.pref.deviceId;
			globals.communicator.deviceId(val);
		} else {
			startupRead = false;
		}
				
		var devs = 0;
		if ('device' in globals.pref) {
			devs = globals.pref.device.length;
		} else {
			startupRead = false;
		}
		if (devs > 0) {
			for (var i = 0; i < devs; i++) {
				globals.device.connect(globals.pref.device[i]);
			}
		}

//		if (startupRead) 
//			globals.parameter.startup();
		
	}

	function exit() {
		globals.pref.device = globals.device.current();
		globals.pref.deviceId = globals.communicator.deviceId(); 
		globals.device.disconnect();
		app.saveState(globals.pref);
	}
	
	globals.parameter.saveMidiSetting = function() {
		globals.pref.device = globals.device.current();
		globals.pref.deviceId = globals.communicator.deviceId(); 
		app.saveState(globals.pref);
	};

	if (!window.native) {
		/* deffered initialization for WebMIDIAPI.js */
		window.setTimeout(init, 100);
	}
});
