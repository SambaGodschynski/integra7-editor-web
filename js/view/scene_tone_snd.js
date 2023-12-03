//
//  scene_tone_snd.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

    var ctrl = window.parent.globals.controller.tone_snd;

    var createSlider = function (id, ctrl) {
        var info = ctrl.get(id);
        $('#'+id).mySlider({
            range: 'min',
            value: info.value,
            min: info.min,
            max: info.max,
            slide: function(event, ui) {
				curId  = id;
                ctrl.put(id, ui.value);
                $('#'+id+'_Data').text(ctrl.getString(id));
				curId  = '';
            }
        })
        .css({
            'width':'60%',
            'float':'left',
            'margin':'2px',
            'margin-left':'10px'
        });
        $('#'+id+'_Data').text(info.string).css({
            'width': '50px',
            'float': 'right',
            'text-align': 'right',
            'padding-right':'3px'
        });
    };

    var createButton = function (id, ctrl) {
        var info = ctrl.get(id);
        var initValue = info.value - info.min ? true :false;
        $('label[for='+id+']').text(info.string).bind('selectstart', function(){ return false; });
        $('#'+id).prop('checked', initValue);
        $('#'+id).button().click(function(){
			curId  = id;
            ctrl.put(id, ((this.checked) ? info.max : info.min));
            $('label[for='+id+'] span.ui-button-text').text(ctrl.getString(id));
			curId  = '';
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
                    $('#'+id).prop('checked', true).button('refresh');
                    $('label[for='+id+'] span.ui-button-text').text(ctrl.getString(id));
                    curId = '';
                    break;

                case 40: // Key[↓]
                    curId = id;
                    ctrl.put(id, info.min);
                    $('#'+id).prop('checked', false).button('refresh');
                    $('label[for='+id+'] span.ui-button-text').text(ctrl.getString(id));
                    curId = '';
                    break;

                default:
                    break;
            }
        });
    };

    var createSelector = function (id, ctrl) {
        var info = ctrl.get(id);
        $("#"+id).change(function() {
			curId  = id;
            var value = parseInt($('option:selected', this).val(), 10);
            ctrl.put(this.id, value);
			curId  = '';
        });
    };

    var instArray = window.parent.globals.parameter.sndInstPreset;

    var instBankArray = [
        { text: 'INT' },
        { text: 'ExSN6' }
    ];

    var variArray = [
        { text: 'OFF'},
        { text: 'FLAM1'},
        { text: 'FLAM2'},
        { text: 'FLAM3'},
        { text: 'BUZZ1'},
        { text: 'BUZZ2'},
        { text: 'BUZZ3'},
        { text: 'ROLL'}
    ];

    var curBankArray = instBankArray.slice(0);

    var bank = 'INT';
    var vari = 'Flam/Buzz/Roll';
    var num = '0';

    var makeInstList = function(){
        $('select#instNumber').empty();
        $.each(instArray, function(i){
            $('select#instNumber').append($('<option>', { value : i, text : this.desc } ));
            if ( this.bank !== bank) {
                $('select#instNumber').children('[value='+i+']').remove();
            }
        });
        // INT start 000 , ExSN6 start 001
        var add = parseInt($('select#instNumber option:first-child').val() ,10) ? 1 : 0;
        $('select#instNumber option').each(function(j){
            $(this).prepend(('00'+(j+add)+' : ').slice(-6));
        });
    };

	var curId = '';
	var lastBank = null;
	function listner(ev, param) {
		var id = param;
		var part;
		if (id.indexOf("-_FPART") > 0) {
			part = id.match(/\d+/) - 1; // 1..16
			id = id.replace(/\d+/, 1); // PART* -> PART1
		}

		if (ev == 'model') {
			if (id === curId) return;
			var item = $("#" + id);
			if (item.length) {
				update(id, item);
			} else if (id.indexOf("-SDKN_INST_NUM") > 0 ) {
				//PRM-_FPART5-_KIT-_KN36-SDKN_INST_NUM

				var numbers = id.match(/\d+/g);

                var partialNum = parseInt(numbers[1], 10);
				if ( partialNum !== window.parent.globals.parameter.db.sndCurPartial ) return;

				var num = 0;

				num = ctrl.getVal("PRM-_FPART"+(part+1) + "-_KIT-_KN"+ numbers[1] + "-SDKN_INST_NUM");

                var info = parseInstIndexNumByPrm(parseInt(num, 10));

                var instNum = info.inst;
                var bankNum = info.bank;

                if (bankNum !== lastBank) {
                    bank = instBankArray[bankNum].text;
                    makeInstList();
                }

                lastBank = bankNum;

                var elementId0 = $("#instBank");
                var elementId1 = $("#instNumber");

				elementId0.val(bankNum);
				elementId1.val(instNum);

                instParam(num);
			}
		}
	}

	/* append/remove update listener to observer */
	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_tone_snd');
	};
	window.parent.globals.observer.append('scene_tone_snd', listner);

	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

		switch (divName) {
		case "SELECT":
			item.val(o.value);
			break;
		default:
			if ( (o.max - o.min) === 1 ) {
                $('label[for='+id+'] span.ui-button-text').text(o.string);
                item.prop('checked',(o.value - o.min) ? true : false).button('refresh');
			} else {
				item.mySlider('value', o.value);
				$('#'+id+'_Data').text(o.string);
			}
			break;
		}
    }
