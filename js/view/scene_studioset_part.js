//
//  scene_studioset_part.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

    var ctrl = window.parent.globals.controller.studioset_part;
	var curId = '';

/* Make blank table */
    var createTable = function(obj, id) {
        $('th',id).empty();
        $('td',id).empty();
    /* Make thead */
        var trhead = $('<tr/>');
        var i = 0;
        for (var title in obj) {
            $('<th id="'+id+'_head-'+i+'" />').text(obj[title]).appendTo(trhead);
            i++;
        }
        $('thead.'+id+'Data').append(trhead);
    /* table css */
        $('#'+id+'_head-0').css({'width':'40px','min-width':'40px'});

    /* Make tbody */
        var objLen = 0;
        for (var key in obj) {
            objLen++;
        }
        for (var i = 0; i < 16; i++) {
            var objLength = objLen;
            var trbody = $('<tr/>');
            for (var j = 0; j<objLength; j++) {
                $('<td valign="middle" align="center" />').text('').appendTo(trbody).addClass(id+'_col-'+j);
            }
            $('tbody.'+id+'Data').append(trbody);
        }
        $.each($('.'+id+'_col-0'),function(p){
            var partNumber = (("00"+(p+1)).slice(-2));
            $(this).text(partNumber);
        });
    /* Add id to <tr> */
        $.each($('tr', 'tbody.'+id+'Data'),function(i){
            $(this).attr('id', id+'_part-'+(i+1));
        });
    };

/* Create Slider */
    var createSlider = function (id, ctrl) {
		var info = ctrl.get(id);
        $('#'+id).after('<span id="'+id+'_Data">'+info.string+'</span>');
        $('#'+id).mySlider({
            range: 'min',
            value: info.value,
            min: info.min,
            max: info.max,
            slide: function(event, ui) {
				curId = id;
                ctrl.put(id, ui.value);
				curId = '';
                $('#'+id+'_Data').text(ctrl.getString(id));
            }
        })
        .css({
            'width':'60%',
            'float':'left',
            'margin':'2px',
            'margin-left':'10px'
        });
        $('#'+id+'_Data').text(info.string).css({
            'width': '30px',
            'float': 'right',
            'text-align': 'right',
            'padding-right':'3px'
        });
    };

/* Create Multi-Handled Slider  */
    var createDoubleSlider = function(id, ctrl) {
        var infoLo = ctrl.get(id+'LO');
        var infoUp = ctrl.get(id+'UP');

        $('#'+id+'LO').before('<span id="'+id+'LO_Data">'+infoLo.string+'</span>');
        $('#'+id+'LO').after('<span id="'+id+'UP_Data">'+infoUp.string+'</span>');

        $('#'+id+'LO_Data').css({
            'width': '30px',
            'float': 'left',
            'text-align': 'right',
            'padding-right': '3px'
        });
        $('#'+id+'UP_Data').css({
            'width': '30px',
            'float': 'right',
            'text-align': 'right',
            'padding-right': '3px'
        });
        $('#'+id+'LO').mySlider ({
            range: true,
            min: infoLo.min,
            max: infoUp.max,
            values: [ infoLo.value, infoUp.value ],
            slide: function(event, ui) {
                curId = id+'LO';
                ctrl.put(id+'LO', ui.values[0]);
                curId = id + 'UP';
                ctrl.put(id+'UP', ui.values[1]);
                curId = '';
                $('#'+id+'LO_Data').text(ctrl.getString(id+'LO'));
                $('#'+id+'UP_Data').text(ctrl.getString(id+'UP'));
            }
        })
        .css({
            'width': '50%',
            'float': 'left',
            'margin':'2px',
            'margin-left': '8px'
        });
    };

