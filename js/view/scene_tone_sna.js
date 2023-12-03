//
//  scene_tone_sna.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

    var ctrl = window.parent.globals.controller.tone_sna;
    var createSlider = function (id, ctrl) {
        var info = ctrl.get(id);
        $('#'+id).mySlider({
            value: info.value,
            range: 'min',
            min: info.min,
            max: info.max,
            slide: function(event, ui) {
                ctrl.put(id, ui.value);
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
            curId = id;
            var value = parseInt($('option:selected', this).val(), 10);
            ctrl.put(id, value);
            curId = '';
        });
    };

	var curId = '';
	var lastBank = null;
	function listner(ev, param) {
		var id = param;
		var part;
		if (id.indexOf("-_FPART") !== 0) {
			part = id.match(/\d+/) - 1; // 1..16
			id = id.replace(/\d+/, 1); // PART* -> PART1
		}

		if (ev == 'model') {
			if (id === curId) return;
			var item = $("#" + id);
			if (item.length) {
				update(id, item);
			} else if (id.indexOf("-_SNTONE-_SNTC-SNTC_INST_BS_PC") > 0 ) {
				if ( window.parent.globals.parameter.db.curPart !== part ) return;

                var vari = ctrl.getVal("PRM-_FPART"+(part+1) + "-_SNTONE-_SNTC-SNTC_INST_BS_LSB");
                var num = ctrl.getVal("PRM-_FPART"+(part+1) + "-_SNTONE-_SNTC-SNTC_INST_BS_PC");
                var info = parseInstIndexNumByPrm(vari, num);
                var instNum = info.inst;
                var bankNum = info.bank;

                if (bankNum !== lastBank) {
                    bank = instBankArray[bankNum].text;
                    makeInstList();
                }

                lastBank = bankNum;

                var elementId0 = $("#instBank");
                var elementId1 = $("#instNumber");

                instParam(instNum);

				elementId0.val(bankNum);
				elementId1.val(instNum);
			}
		}
	}

	/* append/remove update listener to observer */
	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_tone_sna');
	};
	window.parent.globals.observer.append('scene_tone_sna', listner);

	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

