//
//  scene_tone_pcms.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

    var ctrl = window.parent.globals.controller.tone_pcms;
    var curId = '';

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
				curId = '';
            }
        })
        .css({
            'width':'60%',
            'float':'left',
            'margin':'2px 10px 2px 10px'
        });
        $('#'+id+'_Data').text(info.string).css({
            'width': '50px',
            'float': 'right',
            'text-align': 'right',
            'padding-right':'3px'
        });
    };

/* Create Multi-Handled Slider  */
    var createDoubleSlider = function(id, ctrl) {
        var infoLo = ctrl.get(id);
        var upId = id.replace(/_LO/g, '_UP');
        var infoUp = ctrl.get(upId);

        $('#'+id+'_Data').text(infoLo.string).css({
            'width': '20px',
            'float': 'left',
            'text-align': 'right',
            'padding-right': '3px'
        });
        $('#'+upId+'_Data').text(infoUp.string).css({
            'width': '35px',
            'float': 'right',
            'text-align': 'right',
            'padding-right': '3px'
        });
        $('#'+id).mySlider ({
            range: true,
            min: infoLo.min,
            max: infoUp.max,
            values: [ infoLo.value, infoUp.value ],
            slide: function(event, ui) {
                curId  = id;
                ctrl.put(id, ui.values[0]);
                ctrl.put(upId, ui.values[1]);
                $('#'+id+'_Data').text(ctrl.getString(id));
                $('#'+upId+'_Data').text(ctrl.getString(upId));
                curId = '';
            }
        })
        .css({
            'width': '55%',
            'float': 'left',
            'margin':'2px',
            'margin-left': '8px'
        });
    };

    var createButton = function (id, ctrl) {
        var info = ctrl.get(id);
        var initValue = info.value - info.min ? true : false;
        $('label[for='+id+']').text(info.string).bind('selectstart', function(){ return false; });
        $('#'+id).prop('checked', initValue);
        $('#'+id).button().click(function(){
			curId = id;
            ctrl.put(id, ((this.checked) ? info.max : info.min));
            $('label[for='+id+'] span.ui-button-text').text(ctrl.getString(id));
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
        $("#"+id).change(function() {
            curId = id;
            var value = parseInt($('option:selected', this).val(), 10);
            ctrl.put(id, value);
			curId = '';
        });
    };


	var curId = '';
	function listner(ev, param) {
		var id = param;

		if (id.indexOf("-_FPART") > 0) {
			id = id.replace(/\d+/, 1); // PART* -> PART1
		}

		if (ev == 'model') {
			if (id === curId) return;
			var item = $("#" + id);

			if (id.indexOf("_KRANGE_UP") > 0  || id.indexOf("_KRANGE_LO") > 0 ||
					id.indexOf("_VRANGE_UP") > 0  || id.indexOf("_VRANGE_LO") > 0 ) {
				var loId = id.replace("UP", "LO");
				var upId = id.replace("LO", "UP");

				$("#"+loId).mySlider('values', [ctrl.getVal(loId), ctrl.getVal(upId)]);
				$('#'+id+'_Data').text(ctrl.getString(id));
			} else if (item.length) {
                update(id, item);
                if (id.indexOf("WAV_GID") !== -1) {
                    recreateSlider(id);
                }
			}
		}
	}

	/* append/remove update listener to observer */
	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_tone_pcms');
	};
	window.parent.globals.observer.append('scene_tone_pcms', listner);

	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

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
			if ( ( o.max - o.min ) === 1 ) {
                $('label[for='+id+'] span.ui-button-text').text(o.string);
                item.prop('checked',(o.value - o.min) ? true : false).button('refresh');
			} else if (id.indexOf("WAV_NUM") !== -1) {
                var val = o.value;
                var numbers = id.match(/\d+/g);
                var wave = parseInt(numbers[1], 10)-1;
                var wavelist = window.parent.globals.parameter.db.pcmsWaveList[wave];
                item.mySlider('value', val);
                $('#'+id+'_Data').text(val+' '+wavelist[val]);
			} else {
				item.mySlider('value', o.value);
				$('#'+id+'_Data').text(o.string);
			}
			break;
		}
    }
