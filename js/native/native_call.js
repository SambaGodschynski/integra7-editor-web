//
//	native_call.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

window.native$ = function (func) { /* for Windows ie */
	eval(func);
};

window.native = function () {

	var obj  = arguments[0];
	var func = arguments[1];
	var argc = arguments.length;

	if (argc > 5)
		console.log(`window[${obj}][${func}](${arguments[2]}, ${arguments[3]}, ${arguments[4]}, ${arguments[5]})`)
		//return window[obj][func](arguments[2], arguments[3], arguments[4], arguments[5]);
	if (argc > 4)
		console.log(`window[${obj}][${func}](${arguments[2]}, ${arguments[3]}, ${arguments[4]})`)
		//return window[obj][func](arguments[2], arguments[3], arguments[4]);
	if (argc > 3)
		console.log(`window[${obj}][${func}](${arguments[2]}, ${arguments[3]})`)
		//return window[obj][func](arguments[2], arguments[3]);
	if (argc > 2)
		console.log(`window[${obj}][${func}](${arguments[2]})`)
		//return window[obj][func](arguments[2]);

	console.log(`window[${obj}][${func}]`)
	//return window[obj][func]();
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
