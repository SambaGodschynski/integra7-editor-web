//
//  scene_effects_controller.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

//////////////////////////////////////////////////////////////////////

window.parent.globals.controller.effects = new window.parent.globals.controller.base_tone();		


window.parent.globals.controller.effects.getVal = function (id, v) {
	var ret;
	
	if (id.indexOf("-_PRF-_FPEQ1") !== -1) {
		part = window.parent.globals.parameter.db.curPart;	
		var newId = id.replace(/\d+/, part+1);
		ret = window.parent.globals.controller.base_tone.prototype.getVal(newId);	
	} else {
		ret = window.parent.globals.controller.base_tone.prototype.getVal(id);
	}

	return ret;
};

window.parent.globals.controller.effects.get = function (id, v) {
	var ret;
		
	if (id.indexOf("-_PRF-_FPEQ1") !== -1) {
		part = window.parent.globals.parameter.db.curPart;	
		var newId = id.replace(/\d+/, part+1);
		ret = window.parent.globals.controller.base_tone.prototype.get(newId);	
	} else {
		ret = window.parent.globals.controller.base_tone.prototype.get(id);
	}

	return ret;
};

window.parent.globals.controller.effects.put = function (id, v) {
	if (id.indexOf("-_PRF-_FPEQ1") !== -1) {
		part = window.parent.globals.parameter.db.curPart;	
		var newId = id.replace(/\d+/, part+1);
		window.parent.globals.controller.base_tone.prototype.put(newId, v);
	} else {
		window.parent.globals.controller.base_tone.prototype.put(id, v);
	}


};


window.parent.globals.controller.effects.string = function (id) {
	
	if (id.indexOf("-_PRF-_FPEQ1") !== -1) {
		part = window.parent.globals.parameter.db.curPart;	
		var newId = id.replace(/\d+/, part+1);
		window.parent.globals.controller.base_tone.prototype.string(newId);
	} else {
		window.parent.globals.controller.base_tone.prototype.string(id);
	}


};

window.parent.globals.controller.effects.getString = function (id) {
	
	if (id.indexOf("-_PRF-_FPEQ1") !== -1) {
		part = window.parent.globals.parameter.db.curPart;	
		var newId = id.replace(/\d+/, part+1);
		return window.parent.globals.controller.base_tone.prototype.getString(newId);
		
	} else {
		return window.parent.globals.controller.base_tone.prototype.getString(id);	
	}


};