//]

    var createTable = function (target) {
        var id = $(target).attr('class');
        var doc = '';
        var trClass = $(target).closest('tr').attr('class');
        if ( trClass === 'selector' ){
            doc += (
                '<select id='+id+'>'
            );
            var info = ctrl.get(id);
            var opt = info.stringer.enumrate();

            if ( id.indexOf("_SRC") >  0 ) {
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j + ((j > 31) ? 1 : 0)) == info.value) ? " selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j + ((j > 31) ? 1 : 0)) + '"' + selected + '>' +
                        opt[j] +
                        '</option>'
                    );
                }
            } else {
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) == info.value) ? " selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j) + '"' + selected + '>' +
                        opt[j] +
                        '</option>'
                    );
                }
            }
            doc += (
                '</select>'
            );
        } else if ( trClass === 'slider') {
            doc += (
                '<div id="'+id+'"></div>'+
                '<span id="'+id+'_Data"></span>'
            );
        } else if ( trClass === 'button' ) {
            doc += (
                '<input type="checkbox" id="'+id+'" />'+
                '<label for="'+id+'"></label>'
            );
        }
        $(target).append(doc);
    };

    var createPartialTable = function(target) {
        var trClass = $(target).attr('class');
        var doc = '';
        for ( var i = 1; i < 5; i++) {
            doc += '<td>';
            var id = $('td', target).attr('id').replace(/_partial_/, i);
            if ( trClass === 'selector' ){
                doc += '<select id='+id+'>';
                var info = ctrl.get(id);
                var opt = info.stringer.enumrate();
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) == info.value) ? " selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j) + '"' + selected + '>' +
                        opt[j] +
                        '</option>'
                    );
                }
                doc += (
                    '</select></td>'
                );
            } else if ( trClass === 'slider'){
                doc += (
                    '<div id="'+id+'"></div>'+
                    '<span id="'+id+'_Data"></span>'+
                    '</td>'
                );
            } else if ( trClass === 'sliderDouble') {
                var upId = id.replace(/_LO/g, '_UP');
                doc += (
                    '<span id="'+id+'_Data"></span>'+
                    '<div id="'+id+'"></div>'+
                    '<span id="'+upId+'_Data"></span>'+
                    '</td>'
                );
            } else {
                doc += (
                    '<input type="checkbox" id="'+id+'" />'+
                    '<label for="'+id+'"></label>'+
                    '</td>'
                );
            }
        }
        $(target).append(doc);
    };

