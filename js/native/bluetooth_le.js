//
//	bluetooth_le.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

/* BLEDiscovery native class interface */
(function(window) {

var
	obj = '_ble_discovery_';

	window.BLEDiscovery = function() {

		return;
		if (!window.native) return;

		var id = (arguments.length > 0) ? arguments[0] : 0;
		var funcName = obj + id + '$';
		window[funcName] = function(){};
		native(obj, 'delegate', id, funcName);

		this.delegate = function(F) {
			window[funcName] = function(prop) {
				if (prop in F) {
					var args = [].slice.call(arguments, 1);
					F[prop].apply(null, args);
				}
			}
		};

		this.search = function() {
			native(obj, 'search', id);
		};

		this.stop = function() {
			native(obj, 'stop', id);
		};

	}

})(window);

/* BLEMIDIService native class interface */
(function(window) {

	window.BLEMIDIService = function(obj, id) {

		return;
		var funcName = obj + id + 'midi' + '$';
		window[funcName] = function(){};
		native(obj, 'midiService_delegate', id, funcName);

		this.delegate = function(F) {
			window[funcName] = function(prop) {
				if (prop in F) {
					var args = [].slice.call(arguments, 1);
					F[prop].apply(null, args);
				}
			}
		};

		this.send = function(msg, cable) {
			if (arguments.length > 1) {
				native(obj, 'midiService_send', id, msg, cable);
			} else {
				native(obj, 'midiService_send', id, msg);
			}
		};

	}

})(window);

/* BLEConnection native class interface */
(function(window) {

var
	obj = '_ble_';

	window.BLEConnection = function() {

		return;
		if (!window.native) return;

		var id = (arguments.length > 0) ? arguments[0] : 0;
		var funcName = obj + id + '$';
		window[funcName] = function(){};
		native(obj, 'delegate', id, funcName);

		this.midiService = new BLEMIDIService(obj, id);

		this.delegate = function(F) {
			window[funcName] = function(prop) {
				if (prop in F) {
					var args = [].slice.call(arguments, 1);
					F[prop].apply(null, args);
				}
			}
		};

		this.device = function() {
			return JSON.parse(native(obj, 'device', id));
		};

		this.connect = function(device) {
			native(obj, 'connect', id, JSON.stringify(device));
		};

		this.disconnect = function() {
			native(obj, 'disconnect', id);
		};

	}

})(window);