//]
	function parseInstIndexNumByPrm(num) {

		var bankVal;

		for ( var i in instArray) {
			if (instArray[i].num === num) {

				for (var j in instBankArray) {
					if (instBankArray[j].text === instArray[i].bank) {
						bankVal = j;
						break;
					}
				}
				var obj = {
					inst: i,  // 0..
					bank: bankVal // 0..
                };
				return obj;
			}
		}
		// error
	}

    $('td:last-child', 'table.toneSndTable tr').each(function(){
        var id = $(this).attr('class');
        var doc = '';
        var trClass = $(this).closest('tr').attr('class');
        if ( trClass === 'selector' ){
            doc += '<select id='+id+'>';
            var info = ctrl.get(id);
            var opt = info.stringer.enumrate();
            for (var j = 0, len = opt.length; j < len; j++) {
                var selected = ((info.min + j) == info.value) ? "selected='selected'" : '';
                doc += (
                    '<option value="' + (info.min + j) + '"' + selected + '>' +
                    opt[j] +
                    '</option>'
                );
            }
            doc += '</select>';
        } else if ( trClass === 'slider' ) {
            doc += (
                '<div id="'+id+'"></div>'+
                '<span id="'+id+'_Data"></span>'
            );
        } else {
            doc += (
                '<input type="checkbox" id="'+id+'" />'+
                '<label for="'+id+'"></label>'
            );
        }
        $(this).append(doc);
    });


    function instParam(num) {
        if ('amb' in instArray[num]) {
            $('.PRM-_FPART1-_KIT-_KC-SDKC_AMBIENCE_LEVEL').parent('tr').show();
        } else {
            $('.PRM-_FPART1-_KIT-_KC-SDKC_AMBIENCE_LEVEL').parent('tr').hide();
        }

        if ('width' in instArray[num]) {
            $('td[class*=SDKN_STEREO_WIDTH]').parent('tr').show();
        } else {
            $('td[class*=SDKN_STEREO_WIDTH]').parent('tr').hide();
        }

        var variId = $('select[id*=SDKN_FLAM_CTRL]').attr('id');
        if ('vari' in instArray[num]) {
            $('#'+variId).closest('tr').show();
            if (instArray[num].vari !== vari) {
                vari = instArray[num].vari;
                $('#'+variId).empty();
                $.each(variArray, function(i){
                    this.value = i;
                    $('#'+variId).append($('<option>', this));
                });
                switch (vari) {
                    case 'Flam/Buzz':
                        $('#'+variId).children('[value=7]').remove();
                        break;
                    default :
                        break;
                }
            }
        } else {
            vari = null;
            $('#'+variId).closest('tr').hide();
        }
    }

    var currentPartial;
    var instId;

    ctrl.curPartialChanged = function () {
        currentPartial = window.parent.globals.parameter.db.sndCurPartial;

        instId = ('PRM-_FPART1-_KIT-_KN_partial_-SDKN_INST_NUM').replace(/_partial_/, currentPartial);
        num = ctrl.getVal(instId);

        $('select#instBank').empty();
        $.each(instBankArray, function(i){
            this.value = i;
            $('select#instBank').append($('<option>', this));
        });

        var curExpansion = window.parent.globals.parameter.db.curExpansion;
        if ( $.inArray(18, curExpansion) === -1) {
            $('select#instBank option[value=1]').remove();
        }

        if ( num > 168 ){
            bank = 'ExSN6';
            $('select#instBank').val(1);
        } else {
            bank = 'INT';
            $('select#instBank').val(0);
        }

        function updateBankList() {

            var curExpansion = window.parent.globals.parameter.db.curExpansion;

            if ( $.inArray(18, curExpansion) === -1) {
                delete curBankArray[i-12];
            }
            var buf = [];

            for (var i = 0; i < curBankArray.length; ++i) {
                if (curBankArray[i]) buf.push(curBankArray[i]);
            }
            curBankArray = buf;
        }

        updateBankList();

        makeInstList();
        $('select#instNumber').val(num);

        $('td:last-child', 'table#inst tr').each(function(){
            $(this).empty();
            var id = $(this).attr('class').replace(/_partial_/, currentPartial);
            var doc = '';
            var trClass = $(this).closest('tr').attr('class');
            if ( trClass === 'selector' ){
                doc += '<select id='+id+'>';
                var info = ctrl.get(id);
                var opt = info.stringer.enumrate();
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) == info.value) ? "selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j) + '"' + selected + '>' +
                        opt[j] +
                        '</option>'
                    );
                }
                doc += '</select>';
            } else if ( trClass === 'slider' ) {
                doc += (
                    '<div id="'+id+'"></div>'+
                    '<span id="'+id+'_Data"></span>'
                );
            } else {
                doc += (
                    '<input type="checkbox" id="'+id+'" />'+
                    '<label for="'+id+'"></label>'
                );
            }
            $(this).append(doc);
        });

        $('table#inst tr.slider').each(function(){
            var id = $('td:last-child', this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('table#inst tr.selector').each(function(){
            var id = $('td:last-child', this).children('select').attr('id');
            createSelector(id, ctrl);
        });
    };

    $('select#instBank').change(function(){
        bank = $('option:selected', this).text();
        makeInstList();
        // select number 001
        num = $('select#instNumber option:contains(001)').val();
        $('select#instNumber').val(num);
        ctrl.put(instId, num);
    });

    $('select#instNumber').change(function(){
        num = parseInt($('option:selected', this).val(), 10);
        ctrl.put(instId, num);
        instParam(num);
    });


/* COMP + EQ */
    $('#cmpEqBody td').each(function(){
        var trClass = $(this).closest('tr').attr('class');
        var doc = '';
        for ( var i = 1; i < 7; i++) {
            var id = this.id.replace(/_num_/, i);
            if ( trClass === 'selector' ){
                doc += '<td><select id='+id+'>';
                var info = ctrl.get(id);
                var opt = info.stringer.enumrate();
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) == info.value) ? "selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j) + '"' + selected + '>' +
                        opt[j] +
                        '</option>'
                    );
                }
                doc += '</select></td>';
            } else if ( trClass === 'slider' ){
                doc += (
                    '<td>'+
                    '<div id="'+id+'"></div>'+
                    '<span id="'+id+'_Data"></span>'+
                    '</td>'
                );
            } else {
                doc += (
                    '<td>'+
                    '<input type="checkbox" id="'+id+'" />'+
                    '<label for="'+id+'"></label>'+
                    '</td>'
                );
            }
        }
        $(this).closest('tr').append(doc);
    });

    $('tr.slider td', 'table:not(#inst)').not(':first-child').each(function(){
        var id = $(this).children('div').attr('id');
        createSlider(id, ctrl);
        $('#'+id+'_Data').css({'width': '70px'});
    });

    $('tr.selector td', 'table:not(#inst)').not(':first-child').each(function(){
        var id = $(this).children('select').attr('id');
        createSelector(id, ctrl);
    });

    $('tr.button td', 'table:not(#inst)').not(':first-child').each(function(){
        var id = $(this).children('input').attr('id');
        createButton(id, ctrl);
    });

    // phrase number selector
    $('select#PRM-_FPART1-_KIT-_KC-SDKC_PHRASE option').each(function(i){
        if ( i < 17 ) {
            var phraseName = window.parent.globals.parameter.phrase.kitPhraseTbl[i];
            $(this).text(i+' : '+phraseName);
        } else {
            $(this).remove();
        }
    });

    /* table css */
    $('table:not(#cmpEqTable) td:first-child').css({'width':'40%','min-width':'100px'});
    $('table:not(#cmpEqTable) td:nth-child(2)').css({'min-width':'100px'});
    $('table#cmpEqTable td:first-child').css({'width':'10%','min-width':'80px'});

    ctrl.curPartialChanged();
});