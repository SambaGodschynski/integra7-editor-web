//
//  scene_base_tone_controller.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

//////////////////////////////////////////////////////////////////////
(function() {

	globals.controller.base_tone = function(){};
	globals.controller.base_tone.prototype = new globals.controller.base();

	var partsize = 0x200000;

	globals.controller.base_tone.prototype.getVal = function(id) {
		if (id.indexOf("_FPART1-") !== -1) {
			var addr = eval(id.replace(/-/g, '+'));
			addr += ((globals.parameter.db.curPart % 4) * partsize + parseInt(globals.parameter.db.curPart / 4)  * partsize * 8);
			return globals.model.getValue(addr);
		} else {
			return globals.controller.base.prototype.getVal(id);
		}
	};

	globals.controller.base_tone.prototype.get = function(id) {
		if (id.indexOf("_FPART1-") !== -1) {
			var addr = eval(id.replace(/-/g, '+'));
			addr += ((globals.parameter.db.curPart % 4) * partsize + parseInt(globals.parameter.db.curPart / 4)  * partsize * 8);
			return globals.model.get(addr);
		} else {
			return globals.controller.base.prototype.get(id);
		}

	};

	globals.controller.base_tone.prototype.strings = function(id) {
		if (id.indexOf("_FPART1-") !== -1) {
			var addr = eval(id.replace(/-/g, '+'));
			addr += ((globals.parameter.db.curPart % 4) * partsize + parseInt(globals.parameter.db.curPart / 4)  * partsize * 8);
			return globals.model.strings(addr);
		} else {
			return globals.controller.base.prototype.strings(id);
		}
	};

	globals.controller.base_tone.prototype.put = function(id, v) {
		if (id.indexOf("_FPART1-") !== -1) {
			var addr = eval(id.replace(/-/g, '+'));
			addr += ((globals.parameter.db.curPart % 4) * partsize + parseInt(globals.parameter.db.curPart / 4)  * partsize * 8);
			globals.model.put(addr, v);
		} else {
			globals.controller.base.prototype.put(id, v);
		}
	};

	globals.controller.base_tone.prototype.getString = function(id) {
		if (id.indexOf("_FPART1-") !== -1) {
			var addr = eval(id.replace(/-/g, '+'));
			addr += ((globals.parameter.db.curPart % 4) * partsize + parseInt(globals.parameter.db.curPart / 4)  * partsize * 8);
			return globals.model.getString(addr);
		} else {
			return globals.controller.base.prototype.getString(id);
		}
	};

	globals.controller.base_tone.prototype.range = function(id) {
		if (id.indexOf("_FPART1-") !== -1) {
			var addr = eval(id.replace(/-/g, '+'));
			addr += ((globals.parameter.db.curPart % 4) * partsize + parseInt(globals.parameter.db.curPart / 4)  * partsize * 8);
			return globals.model.range(addr);
		} else {
			return globals.controller.base.prototype.range(id);
		}
	};

	globals.controller.base_tone.prototype.getAddr = function(id) {
		if (id.indexOf("_FPART1-") !== -1) {
			var addr = eval(id.replace(/-/g, '+'));
			addr += ((globals.parameter.db.curPart % 4) * partsize + parseInt(globals.parameter.db.curPart / 4)  * partsize * 8);
			return addr;
		} else {
			return globals.controller.base.prototype.getAddr(id);
		}
	};

})();