/* Table css */
    $('table.tonePcmsTable td:nth-child(1)').css({'width':'40%','min-width':'100px'});
    $('table.tonePcmsTable td:nth-child(2)').css({'min-width':'100px'});
    $('table.partial td:nth-child(1)').css({'width':'15%','min-width':'110px'});

    ctrl.clearTable = function (id) {
        $('table.partial td:not(:first-child)').remove();
        $('table.tonePcmsTable td:last-child').children().remove();
        $('table').css('display', 'none');
        $('a').css('display', 'none');
        $('table#'+id).css('display', '');
        $('table#'+id+'_2').css('display', '');
        $('a#'+id).css('display', '');
    };

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
            var selected = parseInt($('option:selected', this).val(), 10);
            ctrl.put(id, selected);
            curId  = '';
        });
    };

    var selectedPartial = window.parent.globals.parameter.db.pcmsSelectedPartial;

    var partial = function(title){
        var doc = '';
        for ( var i = 1; i < 5; i++) {
            var id = 'PRM-_FPART1-_PAT-_PX-RFPX_TMT'+i+'_SW';
            var infoSw = ctrl.get(id);
            var partialSw = infoSw.value ? "checked='checked'" : '';
            var selected = selectedPartial[i-1] ? "checked='checked'" : '';

            doc = (
                '<td>'+
                    '<div>PARTIAL '+i+'</div>'+
                    '<input type="checkbox" name="partial'+i+'_Sw" id="'+id+'" '+partialSw+'>'+
                    '<label for="'+id+'">'+infoSw.string+'</label>'+
                    '<input type="checkbox" name="partial'+i+'_Sel"  id="partial'+i+'_Sel" '+selected+'>'+
                    '<label for="partial'+i+'_Sel" style="width:55px">SELECT</label>'+
                '</td>'
            );
            $('tr.module', 'table#'+title+'').append(doc);
            module(i);
            sync(i+1, selectedPartial[i-1]);
        }
    };

    var module = function(i) {
        var id = 'PRM-_FPART1-_PAT-_PX-RFPX_TMT'+i+'_SW';
        // partial sw
        $('#'+id).button().click(function(){
            $('label[for='+this.id+'] span.ui-button-text').text(this.checked ? 'ON' : 'OFF');
            ctrl.put(id, this.checked);
        })
        .keydown(function(e){
            if(e.keyCode === 38 || e.keyCode === 40){
                return false;
            }
        })
        .keyup(function(e){
            switch(e.keyCode){
                case 38: // Key[↑]
                    $(this).prop('checked', true).button('refresh');
                    $('label[for='+this.id+'] span.ui-button-text').text('ON');
                    ctrl.put(id, 1);
                    break;

                case 40: // Key[↓]
                    $(this).prop('checked', false).button('refresh');
                    $('label[for='+this.id+'] span.ui-button-text').text('OFF');
                    ctrl.put(id, 0);
                    break;

                default:
                    break;
            }
        });
        // partial select
        $('#partial'+i+'_Sel').button().click(function(){
            window.parent.globals.parameter.db.pcmsSelectedPartial[i-1] = this.checked;
            sync(i+1, this.checked);
        })
        .keydown(function(e){
            if(e.keyCode === 38 || e.keyCode === 40){
                return false;
            }
        })
        .keyup(function(e){
            switch(e.keyCode){
                case 38: // Key[↑]
                    $(this).prop('checked', true).button('refresh');
                    window.parent.globals.parameter.db.pcmsSelectedPartial[i-1] = 1;
                    sync(i+1, 1);
                    break;

                case 40: // Key[↓]
                    $(this).prop('checked', false).button('refresh');
                    window.parent.globals.parameter.db.pcmsSelectedPartial[i-1] = 0;
                    sync(i+1, 0);
                    break;

                default:
                    break;
            }
        });
    };

    // partial row sync
    var sync = function(row, flg) {
        var target = $('td:nth-child('+row+')','.partial tr:not(.module)');
        if (flg) { // partial sync
            target.children('div, select, input').addClass('sync');
            target.css({'background-color':'#454545'});
            syncPartial();
        } else { // partial not-sync
            target.children('div, select, input').removeClass('sync').unbind('.sync');
            target.css({'background-color':'transparent'});
        }
    };

    var syncPartial = function() {
        //sync partial
        $('select.sync', 'table.partial').bind('change.sync', function() {
            var value = this.value;
            var id = this.id;
            curId = id;
            $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                var sibId = $(this).find('select').attr('id');
                if ( $('#'+sibId).hasClass('sync') ) {
                    ctrl.put(sibId, value);
                }
            });
            curId = '';
        });

        $('input.sync', 'table.partial').bind('click.sync', function() {
            var value = (this.checked) ? 1 : 0;
            var id = this.id;
            curId = id;
            $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                var sibId = $(this).find('input').attr('id');
                if ( $('#'+sibId).hasClass('sync') ) {
                    ctrl.put(sibId, value);
                }
            });
            curId = '';
            })
        .bind('keyup.sync', function(e){
            if ( e.keyCode === 38 || e.keyCode === 40 ) {
                var value = (this.checked) ? 1 : 0;
                var id = this.id;
                curId = id;
                $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                    var sibId = $(this).find('input').attr('id');
                    if ( $('#'+sibId).hasClass('sync') ) {
                        ctrl.put(sibId, value);
                    }
                });
                curId = '';
            }
        });

        $('div.sync', 'table.partial tr.slider').bind('myslidechange.sync', function(event, ui) {
            var value = ui.value;
            var id = this.id;
            var data = $('#'+id+'_Data').text();
            curId = id;
            if ( id.indexOf('WAV_NUM') !==  -1 ) {
                var grId = id.substr(0, id.length-4) + 'GID';
                var grVal = $('option:selected' ,'select#'+grId).val();
                $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                    var sibId = $(this).find('div').attr('id');
                    var sibGrId = sibId.substr(0, sibId.length-4) + 'GID';
                    var sibGrVal = $('option:selected' ,'#'+sibGrId).val();
                    if ( $('#'+sibId).hasClass('sync') && ( grVal === sibGrVal ) ) {
                        ctrl.put(sibId, value);
                        $('#'+sibId+'_Data').text(data);
                    }
                });
            } else {
                $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                    var sibId = $(this).find('div').attr('id');
                    if ( $('#'+sibId).hasClass('sync') ) {
                        ctrl.put(sibId, value);
                    }
                });
            }
            curId = '';
        });

        $('div.sync', 'table.partial tr.sliderDouble').bind('myslidechange.sync', function(event, ui) {
            var loVal = ui.values[0];
            var upVal = ui.values[1];
            var id = this.id;
            curId = id;
            $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                var sibLoId = $(this).find('div').attr('id');
                if ( $('#'+sibLoId).hasClass('sync') ) {
                    var sibUpId = sibLoId.replace(/_LO/, '_UP');
                    ctrl.put(sibLoId, loVal);
                    ctrl.put(sibUpId, upVal);
                }
            });
            curId = '';
        });
    };