//		if (item.attr( 'option', 'values' ) !== null)

		switch (divName) {
		case "SELECT":
			if (id.indexOf("CATE") !== -1) {
				var _val = o.value;
				_val = window.parent.globals.parameter.ToCategory36(_val);
				_val = window.parent.globals.parameter.ToCategory50(_val);
				item.val(_val);
			} else {
				item.val(o.value);
			}

			break;
		default:
			// var type = item.attr("type");

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

	function parseInstIndexNumByPrm(vari, num) {

		var bankVal;

		for ( var i in instArray) {
			if (instArray[i].lsb === vari && instArray[i].pc === num) {

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
		return {inst: 0, bank: 0};
	}

    $('td:last-child', '.toneSnaTable tr').each(function(){
        var id = $(this).attr('class');
        var doc = '';
        var trClass = $(this).closest('tr').attr('class');
        if ( trClass === 'selector' ){
            doc += (
                '<select id='+id+'>'
            );
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
            doc += (
                '</select>'
            );
        } else if ( trClass === 'slider' ) {
            doc += (
                '<div id="'+id+'"></div>'+
                '<span id="'+id+'_Data"></span>'
            );
        } else if ( trClass === 'button') {
            doc += (
                '<input type="checkbox" id="'+id+'" />'+
                '<label for="'+id+'"></label>'
            );
        }
        $(this).append(doc);
    });

    $('tr.selector td', 'table.toneSnaTable').not(':first-child').each(function(){
        var id = $(this).children('select').attr('id');
        createSelector(id, ctrl);
    });

    $('tr.slider td', 'table.toneSnaTable').not(':first-child').each(function(){
        var id = $(this).children('div').attr('id');
        createSlider(id, ctrl);
    });

    $('tr.button td', 'table.toneSnaTable').not(':first-child').each(function(){
        var id = $(this).children('input').attr('id');
        createButton(id, ctrl);
    });

    // phrase number selector
    $('select#PRM-_FPART1-_SNTONE-_SNTC-SNTC_PHRASE option').each(function(i){
        if ( i < 88 ) {
            var phraseName = window.parent.globals.parameter.phrase.snaPhraseTbl[i];
            $(this).text(i+' : '+phraseName);
        } else {
            $(this).remove();
        }
    });

    var createCategory = function (id, ctrl) {
        var category = window.parent.globals.parameter.presetCategory.categoryName2;
        var cateNum;
        for ( var i = 0; i < category.length; i++){
            cateNum = window.parent.globals.parameter.ToCategory50(i);
            $('#'+id).append($('<option>', { value : cateNum, text:category[i][0]}));
        }

        var initValue = ctrl.getVal(id);

        initValue = window.parent.globals.parameter.ToCategory36(initValue);
        initValue = window.parent.globals.parameter.ToCategory50(initValue);

        $('#'+id).val(initValue);
        $('#'+id).change(function() {
            curId  = id;
            var selected = $('option:selected', this).val();
            ctrl.put(id, selected);
            curId  = '';
        });
    };

    // Tone Category
    $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_CATE').empty();
    createCategory('PRM-_FPART1-_SNTONE-_SNTC-SNTC_CATE', ctrl);

    var instArray = window.parent.globals.parameter.snaInstPreset;

    var instBankArray = [
        { text: 'INT' },
        { text: 'ExSN1' },
        { text: 'ExSN2' },
        { text: 'ExSN3' },
        { text: 'ExSN4' },
        { text: 'ExSN5' }
    ];

    var curBankArray = instBankArray.slice(0);

    // var mod1~mod22;
    for ( var i = 1; i < 23; i++) {
        eval("var mod"+ i +";");
    }

    var instParam = function(i){
        var doc = '';
        $('table#param').empty();
        var cate = instArray[i].cate;
        if ('mod1' in instArray[i]) {
            mod1 = instArray[i].mod1;
            doc += '<tr class="slider"><td>'+mod1+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM1"></td></tr>';
        }
        if ('mod2' in instArray[i]) {
            mod2 = instArray[i].mod2;
            doc += '<tr class="slider"><td>'+mod2+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM2"></td></tr>';
        }
        if ('mod3' in instArray[i]) {
            mod3 = instArray[i].mod3;
            doc += '<tr class="slider"><td>'+mod3+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM3"></td></tr>';
        }
        if ('mod4' in instArray[i]) {
            mod4 = instArray[i].mod4;
            switch (cate) {
                case 'Ac.Piano' :
                case 'Organ' :
                    doc += '<tr class="slider"><td>'+mod4+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM4"></td></tr>';
                    break;
                default :
                    doc += '<tr class="button"><td>'+mod4+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM4"></td></tr>';
                    break;
            }
        }
        if ('mod5' in instArray[i]) {
            mod5 = instArray[i].mod5;
            switch (cate) {
                case 'Ac.Piano' :
                    doc += '<tr class="selector"><td>'+mod5+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM5"></td></tr>';
                    break;
                default :
                    doc += '<tr class="slider"><td>'+mod5+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM5"></td></tr>';
                    break;
            }
        }
        if ('mod6' in instArray[i]) {
            mod6 = instArray[i].mod6;
            doc += '<tr class="slider"><td>'+mod6+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM6"></td></tr>';
        }
        if ('mod7' in instArray[i]) {
            mod7 = instArray[i].mod7;
            switch (cate) {
                case 'Organ' :
                    doc += '<tr class="slider"><td>'+mod7+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM7"></td></tr>';
                    break;
                default :
                    doc += '<tr class="selector"><td>'+mod7+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM7"></td></tr>';
                    break;
            }
        }
        if ('mod8' in instArray[i]) {
            mod8 = instArray[i].mod8;
            switch (cate) {
                case 'Organ' :
                    doc += '<tr class="slider"><td>'+mod8+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM8"></td></tr>';
                    break;
                default :
                    doc += '<tr class="selector"><td>'+mod8+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM8"></td></tr>';
                    break;
            }
        }
        if ('mod9' in instArray[i]) {
            mod9 = instArray[i].mod9;
            switch (cate) {
                case 'Organ' :
                    doc += '<tr class="slider"><td>'+mod9+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM9"></td></tr>';
                    break;
                default :
                    doc += '<tr class="selector"><td>'+mod9+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM9"></td></tr>';
                    break;
            }
        }
        if ('mod10' in instArray[i]) {
            mod10 = instArray[i].mod10;
            switch (cate) {
                case 'Organ' :
                    doc += '<tr class="button"><td>'+mod10+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM10"></td></tr>';
                    break;
                default :
                    doc += '<tr class="selector"><td>'+mod10+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM10"></td></tr>';
                    break;
            }
        }
        if ('mod11' in instArray[i]) {
            mod11 = instArray[i].mod11;
            switch (cate) {
                case 'Organ' :
                    doc += '<tr class="selector"><td>'+mod11+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM11"></td></tr>';
                    break;
                default :
                    doc += '<tr class="button"><td>'+mod11+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM11"></td></tr>';
                    break;
            }
        }
        if ('mod12' in instArray[i]) {
            mod12 = instArray[i].mod12;
            switch (cate) {
                case 'Organ' :
                    doc += '<tr class="selector"><td>'+mod12+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM12"></td></tr>';
                    break;
                default :
                    doc += '<tr class="button"><td>'+mod12+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM12"></td></tr>';
                    break;
            }
        }
        if ('mod13' in instArray[i]) {
            mod13 = instArray[i].mod13;
            doc += '<tr class="slider"><td>'+mod13+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM13"></td></tr>';
        }
        if ('mod14' in instArray[i]) {
            mod14 = instArray[i].mod14;
            doc += '<tr class="slider"><td>'+mod14+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM14"></td></tr>';
        }
        if ('mod15' in instArray[i]) {
            mod15 = instArray[i].mod15;
            doc += '<tr class="slider"><td>'+mod15+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM15"></td></tr>';
        }
        if ('mod16' in instArray[i]) {
            mod16 = instArray[i].mod16;
            doc += '<tr class="slider"><td>'+mod16+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM16"></td></tr>';
        }
        if ('mod17' in instArray[i]) {
            mod17 = instArray[i].mod17;
            doc += '<tr class="slider"><td>'+mod17+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM17"></td></tr>';
        }
        if ('mod18' in instArray[i]) {
            mod18 = instArray[i].mod18;
            doc += '<tr class="slider"><td>'+mod18+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM18"></td></tr>';
        }
        if ('mod19' in instArray[i]) {
            mod19 = instArray[i].mod19;
            doc += '<tr class="slider"><td>'+mod19+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM19"></td></tr>';
        }
        if ('mod20' in instArray[i]) {
            mod20 = instArray[i].mod20;
            doc += '<tr class="slider"><td>'+mod20+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM20"></td></tr>';
        }
        if ('mod21' in instArray[i]) {
            mod21 = instArray[i].mod21;
            doc += '<tr class="selector"><td>'+mod21+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM21"></td></tr>';
        }
        if ('mod22' in instArray[i]) {
            mod22 = instArray[i].mod22;
            doc += '<tr class="slider"><td>'+mod22+'</td><td class="PRM-_FPART1-_SNTONE-_SNTC-SNTC_MOD_PRM22"></td></tr>';
        }
        $('table#param').append(doc);

        // create widget
        $('td:last-child', 'table#param tr').each(function(){
            var id = $(this).attr('class');
            // var doc = '';
            var trClass = $(this).closest('tr').attr('class');
            if ( trClass === 'selector' ){
                var doc = (
                    '<select id='+id+'>'
                );
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
                doc += (
                    '</select>'
                );
                $(this).append(doc);
                // remove option value = 1 from variation of 'Uilleann Pipes' and 'Bag Pipes'
                switch (i) {
                    case '73' :
                    case '74' :
                        $('option[value=1]', this).remove();
                        break;
                    default :
                        break;
                }
                createSelector(id, ctrl);
            } else if ( trClass === 'slider' ) {
                var doc = (
                    '<div id="'+id+'"></div>'+
                    '<span id="'+id+'_Data"></span>'
                );
                $(this).append(doc);
                createSlider(id, ctrl);
            } else if ( trClass === 'button') {
                var doc = (
                    '<input type="checkbox" id="'+id+'" />'+
                    '<label for="'+id+'"></label>'
                );
                $(this).append(doc);
                createButton(id, ctrl);
            }

            ctrl.put('PRM-_FPART1-_SNTONE-_SNTC-SNTC_INST_BS_LSB', instArray[i].lsb);
            ctrl.put('PRM-_FPART1-_SNTONE-_SNTC-SNTC_INST_BS_PC', instArray[i].pc);
        });

/* Table css */
        $('td:nth-child(1)').css({'width':'40%','min-width':'100px'});
        $('td:nth-child(2)').css({'min-width':'100px'});

        // Parameter show/hide
        switch (i) {
            case '0' ://'Concert Grand' :
            case '1' ://'Grand Piano1' :
            case '2' ://'Grand Piano2' :
            case '3' ://'Grand Piano3' :
            case '4' ://'Mellow Piano' :
            case '5' ://'Bright Piano' :
            case '6' ://'Upright Piano' :
            case '7' ://'Concert Mono' :
            case '8' ://'Honky-tonk' :
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_MONO_POLY').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_CUTOFF_OFST').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_RESO_OFST').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_ATK_OFST').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_REL_OFST').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_PORT_TIME').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_VIB_RATE').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_VIB_DEPTH').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_VIB_DELAY').closest('tr').show();
                break;
            case '28' ://'TW Organ' :
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_MONO_POLY').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_CUTOFF_OFST').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_RESO_OFST').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_ATK_OFST').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_REL_OFST').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_PORT_TIME').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_VIB_RATE').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_VIB_DEPTH').closest('tr').hide();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_VIB_DELAY').closest('tr').hide();
                break;
            default :
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_MONO_POLY').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_CUTOFF_OFST').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_RESO_OFST').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_ATK_OFST').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_REL_OFST').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_PORT_TIME').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_VIB_RATE').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_VIB_DEPTH').closest('tr').show();
                $('#PRM-_FPART1-_SNTONE-_SNTC-SNTC_VIB_DELAY').closest('tr').show();
                break;
        }
        $('#instNumber').val(i);
    };

    var makeInstList = function(){
        $('select#instNumber').empty();
        $.each(instArray, function(i){
            $('select#instNumber').append($('<option>', { value : i, text : this.desc } ));
            if ( this.cate === 'Ac.Piano' ) {
                this.mod1 = 'String Resonance';
                this.mod2 = 'Key Off Resonance';
                this.mod3 = 'Hammer Noise';
                this.mod4 = 'Stereo Width';
                this.mod6 = 'Tone Character';
                if ( this.desc !== 'Concert Mono') {
                    this.mod5 = 'Nuance';
                }
            } else if ( this.cate === 'Organ' ) {
                this.mod1 = 'Harmonic Bar 16"';
                this.mod2 = 'Harmonic Bar 5-1/3"';
                this.mod3 = 'Harmonic Bar 8"';
                this.mod4 = 'Harmonic Bar 4"';
                this.mod5 = 'Harmonic Bar 2-2/3"';
                this.mod6 = 'Harmonic Bar 2"';
                this.mod7 = 'Harmonic Bar 1-3/5"';
                this.mod8 = 'Harmonic Bar 1-1/3"';
                this.mod9 = 'Harmonic Bar 1"';
                this.mod10 = 'Percussion Switch';
                this.mod11 = 'Percussion Harmonic';
                this.mod12 = 'Percussion Slow';
                this.mod13 = 'Key On Click Level';
                this.mod14 = 'Key Off Click Level';
                this.mod15 = 'Percussion Soft Level';
                this.mod16 = 'Percussion Normal Level';
                this.mod17 = 'Percussion Slow Time';
                this.mod18 = 'Percussion Fast Time';
                this.mod19 = 'Percussion Recharge Time';
                this.mod20 = 'Percussion Harmonic Bar Level';
                this.mod21 = 'Percussion Soft';
                this.mod22 = 'Leakage Level';
            }
            if ( this.bank !== bank ) {
                $('select#instNumber').children('[value='+i+']').remove();
            }
        });
        $('select#instNumber option').each(function(j){
            $(this).prepend(('00'+(j+1)+' : ').slice(-6));
        });
    };


    var part = window.parent.globals.parameter.db.curPart;
    var lsb = ctrl.getVal("PRM-_FPART"+(part+1) + "-_SNTONE-_SNTC-SNTC_INST_BS_LSB");
    var pc = ctrl.getVal("PRM-_FPART"+(part+1) + "-_SNTONE-_SNTC-SNTC_INST_BS_PC");
    var info = parseInstIndexNumByPrm(lsb, pc);
    var num = info.inst;
    var bank = instBankArray[info.bank].text;

    makeInstList();
    instParam(num);

    $.each(instBankArray, function(i){
        this.value = i;
        $('select#instBank').append($('<option>', this));
    });

    var curExpansion = window.parent.globals.parameter.db.curExpansion;
    for ( var i = 13; i <= 17; i++) {
        if ( $.inArray(i, curExpansion) === -1) {
            $('select#instBank option[value='+(i-12)+']').remove();
        }
    }
    $('select#instBank').val(info.bank);


    function updateBankList() {

        var curExpansion = window.parent.globals.parameter.db.curExpansion;

        for ( var i = 13; i <= 17; i++) {
            if ( $.inArray(i, curExpansion) === -1) {
                delete curBankArray[i-12];
            }
        }
        var buf = [];

        for (var i = 0; i < curBankArray.length; ++i) {
            if (curBankArray[i]) buf.push(curBankArray[i]);
        }
        curBankArray = buf;
    }

    updateBankList();

    $('select#instBank').change(function(){
        bank = $('option:selected', this).text();
        makeInstList();
        num = parseInt($('select#instNumber option:first-child').val(), 10);
        instParam(num);
    });

    $('select#instNumber').change(function(){
        num = parseInt($('option:selected', this).val(), 10);
        instParam(num);
    });

});