//
//	observer.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

/*
	ev:
	'nop',		param: undefined
	'model',	param: 'id'
	'read',		param: 'start' or 'end'
	'sync',		param: 'start' or 'end'
	'view',
*/

(function(globals) {

	var listener = {};

	globals.observer.append = function(prop, func) {
		listener[prop] = func;
	};

	globals.observer.remove = function(prop) {
		delete listener[prop];
	};

	globals.observer.notify = function(ev, param) {
		for (var prop in listener) {
			listener[prop].apply(null, arguments);
		}
	};

	globals.observer.post = function(ev, param) {
		window.setTimeout(function(){ globals.observer.notify(ev, param) }, 10);
	};

})(window.globals);