/* create Button */
    var createButton = function (id, ctrl) {
        var info = ctrl.get(id);
        var initValue = info.value - info.min ? true :false;
        $('#'+id).after('<label for='+id+'>'+info.string+'</label>');
        $('#'+id).prop('checked', initValue);
        $('#'+id).button().click(function(){
            curId = id;
            ctrl.put(id, ((this.checked) ? info.max : info.min));
            var label = ctrl.getString(id);
            $('label[for='+id+'] span.ui-button-text').text(label).bind('selectstart', function(){ return false; });
            curId = '';
        })
        .keydown(function(e){
            if(e.keyCode === 38 || e.keyCode === 40){
                return false;
            }
        })
        .keyup(function(e){
            switch(e.keyCode){
                case 38: // Key[↑]
                    curId = id;
                    ctrl.put(id, info.max);
                    $('#'+id).prop('checked', true);
                    $('label[for='+id+'] span.ui-button-text').text(ctrl.getString(id));
                    curId = '';
                    $('#'+id).button('refresh');
                    break;

                case 40: // Key[↓]
                    curId = id;
                    ctrl.put(id, info.min);
                    $('#'+id).prop('checked', false);
                    $('label[for='+id+'] span.ui-button-text').text(ctrl.getString(id));
                    curId = '';
                    $('#'+id).button('refresh');
                    break;

                default:
                    break;
            }
        });
    };

    var createSelector = function (id, ctrl) {
        var info = ctrl.get(id);
        var opt = info.stringer.enumrate();
        var doc = '';
        for (var j = 0, len = opt.length; j < len; j++) {
            var selected = ((info.min + j) == info.value) ? "selected='selected'" : '';
            doc += (
                '<option value="' + (info.min + j) + '"' + selected + '>' +
                opt[j] +
                '</option>'
            );
        }
        $('#'+id).append(doc);

        var msbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB";
        var lsbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_LSB";
        var pcId = "PRM-_PRF-_FP1-NEFP_PAT_PC";

        $('#'+id).change(function() {

            if (id.indexOf("_PC") !== -1 ) {
                ctrl.toneChange(id, this.value);
            } else {
                curId = id;
                var value = parseInt($('option:selected', this).val(), 10);
                ctrl.put(id, value);
                curId = '';
            }
        });
    };


	function listner(ev, param) {
		var id = param;

		if (ev == 'model') {
			if (id === curId) return;
			var item = $("#" + id);
			if (item.length ) {
				update(id, item);
			} else if (id.indexOf("-NEFP_KRANGE_UP") > 0 || id.indexOf("-NEFP_VRANGE_UP") > 0 ) {
				var loId = id.replace("UP", "LO");
				$("#"+loId).mySlider('values', [ctrl.getVal(loId), ctrl.getVal(id)]);
				$('#'+id+'_Data').text(ctrl.getString(id));
			} else if (id === "PRM-_PRF-_FC-NEFC_SOLO_PART") {
				var val =  ctrl.getVal(id);

				for (var i = 0; i < 16; i++) {
					var $item = $("#part_"+ i + "SoloSw");
					$item.removeClass('soloPart');
					$item.prop('checked', false);
                    $item.button('refresh');
				}

				if (val !== 0) {
                    var $item = $("#part_"+ val + "SoloSw");
					$item.addClass('soloPart');

					$item.prop('checked',(val) ? true : false).button('refresh');

				}
			}
		}
	}

	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_studioset_part');
	};

	window.parent.globals.observer.append('scene_studioset_part', listner);


	var msbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB";
	var lsbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_LSB";
	var pcId = "PRM-_PRF-_FP1-NEFP_PAT_PC";

	function update(id, item) {

		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

		switch (divName) {
		default:

			if ( o.max - o.min === 1 ) {
				var val = ctrl.getVal(id);
                $('label[for='+id+'] span.ui-button-text').text(o.string);
                item.prop('checked',(o.value - o.min) ? true : false).button('refresh');
			} else if (item.mySlider( 'option', 'values' ) !== null) {
				item.mySlider('values', [o.value, ctrl.getVal(id.replace("LO", "UP"))]);
				$('#'+id+'_Data').text(o.string);
			} else {
				item.mySlider('value', o.value);
				$('#'+id+'_Data').text(o.string);
			}
			break;
		case "SELECT":
			var cnvId = id.replace(/\d+/, 1); // PART* -> PART1
			var part = id.match(/\d+/) - 1;

			switch (cnvId) {
			default:
				item.val(o.value);
				break;
			case msbId:
			case lsbId:
			case pcId:
				ctrl.typeSelectUpdate(part);
				ctrl.bankSelectUpdate(part);
				ctrl.toneSelectUpdate(part);
				ctrl.categorySelectUpdate(part);
				break;
			}
			break;
		}
	}


