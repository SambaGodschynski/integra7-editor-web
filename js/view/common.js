//
//  common.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

	window.parent.globals.parameter.snaCategoryArray = [
		{'text':'No Assign'},
		{'text':'Piano'},
		{'text':'E.Piano'},
		{'text':'Organ'},
		{'text':'Keyboards'},
		{'text':'Accordion/Harmonica'},
		{'text':'Bell/Mallet'},
		{'text':'A.Guitar'},
		{'text':'E.Guitar'},
		{'text':'Dist.Guitar'},
		{'text':'A.Bass'},
		{'text':'E.Bass'},
		{'text':'Synth Bass'},
		{'text':'Plucked/Stroke'},
		{'text':'Strings'},
		{'text':'Brass'},
		{'text':'Wind'},
		{'text':'Flute'},
		{'text':'Sax'},
		{'text':'Recorder'},
		{'text':'Vox/Choir'},
		{'text':'Synth Lead'},
		{'text':'Synth Brass'},
		{'text':'Synth Pad/Strings'},
		{'text':'Synth Bellpad'},
		{'text':'Synth Polykey'},
		{'text':'FX'},
		{'text':'Synth Seq/Pop'},
		{'text':'Phrase'},
		{'text':'Pulsating'},
		{'text':'Beat & Groove'},
		{'text':'Hit'},
		{'text':'Sound FX'},
		{'text':'Drums'},
		{'text':'Percussion'},
		{'text':'Combination'}
	];

	var msbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB";
	var lsbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_LSB";
	var pcId = "PRM-_PRF-_FP1-NEFP_PAT_PC";

	var intervalHdr = null;
	var cnt = 0;
	var lastToneType = null;
	
	function toneReadProgDraw (t_ms) {
        var curDevice = window.parent.globals.device.current();
        
        if ( curDevice.length !== 2 ) {

        } else {
            window.parent.$('#toneRead_Dialog').dialog('open');
            var F = function() {
            	window.parent.$('#toneRead_Dialog').dialog('close');
            };
            setTimeout(F, t_ms);
         }	
	}
	
	var CHECK_INTERVAL = 1000;
	/* wait reading is finished. */
	function syncToneData(func) {
		
		if (!globals.model.isReading()) {
			func();
		} else {	
			
		//	window.parent.$('#toneRead_Dialog').dialog('open');
        //    toneReadProgDraw(CHECK_INTERVAL);             
            var F = function() {
         //   	toneReadProgDraw(CHECK_INTERVAL);
            	if (!globals.model.isReading()) {
            		func();
            		//alert("exec func");
            	} else {
            		setTimeout(arguments.callee, CHECK_INTERVAL);
            		//alert("reading");
            	}
            };
            setTimeout(F, CHECK_INTERVAL);
		}		
	}	

	function listner(ev, param) {
		var id = param;

		if (ev == 'read') {
			if ( $("#readDialog").dialog("isOpen") && $("#readPrg").is(':visible') ) {
				if (param == 'end') {

				} else if (param == 'start') {
					//$("#readPrg").progressbar('value', '0 %');
				} else {
					var per = parseInt(param, 10);
					if (per === 100) {
						window.parent.globals.communicator.stopWatchDog();
					}
					if (per > 30)
						$("#readPrg").progressbar('value', per);

				}
			}
		} else if (ev == 'sync') {
			if (param == 'end') {
				window.parent.globals.controller.indextop.toneUpdate();
				window.parent.globals.controller.indextop.updateContents();
				window.parent.globals.controller.indextop.studiosetUpdate();
			} else if (param == 'start') {
				$("#syncDialog").dialog('open');
				$("#syncPrg").progressbar('value', '0 %');
			} else {
				var per = parseInt(param, 10);
				$("#syncPrg").progressbar('value', per);
			}
		} else if (ev == 'model') {
			if (id.indexOf("_PAT_BS_MSB") !== -1 ||
				id.indexOf("_PAT_BS_LSB") !== -1 ||
				id.indexOf("_PAT_PC") !== -1) {

				if ($("#readDialog").dialog("isOpen") ) {
					return;
				}
				
				
				if (id.indexOf("_PAT_PC") !== -1) {

//					var tone = ctrl.getCurTone();
					var curContents =  window.parent.globals.parameter.db.curContents;
					switch (curContents) {
					case 'tone_sna':
					case 'effects':
						window.parent.globals.controller.indextop.updateContents();
						break;
					default :
						break;
					}
//					lastToneType = tone.type;
				}
				var part = id.match(/\d+/);
				var msb = window.parent.globals.controller.base.prototype.getVal(msbId.replace(/\d+/, part));
				var type = getToneType(msb);

				var curDevice = globals.device.current();
				
				if ( curDevice.length !== 2 ) {
					/* not connected */
					return;
				}

				switch (type) {
				case "SN-A":
					var F = function() {
						globals.model.read("PRM-_FPART" + (id.match(/\d+/)) +  '-_SNTONE');
					};
					syncToneData(F);
					break;
				case "SN-D":
					var F = function() {
						globals.model.read("PRM-_FPART" + (id.match(/\d+/)) +  '-_KIT');
					};
					syncToneData(F);
					break;
				case "SN-S":
					var F = function() {
						globals.model.read("PRM-_FPART" + (id.match(/\d+/)) +  '-_SHPAT');
					};
					syncToneData(F);
					break;
				case "PCM-S":
					var F = function() {
						globals.model.read("PRM-_FPART" + (id.match(/\d+/)) +  '-_PAT');
					};
					syncToneData(F);
					break;
				case "PCM-D":
					var F = function() {
						globals.model.read("PRM-_FPART" + (id.match(/\d+/)) +  '-_RHY');
					};
					syncToneData(F);
					break;
				}

			}
		}
	}
	window.parent.globals.observer.append('common', listner);




