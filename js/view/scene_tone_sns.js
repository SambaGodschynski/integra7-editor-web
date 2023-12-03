//
//  scene_tone_sns.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

    var ctrl = window.parent.globals.controller.tone_sns;

/* Table css */
    $('table.toneSnsTable td:nth-child(1)').css({'width':'40%','min-width':'100px'});
    $('table.toneSnsTable td:nth-child(2)').css({'min-width':'100px'});
    $('table.partial td:nth-child(1)').css({'width':'20%','min-width':'100px'});

    var createSlider = function (id, ctrl) {
        var info = ctrl.get(id);
        $('#'+id).mySlider({
            range: 'min',
            value: info.value,
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
            'margin':'2px 10px 2px 10px'
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
        $('#'+id).attr('checked', initValue);
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

	var curId = '';
	function listner(ev, param) {
		var id = param;

		if (id.indexOf("-_FPART") > 0) {
			id = id.replace(/\d+/, 1); // PART* -> PART1
		}

		if (ev == 'model') {
			if (id === curId) return;
			var item = $("#" + id);

			if (item.length) {
				update(id, item);
                if ((id+" ").indexOf("_OSC_WAVE"+" ") !== -1 ) {
                    waveEnable(id);
                }
			} else if ( (id.indexOf("_SW") !== -1) && (id.indexOf("-_SHPAT-_SHPC-SHPC_TONE") !== -1)) {
				var num = id.slice(-4, -3);
				var info = ctrl.get(id);
                var val = info.value;
				var label = val ? 'ON' : 'OFF';

                $('input[name=partial'+num+'_Sw]').each(function(){
                    $('label[for='+this.id+'] span.ui-button-text').text(label);
                    $(this).prop('checked', val ? true : false).button('refresh');
                });
            }
		}
	}

	/* append/remove update listener to observer */
	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_tone_sns');
	};
	window.parent.globals.observer.append('scene_tone_sns', listner);

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
			if ( ( o.max - o.min ) === 1 || id === "PRM-_FPART1-_SHPAT-_SHPC-SHPC_SYNC_RING_SEL") {
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

/* Common */
    $('td:last-child', '.toneSnsTable tr').each(function(){
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
                var selected = ((info.min + j) == info.value) ? " selected='selected'" : '';
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
        } else {
            doc += (
                '<input type="checkbox" id="'+id+'" />'+
                '<label for="'+id+'"></label>'
            );
        }
        $(this).append(doc);
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
            var selected = $('option:selected' ,this).val();
            ctrl.put(id, selected);
            curId  = '';
        });
    };

    // Tone Category
    $('#PRM-_FPART1-_SHPAT-_SHPC-SHPC_CATE').empty();
    createCategory('PRM-_FPART1-_SHPAT-_SHPC-SHPC_CATE', ctrl);

/* Partial */

    var selectedPartial = window.parent.globals.parameter.db.snsSelectedPartial;

    var partial = function(num){
        // partial sw
        $('input[id^=partial'+num+'_Sw]').button().click(function(){
            $('label[for^=partial'+num+'_Sw] span.ui-button-text').text(this.checked ? 'ON' : 'OFF');
            $('input[name=partial'+num+'_Sw]').prop('checked', this.checked).button('refresh');
            ctrl.put('PRM-_FPART1-_SHPAT-_SHPC-SHPC_TONE'+num+'_SW', this.checked);
        })
        .keydown(function(e){
            if(e.keyCode === 38 || e.keyCode === 40){
                return false;
            }
        })
        .keyup(function(e){
            switch(e.keyCode){
                case 38: // Key[↑]
                    $('input[name=partial'+num+'_Sw]').prop('checked', true).button('refresh');
                    ctrl.put('PRM-_FPART1-_SHPAT-_SHPC-SHPC_TONE'+num+'_SW', 1);
                    break;

                case 40: // Key[↓]
                    $('input[name=partial'+num+'_Sw]').prop('checked', false).button('refresh');
                    ctrl.put('PRM-_FPART1-_SHPAT-_SHPC-SHPC_TONE'+num+'_SW', 0);
                    break;

                default:
                    break;
            }
        });
        // partial select
        $('input[id^=partial'+num+'_Sel]').button().click(function(){
            $('input[name=partial'+num+'_Sel]').prop('checked', this.checked).button('refresh');
            window.parent.globals.parameter.db.snsSelectedPartial[num-1] = this.checked;
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
                    $('input[name=partial'+num+'_Sel]').prop('checked', true).button('refresh');
                    window.parent.globals.parameter.db.snsSelectedPartial[num-1] = 1;
                    sync(num+1, 1);
                    break;

                case 40: // Key[↓]
                    $('input[name=partial'+num+'_Sel]').prop('checked', false).button('refresh');
                    window.parent.globals.parameter.db.snsSelectedPartial[num-1] = 0;
                    sync(num+1, 0);
                    break;

                default:
                    break;
            }
        });
    };

