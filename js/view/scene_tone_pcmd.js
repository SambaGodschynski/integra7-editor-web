//
//  scene_tone_pcmd.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

    var ctrl = window.parent.globals.controller.tone_pcmd;

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
        $('#'+id).change(function() {
			curId = id;
            var value = parseInt($('option:selected', this).val(), 10);
            ctrl.put(this.id, value);
			curId = '';
        });
    };

    var createTextBox = function (id, ctrl) {
        var initString = ctrl.getString(id);
        $('#'+id).val(initString);
        $('#'+id+'_write').css({'margin-left':'10px','padding-left':'0px','padding-right':'0px','width':'50px'});
        $('#'+id+'_write').button().click(function() {
			curId = this.id;
            var value = $('#'+id).val();
            ctrl.put(id, value);
            $(this).blur();
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
			var item = $('#'+id);

            if ( ( id.indexOf('_SW') !== -1 && id.indexOf('-RFRT_WMT') !== -1 ) && id.indexOf('FXM') === -1) {
                var numbers = id.match(/\d+/g);
                var partialNum = parseInt(numbers[1], 10);
                if (partialNum !== window.parent.globals.parameter.db.pcmdCurPartial) return;
                for (var i = 0; i < 2; i++) {
                    var elementId = 'wave'+numbers[2]+'_Sw_'+ i;
                    item = $('#'+elementId);
                    if (item.length) {
                        var info = ctrl.get(id);
                        $('label[for='+elementId+'] span.ui-button-text').text(info.string);
                        item.prop('checked', (info.value- info.min) ? true : false).button('refresh');
                    }
                }
            // } else if ( id.indexOf('GTYPE') !== -1 ) {
            //     recreateSlider(id.replace(/GTYPE/, 'GID'));
			} else if(item.length) {
                update(id, item);
                if (id.indexOf('WAV_GID') !== -1) {
                    recreateSlider(id);
                }
            }
		}
	}

	/* append/remove update listener to observer */
	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_tone_pcmd');
	};
	window.parent.globals.observer.append('scene_tone_pcmd', listner);

	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

		switch (divName) {
		case 'SELECT':
			item.val(o.value);
			break;
		default:
			if ( id.indexOf('NAME') !== -1 ) {
                $('#'+id).val(o.string);
			} else if ( ( o.max - o.min ) === 1 ) {
                $('label[for='+id+'] span.ui-button-text').text(o.string);
                item.prop('checked',(o.value - o.min) ? true : false).button('refresh');
            } else if (id.indexOf('WAV_NUM') !== -1) {
                var val = o.value;
                var numbers = id.match(/\d+/g);
                var wave = parseInt(numbers[2], 10)-1;
                var wavelist = window.parent.globals.parameter.db.pcmdWaveList[wave];
                item.mySlider('value', val);
                $('#'+id+'_Data').text(val+' '+wavelist[val]);
            } else {
				item.mySlider('value', o.value);
				$('#'+id+'_Data').text(o.string);
			}
			break;
		}
	}

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
        var wave = parseInt(numbers[2], 10)-1;
        window.parent.globals.parameter.db.pcmdWaveList[wave] = wavelist;

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

	ctrl.curPartialChanged = function () {
        var currentPartial = window.parent.globals.parameter.db.pcmdCurPartial;

        $('td:last-child', 'table.tonePcmdTable tr').each(function(){
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
            } else if ( trClass === 'button' ) {
                doc += (
                    '<input type="checkbox" id="'+id+'" />'+
                    '<label for="'+id+'"></label>'
                );
            } else {
                doc += (
                    '<input type="text" maxlength="12" id="'+id+'" value="'+ctrl.getString(id)+'"  style="ime-mode:disabled" autofocus/>'+
                    '<button type="button" id="'+id+'_write">WRITE</button>'
                );
            }
            $(this).append(doc);
        });


        $('table.wave tr:not(.module)').each(function(){
            var waveId = $('td:first-child', this).attr('id').replace(/_partial_/, currentPartial);
        /* Wave */
            $('td:not(:first-child)', this).remove();
            var trClass = $(this).attr('class');
            var doc = '';
            for ( var i = 1; i < 5; i++) {
                doc += '<td>';
                var id = waveId.replace(/_wave_/, i);
                if ( trClass === 'selector' ){
                    doc += '<select id='+id+'>';
                    var info = ctrl.get(id);
                    var opt = info.stringer.enumrate();
                    for (var j = 0, len = opt.length; j < len; j++) {
                        var selected = ((info.min + j) == info.value) ? "selected='selected'" : '';
                        doc += (
                            '<option value="' + (info.min + j) + '">' +
                            opt[j] +
                            '</option>'
                        );
                    }
                    doc += (
                        '</select></td>'
                    );
                } else if ( trClass === 'slider' ){
                    doc += (
                        '<div id="'+id+'"></div>'+
                        '<span id="'+id+'_Data"></span>'+
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
            $(this).append(doc);
        });

        var selectedWave = window.parent.globals.parameter.db.pcmdSelectedWave;

        var wave = function(num){
            // wave sw
            var swId ='wave'+num+'_Sw';
            $('input[id^='+swId+']').button().click(function(){
                $('input[name='+swId+']').prop('checked', this.checked).button('refresh');
                $('label[for^='+swId+'] span.ui-button-text').text(this.checked ? 'ON' : 'OFF');
                ctrl.put('PRM-_FPART1-_RHY-_RT'+currentPartial+'-RFRT_WMT'+num+'_SW', this.checked ? 1 : 0);
            })
            .keydown(function(e){
                if(e.keyCode === 38 || e.keyCode === 40){
                    return false;
                }
            })
            .keyup(function(e){
                switch(e.keyCode){
                    case 38: // Key[↑]
                        $('input[name='+swId+']').prop('checked', true).button('refresh');
                        $('label[for^='+swId+'] span.ui-button-text').text('ON');
                        ctrl.put('PRM-_FPART1-_RHY-_RT'+currentPartial+'-RFRT_WMT'+num+'_SW', 1);
                        break;

                    case 40: // Key[↓]
                        $('input[name='+swId+']').prop('checked', false).button('refresh');
                        $('label[for^='+swId+'] span.ui-button-text').text('OFF');
                        ctrl.put('PRM-_FPART1-_RHY-_RT'+currentPartial+'-RFRT_WMT'+num+'_SW', 0);
                        break;

                    default:
                        break;
                }
            });
            // wave select
            var selId = 'wave'+num+'_Sel';
            $('input[id^='+selId+']').button().click(function(){
                $('input[name='+selId+']').prop('checked', this.checked).button('refresh');
                window.parent.globals.parameter.db.pcmdSelectedWave[num-1] = this.checked;
                sync(num+1, this.checked);
            })
            .keydown(function(e){
                if(e.keyCode === 38 || e.keyCode === 40){
                    return false;
                }
            })
            .keyup(function(e){
                switch(e.keyCode){
                    case 38: // Key[↑]
                        $('input[name='+selId+']').prop('checked', true).button('refresh');
                        window.parent.globals.parameter.db.pcmdSelectedWave[num-1] = 1;
                        sync(num+1, 1);
                        break;

                    case 40: // Key[↓]
                        $('input[name='+selId+']').prop('checked', false).button('refresh');
                        window.parent.globals.parameter.db.pcmdSelectedWave[num-1] = 0;
                        sync(num+1, 0);
                        break;

                    default:
                        break;
                }
            });
        };

/* Wave SW */

        // wave row sync
        var sync = function(row, flg) {
            var target = $('td:nth-child('+row+')','.wave tr:not(.module)');
            if (flg) { // wave sync
                target.children().addClass('sync');
                target.css({'background-color':'#454545'});
                syncPartial();
            } else { // wave not-sync
                target.children().removeClass('sync').unbind('.sync');
                target.css({'background-color':'transparent'});
            }

            // sync wave
            $('select.sync', 'table.wave').bind('change.sync', function() {
                var value = this.value;
                $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                    var sibId = $(this).find('select').attr('id');
                    if ( $('#'+sibId).hasClass('sync') ) {
                        ctrl.put(sibId, value);
                    }
                });
            });
        };

        var syncPartial = function() {
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

            $('input.sync', 'table.wave').bind('click.sync', function() {
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

            $('div.sync', 'table.wave').bind('myslidechange.sync', function(event, ui) {
                var value = ui.value;
                var id = this.id;
                var data = $('#'+id+'_Data').text();
                curId = '';
                if ( id.indexOf('WAV_NUM') !==  -1 ) {
                    var grId = id.substr(0, id.length-4) + 'GID';
                    var grVal = $('option:selected' ,'select#'+grId).val();
                    $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                        var sibId = $(this).find('div').attr('id');
                        var sibGrId = sibId.substr(0, sibId.length-4) + 'GID';
                        var sibGrVal = $('option:selected' ,'select#'+sibGrId).val();
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
        };

        $('tr.module').each(function(i){
            $('td:not(:first-child)', this).remove();
            var doc = '';
            for ( var j = 1; j < 5; j++) {
                var id = 'PRM-_FPART1-_RHY-_RT'+currentPartial+'-RFRT_WMT'+j+'_SW';
                var infoSw = ctrl.get(id);
                var waveOn = infoSw.value ? "checked='checked'" : '';
                var selected = selectedWave[j-1] ? "checked='checked'" : '';

                doc = (
                    '<td>'+
                        '<div>WAVE '+j+'</div>'+
                        '<input type="checkbox" name="wave'+j+'_Sw" id="wave'+j+'_Sw_'+i+'" '+waveOn+'>'+
                        '<label for="wave'+j+'_Sw_'+i+'">'+infoSw.string+'</label>'+
                        '<input type="checkbox" name="wave'+j+'_Sel" id="wave'+j+'_Sel_'+i+'" '+selected+'>'+
                        '<label for="wave'+j+'_Sel_'+i+'" style="width:55px">SELECT</label>'+
                    '</td>'
                );
                $(this).append(doc);
                wave(j);
            }
        });

        $('tr.slider td:not(:first-child)', 'table:not(#cmpEqTable)').each(function(){
            var id = $(this).children('div').attr('id');
            createSlider(id, ctrl);
        });

        $('tr.selector td:not(:first-child)', 'table:not(#cmpEqTable)').each(function(){
            var id = $(this).children('select').attr('id');
            createSelector(id, ctrl);
        });

        $('tr.button td:not(:first-child)', 'table:not(#cmpEqTable)').each(function(){
            var id = $(this).children('input').attr('id');
            createButton(id, ctrl);
        });

        $('tr.text td:not(:first-child)', 'table:not(#cmpEqTable)').each(function(){
            var id = $(this).children('input').attr('id');
            createTextBox(id, ctrl);
        });

        // phrase number selector
        $('select#PRM-_FPART1-_RHY-_RC2-RFRC2_PHRASE option').each(function(i){
            if ( i < 19 ) {
                var phraseName = window.parent.globals.parameter.phrase.rhyPhraseTbl[i];
                $(this).text(i+' : '+phraseName);
            } else {
                $(this).remove();
            }
        });

        var curExpansion = window.parent.globals.parameter.db.curExpansion;
        for ( var i = 1; i <= 12; i++) {
            if ( $.inArray(i, curExpansion) === -1) {
                $('select[id*=WAV_GID] option[value='+i+']').remove();
            }
        }

        // wave type init
        for ( var i = 1; i < 5; i++) {
            var id = ('PRM-_FPART1-_RHY-_RT_partial_-RFRT_WMT'+i+'_WAV_GTYPE').replace(/_partial_/, currentPartial);
            var info = ctrl.get(id);
            if ( info.value === 0 ) {
                $('#'+id.replace(/GTYPE/, 'GID')).val('0');
                ctrl.put(id, 0);
            }
        }


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

        for ( var j = 1; j < 5; j++ ) {
            sync(j+1, selectedWave[j-1]);
        }

    };

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

    $('tr.slider td:not(:first-child)', 'table#cmpEqTable').each(function(){
        var id = $(this).children('div').attr('id');
        createSlider(id, ctrl);
        $('#'+id+'_Data').css({'width': '70px'});
    });

    $('tr.selector td:not(:first-child)', 'table#cmpEqTable').each(function(){
        var id = $(this).children('select').attr('id');
        createSelector(id, ctrl);
    });

    $('tr.button td:not(:first-child)', 'table#cmpEqTable').each(function(){
        var id = $(this).children('input').attr('id');
        createButton(id, ctrl);
    });

    ctrl.curPartialChanged();

/* table css */
    $('table.tonePcmdTable td:nth-child(1)').css({'width':'40%','min-width':'100px'});
    $('table.tonePcmdTable td:nth-child(2)').css({'min-width':'100px'});
    $('table.wave td:nth-child(1)').css({'width':'15%','min-width':'110px'});
    $('#cmpEqBody td:first-child').css({'width':'5%','min-width':'80px'});

});