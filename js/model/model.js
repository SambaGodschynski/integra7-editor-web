//
//	model.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

(function(globals) {

	globals.model.option = {};

	var data = [];
	var root = model_excmap();

	/* initialize */
	(function(a) {
		var offset = 0;
		for (var i = 0, num = a.length; i < num; i++) {
			var obj = a[i];
			if (!obj.nibbled) {
				obj.addr = nibble(obj.addr);
				obj.nibbled = true;
			}
			if ('node' in obj) {
				obj.offset = offset;
				if (obj.node === undefined) {
					globals.log('model.js: init(): node undefined - ' + obj.desc);
				} else if (obj.node != null) {
					offset += arguments.callee(obj.node);
				}
			} else {
				offset++;
			}
		}
		return offset;
	})(root);

	var getnode = function(id) {
		var a = root, addr = 0, offset = 0;
		if (id != null) {
			var splits = id.split('-'); splits.shift();
			for (var i = 0, len = splits.length; i < len; i++) {
				for (var j = 0, num = a.length; j < num && a[j].id != splits[i]; j++) ;
				if (j == num) return null;
				addr += a[j].addr;
				offset += a[j].offset;
				a = a[j].node;
			}
		}
		return { node:a, addr:addr, offset:offset };
	};

	var getleaf = function(a, addr, offset, id) {
		for (var i = (a.length - 1); i >= 0; i--) {
			var obj = a[i];
			if (addr >= obj.addr) {
				if ('node' in obj) {
					return (obj.node != null) ?
						arguments.callee(obj.node,
							addr - obj.addr, obj.offset + offset, id + '-' + obj.id) : null;
				} else if (addr == obj.addr) {
					var opt = null;
					if (('opt' in obj) && ('pos' in obj))
						opt = globals.model.option[obj.opt].get(a, obj, data, offset);
					var v = data[offset + i];
					if (v == null) /* null or undefined ? */
						v = opt ? opt.leaf.init : obj.init;
					return { bid:id, block:a, index:i, leaf:obj, offset:offset, value:v, opt:opt };
				}
				break;
			}
		}
		return null;
	};
	/* get data  */
	globals.model.getData = function() {
		return data;
	};
	globals.model.setData = function(d) {
		data = d;
	};

	
	/* reset model */
	globals.model.reset = function() {
		data = [];
		for (prop in globals.model.option) {
			globals.model.option[prop].reset();
		}
	};

	/* serialize/deserialize the model */
	globals.model.serialize = function() {
		return JSON.stringify(data);
	}

	globals.model.deserialize = function(s) {
		globals.model.reset();
		data = JSON.parse(s);
	}

	/* get value from model */
	globals.model.get = function(addr) {

		var o = getleaf(root, nibble(addr), 0, ID_PREFIX);
		if (o == null) {
			globals.log('model.js: get(): addr(' + addr.toString(16) + ') not found.');
			return null;
		}

		var v = o.value;
		var leaf = o.opt ? o.opt.leaf : o.leaf;
		var stringer = globals.model.stringer[leaf.id];

		return {
			id: o.bid + '-' + o.leaf.id,
			desc: leaf.desc,
			type: (o.leaf.bytes > INTEGER_MASK) ? 'integer' : 'ascii',
			min: leaf.min,
			max: leaf.max,
			value: v,
			string: stringer ? stringer.getString(v - leaf.min) :
						((o.leaf.bytes > INTEGER_MASK) ? (v - leaf.min) : v),
			unit: stringer ? stringer.getUnit() : '',
			stringer: stringer ? stringer : null
		};
	};

	/* get { min: , max: } from model */
	globals.model.range = function(addr) {
		var o = globals.model.get(addr);
		return o ? { min:o.min, max:o.max } : undefined;
	};

	/* get value from model */
	globals.model.getValue = function(addr) {
		var o = globals.model.get(addr);
		return o ? o.value : undefined;
	};

	/* get string related value from model */
	globals.model.getString = function(addr) {
		var o = globals.model.get(addr);
		return o ? o.string : undefined;
	};

	globals.model.put = function(addr, v /*, dt1 */) {

		var o = getleaf(root, nibble(addr), 0, ID_PREFIX);
		if (o == null) {
			globals.log('model.js: put(): addr(' + addr.toString(16) + ') not found.');
			return;
		}

		if (v == o.value)
			return;

		if (o.leaf.bytes > INTEGER_MASK) {
			var leaf = o.opt ? o.opt.leaf : o.leaf;
			if (v < leaf.min)
				v = leaf.min;
			if (v > leaf.max)
				v = leaf.max;
		} else if (v.length > o.leaf.bytes) { /* v is ASCII String */
			v = v.substring(0, o.leaf.bytes);
		}
		data[o.offset + o.index] = v;

		if (arguments.length < 3 || arguments[2] == true) {
			var dt1 = [];
			make_dt1_data(v, o.leaf.bytes, dt1);
			globals.communicator.dt1(addr, dt1);
		}

		globals.observer.notify('model', o.bid + '-' + o.leaf.id);

		if (('opt' in o.leaf) && !('pos' in o.leaf)) {
			globals.model.option[o.leaf.opt].put(o, v, data);
		}
	};

	var make_dt1_data = function(v, bytes, dt1) {
		switch (bytes) {
			case INTEGER1x1:
			case INTEGER1x2:
			case INTEGER1x3:
			case INTEGER1x4:
			case INTEGER1x5:
			case INTEGER1x6:
			case INTEGER1x7:
				dt1.push(v & 0x7f);
				break;

			case INTEGER2x4:
				dt1.push((v >>> 4) & 0xf);
				dt1.push( v        & 0xf);
				break;

			case INTEGER4x4:
				dt1.push((v >>> 12) & 0xf);
				dt1.push((v >>>  8) & 0xf);
				dt1.push((v >>>  4) & 0xf);
				dt1.push( v         & 0xf);
				break;

			default: /* ASCII String */
				var len = v.length;
				for (var i = 0; i < bytes; i++) {
					var ch = (i < len) ? v.charCodeAt(i) : 0x20; /* 0x20 = ' ' */
					if (ch < 0x20 || 0x7f < ch) {
						globals.log('(model.js: make_dt1_data(): illegal char code: ' + ch);
						ch = 0x20;
					}
					dt1.push(ch);
				}
				break;
		}
	};
	globals.model.make_dt1_data = make_dt1_data;
	
	/* received DT1 from communicator */
	globals.model.recv = function(addr, dataS) {

		var o = getleaf(root, nibble(addr), 0, ID_PREFIX);
		if (o == null) {
			globals.log('model.js: recv(): addr(' + addr.toString(16) + ') not found.');
			return;
		}

		var bid    = o.bid;
		var block  = o.block;
		var addr0  = o.leaf.addr;
		var offset = o.offset + o.index;

		for (var i = o.index, num = block.length; i < num; i++, offset++) {

			var leaf = block[i];
			var pos = (leaf.addr - addr0) * 2;
			var datalen = dataS.length - pos;
			if (datalen <= 0)
				break;

			var v;
			switch (leaf.bytes) {
				case INTEGER1x1:
				case INTEGER1x2:
				case INTEGER1x3:
				case INTEGER1x4:
				case INTEGER1x5:
				case INTEGER1x6:
				case INTEGER1x7:
					if (datalen < 2) return;
					v = (parseInt(dataS.substring(pos, pos + 2), 16) & 0x7f);
					if (v < leaf.min)
						v = leaf.min
					if (v > leaf.max)
						v = leaf.max
					break;

				case INTEGER2x4:
					if (datalen < 4) return;
					v = ((parseInt(dataS.substring(pos,     pos + 2), 16) & 0xf) << 4) |
						 (parseInt(dataS.substring(pos + 2, pos + 4), 16) & 0xf);
					if (v < leaf.min)
						v = leaf.min
					if (v > leaf.max)
						v = leaf.max
					break;

				case INTEGER4x4:
					if (datalen < 8) return;
					v = ((parseInt(dataS.substring(pos,     pos + 2), 16) & 0xf) << 12) |
						((parseInt(dataS.substring(pos + 2, pos + 4), 16) & 0xf) <<  8) |
						((parseInt(dataS.substring(pos + 4, pos + 6), 16) & 0xf) <<  4) |
						 (parseInt(dataS.substring(pos + 6, pos + 8), 16) & 0xf);
					if (v < leaf.min)
						v = leaf.min
					if (v > leaf.max)
						v = leaf.max
					break;

				default: /* ASCII String */
					var n = leaf.bytes * 2; if (datalen < n) return;
					v = '';
					for (var j = 0; j < n; j += 2)
						v += String.fromCharCode(
							parseInt(dataS.substring(pos + j, pos + j + 2), 16));
					break;
			}

			data[offset] = v;

			if (('opt' in leaf) && !('pos' in leaf)) {
				globals.model.option[leaf.opt].reset();
			}

			globals.observer.notify('model', bid + '-' + leaf.id);

		}
	};

	var readtimer = null;
	var synctimer = null;

	globals.model.abortRead = function() {
		clearInterval(readtimer);
		readtimer = null;
        globals.communicator.stopWatchDog();
        globals.observer.notify('read', 'end');
        globals.communicator.clear_rq1();
	
	};
	
	globals.model.isReading = function() {
		return (readtimer === null) ? false : true;
	};
	
	
	globals.model.abortSync = function() {
		clearInterval(synctimer);
		synctimer = null;
		globals.communicator.stopWatchDog();
        globals.observer.notify('sync', 'end');
	};
	
	/* excmap read */
	globals.model.read = function() {
		if (readtimer) return;
		if (synctimer) return;

		var list = [], i = 0;

		do {
			var id = (arguments.length > 0) ? arguments[i++] : null;
			var o = getnode(id);
			if (o == null) {
				globals.log('model.js: read(): id(' + id + ') not found.');
				return;
			}

			(function(a, addr) {
				for (var i = (a.length - 1); i >= 0; i--) {
					var obj = a[i];
					if ('node' in obj) {
						if (obj.node != null) {
							arguments.callee(obj.node, obj.addr + addr);
						}
					} else {
						var bytes = obj.bytes;
						if (bytes > INTEGER_MASK)
							bytes >>>= 16;
							bytes += obj.addr;
							var t = parseInt(bytes / 2);//parseInt(bytes * 1000 / 3125);
							list.push({ addr:expand(addr), size:expand(bytes), wait:t });
							return;
					}
				}
			})(o.node, o.addr);
		} while (i < arguments.length);

		globals.observer.notify('read', 'start');

		function each_rq1(list) {
			var cnt = 0;

			var time = new Date();
			var t0 = time.getTime();
			var wait = 0;

			return function() {
				if (cnt < list.length) {
					time = new Date();
					var t = time.getTime();
					if (wait > t - t0) return;
					t0 = t;
					wait = list[cnt].wait;
					globals.communicator.rq1(list[cnt++]);
					
					var proc = parseInt( (cnt * 100) / list.length);
					globals.observer.notify('read', proc.toString());
				} else {
					clearInterval(readtimer);
					readtimer = null;
					globals.observer.notify('read', 'end');
				}
			};
		}
		readtimer = setInterval(each_rq1(list), 20);
	};

	/* excmap sync */
	globals.model.sync = function(id) {
		if (readtimer) {
			clearInterval(readtimer);
			readtimer = null;
			globals.observer.notify('read', 'end');
		}
		if (synctimer) {
			clearInterval(synctimer);
			synctimer = null;
			globals.observer.notify('sync', 'end');
		}

		var list = [], i = 0;

		do {
			var id = (arguments.length > 0) ? arguments[i++] : null;
			var o = getnode(id);
			if (o == null) {
				globals.log('model.js: sync(): id(' + id + ') not found.');
				return;
			}
			(function(a, addr, offset) {
				for (var i = 0, num = a.length; i < num; i++) {
					var obj = a[i];
					if ('node' in obj) {
						if (obj.node != null) {
							arguments.callee(obj.node, obj.addr + addr, obj.offset + offset);
						}
					} else {
						list.push({ block:a, addr:addr, offset:offset });
						return;
					}
				}
			})(o.node, o.addr, o.offset);
		} while (i < arguments.length);

		globals.observer.notify('sync', 'start');

		function each_dt1(list) {
			var cnt = 0;
			return function() {
				if (cnt < list.length) {

					var block  = list[cnt].block;
					var addr   = list[cnt].addr;
					var offset = list[cnt].offset;

					var dt1 = [], start = 0;
					for (var i = 0, num = block.length; i < num; i++) {
						var leaf = block[i];
						var v = data[offset + i];
						if (v == null)	{ /* null or undefined ? */
							var opt = null;
							if (('opt' in leaf) && ('pos' in leaf))
								opt = globals.model.option[leaf.opt].get(block, leaf, data, offset);
							v = opt ? opt.leaf.init : leaf.init;
						}
						make_dt1_data(v, leaf.bytes, dt1);
						if (i < num - 1) {
							var bytes = leaf.bytes;
							if (bytes > INTEGER_MASK)
								bytes >>>= 16;
							if (block[i+1].addr != (leaf.addr + bytes)) {
								globals.communicator.dt1(expand(addr + block[start].addr), dt1);
								dt1 = [];
								start = i + 1;
							}
						}
					
					}
					globals.communicator.dt1(expand(addr + block[start].addr), dt1);
				
					cnt++;
					var proc = parseInt( (cnt * 100) / list.length);
					globals.observer.notify('sync', proc.toString());
			
					
				} else {
					clearInterval(synctimer);
					synctimer = null;
					globals.observer.notify('sync', 'end');
				}
			}
		}
		synctimer = setInterval(each_dt1(list), 85);
	};

	function nibble(x) {
		return (
			((x & 0x7f000000) >>> 3) |
			((x & 0x007f0000) >>> 2) |
			((x & 0x00007f00) >>> 1) |
			((x & 0x0000007f))
		);
	}

	function expand(x) {
		return (
			((x & 0x0fe00000) << 3) |
			((x & 0x001fc000) << 2) |
			((x & 0x00003f80) << 1) |
			((x & 0x0000007f))
		);
	}

	/* debug function of model */
	globals.model.list = function(descends, callback) {
		var a = root;
		var addr = 0;
		var id = ID_PREFIX;
		for (var i = 0; i < descends.length; i++, a = a.node) {
			a = a[descends[i]];
			addr += a.addr; id = id + '-' + a.id;
		}
		var info = [];
		for (var i = 0, num = a ? a.length : 0; i < num; i++) {
			info.push({
				id: id + '-' + a[i].id,
				desc: a[i].desc,
				type: ('bytes' in a[i]) ? 'leaf' : 'node'
			});
		}
		callback(info);
	};

})(window.globals);