// ========================================
//   COMMON
// ========================================
    ctrl.selectCommon = function () {
        $('td:last-child', 'table#common tr').each(function(){
            var target = $(this);
            createTable(target);
        });

        $('td:last-child', 'table#common tr.selector:not(first-child)').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:last-child', 'table#common tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:last-child', 'table#common tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        // Tone Category
        $('#PRM-_FPART1-_PAT-_PC2-RFPC2_CATE').empty();
        createCategory('PRM-_FPART1-_PAT-_PC2-RFPC2_CATE', ctrl);

        // phrase number selector
        $('#PRM-_FPART1-_PAT-_PC2-RFPC2_PHRASE option').each(function(i){
            if ( i < 244 ) {
                var phraseName = window.parent.globals.parameter.phrase.patPhraseTbl[i];
                $(this).text(i+' : '+phraseName);
            } else {
                $(this).remove();
            }
        });
    };


// ========================================
//   WAVE
// ========================================

    var recreateSlider = function(id) {
        var wavelist = window.parent.globals.parameter.wave.xv5080;
        var gType = ctrl.getVal(id.replace(/GID/, 'GTYPE'));
        if ( gType === 0) {
            $('#'+id).val(0);
        }
        var waveGroup = $('option:selected', '#'+id).val();
        switch (waveGroup) {
            case '1':
                wavelist = window.parent.globals.parameter.wave.srx01;
                break;
            case '2':
                wavelist = window.parent.globals.parameter.wave.srx02;
                break;
            case '3':
                wavelist = window.parent.globals.parameter.wave.srx03;
                break;
            case '4':
                wavelist = window.parent.globals.parameter.wave.srx04;
                break;
            case '5':
                wavelist = window.parent.globals.parameter.wave.srx05;
                break;
            case '6':
                wavelist = window.parent.globals.parameter.wave.srx06;
                break;
            case '7':
                wavelist = window.parent.globals.parameter.wave.srx07;
                break;
            case '8':
                wavelist = window.parent.globals.parameter.wave.srx08;
                break;
            case '9':
                wavelist = window.parent.globals.parameter.wave.srx09;
                break;
            case '10':
                wavelist = window.parent.globals.parameter.wave.srx10;
                break;
            case '11':
                wavelist = window.parent.globals.parameter.wave.srx11;
                break;
            case '12':
                wavelist = window.parent.globals.parameter.wave.srx12;
                break;
            default :
                break;
        }

        var numbers = id.match(/\d+/g);
        var wave = parseInt(numbers[1], 10)-1;
        window.parent.globals.parameter.db.pcmsWaveList[wave] = wavelist;

        $('div[id*='+id.replace(/GID/, 'NUM')+']').each(function() {
            var id = this.id;
            var info = ctrl.get(id);
            $(this).mySlider('destroy');
            $(this).mySlider({
                range: 'min',
                value: info.value,
                min: 0,
                max: wavelist.length-1,
                slide: function(event, ui) {
                    curId  = id;
                    ctrl.put(id, ui.value);
                    $('#'+id+'_Data').text(ui.value+' '+wavelist[ui.value]);
                    curId = '';
                }
            })
            .css({
                'width':'60%',
                'float':'left',
                'margin':'2px 10px 2px 10px'
            });
            $('#'+id+'_Data').text(info.value+' '+wavelist[info.value]).css({
                'width': '130px',
                'float': 'right',
                'text-align': 'right',
                'padding-right':'3px'
            });
        });
    };

    ctrl.selectWave = function () {
        $('table#wave tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#wave tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#wave tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            if ( id.indexOf('WAVE_NUM') === -1 ) {
                createSlider(id, ctrl);
            }
        });

        $('td:not(:first-child)','table#wave tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        var curExpansion = window.parent.globals.parameter.db.curExpansion;
        for ( var i = 1; i <= 12; i++) {
            if ( $.inArray(i, curExpansion) === -1) {
                $('select[id$=WAV_GID] option[value='+i+']').remove();
            }
        }

        // wave type init
        for ( var i = 1; i < 5; i++) {
            var id = ('PRM-_FPART1-_PAT-_PT_partial_-RFPT_WAV_GTYPE').replace(/_partial_/, i);
            var info = ctrl.get(id);
            if ( info.value === 0 ) {
                $('#'+id.replace(/GTYPE/, 'GID')).val('0');
                ctrl.put(id, 0);
            }
        }
        partial('wave');

        $('select[id$=WAV_GID]').each(function(){
            var id = this.id;
            recreateSlider(id);

            $(this).unbind('.sync');
            $(this).bind('change.wave', function(){
                var gId = this.id;
                var waveGroup = $('option:selected', this).val();
                var waveBank = ctrl.getVal(gId);
                if ( waveGroup === '0' ) {
                    ctrl.put(gId.replace(/GID/, 'GTYPE'), 0);
                } else {
                    ctrl.put(gId.replace(/GID/, 'GTYPE'), 1);
                }
                ctrl.put(gId, waveBank);
                recreateSlider(gId);
            // sync wave group
                if ( $(this).hasClass('sync') ) {
                    $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                        var sibId = $(this).find('select').attr('id');
                        if ( $('#'+sibId).hasClass('sync') ) {
                            if ( waveGroup === '0' ) {
                                ctrl.put(sibId.replace(/GID/, 'GTYPE'), 0);
                            } else {
                                ctrl.put(sibId.replace(/GID/, 'GTYPE'), 1);
                            }
                            ctrl.put(sibId, waveBank);
                            recreateSlider(sibId);
                        }
                    });
                }
            });
        });
    };

