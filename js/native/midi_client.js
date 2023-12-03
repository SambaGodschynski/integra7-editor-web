//
//	midi_client.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

/* MIDIInputPort native class interface */
(function(window) {

	window.MIDIInputPort = function(obj, id) {

		var funcName = obj + id + 'in' + '$';
		window[funcName] = function(){};
		native(obj, 'inputPort_delegate', id, funcName);

		this.delegate = function(F) {
			window[funcName] = function(prop) {
				if (prop in F) {
					var args = [].slice.call(arguments, 1);
					F[prop].apply(null, args);
				}
			}
		};

		this.endpoints = function() {
			return JSON.parse(native(obj, 'inputPort_endpoints', id));
		};

		this.connectEndpoint = function(ep) {
			native(obj, 'inputPort_connectEndpoint', id, JSON.stringify(ep));
		};

		this.disconnectEndpoint = function(ep) {
			native(obj, 'inputPort_disconnectEndpoint', id, JSON.stringify(ep));
		};

		this.connectAllEndpoints = function() {
			native(obj, 'inputPort_connectAllEndpoints', id);
		};

		this.disconnectAllEndpoints = function() {
			native(obj, 'inputPort_disconnectAllEndpoints', id);
		};

	}

})(window);

/* MIDIOutputPort native class interface */
(function(window) {

	window.MIDIOutputPort = function(obj, id) {

		this.endpoints = function() {
			return JSON.parse(native(obj, 'outputPort_endpoints', id));
		};

		this.connectEndpoint = function(ep) {
			native(obj, 'outputPort_connectEndpoint', id, JSON.stringify(ep));
		};

		this.disconnectEndpoint = function(ep) {
			native(obj, 'outputPort_disconnectEndpoint', id, JSON.stringify(ep));
		};

		this.connectAllEndpoints = function() {
			native(obj, 'outputPort_connectAllEndpoints', id);
		};

		this.disconnectAllEndpoints = function() {
			native(obj, 'outputPort_disconnectAllEndpoints', id);
		};

		this.send = function(msg) {
			native(obj, 'outputPort_send', id, msg);
		};

	}

})(window);

/* MIDIClient native class interface */
(function(window) {

var
	obj = '_midi_';

	window.MIDIClient = function() {

		if (!window.native) return;

		var id = (arguments.length > 0) ? arguments[0] : 0;
		var funcName = obj + id + '$';
		window[funcName] = function(){};
		native(obj, 'delegate', id, funcName);

		this.inputPort = new MIDIInputPort(obj, id);
		this.outputPort = new MIDIOutputPort(obj, id);

		this.delegate = function(F) {
			window[funcName] = function(prop) {
				if (prop in F) {
					var args = [].slice.call(arguments, 1);
					F[prop].apply(null, args);
				}
			}
		};

	}

})(window);
