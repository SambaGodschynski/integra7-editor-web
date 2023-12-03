//
//  device.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

(function(globals) {

	var
		inputs  = [],
		outputs = [],
		netdevs = [],
		bledevs = [],

		cur_input  = null,
		cur_output = null,
		cur_net = null,
		cur_ble = null;

	var target = [];
	globals.device.send = function(msg) {
		console.log('device.js: send(): ' + msg);
		for (var i = 0, num = target.length; i < num; i++)
			target[i].send(msg);
	};

	var recv = {
		midiInputMessage: function(msg, timeStamp, cin) {
			globals.communicator.input(msg);
		}
	};

	var midi = new MIDIClient();
	if (midi.delegate) {
		midi.delegate({
			midiInputPortConnectFailed: function(ep) {
				cur_input = null;
				// globals.error('midiInputPortConnectFailed: ' + ep.MIDIDeviceNameKey);
				globals.error('midiInputPortConnectFailed', ep.MIDIDeviceNameKey);
			},
			midiOutputPortConnectFailed: function(ep) {
				cur_output = null;
				// globals.error('midiOutputPortConnectFailed: ' + ep.MIDIDeviceNameKey);
				globals.error('midiOutputPortConnectFailed', ep.MIDIDeviceNameKey);
			},
			midiObjectAddedRemoved: function() {
				globals.log('device.js: midi.delegate: midiObjectAddedRemoved');
			},
			midiErrorDidOccur: function(errcode) {
				cur_input  = null;
				cur_output = null;
				// globals.error('midiErrorDidOccur: ' + errcode);
				globals.error('midiErrorDidOccur', errcode);
			}
		});
		midi.inputPort.delegate(recv);
		target.push(midi.outputPort);
	} else {
		midi = null;
	}

	var net = new RWCConnection();
	if (net.delegate) {
		net.delegate({
			connectionFailed: function(dev) {
				cur_net = null;
				globals.error('RWC connectionFailed: ' + dev.RWCDeviceNameKey);
			},
			connectionDidEstablished: function(dev) {
				globals.log('device.js: net.delegate: connectionDidEstablished');
			},
			connectionDidClosed: function(dev) {
				cur_net = null;
				globals.error('RWC connectionDidClosed: ' + dev.RWCDeviceNameKey);
			},
			connectionErrorDidOccur: function(dev) {
				cur_net = null;
				globals.error('RWC connectionErrorDidOccur: ' + dev.RWCDeviceNameKey);
			}
		});
		net.midiService.delegate(recv);
		target.push(net.midiService);
	} else {
		net = null;
	}

	var ble = new BLEConnection();
	if (ble.delegate) {
		ble.delegate({
			connectionFailed: function(dev) {
				cur_ble = null;
				globals.error('BLE connectionFailed: ' + dev.BLEDeviceNameKey);
			},
			connectionDidEstablished: function(dev) {
				globals.log('device.js: ble.delegate: connectionDidEstablished');
			},
			connectionDidClosed: function(dev) {
				cur_ble = null;
				globals.error('BLE connectionDidClosed: ' + dev.BLEDeviceNameKey);
			},
			connectionErrorDidOccur: function(dev) {
				cur_ble = null;
				globals.error('BLE connectionErrorDidOccur: ' + dev.BLEDeviceNameKey);
			}
		});
		ble.midiService.delegate(recv);
		target.push(ble.midiService);
	} else {
		ble = null;
	}

	var net$discovery = new RWCDiscovery();
	if (net$discovery.delegate) {
		net$discovery.delegate({
			discoveryDeviceDidFound: function(dev) {
				dev.id   = dev.RWCDeviceUIDKey;
				dev.name = dev.RWCDeviceNameKey;
				dev.type = 'net';
				netdevs.push(dev);
			}
		});
	} else {
		net$discovery = null;
	}

	var ble$discovery = new BLEDiscovery();
	if (ble$discovery.delegate) {
		ble$discovery.delegate({
			discoveryDeviceDidFound: function(dev) {
				dev.id   = dev.BLEDeviceUIDKey;
				dev.name = dev.BLEDeviceNameKey;
				dev.type = 'ble';
				bledevs.push(dev);
			}
		});
	} else {
		ble$discovery = null;
	}

	globals.device.current = function() {
		var a = [];
		if (cur_input)
			a.push(cur_input);
		if (cur_output)
			a.push(cur_output);
		if (cur_net)
			a.push(cur_net);
		if (cur_ble)
			a.push(cur_ble);
		return a;
	};

	globals.device.search = function() {

		inputs  = [];
		outputs = [];
		netdevs.length = 0;
		bledevs.length = 0;

		found = {};

		if (midi) {
			inputs  = midi.inputPort.endpoints();
			outputs = midi.outputPort.endpoints();
			for (var i = 0, num = inputs.length; i < num; i++) {
				inputs[i].id   = inputs[i].MIDIEndpointUIDKey;
				inputs[i].name = inputs[i].MIDIDeviceNameKey;
				inputs[i].type = 'input';
			}
			for (var i = 0, num = outputs.length; i < num; i++) {
				outputs[i].id   = outputs[i].MIDIEndpointUIDKey;
				outputs[i].name = outputs[i].MIDIDeviceNameKey;
				outputs[i].type = 'output';
			}
			found.midi = [ inputs, outputs ];
		}
		if (net$discovery) {
			net$discovery.search();
			found.net = netdevs;
		};
		if (ble$discovery) {
			ble$discovery.search();
			found.ble = bledevs;
		};

		return found;
	};

	globals.device.disconnect = function() {
		if (midi) {
			midi.inputPort.disconnectAllEndpoints();
			midi.outputPort.disconnectAllEndpoints();
		}
		if (net) { net.disconnect(); }
		if (ble) { ble.disconnect(); }

		cur_input  = null,
		cur_output = null;
		cur_net = null;
		cur_ble = null;
	};

	globals.device.connect = function(cur) {

		globals.parameter.db.Flg = 0;
		function _copy(x) {
			var o = {};
			for (var prop in x) { o[prop] = x[prop]; }
			return o;
		}

		if (cur.type == 'input' && midi) {
			cur_input = _copy(cur);
			midi.inputPort.connectEndpoint(cur);
		} else
		if (cur.type == 'output' && midi) {
			cur_output = _copy(cur);
			midi.outputPort.connectEndpoint(cur);
		} else
		if (cur.type == 'net' && net) {
			cur_net = _copy(cur);
			net.connect(cur);
		} else
		if (cur.type == 'ble' && ble) {
			cur_ble = _copy(cur);
			ble.connect(cur);
		}
	};


})(window.globals);
