//
//  globals.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

(function () {

	function loadJS(path) {
		var element = document.createElement('script');
		element.setAttribute('type', 'text/javascript');
		element.setAttribute('src', path);
		document.getElementsByTagName('head')[0].appendChild(element);
	}

	 // load WebMIDIAPI.js when you use Browser.
	if (navigator.userAgent.indexOf('Firefox') != -1) {
		window.native = null;
		loadJS('../html_develop/WebMIDIAPIWrapper.js');
		loadJS('../html_develop/WebMIDIAPI.js');
	}

})();

window.globals = {

	debug: false,

	log: function(msg) {
		if (this.debug) { console.log(msg); }
	},

	error: function(msg, key) {
		var count = globals.parameter.db.midiErrorFlg;
		if ( ( msg.indexOf('midi') !== -1 ) && key) {
			var errorText;
			switch (msg) {
				case 'midiInputPortConnectFailed':
					errorText = 'MIDI INPUT PORT CONNECT FAILED  :  ';
					break;
				case 'midiOutputPortConnectFailed':
					errorText = 'MIDI OUTPUT PORT CONNECT FAILED  :  ';
					break;
				case 'midiErrorDidOccur':
					errorText = 'MIDI ERROR DID OCCUR  :  ';
					globals.parameter.db.midiErrorFlg++;
					break;
				default:
					break;
			}
			if ( !count ) {
				$('#'+msg+'MsgKey').text(key);
				$('#'+msg+'Msg').text(errorText);
				$('#'+msg+'Dialog').dialog('open');
			}
		} else {
			alert(msg);
		}
	},

	product:	'INTEGRA-7 Editor',
	version:	'2.0.3',
	buildNo:	'(B026)',
	copyright:	'Copyright 2014 Roland Corporation. All rights reserved.',
	vst_copyright: null,
	other_copyright : null,

	observer: {},
	controller: {},
	model: {},
	communicator: {},
	device: {},

	parameter: {},

	pref: {}

};
