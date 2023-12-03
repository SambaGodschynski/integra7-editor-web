//
//	file_operation.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

/* File operation native class interface */
(function(window) {

var
		obj = '_fileop_';

	window.FileOperation = function() {

		var id = 0; /* fixed */

		this.basedir = function() {
			return native(obj, 'basedir', id);
		};

		this.tmpdir = function() {
			return native(obj, 'tmpdir', id);
		};

		this.contents = function(path) {
			var ext = (arguments.length > 1) ? arguments[1] : "";
			var s = native(obj, 'contents', id, path, ext);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true, data: JSON.parse(s.substring(1)) };
		};

		this.stat = function(path) {
			var s = native(obj, 'stat', id, path);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true, data: JSON.parse(s.substring(1)) };
		};

		this.exec = function(path) {
			native(obj, 'exec', id, path);
		};

		this.mkdir = function(path) {
			var s = native(obj, 'mkdir', id, path);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true };
		};

		this.unlink = function(path) {
			var s = native(obj, 'unlink', id, path);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true };
		};

		this.copy = function(src, dst) {
			var s = native(obj, 'copy', id, src, dst);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true };
		};

		this.move = function(src, dst) {
			var s = native(obj, 'move', id, src, dst);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true };
		};

		this.readString = function(path) {
			var s = native(obj, 'readString', id, path);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true, data: s.substring(1) };
		};

		this.readData = function(path) {
			var s = native(obj, 'readData', id, path);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true, data: s.substring(1) };
		};

		this.writeString = function(path, str) {
			var s = native(obj, 'writeString', id, path, str);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true };
		};

		this.appendString = function(path, str) {
			var s = native(obj, 'appendString', id, path, str);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true };
		};

		this.writeData = function(path, hex) {
			var s = native(obj, 'writeData', id, path, hex);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true };
		};

		this.appendData = function(path, hex) {
			var s = native(obj, 'appendData', id, path, hex);
			if (s.charAt(0) == 'E') {
				return { success: false, reason: s.substring(1) };
			}
			return { success: true };
		};

		this.openFileName = function(filter, func) {
			function result(s) {
				if (s.charAt(0) == 'W')
					return;
				if (s.charAt(0) == 'E') {
					func({ success: false });
				} else {
					func({ success: true, data: s.substring(1) });
				}
			}
			window.FileOperationCB = function(s) { result(s); }
			result(native(obj, 'openFileName', id, filter));
		};

		this.saveFileName = function(name, ext, func) {
			function result(s) {
				if (s.charAt(0) == 'W')
					return;
				if (s.charAt(0) == 'E') {
					func({ success: false });
				} else {
					func({ success: true, data: s.substring(1) });
				}
			}
			window.FileOperationCB = function(s) { result(s); }
			result(native(obj, 'saveFileName', id, name, ext));
		};

	}

})(window);
