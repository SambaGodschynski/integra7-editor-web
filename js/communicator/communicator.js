//
//	communicator.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

(function(globals) {

var
	ROLAND		= '41',
	DEV_ID		= '10',
	MODEL_ID	= '000064',
	RQ1			= '11',
	DT1			= '12',

	ADDR_SIZE	= 4,
	DATA_SIZE	= 4;

	var ROLAND_SYSEX;
	var ROLAND_DT1;
	var ROLAND_RQ1;

	var transaction = [];
	
	/* send queue  */
	var queue = [];	
	var t0 = new Date();
	var wait = 0;
	
	/* send count for checking connect error */
	var _watchDogCallback = null;
	var watchDogCount = 0;
	var WATCH_TIME_MAX = 1000 * 15;
	var watchDogEnable = false;
	
	globals.communicator.startWatchDog = function() {
		watchDogCount = 0;
		watchDogEnable = true;
	};

	globals.communicator.stopWatchDog = function() {
		watchDogCount = 0;
		watchDogEnable = false;
		_watchDogCallback = null;
	};		
	
	globals.communicator.watchDogCallback = function(func) {
		_watchDogCallback = func;
	};
	
	function resetWatchDog() {
		watchDogCount = 0;
	};
	
	var DEQUEUE_INTERVAL =10;
	function updateWatchDog() {
		
		if (watchDogEnable === false) return;
		
		watchDogCount += DEQUEUE_INTERVAL;

		if (watchDogCount > WATCH_TIME_MAX) {
			if (_watchDogCallback !== null) {
				_watchDogCallback();
				watchDogEnable = false;
				_watchDogCallback = null;
			}
		}
	};
	
	function dequeueMessage() {
		if (queue.length > 0) {
			var time = new Date();
			var t = time.getTime();

			if (wait > t - t0) return;
			t0 = t;
			var msg = queue.shift();
			globals.device.send(msg);
			console.log(msg)
			wait = parseInt(msg.length / 4);
		}			
		updateWatchDog();
	};

	timer = setInterval(dequeueMessage, DEQUEUE_INTERVAL);
	
	

	(globals.communicator.deviceId = function() {
		if (arguments.length > 0) {
			DEV_ID = arguments[0];
			ROLAND_SYSEX = 'F0' + ROLAND + DEV_ID + MODEL_ID;
			ROLAND_DT1 = ROLAND_SYSEX + DT1;
			ROLAND_RQ1 = ROLAND_SYSEX + RQ1;
		} else {
			return DEV_ID;
		}
	})(DEV_ID);

	globals.communicator.send = function(msg) {
		queue.push(msg);
	};

	globals.communicator.sysex = function(dataS) {
		var msg = ROLAND_SYSEX + dataS + 'F7';
		queue.push(msg);
	};

	globals.communicator.dt1 = function(addr, v) {

		var dataS = toHexStr(addr, ADDR_SIZE);

		for (var i = 0, len = v.length; i < len; i++) {
			if (v[i] < 0x10)
				dataS += '0';
			dataS += v[i].toString(16);
		}

		var msg = ROLAND_DT1 + dataS; msg += (chksum(dataS) + 'F7');

		queue.push(msg);
	};

	globals.communicator.rq1 = function(req) {

		if (!('addr' in req) || !('size' in req)) {
			globals.log('(communicator.js: rq1(): illegal request');
			return;
		}

		var addr  = req.addr;
		var size  = req.size;
		var bytes = req.bytes ? req.bytes : DATA_SIZE;
		var func  = req.func ? req.func : null;
		var dt1addr = req.dt1addr ? req.dt1addr : addr;

		var dataS = toHexStr(addr, ADDR_SIZE) + toHexStr(size, bytes);
		var msg = ROLAND_RQ1 + dataS; msg += (chksum(dataS) + 'F7');

		if (func) {
			transaction.push({
				addr: dt1addr,
				func: func
			});
		}

		queue.push(msg);
	};

	globals.communicator.clear_rq1 = function() {
		transaction = [];
	};

	var recv_dt1 = function(s) {

		var addrS = s.substring(0, ADDR_SIZE * 2);
		var dataS = s.substring(ADDR_SIZE * 2);

		globals.log('communicator.js: recv_dt1(): ' + addrS + ', ' + dataS);

		var addr = parseInt(addrS, 16);
		for (var i = 0, num = transaction.length; i < num; i++) {
			if (transaction[i].addr == addr) {
				if (!transaction[i].func(dataS)) {
					/* if return value is false, then remove this transaction. */
					transaction.splice(i, 1);
				}
				return;
			}
		}
		resetWatchDog();
		globals.model.recv(addr, dataS);
	};

	var recv_sysex = function(s) {
	};

	var recv_msg = function(s) {
	};

	globals.communicator.input = function(msg) {
		if (msg.indexOf('F0') === 0) {
			if (msg.indexOf(ROLAND_DT1) === 0) {
				var s = msg.substring(ROLAND_DT1.length, msg.length - 4);
				recv_dt1(s);
			} else if (msg.indexOf(ROLAND_SYSEX) === 0) {
				var s = msg.substring(ROLAND_SYSEX.length, msg.length - 4);
				recv_sysex(s);
			}
		} else {
			recv_msg(msg);
		}
	};

	function chksum(msg) {
		var sum = 0;
		for (var i = 0, len = msg.length; i < len; i += 2) {
			sum += parseInt(msg.substring(i, i + 2), 16);
		}
		sum = 128 - (sum & 0x7f);
		sum &= 0x7F;
		var str = sum.toString(16);
		return (sum < 0x10) ? '0' + str : str;
	}

	function toHexStr(x, size) {
		var _0 = '';
		var str = x.toString(16);
		var len = (size * 2) - str.length;
		while (len-- > 0)
			_0 += '0';
		return _0 + str;
	}
	
})(window.globals);