// =============================================
//   TONE
// =============================================
	ctrl.selectTone = function () {

		var contents = window.parent.globals.parameter.db.curContents;
		window.parent.globals.parameter.db.contentsAreaScene[contents] = 0;

        $(".partData").empty();

        $("#title").empty().append("TONE");

        var toneObj = {
            'part_':'PART',
            'type_':'TYPE',
            'bank_':'BANK',
            'category_':'CATEGORY',
            'tone_':'TONE',
            'mute_':'MUTE',
            'solo_':'SOLO'
        };
        createTable (toneObj, 'part');

    /* table css */
        $('#part_head-4').css('min-width','100px');

    /* [type] */
        $('#part .part_col-1').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_BS_MSB';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
        });

    /* [bank] */
        $('#part .part_col-2').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_BS_LSB';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
        });

    /* [category] */
        $('#part .part_col-3').each(function(i){
            $(this).html( '<div id="category_' + (i+1) + '"></div>');
        });

	/* [tone] */
        $('#part .part_col-4').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_PC';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
        });

	/* [mute] */
        $('#part .part_col-5').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_MUTE_SW';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [solo] */
        $('#part .part_col-6').each(function(i){
            $(this).html('<input type="radio" id="part_' + (i+1) + 'SoloSw" name="solo" /><label for="part_' + (i+1) + 'SoloSw" onSelectStart="return false">SOLO</label>');
        });

        /* Enable uncheck all checkboxes */
        var soloPart = ctrl.getString("PRM-_PRF-_FC-NEFC_SOLO_PART");
        if (soloPart !== 'OFF' ) {
            $('input[id=part_' + soloPart + 'SoloSw]').prop('checked', true);
        }

        $('input[id$=SoloSw]').each(function(i){
            $('#'+this.id).button().click(function () {
                if ($(this).hasClass('soloPart')) {
                    $(this).removeClass('soloPart').prop('checked', false).button('refresh');
                    ctrl.put("PRM-_PRF-_FC-NEFC_SOLO_PART", 0);
                } else {
                    $('input[name="solo"]').removeClass('soloPart');
                    $(this).addClass('soloPart');
                    /* Add class to latest checked button */
                    ctrl.put("PRM-_PRF-_FC-NEFC_SOLO_PART", i+1);
                }
            })
            .keydown(function(e){
                if(e.keyCode === 38 || e.keyCode === 40){
                    return false;
                }
            })
            .keyup(function(e){
                switch(e.keyCode){
                    case 38: // Key[↑]
                        if ($(this).hasClass('soloPart')) {
                        } else {
                            $('input[name="solo"]').removeClass('soloPart');
                            $(this).addClass('soloPart');
                            /* Add class to latest checked button */
                            ctrl.put("PRM-_PRF-_FC-NEFC_SOLO_PART", i+1);
                        }
                        break;

                    case 40: // Key[↓]
                        if ($(this).hasClass('soloPart')) {
                            $(this).removeClass('soloPart').prop('checked', false).button('refresh');
                            ctrl.put("PRM-_PRF-_FC-NEFC_SOLO_PART", 0);
                        }
                        break;

                    default:
                        break;
                }
            });
        });

        // Ext Part
        var ex = (
            '<tr id="exPart">'+
            '<td align="center">EX</td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td align="center"><input type="checkbox" id="PRM-_PRF-_FC-NEFC_IN_MUTE_SW"></td>'+
            '<td></td>'+
            '</tr>'
        );

        $('tbody.partData').append(ex);
            createButton('PRM-_PRF-_FC-NEFC_IN_MUTE_SW', ctrl);


        for (var i = 0; i < 16; i++) {
            ctrl.init(i ,
                $('#PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_BS_MSB'),
                $('#PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_BS_LSB'),
                $('#PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_PC')	,
                $('#category_'+(i+1))
            );

            ctrl.typeSelectUpdate(i);
            ctrl.bankSelectUpdate(i);
            ctrl.toneSelectUpdate(i);
            ctrl.categorySelectUpdate(i);
        }

    };

