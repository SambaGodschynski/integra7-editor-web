//
//	native_call.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

window.native$ = function (func) { /* for Windows ie */
	eval(func);
};

window.native = function (obj, func, ...args) {

	if (!window[obj] || !window[obj][func]) {
		console.log(`window[${obj}][${func}](${args.join(', ')})`);
		return `{}`;
	}
	const result = window[obj][func](...args);
	if (!result) {
		return undefined;
	}
	if (typeof(result) === 'string') {
		return result;
	}
	return JSON.stringify(result);
};

/* NSURLProtocol for Mac/iOS */
if (navigator.userAgent.indexOf('Mac') != -1 ||
	navigator.userAgent.indexOf('iPhone') != -1 ||
	navigator.userAgent.indexOf('iPad') != -1 ||
	navigator.userAgent.indexOf('iPod') > 0) {

	window.native = function () {

		var URL = 'native://' + arguments[0] + '/' + arguments[1];
		var argc = arguments.length - 2;
		if (argc > 0) {
			URL += ';' + encodeURIComponent(arguments[2]);
			for (var i = 1; i < argc; i++) {
				URL += '~|~' + encodeURIComponent(arguments[i + 2]);
			}
		}
		var result = undefined;
		jQuery.ajax({
			type: "GET",
			url: URL,
			cache: false,
			async: false,
			success: function(ret) {
								if (ret == 'undefined') {
										/* nothing to do */
								} else if ((ret == '') || (ret == 'null')) {
										result = null;
								} else if (ret == 'true') {
										result = true;
								} else if (ret == 'false') {
										result = false;
								} else {
										result = ret;
								}
			},
			error: function() {
				alert("ajax:" + URL);
			}
		});
		return result;
	};
}