// ========================================
//   PMT
// ========================================
    ctrl.selectPmt = function () {
        //common
        $('td:last-child', 'table#pmt_2 tr').each(function(){
            var target = $(this);
            createTable(target);
        });

        $('td:last-child', 'table#pmt_2 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:last-child', 'table#pmt_2 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:last-child', 'table#pmt_2 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        // partial
        $('table#pmt tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#pmt tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#pmt tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#pmt tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        $('td:not(:first-child)','table#pmt tr.sliderDouble').each(function(){
            var id = $(this).children('div').attr('id');
            createDoubleSlider(id, ctrl);
        });

        partial('pmt');
    };

// ========================================
//   PITCH
// ========================================
    ctrl.selectPitch = function () {
        $('table#pitch tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#pitch tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#pitch tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#pitch tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('pitch');

        // pitch common
        $('td:last-child', 'table#pitch_2 tr').each(function(){
            var target = $(this);
            createTable(target);
        });

        $('td:last-child', 'table#pitch_2 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:last-child', 'table#pitch_2 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:last-child', 'table#pitch_2 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });
    };


// ========================================
//   PITCH ENV
// ========================================
    ctrl.selectPitchEnv = function () {
        $('table#pitchEnv tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#pitchEnv tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#pitchEnv tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#pitchEnv tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('pitchEnv');
    };

// ========================================
//   TVF
// ========================================
    ctrl.selectTvf = function () {
        $('table#tvf tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#tvf tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#tvf tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#tvf tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('tvf');
    };

// ========================================
//   TVF ENV
// ========================================
    ctrl.selectTvfEnv = function () {
        $('table#tvfEnv tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#tvfEnv tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#tvfEnv tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#tvfEnv tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('tvfEnv');
    };

// ========================================
//   TVA
// ========================================
    ctrl.selectTva = function () {
        $('table#tva tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#tva tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#tva tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#tva tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('tva');
    };

// ========================================
//   TVA ENV
// ========================================
    ctrl.selectTvaEnv = function () {
        $('table#tvaEnv tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#tvaEnv tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#tvaEnv tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#tvaEnv tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('tvaEnv');
    };

// ========================================
//   OUTPUT
// ========================================
    ctrl.selectOutput = function () {
        $('table#output tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)', 'table#output tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)', 'table#output tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)', 'table#output tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('output');
    };

// ========================================
//   LFO1
// ========================================
    ctrl.selectLfo1 = function () {
        $('table#lfo1 tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#lfo1 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#lfo1 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#lfo1 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('lfo1');
    };

// ========================================
//   LFO2
// ========================================
    ctrl.selectLfo2 = function () {
        $('table#lfo2 tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#lfo2 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#lfo2 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#lfo2 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('lfo2');
    };

// ========================================
//   STEP LFO
// ========================================
    ctrl.selectStepLfo = function () {
        $('table#stepLfo tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#stepLfo tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#stepLfo tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#stepLfo tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('stepLfo');
    };

// ========================================
//   CTRL
// ========================================
    ctrl.selectCtrl = function () {
        $('table#ctrl tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#ctrl tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#ctrl tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#ctrl tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        partial('ctrl');
    };

// ========================================
//   MTRX CTRL1
// ========================================
    ctrl.selectMtrxCtrl1 = function () {
        // common
        $('td:last-child', 'table#mtrxCtrl1_2 tr').each(function(){
            var target = $(this);
            createTable(target);
        });

        $('td:last-child', 'table#mtrxCtrl1_2 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');

 //           if (id.indexOf("_SRC") >  0) {
 //               createSelectorForToneCtrlSrc(id, ctrl);
 //           } else {
                createSelector(id, ctrl);
 //           }

        });

        $('td:last-child', 'table#mtrxCtrl1_2 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:last-child', 'table#mtrxCtrl1_2 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        // partial
        $('table#mtrxCtrl1 tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#mtrxCtrl1 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#mtrxCtrl1 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#mtrxCtrl1 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });
    };

// ========================================
//   MTRX CTRL2
// ========================================
    ctrl.selectMtrxCtrl2 = function () {
        // common
        $('td:last-child', 'table#mtrxCtrl2_2 tr').each(function(){
            var target = $(this);
            createTable(target);
        });

        $('td:last-child', 'table#mtrxCtrl2_2 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);

        });

        $('td:last-child', 'table#mtrxCtrl2_2 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:last-child', 'table#mtrxCtrl2_2 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        // partial
        $('table#mtrxCtrl2 tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#mtrxCtrl2 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#mtrxCtrl2 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#mtrxCtrl2 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });
    };

// ========================================
//   MTRX CTRL3
// ========================================
    ctrl.selectMtrxCtrl3 = function () {
        // common
        $('td:last-child', 'table#mtrxCtrl3_2 tr').each(function(){
            var target = $(this);
            createTable(target);
        });

        $('td:last-child', 'table#mtrxCtrl3_2 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:last-child', 'table#mtrxCtrl3_2 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:last-child', 'table#mtrxCtrl3_2 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        // partial
        $('table#mtrxCtrl3 tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#mtrxCtrl3 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#mtrxCtrl3 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#mtrxCtrl3 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });
    };

// ========================================
//   MTRX CTRL4
// ========================================
    ctrl.selectMtrxCtrl4 = function () {
        // common
        $('td:last-child', 'table#mtrxCtrl4_2 tr').each(function(){
            var target = $(this);
            createTable(target);
        });

        $('td:last-child', 'table#mtrxCtrl4_2 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:last-child', 'table#mtrxCtrl4_2 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:last-child', 'table#mtrxCtrl4_2 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        // partial
        $('table#mtrxCtrl4 tr:not(.module)').each(function(){
            var target = $(this);
            createPartialTable(target);
        });

        $('td:not(:first-child)','table#mtrxCtrl4 tr.selector').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('td:not(:first-child)','table#mtrxCtrl4 tr.slider').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('td:not(:first-child)','table#mtrxCtrl4 tr.button').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });
    };

// =========================================

    var scene = window.parent.globals.parameter.db.tonePcmContents;

    if (!scene ) {
       ctrl.selectCommon();
    } else {
        switch (scene) {
            case "common": window.parent.globals.controller.tone_pcms.selectCommon(); break;
            case "wave": window.parent.globals.controller.tone_pcms.selectWave(); break;
            case "pmt": window.parent.globals.controller.tone_pcms.selectPmt(); break;
            case "pitch": window.parent.globals.controller.tone_pcms.selectPitch(); break;
            case "pitchEnv": window.parent.globals.controller.tone_pcms.selectPitchEnv(); break;
            case "tvf": window.parent.globals.controller.tone_pcms.selectTvf(); break;
            case "tvfEnv": window.parent.globals.controller.tone_pcms.selectTvfEnv(); break;
            case "tva": window.parent.globals.controller.tone_pcms.selectTva(); break;
            case "tvaEnv": window.parent.globals.controller.tone_pcms.selectTvaEnv(); break;
            case "output": window.parent.globals.controller.tone_pcms.selectOutput(); break;
            case "lfo1": window.parent.globals.controller.tone_pcms.selectLfo1(); break;
            case "lfo2": window.parent.globals.controller.tone_pcms.selectLfo2(); break;
            case "stepLfo": window.parent.globals.controller.tone_pcms.selectStepLfo(); break;
            case "ctrl": window.parent.globals.controller.tone_pcms.selectCtrl(); break;
            case "mtrxCtrl1": window.parent.globals.controller.tone_pcms.selectMtrxCtrl1(); break;
            case "mtrxCtrl2": window.parent.globals.controller.tone_pcms.selectMtrxCtrl2(); break;
            case "mtrxCtrl3": window.parent.globals.controller.tone_pcms.selectMtrxCtrl3(); break;
            case "mtrxCtrl4": window.parent.globals.controller.tone_pcms.selectMtrxCtrl4(); break;
        }
    }

    $('#writeToneDialogError').dialog({
        autoOpen: false,
        resizable: false,
        width: "450px",
        modal: true,
        buttons: {
            'CLOSE': function() {
                $(this).dialog('close');
            }
        },
        open: function() {
            $('.ui-button').blur();
            window.parent.contents.$('input[id^="execute"]').prop('checked', false);
        }
    });
});