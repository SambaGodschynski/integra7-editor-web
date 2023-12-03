//
//	application.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

/* Application native class interface */
(function(window) {

var
		obj = '_app_';

	window.Application = function() {

		if (!window.native) {
			this.saveState = function(data) {
				var str = JSON.stringify(data);
				document.cookie = 'pref=' + encodeURIComponent(str);
			};
			this.loadState = function() {
				var allcookies = document.cookie;
				if (allcookies != '') {
					var cookies = allcookies.split(';');
					for (var i = 0; i < cookies.length; i++) {
						var cookie = cookies[i].split('=');
						if (cookie[0] == 'pref') {
							var str = decodeURIComponent(cookie[1]);
							return JSON.parse(str);
						}
					}
				}
				return {};
			}
			return;
		}

		var id = 0; /* fixed */
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

		this.ready = function() {
			native(obj, 'ready', id);
		};

		this.result = function(value) {
			native(obj, 'result', id, value);
		};

		this.saveState = function(data) {
			native(obj, 'saveState', id, JSON.stringify(data));
		};

		this.loadState = function() {
			var s = native(obj, 'loadState', id);
			return s ? JSON.parse(s) : {};
		};
	}

})(window);