// =============================================
//   LEVEL / CH
// =============================================
	ctrl.selectLevelCh = function () {

		var contents = window.parent.globals.parameter.db.curContents;
		window.parent.globals.parameter.db.contentsAreaScene[contents] = 1;

        $(".partData").empty();

        $("#title").empty();
        $("#title").append("LEVEL/CH");

        var levelChObj = {
            'part_' : 'PART',
            'level_' : 'LEVEL',
            'pan_' : 'PAN',
            'cho_' : 'CHORUS SEND LEVEL',
            'rev_' : 'REVERB SEND LEVEL',
            'output_' : 'OUTPUT ASSIGN',
            'rxSw_' : 'RX SW',
            'rxCh_' : 'RX CH',
            'monoPoly_' : 'MONO / POLY',
            'legatoSw_' : 'LEGATO SW',
            'voiceReserve_' : 'VOICE RESERVE'
        };
        createTable (levelChObj, 'part');

	/* table css */
        $('#part_head-1, #part_head-2, #part_head-3, #part_head-4').css({'width':'13%','min-width':'60px'});
        $('#part_head-5, #part_head-7').css({'width':'7%'});
        $('#part_head-8, #part_head-9, #part_head-10').css('width','8%');

    /* [Level] */
        $('#part .part_col-1').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_LEVEL';
            $(this).html('<div id="'+id+'"></div>');
            createSlider(id, ctrl);
        });

    /* [Pan] */
        $('#part .part_col-2').each(function(i){
            var id= 'PRM-_PRF-_FP'+(i+1)+'-NEFP_PAN';
            $(this).html('<div id="'+id+'"></div>');
            createSlider(id, ctrl);
        });

    /* [Cho Send Level] */
        $('#part .part_col-3').each(function(i){
            var id= 'PRM-_PRF-_FP'+(i+1)+'-NEFP_CHO_SEND';
            $(this).html('<div id="'+id+'"></div>');
            createSlider(id, ctrl);
        });

    /* [Rev Send Level] */
        $('#part .part_col-4').each(function(i){
            var id= 'PRM-_PRF-_FP'+(i+1)+'-NEFP_REV_SEND';
            $(this).html('<div id="'+id+'"></div>');
            createSlider(id, ctrl);
        });

    /* [output assign] */
        $('#part .part_col-5').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_OUT_ASGN';
            $(this).html('<select id="'+id+'"></select>');
            createSelector(id, ctrl);
        });

    /* [Rx SW] */
        $('#part .part_col-6').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_SW';
            $(this).html('<input type="checkbox" id="'+id+'" />');
            createButton(id, ctrl);
        });

    /*[RxCh] */
        $('#part .part_col-7').each(function(i){
            var id= 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_CH';
            $(this).html('<select id="'+id+'"></select>');
            createSelector(id, ctrl);
        });

    /* [Mono/Poly] */
        $('#part .part_col-8').each(function(i){
            var id= 'PRM-_PRF-_FP'+(i+1)+'-NEFP_MONO_POLY';
            $(this).html('<select id="'+id+'"></select>');
            createSelector(id, ctrl);
        });

    /* [Legato Sw] */
        $('#part .part_col-9').each(function(i){
            var id= 'PRM-_PRF-_FP'+(i+1)+'-NEFP_LEGATO_SW';
            $(this).html('<select id="'+id+'"></select>');
            createSelector(id, ctrl);
        });

	/* [Voice Reserve] */
        $('#part .part_col-10').each(function(i){
            var id = 'PRM-_PRF-_FC-NEFC_VOICE_RESERV'+(i+1);
            $(this).html('<select id="'+id+'"></select>');
            createSelector(id, ctrl);
        });

        // Ext Part
        var ex = (
            '<tr id="exPart">'+
            '<td align="center">EX</td>'+
            '<td><div id="PRM-_PRF-_FC-NEFC_IN_LEVEL"></div></td>'+
            '<td></td>'+
            '<td><div id="PRM-_PRF-_FC-NEFC_IN_CHO_SEND_LEVEL"></div></td>'+
            '<td><div id="PRM-_PRF-_FC-NEFC_IN_REV_SEND_LEVEL"></div></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '<td></td>'+
            '</tr>'
        );

        $('tbody.partData').append(ex);
        createSlider('PRM-_PRF-_FC-NEFC_IN_LEVEL', ctrl);
        createSlider('PRM-_PRF-_FC-NEFC_IN_CHO_SEND_LEVEL', ctrl);
        createSlider('PRM-_PRF-_FC-NEFC_IN_REV_SEND_LEVEL', ctrl);

	};

