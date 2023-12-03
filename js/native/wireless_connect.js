//
//	wireless_connect.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

/* RWCDiscovery native class interface */
(function(window) {

var
	obj = '_rwc_discovery_';

	window.RWCDiscovery = function() {

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

	}

})(window);

/* RWCMIDIService native class interface */
(function(window) {

	window.RWCMIDIService = function(obj, id) {

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

		this.streaming = function(on) {
			if (arguments.length > 0) {
				native(obj, 'midiService_streaming', id, on);
			} else {
				return native(obj, 'midiService_streaming', id);
			}
		};

		this.streamingDelayTime = function(sec) {
			if (arguments.length > 0) {
				native(obj, 'midiService_streamingDelayTime', id, sec);
			} else {
				return native(obj, 'midiService_streamingDelayTime', id) * 1;
			}
		};

	}

})(window);

/* RWCInputStream native class interface */
(function(window) {

	window.RWCInputStream = function(obj, id) {

		var funcName = obj + id + 'is' + '$';
		window[funcName] = function(){};
		native(obj, 'inputStream_delegate', id, funcName);

		this.delegate = function(F) {
			window[funcName] = function(prop) {
				if (prop in F) {
					var args = [].slice.call(arguments, 1);
					F[prop].apply(null, args);
				}
			}
		};

		this.inputMode = function(mode) {
			native(obj, 'inputStream_inputMode', id, mode);
		};

		this.start = function() {
			native(obj, 'inputStream_start', id);
		};

		this.pause = function() {
			native(obj, 'inputStream_pause', id);
		};

		this.stop = function(shouldStopImmediate) {
			native(obj, 'inputStream_stop', id, shouldStopImmediate);
		};

		this.status = function() {
			return native(obj, 'inputStream_status', id) * 1;
		};

		this.numberOfChannels = function() {
			return native(obj, 'inputStream_numberOfChannels', id) * 1;
		};

		this.volume = function(gain) {
			if (arguments.length > 0) {
				native(obj, 'inputStream_volume', id, gain);
			} else {
				return native(obj, 'inputStream_volume', id) * 1;
			}
		};

		this.peakPowerForChannel = function() {
			return native(obj, 'inputStream_peakPowerForChannel', id) * 1;
		};

		this.currentTime = function() {
			return native(obj, 'inputStream_currentTime', id) * 1;
		};

	}

})(window);

/* RWCOutputStream native class interface */
(function(window) {

	window.RWCOutputStream = function(obj, id) {

		var funcName = obj + id + 'os' + '$';
		window[funcName] = function(){};
		native(obj, 'outputStream_delegate', id, funcName);

		this.delegate = function(F) {
			window[funcName] = function(prop) {
				if (prop in F) {
					var args = [].slice.call(arguments, 1);
					F[prop].apply(null, args);
				}
			}
		};

		this.start = function() {
			native(obj, 'outputStream_start', id);
		};

		this.pause = function() {
			native(obj, 'outputStream_pause', id);
		};

		this.stop = function() {
			native(obj, 'outputStream_stop', id);
		};

		this.status = function() {
			return native(obj, 'outputStream_status', id) * 1;
		};

		this.numberOfChannels = function() {
			return native(obj, 'outputStream_numberOfChannels', id) * 1;
		};

		this.volume = function(gain) {
			if (arguments.length > 0) {
				native(obj, 'outputStream_volume', id, gain);
			} else {
				return native(obj, 'outputStream_volume', id) * 1;
			}
		};

		this.peakPowerForChannel = function() {
			return native(obj, 'outputStream_peakPowerForChannel', id) * 1;
		};

		this.currentTime = function() {
			return native(obj, 'outputStream_currentTime', id) * 1;
		};

	}

})(window);

/* RWCConnection native class interface */
(function(window) {

var
	obj = '_rwc_';

	window.RWCConnection = function() {

		if (!window.native) return;

		var id = (arguments.length > 0) ? arguments[0] : 0;
		var funcName = obj + id + '$';
		window[funcName] = function(){};
		native(obj, 'delegate', id, funcName);

		this.midiService = new RWCMIDIService(obj, id);
		this.inputStream = new RWCInputStream(obj, id);
		this.outputStream = new RWCOutputStream(obj, id);

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

		this.connectTimeout = function(sec) {
			if (arguments.length > 0) {
				native(obj, 'connectTimeout', id, sec);
			} else {
				return native(obj, 'connectTimeout', id) * 1;
			}
		};

		this.keepAliveTimeout = function(sec) {
			if (arguments.length > 0) {
				native(obj, 'keepAliveTimeout', id, sec);
			} else {
				return native(obj, 'keepAliveTimeout', id) * 1;
			}
		};

	}

})(window);
