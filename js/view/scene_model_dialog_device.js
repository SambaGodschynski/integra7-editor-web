//
//	scene_model_dialog_device.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

	$('#device').button().on('click', function() {

		var cur = window.parent.globals.device.current();
		var found = window.parent.globals.device.search();

		var inputs  = [],
			outputs = [],
			netdevs = [],
			bledevs = [],

			cur_input  = null,
			cur_output = null,
			cur_net = null,
			cur_ble = null;

		if ('midi' in found) {
			inputs  = found.midi[0];
			outputs = found.midi[1];
		}
		if ('net' in found) {
			netdevs = found.net;
		}
		if ('ble' in found) {
			bledevs = found.ble;
		}

		for (var i = 0, num = cur.length; i < num; i++) {
			if (cur[i].type == 'input') {
				cur_input = cur[i];
			} else
			if (cur[i].type == 'output') {
				cur_output = cur[i];
			} else
			if (cur[i].type == 'net') {
				cur_net = cur[i];
			} else
			if (cur[i].type == 'ble') {
				cur_ble = cur[i];
			}
		}

		$('#inputs' ).empty().append('<option></option>');
		$('#outputs').empty().append('<option></option>');
		$('#netdevs').empty().append('<option></option>');
		$('#bledevs').empty().append('<option></option>');

		var doc, selected;

		doc = '';
		for (var i = 0, num = inputs.length; i < num; i++) {
			selected = (cur_input && cur_input.id == inputs[i].id) ? 'selected' : '';
			doc += (
				'<option ' + selected + '>' + inputs[i].name + '</option>'
			);
		}
		$('#inputs').append(doc);

		doc = '';
		for (var i = 0, num = outputs.length; i < num; i++) {
			selected = (cur_output && cur_output.id == outputs[i].id) ? 'selected' : '';
			doc += (
				'<option ' + selected + '>' + outputs[i].name + '</option>'
			);
		}
		$('#outputs').append(doc);

		var refreshtimer = null;
		if (('net' in found) || ('ble' in found)) {
			refreshtimer = setTimeout(refresh, 1000);
		}

		var cur_tab = 0;
		$('#tabs').tabs({
			beforeActivate: function(event, ui) {
				cur_tab = ui.newTab.index();
			}
		});

		$('#dialog-device').dialog({
			modal: true,
			width: 600,
			buttons: {
				Ok: function() {
					if (refreshtimer) clearTimeout(refreshtimer);

					window.parent.globals.device.disconnect();

					var index = -1;
					switch (cur_tab) {
						case 0:
							index = $('#inputs' ).prop("selectedIndex") - 1;
							if (index >= 0) {
								window.parent.globals.device.connect(inputs[index]);
							}
							index = $('#outputs').prop("selectedIndex") - 1;
							if (index >= 0) {
								window.parent.globals.device.connect(outputs[index]);
							}
							break;
						case 1:
							index = $('#netdevs').prop("selectedIndex") - 1;
							if (index >= 0) {
								window.parent.globals.device.connect(netdevs[index]);
							}
							break;
						case 2:
							index = $('#bledevs').prop("selectedIndex") - 1;
							if (index >= 0) {
								window.parent.globals.device.connect(bledevs[index]);
							}
							break;
					}

					$(this).dialog('close');
				},
				Cancel: function() {
					if (refreshtimer) clearTimeout(refreshtimer);
					$(this).dialog('close');
				}
			}
		});

		function refresh() {

			var opt = $('#netdevs').children('option');
			for (var i = opt.length - 1, num = netdevs.length; i < num; i++) {
				selected = (cur_net && cur_net.id == netdevs[i].id) ? "selected='selected'" : '';
				$('#netdevs').append('<option ' + selected + '>' + netdevs[i].name + '</option>');
			}

			var opt = $('#bledevs').children('option');
			for (var i = opt.length - 1, num = bledevs.length; i < num; i++) {
				selected = (cur_ble && cur_ble.id == bledevs[i].id) ? "selected='selected'" : '';
				$('#bledevs').append('<option ' + selected + '>' + bledevs[i].name + '</option>');
			}

			refreshtimer = setTimeout(refresh, 3000);
		}

	});

});