// =============================================
//   PART EQ
// =============================================

	ctrl.selectPartEq = function () {

		var contents = window.parent.globals.parameter.db.curContents;
		window.parent.globals.parameter.db.contentsAreaScene[contents] = 2;

        $(".partData").empty();

        $("#title").empty();
        $("#title").append("PART EQ");

        var partEqObj = {
            'part_' : 'PART',
            'eqSw_' : 'EQ SW',
            'eqLowFreq_' : 'EQ LOW FREQ',
            'eqLowGain_' : 'EQ LOW GAIN',
            'eqMidFreq_' : 'EQ MID FREQ',
            'eqMidGain_' : 'EQ MID GAIN',
            'eqMidQ_' : 'EQ MID Q',
            'eqHighFreq_' : 'EQ HIGH FREQ',
            'eqHighGain_' : 'EQ HIGH GAIN'
        };
        createTable (partEqObj, 'part');


	/* table css */
        $('#part_head-3, #part_head-5, #part_head-8').css({'width':'16%','min-width':'60px'});

    /* [Eq SW] */
        $('#part .part_col-1').each(function(i){
            var id = 'PRM-_PRF-_FPEQ'+(i+1)+'-NEFPEQ_EQ_SW';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [EQ Low Freq] */
        $('#part .part_col-2').each(function(i){
            var id = 'PRM-_PRF-_FPEQ'+(i+1)+'-NEFPEQ_EQ_LOWFREQ';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
        });

    /* [Eq Low Gain] */
        $('#part .part_col-3').each(function(i){
            var id = 'PRM-_PRF-_FPEQ'+(i+1)+'-NEFPEQ_EQ_LOWGAIN';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
            $('#'+id+'_Data').css({'width': '50px'});
        });

    /* [EQ Mid Freq] */
        $('#part .part_col-4').each(function(i){
            var id = 'PRM-_PRF-_FPEQ'+(i+1)+'-NEFPEQ_EQ_MIDFREQ';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
        });

    /* [Eq Mid Gain] */
        $('#part .part_col-5').each(function(i){
            var id = 'PRM-_PRF-_FPEQ'+(i+1)+'-NEFPEQ_EQ_MIDGAIN';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
            $('#'+id+'_Data').css({'width': '50px'});
        });

    /* [EQ MidQ] */
        $('#part .part_col-6').each(function(i){
            var id = 'PRM-_PRF-_FPEQ'+(i+1)+'-NEFPEQ_EQ_MIDQ';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
        });

    /* [EQ High Freq] */
        $('#part .part_col-7').each(function(i){
            var id = 'PRM-_PRF-_FPEQ'+(i+1)+'-NEFPEQ_EQ_HIGHFREQ';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
        });

    /* [Eq High Gain] */
        $('#part .part_col-8').each(function(i){
            var id = 'PRM-_PRF-_FPEQ'+(i+1)+'-NEFPEQ_EQ_HIGHGAIN';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
            $('#'+id+'_Data').css({'width': '50px'});
        });
    };

// =============================================
//   KEYBOARD
// =============================================
    ctrl.selectKeyboard = function () {

		var contents = window.parent.globals.parameter.db.curContents;
		window.parent.globals.parameter.db.contentsAreaScene[contents] = 3;

        $(".partData").empty();

        $("#title").empty();
        $("#title").append("KEYBOARD");

      var keyboardObj = {
            'part_':'PART',
            'keyfl_':'KEY FADE LOWER',
            'keyRange_':'KEY RANGE LOWER / UPPER',
            'keyfu_':'KEY FADE UPPER',
            'velofu_':'VELO FADE LOWER',
            'veloRange_':'VELO RANGE LOWER / UPPER',
            'velofld_':'VELO FADE UPPER',
            'vSeneOffset_':'VELO SENS OFFSET'
        };
        createTable (keyboardObj, 'part');

    /* table css */
        $('#part_head-1, #part_head-3, #part_head-4, #part_head-6, #part_head-7').css('min-width','60px');
        $('#part_head-7').css('width','12%');
        $('#part_head-2, #part_head-5').css({'width':'18%','min-width':'95px'});

    /* [Key Fade Lower] */
        $('#part .part_col-1').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_KFADE_LO';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
        });

    /* [Key Range Lower/Upper] */
        $('#part .part_col-2').each(function(i){
            $(this).html('<div id="PRM-_PRF-_FP'+(i+1)+'-NEFP_KRANGE_LO"></div>');
            createDoubleSlider('PRM-_PRF-_FP'+(i+1)+'-NEFP_KRANGE_', ctrl);
        });

    /* [Key Fade Upper] */
        $('#part .part_col-3').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_KFADE_UP';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
        });

    /* [Velo Fade Lower] */
        $('#part .part_col-4').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_VFADE_LO';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
        });

    /* [Velo Range Lower/Upper] */
        $('#part .part_col-5').each(function(i){
            $(this).html('<div id="PRM-_PRF-_FP'+(i+1)+'-NEFP_VRANGE_LO"></div>');
            createDoubleSlider('PRM-_PRF-_FP'+(i+1)+'-NEFP_VRANGE_', ctrl);
        });

        $('#veloRange1').bind('myslidechange', function(event, ui) {
            var loId2 = 'PRM-_PRF-_FP2-NEFP_VRANGE_LO';
            var upId2 = 'PRM-_PRF-_FP2-NEFP_VRANGE_UP';
            var value = $(this).mySlider('option', 'values');
            curId = loId2;
            ctrl.put(loId2, value[0]);
            curId = upId2;
            ctrl.put(upId2, value[1]);
            curId = '';
        });

    /* [Velo Fade Upper] */
        $('#part .part_col-6').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_VFADE_UP';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
        });

    /* [Velo Sens Offset] */
        $('#part .part_col-7').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_VSENS_OFST';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
        });
    };