$(function() {
    // $('#widget').draggable();

/* Studio Set Rename Dialog */
    $('#studioSetRenameDialog').dialog({
        autoOpen: false,
        resizable: false,
        height:140,
        modal: true,
        closeOnEscape: false,
        buttons: {
            'Rename': function() {
                $(this).dialog('close');
                var newStudioSetName = $('#studioSetRename').val();
                var oldStudioSetName = window.parent.header.$('#currentStudioSet').val().slice(7);
                var studioSetNumber = window.parent.header.$('#currentStudioSet').val().slice(0 , 7);
                if (oldStudioSetName !== newStudioSetName) {
                    var studioSetDisplay = studioSetNumber + newStudioSetName;
					var currentStudioSetID = "currentStudioSet";
					window.parent.header.$('#'+ currentStudioSetID).val(studioSetDisplay);
			//		window.parent.header.$('#studioSetSelect option:selected').text(studioSetDisplay);
					window.parent.globals.controller.indextop.put(currentStudioSetID, newStudioSetName);
                } else {}
            },
            'Cancel': function() {
                $(this).dialog('close');
            }
        }
    });


/* Tone Rename Dialog */
    $('#toneRenameDialog').dialog({
        autoOpen: false,
        resizable: false,
        height:140,
        modal: true,
        closeOnEscape: false,
        buttons: {
            'Rename': function() {
                $(this).dialog('close');
                var newToneName = $('#toneRename').val();
                var oldToneName = window.parent.header.$('#currentToneName').val().slice(7);
                var toneNumber = window.parent.header.$('#currentToneName').val().slice(0, 7);
                if (oldToneName !== newToneName) {
                    var toneDisplay = toneNumber + newToneName;
                    var currentToneNameID = "currentToneName";
                    window.parent.header.$('#'+ currentToneNameID).val(toneDisplay);
                    window.parent.globals.controller.indextop.put(currentToneNameID, newToneName);
                } else {}
              },
            'Cancel': function() {
                $(this).dialog('close');
            }
        }
    });


/* Read Dialog */
    var readbar = $('div#readPrg');
    var readper = $('span#readPrgPer');

	function readProgCreate() {
		$('#readPrgPer').show().text('0 %');
		$('#readPrg').show().progressbar({
			value: 0,
			max: 100,
			change: function() {
				readper.text(readbar.progressbar('value') + ' %');
			},
			complete: function() {
				readProgDestroy();
				$('#readDialog').dialog('close');
				window.parent.header.$('input#read').prop('checked', false).button('refresh');
				window.parent.globals.controller.indextop.toneUpdate();
				window.parent.globals.controller.indextop.updateContents();
				window.parent.globals.controller.indextop.studiosetUpdate();
			}
		});
	}

	function readProgDestroy() {
		$('#readPrgPer').hide();
		$('#readPrg').hide();
		$('#readConfirm').show();
		$('.okBtn').show();
	}
	readProgDestroy();

	var ADDR_BASE = 0x18002006;
	var readMSB = [];
	function reqToneNum(part , next) {

		var addr = ADDR_BASE + 0x100 * part;

		var sendInfo = {
			addr : addr,
			size : 1,
			func : function(d) {
				readMSB[part] = parseInt(d, 16);
				next();
				return false;
			}
		};
		window.parent.globals.communicator.rq1(sendInfo);
	}

	function readToneNum(next) {

		reqToneNum(0, function () {
			reqToneNum(1, function() {
				reqToneNum(2, function() {
					reqToneNum(3, function () {
						reqToneNum(4, function() {
							reqToneNum(5, function() {
								reqToneNum(6, function() {
									reqToneNum(7, function() {
										reqToneNum(8, function() {
											reqToneNum(9, function() {
												reqToneNum(10, function() {
													reqToneNum(11, function() {
														reqToneNum(12, function() {
															reqToneNum(13, function() {
																reqToneNum(14, function() {
																	reqToneNum(15, function() {
																		next();
																	});
																});
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	}

	var list = [];

    $('#readDialog').dialog({
        autoOpen: false,
        resizable: false,
        width: "300px",
        modal: true,
        dialogClass: 'no-close',
        closeOnEscape: false,
        buttons: {
			"CANCEL": {
				text: "CANCEL",
				'class': "cancelBtn",
				click: function() {
					$(this).dialog('close');
					window.parent.header.$('input#read').prop('checked', false).button('refresh');
				}
            },
            "OK": {
				text: "OK",
				'class': "okBtn",
				click: function() {
					var curDevice = globals.device.current();

					/* for debug */
					if(navigator.userAgent.indexOf("Firefox") != -1){
						curDevice.length = 2;
					}
					if ( curDevice.length !== 2 ) {
						$(this).dialog('close');
						window.parent.header.$('input#read').prop('checked', false).button('refresh');
						$('#connectMsg').dialog('open');
					} else {

						var ReadFunc = function () {

							var midi = new globals.controller.base_midi();

							midi.read( function () {
								list = [];
								for (var part = 0; part < 16 ; part++) {
								//	var msb = window.parent.globals.controller.base.prototype.getVal(msbId.replace(/\d+/, part+1));
									var msb = readMSB[part];
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
								var readDly = function () {
									window.parent.globals.model.read(
											"PRM-_SETUP",
											"PRM-_SYS",
											"PRM-_PRF",
											list[0], list[1], list[2], list[3],
											list[4], list[5], list[6], list[7],
											list[8], list[9], list[10], list[11],
											list[12], list[13], list[14], list[15]
									);
								};
								readDly();

							});
							$('.cancelBtn').bind('click.cancel', function(){
								globals.model.abortRead();
							});
						};

						globals.model.abortRead(); // Cancel currently-running read processing

						$('#readConfirm').hide();
						$('.okBtn').hide();
						readProgCreate();
						$("#readPrg").progressbar('value', 1);
						
						window.parent.globals.communicator.stopWatchDog();
						window.parent.globals.communicator.watchDogCallback(function(){
							window.parent.$('#connectMsg').dialog('open');
							window.parent.$('#readDialog').dialog('close');
							globals.model.abortRead();
						});
						window.parent.globals.communicator.startWatchDog();
						
						
						readToneNum( function () {
							window.parent.globals.controller.indextop.toneUpdate();
							window.parent.globals.controller.indextop.studiosetUpdate();
							window.parent.globals.controller.indextop.updateContents();
							ReadFunc();
						});
					}
				}
			}
		},
		open: function(event, ui) {
			readProgDestroy();
			$('.ui-button').blur();
		}
    });

	$('#connectMsg').dialog({
        autoOpen: false,
        resizable: false,
        width: "300px",
        modal: true,
		closeOnEscape: false,
        buttons: {
			'Close': function() {
                $(this).dialog('close');
            }
        },
		open: function(event, ui) {
			$('.ui-button').blur();
		}
	});



/* Total Recall Dialog */
    var syncbar = $('div#syncPrg');
    var syncper = $('span#syncPrgPer');

	function syncProgCreate() {
		$('#syncPrgPer').text('0 %');
		$('#syncPrg').progressbar({
			value: 0,
			max: 100,
			change: function() {
				syncper.text(syncbar.progressbar('value') + ' %');
			},
			complete: function() {
//				syncProgDestroy();
				$('#syncDialog').dialog('close');
			}
		});
	}

	$("#syncDialog").dialog({
        autoOpen: false,
        resizable: false,
        width: "300px",
        modal: true,
        dialogClass: 'no-close',
		closeOnEscape: false,
        buttons: {
			"CANCEL": {
				text: "CANCEL",
				'class': "cancelBtn",
				click: function() {
					$(this).dialog('close');
					globals.model.abortSync();
				}
            }
		},
		open: function(event, ui) {
			$('.ui-button').blur();
			syncProgCreate();
		}
	});


/* Write Studioset Dialog */
    $('#writeStudiosetDialog').dialog({
        autoOpen: false,
        resizable: false,
        width: "400px",
        modal: true,
        dialogClass: 'no-close',
        closeOnEscape: false,
        buttons: {
            'CANCEL': function() {
                $(this).dialog('close');
				window.parent.contents.$('input:checked').prop('checked', false).button('refresh');

            },
            'OK': function() {
				var curDevice = globals.device.current();
				if ( curDevice.length !== 2 ) {
					$(this).dialog('close');
					window.parent.contents.$('input:checked').prop('checked', false).button('refresh');
					$('#connectMsg').dialog('open');
				} else {
					var ctrl = new window.parent.globals.controller.base_midi();
					ctrl.writeStudioset(window.parent.globals.parameter.db.selectedStudioset, function(){
						ctrl.readStudiosetNameAll(function() {
								window.parent.globals.controller.indextop.updateContents();
								window.parent.globals.controller.indextop.toneUpdate();
								window.parent.globals.controller.indextop.studiosetUpdate();
						});
					});
					$(this).dialog('close');
				}
            }
        },
		open: function(event, ui) {
			$('.ui-button').blur();
		}
    });

/* Write Tone Dialog */
    $('#writeToneDialog').dialog({
        autoOpen: false,
        resizable: false,
        width: "400px",
        modal: true,
        dialogClass: 'no-close',
        closeOnEscape: false,
        buttons: {
            'CANCEL': function() {
                $(this).dialog('close');
				window.parent.contents.$('input:checked').prop('checked', false).button('refresh');
            },
            'OK': function() {
				var curDevice = globals.device.current();
				if ( curDevice.length !== 2 ) {
					$(this).dialog('close');
					window.parent.contents.$('input:checked').prop('checked', false).button('refresh');
					$('#connectMsg').dialog('open');
				} else {
					var ctrl = new window.parent.globals.controller.base_midi();
					var tone = window.parent.globals.parameter.db.selectedTone;


					var curTone = window.parent.globals.controller.base_midi.prototype.getCurTone();
					var type = curTone.type;

					var val = parseInt(tone.match(/\d+/), 10) - 1;

					ctrl.writeTone(val, type, function() {
						ctrl.readUserToneName(type, function() {
								var setInfo = {};
								setInfo.type = type;
								setInfo.bank = "USER";
								setInfo.index = val;

								window.parent.globals.controller.indextop.putCurTone(setInfo);
								window.parent.globals.controller.indextop.updateContents();
								window.parent.globals.controller.indextop.toneUpdate();
						});
					});
					$(this).dialog('close');
				}
            }
        },
        open: function() {
			$('.ui-button').blur();
        }
    });

/* Utility Dialog */

	function editName(initName) {
		var newToneName = initName;
        var toneNumber = window.parent.header.$('#currentToneName').val().slice(0, 7);

        var toneDisplay = toneNumber + newToneName;
        var currentToneNameID = "currentToneName";
        window.parent.header.$('#'+ currentToneNameID).val(toneDisplay);
        window.parent.globals.controller.indextop.put(currentToneNameID, newToneName);
	}

    $('.utilDialog').dialog({
        autoOpen: false,
        resizable: false,
        width: "450px",
        modal: true,
		closeOnEscape: false,
        buttons: {
            'CANCEL': function() {
                $(this).dialog('close');
            },
            'OK': function() {
				switch (this.id) {
				case "studioSetInit":
					var ctrl = new window.parent.globals.controller.base_midi();
					ctrl.studioSetInit();

					var F3 = function() {
						var part = window.parent.globals.parameter.db.curPart;
						window.parent.globals.model.abortRead();
						window.parent.globals.model.read(
								"PRM-_PRF",
								"PRM-_FPART1-_SNTONE",
								"PRM-_FPART2-_SNTONE",
								"PRM-_FPART3-_SNTONE",
								"PRM-_FPART4-_SNTONE",
								"PRM-_FPART5-_SNTONE",
								"PRM-_FPART6-_SNTONE",
								"PRM-_FPART7-_SNTONE",
								"PRM-_FPART8-_SNTONE",
								"PRM-_FPART9-_SNTONE",
								"PRM-_FPART10-_KIT",
								"PRM-_FPART11-_SNTONE",
								"PRM-_FPART12-_SNTONE",
								"PRM-_FPART13-_SNTONE",
								"PRM-_FPART14-_SNTONE",
								"PRM-_FPART15-_SNTONE",
								"PRM-_FPART16-_SNTONE"
						);
					};

					setTimeout(F3, 100);

					var F4 = function() {
//						window.parent.globals.controller.indextop.updateContents();
						window.parent.globals.controller.indextop.toneUpdate();
						window.parent.globals.controller.indextop.studiosetUpdate();
						$('#studiosetReadDialog').dialog('close');
					};
					setTimeout(F4, 5000);


					break;
				case "partInit":
					var ctrl = new window.parent.globals.controller.base_midi();
					ctrl.partInit();

					var F3 = function() {
						var part = window.parent.globals.parameter.db.curPart;
						window.parent.globals.model.abortRead();
						window.parent.globals.model.read("PRM-_PRF", "PRM-_FPART" + (part+1) );
					};
					setTimeout(F3, 100);

					var F4 = function() {
						window.parent.globals.controller.indextop.toneUpdate();
						window.parent.globals.controller.indextop.studiosetUpdate();
					};
					setTimeout(F4, 3000);


					break;
				case "soundCtrlInit":
					var ctrl = new window.parent.globals.controller.base_midi();
					ctrl.soundCtrlInit();
					break;
				case "toneInit":
					var ctrl = new window.parent.globals.controller.base_midi();
					ctrl.toneInit();

					var F3 = function() {
						var part = window.parent.globals.parameter.db.curPart;
						window.parent.globals.model.abortRead();
						window.parent.globals.model.read("PRM-_PRF", "PRM-_FPART" + (part+1) );
					};
					setTimeout(F3, 100);

					var F4 = function() {
						window.parent.globals.controller.indextop.toneUpdate();
						window.parent.globals.controller.indextop.studiosetUpdate();

						var cur = ctrl.getCurToneType();

						if (cur == "SN-D" || cur == "PCM-D") {
							editName("INIT KIT");
						} else {
							editName("INIT TONE");
						}
					};
					setTimeout(F4, 3000);

					break;
				case "partialInit":
					var ctrl = new window.parent.globals.controller.base_midi();

					ctrl.partialInit();

					var F3 = function() {
						ctrl.requestPartParam();
					};
					setTimeout(F3, 100);

					var F4 = function() {
						window.parent.globals.controller.indextop.updateContents();

					};
					setTimeout(F4, 2000);

					break;
//				case "partialCopy":
//					var ctrl = new window.parent.globals.controller.base_midi();
//					ctrl.partialCopy();
//					break;
				case "device":
					var ctrl = window.parent.globals.controller.utility;
					ctrl.setMidiDev();
					window.parent.globals.parameter.saveMidiSetting();
					window.parent.globals.communicator.clear_rq1();
					ctrl.readExpansion(); //
					break;
				default:
					break;
				}
               $(this).dialog('close');
            }
        },
        open: function() {
			$('.ui-button').blur();
        }
    });

    $('#writeToneDialogError').dialog({
        autoOpen: false,
        resizable: false,
        width: "300px",
        modal: true,
		closeOnEscape: false,
        buttons: {
			'CLOSE': function() {
				$(this).dialog('close');
			}
		},
		open: function() {
			$('.ui-button').blur();
			window.parent.contents.$('input:checked').prop('checked', false).button('refresh');
		}
	});

    $('.utilDialogError').dialog({
        autoOpen: false,
        resizable: false,
        width: "300px",
        modal: true,
		closeOnEscape: false,
        buttons: {
			'CLOSE': function() {
				$(this).dialog('close');
			}
		},
		open: function() {
			$('.ui-button').blur();
		}
	});


/* Version Dialog */
    $('.version').dialog({
        autoOpen: false,
        resizable: false,
        width: "550px",
        modal: true,
		closeOnEscape: false,
        buttons: {
            'CLOSE': function() {
                $(this).dialog('close');
            }
        },
        open: function() {
			$('.ui-button').blur();
        }
    });

    // $('span#versionNumber').html(window.parent.globals.version);

	// $('span#copyrightText').html(window.parent.globals.copyright);

/* Expansion Progress Bar */
    $("#expPrg").progressbar({
		value: false
    });

    $("#expPrg").hide();

    $("#prg_Dialog").dialog({
		modal: true,
		autoOpen: false,
		resizable: false,
		dialogClass: 'no-close',
		closeOnEscape: false,
		width: '300px',
		open:function(event, ui) {
			$('.ui-button').blur();
			$('#expPrg').progressbar('enable').show();
		}
	});
    
    
/* Tone Read Progress Bar */
    $("#toneReadPrg").progressbar({
		value: false
    });

    $("#toneReadPrg").hide();

    $("#toneRead_Dialog").dialog({
		modal: true,
		autoOpen: false,
		resizable: false,
		dialogClass: 'no-close',
		closeOnEscape: false,
		width: '300px',
		open:function(event, ui) {
			$('.ui-button').blur();
			$('#toneReadPrg').progressbar('enable').show();
		}
	});    


/* Error Dialog */
	$(".errorDialog").dialog({
		modal: true,
		autoOpen: false,
		resizable: false,
		width: '500px',
		closeOnEscape: false,
        buttons: {
            'CLOSE': function() {
                $(this).dialog('close');
            }
        },
        open: function(event, ui) {
			$('.ui-button').blur();
        }
	});
});