/* Partial sw */

    // partial row sync
    var sync = function(row, flg) {
        var target = $('td:nth-child('+row+')','.partial tr:not(.module)');
        if (flg) { // partial sync
            target.children().addClass('sync');
            target.css({'background-color':'#454545'});
            syncPartial();
        } else { // partial not-sync
            target.children().removeClass('sync').unbind('.sync');
            target.css({'background-color':'transparent'});
        }
    };

    var syncPartial = function() {
        // sync partial
        $('select.sync', 'table.partial').bind('change.sync', function() {
            var value = this.value;
            $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                var sibId = $(this).find('select').attr('id');
                if ( $('#'+sibId).hasClass('sync') && !$('#'+sibId).attr('disabled') ) {
                    ctrl.put(sibId, value);
                }
                if ( (sibId+" ").indexOf("_OSC_WAVE"+" ") !== -1 ) {
                    waveEnable(sibId);
                }
            });
        });

        $('input.sync', 'table.partial').bind('click.sync', function() {
            var value = (this.checked) ? 1 : 0;
            $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                var sibId = $(this).find('input').attr('id');
                if ( $('#'+sibId).hasClass('sync') && !$('#'+sibId).attr('disabled') ) {
                    ctrl.put(sibId, value);
                }
            });
        })
        .bind('keyup.sync', function(e){
            if ( e.keyCode === 38 || e.keyCode === 40 ) {
                var value = (this.checked) ? 1 : 0;
                $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                    var sibId = $(this).find('input').attr('id');
                    if ( $('#'+sibId).hasClass('sync') && !$('#'+sibId).attr('disabled') ) {
                        ctrl.put(sibId, value);
                    }
                });
            }
        });

        $('div.sync', 'table.partial').bind('myslidechange.sync', function(event, ui) {
            var value = ui.value;
            $(this).parent('td').siblings('td:not(:first-child)').each(function(){
                var sibId = $(this).find('div').attr('id');
                if ( $('#'+sibId).hasClass('sync') && !$('#'+sibId).hasClass('ui-mySlider-disabled') ) {
                    ctrl.put(sibId, value);
                }
            });
        });
    };

    $('tr.module').each(function(i){
        var doc = '';
        for ( var j = 1; j < 4; j++) {
            var infoSw = ctrl.get('PRM-_FPART1-_SHPAT-_SHPC-SHPC_TONE'+j+'_SW');
            var partialSw = infoSw.value ? "checked='checked'" : '';
            var selected = selectedPartial[j-1] ? 'checked' : '';

            doc = (
                '<td>'+
                    '<div>PARTIAL '+j+'</div>'+
                    '<input type="checkbox" name="partial'+j+'_Sw" id="partial'+j+'_Sw_'+i+'" '+partialSw+'>'+
                    '<label for="partial'+j+'_Sw_'+i+'">'+infoSw.string+'</label>'+
                    '<input type="checkbox" name="partial'+j+'_Sel" id="partial'+j+'_Sel_'+i+'" '+selected+'>'+
                    '<label for="partial'+j+'_Sel_'+i+'" style="width:55px">SELECT</label>'+
                '</td>'
            );
            $(this).append(doc);
            partial(j);
        }
    });

    // createPartialTable
    $('table.partial tr').not('.module').each(function(){
        var trClass = $(this).attr('class');
        var doc = '';
        for ( var i = 1; i < 4; i++) {
            doc += '<td>';
            var id = $('td', this).attr('id').replace(/_partial_/, i);
            if ( trClass === 'selector' ){
                doc += '<select id='+id+'>';
                var info = ctrl.get(id);
                var opt = info.stringer.enumrate();
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) == info.value) ? "selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j) + '"' + selected +'>' +
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

    $('tr.selector td').not(':first-child').each(function(){
        var id = $(this).children('select').attr('id');
        createSelector(id, ctrl);
    });

    $('tr.slider td').not(':first-child').each(function(){
        var id = $(this).children('div').attr('id');
        createSlider(id, ctrl);
    });

    $('tr.button td').not(':first-child').each(function(){
        var id = $(this).children('input').attr('id');
        createButton(id, ctrl);
    });

    // phrase number selector
    $('#PRM-_FPART1-_SHPAT-_SHPC-SHPC_PHRASE option').each(function(i){
        if ( i < 244 ) {
            var phraseName = window.parent.globals.parameter.phrase.patPhraseTbl[i];
            $(this).text(i+' : '+phraseName);
        } else {
            $(this).remove();
        }
    });

    // sort Filter Mode
    $('select[id$=FILT_MODE]').each(function(){
        for ( var i = 0; i < 3; i++) {
            $('option:nth-child(3)', this).clone().appendTo(this);
            $('option:nth-child(3)', this).remove();
        }
    });


    var waveEnable = function(id){
        var waveVal = $('option:selected', '#'+id).val();
        switch ( waveVal ) {
            case '0' :
            case '1' :
            case '2' :
            case '3' :
            case '4' :
            case '5' :
                $('select#'+id.replace(/_OSC_WAVE/, '_OSC_WAVE_VAR')).removeAttr('disabled');
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_NUML')).mySlider('disable');
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_NUML')).find('a').hide();
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_NUML_Data')).css({'color':'#888888'});
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_GAIN')).attr('disabled', true);
                break;
            case '6' :
                $('select#'+id.replace(/_OSC_WAVE/, '_OSC_WAVE_VAR')).attr('disabled', true);
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_NUML')).mySlider('disable');
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_NUML')).find('a').hide();
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_NUML_Data')).css({'color':'#888888'});
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_GAIN')).attr('disabled', true);
                break;
            case '7' :
                $('select#'+id.replace(/_OSC_WAVE/, '_OSC_WAVE_VAR')).attr('disabled', true);
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_NUML')).mySlider('enable');
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_NUML')).find('a').show();
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_NUML_Data')).css({'color':'#EEEEEE'});
                $('#'+id.replace(/_OSC_WAVE/, '_WAV_GAIN')).removeAttr('disabled');
                break;
            default :
                break;
        }
    };

    $('select[id$=SHPT_OSC_WAVE]').each(function(){
        var id = this.id;
        waveEnable(id);
        $(this).bind('change.wave', function(){
            waveEnable(this.id);
        });
    });

    for ( var i = 1 ; i < 4 ; i++ ) {
        var value = selectedPartial[i-1];
        sync(i+1, value);
    }

    $('span[id$=WAV_NUML_Data]').css({'width': '110px'});
});