// =============================================
//   PITCH
// =============================================
    ctrl.selectPitch = function () {

		var contents = window.parent.globals.parameter.db.curContents;
		window.parent.globals.parameter.db.contentsAreaScene[contents] = 4;

        $(".partData").empty();

        $("#title").empty();
        $("#title").append("PITCH");

        var pitchObj = {
            'part_':'PART',
            'octShift_':'OCTAVE SHIFT',
            'coaseTune_':'COARSE TUNE',
            'fineTune_':'FINE TUNE',
            'bendRange_':'BEND RANGE',
            'portaSw_':'PORTA SWITCH',
            'portaTime_':'PORTA TIME'
        };
        createTable (pitchObj, 'part');

    /* table css */
        $('#part_head-1, #part_head-2, #part_head-3, #part_head-4, #part_head-6').css({'width':'17%','min-width':'60px'});

    /* [Octave Shift] */
        $('#part .part_col-1').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_OCTAVE';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
        });

    /* [Coarse Tune] */
        $('#part .part_col-2').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_PIT_CRS';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
        });

    /* [Fine Tune] */
        $('#part .part_col-3').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_PIT_FINE';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
        });

    /* [Bend Range] */
        $('#part .part_col-4').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_BEND_RANGE';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
            $('#'+id+'_Data').css({'width': '40px'});
        });

    /* [Porta Switch] */
        $('#part_head-5').width(80);
        $('#part .part_col-5').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_PORT_SW';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
        });

    /* [Porta Time] */
        $('#part .part_col-6').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_PORT_TIME';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
            $('#'+id+'_Data').css({'width': '40px'});
        });
    };

// =============================================
//   OFFSET
// =============================================
	ctrl.selectOffset = function () {

		var contents = window.parent.globals.parameter.db.curContents;
		window.parent.globals.parameter.db.contentsAreaScene[contents] = 5;

        $(".partData").empty();

        $("#title").empty();
        $("#title").append("OFFSET");

         var offsetObj = {
             'part_':'PART',
             'cutoffOffset_':'CUTOFF OFFSET',
             'resoOffset_':'RESO OFFSET',
             'attackOffset_':'ATTACK OFFSET',
             'decayOffset_':'DECAY OFFSET',
             'releaseOffset_':'RELEASE OFFSET',
             'vibratoRate_':'VIBRATO RATE',
             'vibratoDepth_':'VIBRATO DEPTH',
             'vibratoDelay_':'VIBRATO DELAY'
         };
         createTable (offsetObj, 'part');

     /* table css */
         $('th[id*=part_head]').not('th[id=part_head-0]').css({'width':'12%', 'min-width':'60px'});

    /* [Cutoff Offset] */
         $('#part .part_col-1').each(function(i){
            var id ='PRM-_PRF-_FP'+(i+1)+'-NEFP_CUTOFF_OFST';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
         });

    /* [Reso Offset] */
         $('#part .part_col-2').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RESO_OFST';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
         });

    /* [Attack Offset] */
         $('#part .part_col-3').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_ATK_OFST';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
         });

    /* [Decay Offset] */
         $('#part .part_col-4').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_DCY_OFST';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
         });

    /* [Release Offset] */
         $('#part .part_col-5').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_REL_OFST';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
         });

    /* [Vibrato Rate] */
         $('#part .part_col-6').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_VIB_RATE';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
         });

    /* [Vibrato Depth] */
         $('#part .part_col-7').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_VIB_DEPTH';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
         });

    /* [Vibrato Delay] */
         $('#part .part_col-8').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_VIB_DELAY';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
         });
    };

