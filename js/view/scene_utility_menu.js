//
//  scene_utility_menu.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {
    $('#menu').myMenu();

    $('.utilMenu').click(function(){
        var linkName = this.id;
        window.parent.$(".ui-dialog-content").dialog('close');

		switch (linkName) {
		case "device":
			window.parent.globals.controller.utility.updateDeviceInfo();
			break;
		case "partInit":
			window.parent.globals.controller.utility.updatePartDialog();
			break;
		case "partialInit":

			var tone = window.parent.globals.controller.utility.getCurTone();
			if (tone.type === "SN-A" || tone.bank ===  "GM2" || tone.bank === "GM2#") {
				linkName = 'partialInitNG';
			}

			window.parent.globals.controller.utility.updatePartialDialog();
			break;
		case "partialCopy":
			window.parent.globals.controller.utility.updatePartialCopyDialog();
			break;
		}
        window.parent.$('#'+linkName).dialog('open');
    });

    $('#manual').click(function(){
		var lang = (navigator.userLanguage||navigator.language).substr(0,2) === 'ja' ? 'j' : 'e';
		window.open('manual/manual_'+lang+'.pdf', 'Manual');
	});

});