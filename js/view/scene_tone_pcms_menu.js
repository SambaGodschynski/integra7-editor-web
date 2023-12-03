//
//  scene_tone_pcms_menu.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {
    $('#menu').myMenu();

    $('.link').click(function(){
        var loadLink = window.parent.$('#contents').attr('src');
        var anchor = $(this).attr('id');
  //       var url = loadLink +'#' + anchor;
		window.parent.globals.controller.tone_pcms.clearTable(anchor);
		switch (anchor) {
			case "common":
				window.parent.globals.controller.tone_pcms.selectCommon();
				break;
			case "wave":
				window.parent.globals.controller.tone_pcms.selectWave();
				break;
			case "pmt":
				window.parent.globals.controller.tone_pcms.selectPmt();
				break;
			case "pitch":
				window.parent.globals.controller.tone_pcms.selectPitch();
				break;
			case "pitchEnv":
				window.parent.globals.controller.tone_pcms.selectPitchEnv();
				break;
			case "tvf":
				window.parent.globals.controller.tone_pcms.selectTvf();
				break;
			case "tvfEnv":
				window.parent.globals.controller.tone_pcms.selectTvfEnv();
				break;
			case "tva":
				window.parent.globals.controller.tone_pcms.selectTva();
				break;
			case "tvaEnv":
				window.parent.globals.controller.tone_pcms.selectTvaEnv();
				break;
			case "output":
				window.parent.globals.controller.tone_pcms.selectOutput();
				break;
			case "lfo1":
				window.parent.globals.controller.tone_pcms.selectLfo1();
				break;
			case "lfo2":
				window.parent.globals.controller.tone_pcms.selectLfo2();
				break;
			case "stepLfo":
				window.parent.globals.controller.tone_pcms.selectStepLfo();
				break;
			case "ctrl":
				window.parent.globals.controller.tone_pcms.selectCtrl();
				break;
			case "mtrxCtrl1":
				window.parent.globals.controller.tone_pcms.selectMtrxCtrl1();
				break;
			case "mtrxCtrl2":
				window.parent.globals.controller.tone_pcms.selectMtrxCtrl2();
				break;
			case "mtrxCtrl3":
				window.parent.globals.controller.tone_pcms.selectMtrxCtrl3();
				break;
			case "mtrxCtrl4":
				window.parent.globals.controller.tone_pcms.selectMtrxCtrl4();
				break;
		}
	});
});