// =============================================
//   SCALE
// =============================================
    ctrl.selectScale = function () {

		var contents = window.parent.globals.parameter.db.curContents;
		window.parent.globals.parameter.db.contentsAreaScene[contents] = 6;


        $(".partData").empty();

        $("#title").empty();
        $("#title").append("SCALE");

        var scaleTbl = window.parent.globals.parameter.scaleTbl;
        var scaleObj = {
            'part_':'PART',
            'type_':'TYPE',
            'key_':'KEY',
            'c_':'C',
            'c_s_':'C#',
            'd_':'D',
            'd_s_':'D#',
            'e_':'E',
            'f_':'F',
            'f_s_':'F#',
            'g_':'G',
            'g_s_':'G#',
            'a_':'A',
            'a_s_':'A#',
            'b_':'B'
        };
        createTable (scaleObj, 'part');

        var getTemperament = function(part, type) {
            var key = ctrl.getVal('PRM-_PRF-_FP'+part+'-NEFP_SCALE_KEY');
            var shift = ( 9-key >= 0 ) ? 9 - key : 9 - key + 11;
            var ofst = scaleTbl[type][9]-scaleTbl[type][shift];
            var tempAry = [];
            if ( type === 7 ) {
                for ( var i = 0; i < 12; i++){
                    var value = ( i-key >= 0 ) ? i-key : i-key+12;
                    tempAry[i] = scaleTbl[type][value];
                }
            } else {
                for ( var i = 0; i < 12; i++){
                    var index = ( i+key < 12 ) ? i+key : i+key-12;
                    tempAry[index] = scaleTbl[type][i] + ofst;
                }
            }

            $('div[id^=PRM-_PRF-_FP'+part+'-NEFP_TUNE_]').each(function(i){
                $(this).mySlider('value', tempAry[i]+64);
            });
            $('span[id^=PRM-_PRF-_FP'+part+'-NEFP_TUNE_]').each(function(i){
                var text = tempAry[i] > 0 ? '+'+tempAry[i] : tempAry[i];
                $(this).text(text);
            });
        };

    /* table css */
        $('th[id*=part_head]').not('th[id=part_head-0],th[id=part_head-1]').css('min-width','50px');

    /* [Type] */
        $('#part .part_col-1').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_SCALE_TYPE';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
            $('#'+id).bind('change', function() {
                var value = $('option:selected', this).val();
                if ( value !== '0' ) {
                    getTemperament(i+1, value-1);
                }
            });
        });

    /* [Key] */
        $('#part .part_col-2').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_SCALE_KEY';
            $(this).html('<div id='+id+'></div>');
            createSlider(id, ctrl);
            $('#'+id).bind('myslidechange', function(event, ui) {
                var part = id.slice( id.indexOf('FP')+2, id.indexOf('-NE'));
                var value = $('select#PRM-_PRF-_FP'+part+'-NEFP_SCALE_TYPE option:selected').val();
                if ( value !== '0' ) {
                    getTemperament(part, value-1);
                }
            });
        });

        var createScaleSlider = function (id, ctrl) {
            var info = ctrl.get(id);
            $('#'+id).after('<span id="'+id+'_Data">'+info.string+'</span>');
            $('#'+id).mySlider({
                range: 'min',
                value: info.value,
                min: info.min,
                max: info.max,
                slide: function(event, ui) {
                    curId = id;
                    ctrl.put(id, ui.value);
                    curId = '';
                    $('#'+id+'_Data').text(ctrl.getString(id));
                    var part = id.slice( id.indexOf('FP')+2, id.indexOf('-NE'));
                    $('#PRM-_PRF-_FP'+part+'-NEFP_SCALE_TYPE').val('0');
                    $('#PRM-_PRF-_FP'+part+'-NEFP_SCALE_KEY').mySlider('value', 0);
                    $('#PRM-_PRF-_FP'+part+'-NEFP_SCALE_KEY_Data').text('C');
                }
            })
            .css({
                'width':'60%',
                'float':'left',
                'margin':'2px',
                'margin-left':'10px'
            });
            $('#'+id+'_Data').text(info.string).css({
                'width': '30px',
                'float': 'right',
                'text-align': 'right',
                'padding-right':'3px'
            });
        };

    /* [C] */
        $('#part .part_col-3').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_C';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [C#] */
        $('#part .part_col-4').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_CS';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [D] */
        $('#part .part_col-5').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_D';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [D#] */
        $('#part .part_col-6').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_DS';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [E] */
        $('#part .part_col-7').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_E';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [F] */
        $('#part .part_col-8').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_F';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [F#] */
        $('#part .part_col-9').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_FS';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [G] */
        $('#part .part_col-10').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_G';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [G#] */
        $('#part .part_col-11').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_GS';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [A] */
        $('#part .part_col-12').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_A';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [A#] */
        $('#part .part_col-13').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_AS';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

    /* [B] */
        $('#part .part_col-14').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_TUNE_B';
            $(this).html('<div id='+id+'></div>');
            createScaleSlider(id, ctrl);
        });

        for ( var i = 1; i <= 12; i++) {
            var value = $('select#PRM-_PRF-_FP'+i+'-NEFP_SCALE_TYPE option:selected').val();
            if ( value !== '0' ) {
                getTemperament(i, value-1);
            }
        }
	};

// =============================================
//   MIDI
// =============================================
	ctrl.selectMidi = function () {

		var contents = window.parent.globals.parameter.db.curContents;
		window.parent.globals.parameter.db.contentsAreaScene[contents] = 7;

        $(".partData").empty();

        $("#title").empty();
        $("#title").append("MIDI");

        var midiObj = {
            'part_':'PART',
            'rxSwPc_':'PROGRAM CHANGE',
            'bs_':'BANK SELECT',
            'bend_':'PITCH BEND',
            'polyAft_':'POLY KEY PRESS',
            'chAft_':'CH PRESS',
            'mod_':'MODULATION',
            'vol_':'VOLUME',
            'pan_':'PAN',
            'exp_':'EXPRESSION',
            'hold_':'HOLD-1',
            'veloCrvType_':'VELO CRV TYPE'
        };
        createTable (midiObj, 'part');

	/* table css */
        $('th[id*=part_head]').not('th[id=part_head-0]').css('width','9%');

    /* [Program Change] */
        $('#part .part_col-1').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_PC';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Bank Select] */
        $('#part .part_col-2').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_BS';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Pitch Bend] */
        $('#part .part_col-3').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_BEND';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Poly Key Press] */
        $('#part .part_col-4').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_PAFT';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Ch Press] */
        $('#part .part_col-5').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_CAFT';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Modulation] */
        $('#part .part_col-6').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_MOD';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Volume] */
        $('#part .part_col-7').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_VOL';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Pan] */
        $('#part .part_col-8').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_PAN';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Expression] */
        $('#part .part_col-9').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_EXPR';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Hold-1] */
        $('#part .part_col-10').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RX_HOLD';
            $(this).html('<input type="checkbox" id='+id+' />');
            createButton(id, ctrl);
        });

    /* [Vero Crv Type] */
        $('#part .part_col-11').each(function(i){
            var id = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_VELO_CRV_TYPE';
            $(this).html('<select id='+id+'></select>');
            createSelector(id, ctrl);
        });
	};


	//default
    var scene = window.parent.globals.parameter.db.studioPartContents;
    var loadContents = window.parent.globals.parameter.db.curContents;

    if (!scene) {
        if (window.parent.globals.parameter.db.contentsAreaScene[loadContents] === null) {
            ctrl.selectTone();
        } else {
			switch (window.parent.globals.parameter.db.contentsAreaScene[loadContents]) {
			case 0: ctrl.selectTone(); break;
			case 1:	ctrl.selectLevelCh(); break;
			case 2:	ctrl.selectPartEq(); break;
			case 3:	ctrl.selectKeyboard(); break;
			case 4:	ctrl.selectPitch(); break;
			case 5:	ctrl.selectOffset(); break;
			case 6:ctrl.selectScale(); break;
			case 7:	ctrl.selectMidi(); break;
			default:
				ctrl.selectTone(); break;
			}
        }
    } else {

        switch (scene) {
            case "tone":    ctrl.selectTone(); break;
            case "levelch": ctrl.selectLevelCh(); break;
            case "parteq":  ctrl.selectPartEq(); break;
            case "keyboard":ctrl.selectKeyboard(); break;
            case "pitch":   ctrl.selectPitch(); break;
            case "offset":  ctrl.selectOffset(); break;
            case "scale":   ctrl.selectScale(); break;
            case "midi":    ctrl.selectMidi(); break;
        }
        window.parent.globals.parameter.db.studioPartContents = null;

    }

});