//
//  scene_effects_part.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

	var contents = window.parent.globals.parameter.db.curContents;
	window.parent.globals.parameter.db.contentsAreaScene[contents] = 0;

    var ctrl = window.parent.globals.controller.effects;
    var curId = '';

    var curCtrl = window.parent.globals.controller.indextop;
    var toneType = curCtrl.getCurToneType();

    var currentToneType = 'SNTONE-_SNTF-SNTF';
    var currentTFX = 'SNTONE-_SNTC-SNTC';
    switch ( toneType ) {
        case 'SN-A' :
            currentToneType = 'SNTONE-_SNTF-SNTF';
            currentTFX = 'SNTONE-_SNTC-SNTC';
            break;
        case 'SN-S' :
            currentToneType = 'SHPAT-_SHPF-SHPF';
            currentTFX = 'SHPAT-_SHPC-SHPC';
            break;
        case 'SN-D' :
            currentToneType = 'KIT-_KF-SDKF';
            currentTFX = 'KIT-_KC-SDKC';
            break;
        case 'PCM-S' :
            currentToneType = 'PAT-_PF-RFPF';
            currentTFX = 'PAT-_PC2-RFPC2';
            break;
        case 'PCM-D' :
            currentToneType = 'RHY-_RF-RFRF';
            currentTFX = 'RHY-_RC2-RFRC2';
            break;
        default :
            break;
    }

    var createSlider = function (id, ctrl) {
        var info = ctrl.get(id);
        $('#'+id).mySlider({
            range: 'min',
            value: info.value,
            min: info.min,
            max: info.max,
            slide: function(event, ui) {
                curId = id;
                ctrl.put(id, ui.value);
                $('#'+id+'_Data').text(ctrl.getString(id));
                curId = "";
            }
        })
        .css({
            'width':'60%',
            'float':'left',
            'margin':'2px 10px 2px 10px'
        });
        $('#'+id+'_Data').text(info.string).css({
            'width': '65px',
            'float': 'right',
            'text-align': 'right',
            'padding-right':'3px'
        });
    };

    var createButton = function (id, ctrl) {
        var info = ctrl.get(id);
        var initValue = (info.value === info.min) ? false : true;
        $('label[for='+id+']').text(info.string).bind('selectstart', function(){ return false; });
        $('#'+id).prop('checked', initValue);
        $('#'+id).button().click(function(){
            curId = id;
            ctrl.put(id, ((this.checked) ? info.max : info.min));
            $('label[for='+id+'] span.ui-button-text').text(ctrl.getString(id));
            curId = "";
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

    var createSelector = function(id, ctrl) {
        var info = ctrl.get(id);
        $('#'+id).change(function() {
            curId = id;
            var value = parseInt($('option:selected', this).val(), 10);
            ctrl.put(id, value);
            curId = "";
        });
    };


    var paramMake = function(mfx) {
        $('td.slider, td.selector, td.button', 'table.mfxParameter').children().remove();
        $('tr', 'table#'+mfx).each(function(i){
            var id = 'PRM-_FPART1-_'+currentToneType+'_MFX_PRM'+(i+1);
            var tdClass = $('td:last-child', this).attr('class');
            if ( tdClass === 'selector' ){
                var info = ctrl.get(id);
                var opt = info.stringer.enumrate();
                var doc = (
                    '<select id='+id+'>'
                );
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
                $('td:last-child', this).append(doc).css({'width':'60%','min-width':'100px'});
                createSelector(id, ctrl);
            } else if ( tdClass === 'slider' ){
                var doc = (
                    '<div id="'+id+'"></div>'+
                    '<span id="'+id+'_Data"></span>'
                );
                $('td:last-child', this).append(doc).css({'width':'60%','min-width':'100px'});
                createSlider(id, ctrl);
            } else if ( tdClass === 'button' ){
                var doc = (
                    '<input type="checkbox" id="'+id+'" />'+
                    '<label for="'+id+'"></label>'
                );
                $('td:last-child', this).append(doc).css({'width':'60%','min-width':'100px'});
                createButton(id, ctrl);
            }
        });
        $('tr.rate', 'table#'+mfx).each(function(){
            var rateId = $(this).find('select').attr('id');
            rateParam(rateId);
            $('#'+rateId).change(function(){
                rateParam(rateId);
            });
        });
        $('select[id*=MFX_CTRL_ASGN]').each(function(){
            $(this).empty();
            var id = this.id;
            var info = ctrl.get(id);
            var opt = info.stringer.enumrate();
            var doc = '';
            for (var j = 0, len = opt.length; j < len; j++) {
                var selected = ((info.min + j) === info.value) ? " selected='selected'" : '';
                doc += (
                    '<option value="' + (info.min + j) + '"' + selected + '>' +
                    opt[j] +
                    '</option>'
                );
            }
            $(this).append(doc);
            createSelector(id, ctrl);
        });
    };

    var rateParam = function(id) {
        var info = ctrl.get(id);
        var flg = info.value-info.min;
        switch (flg) {
            case 0:
                $('#'+id).closest('tr').next('tr').children('td').show();
                $('#'+id).closest('tr').next('tr').next('tr').children('td').hide();
                break;
            case 1:
                $('#'+id).closest('tr').next('tr').children('td').hide();
                $('#'+id).closest('tr').next('tr').next('tr').children('td').show();
                break;
            default :
                break;
        }
    };

	function listner(ev, param) {
		var id = param;
		var part;
		if (id.indexOf("-_FPART") > 0) {
			//part = id.match(/\d+/) - 1; // 1..16
			id = id.replace(/\d+/, 1); // PART* -> PART1
		}

		if (id.indexOf("-_PRF-_FPEQ1") !== -1) {
			//part = id.match(/\d+/) - 1; // 1..16
			id = id.replace(/\d+/, 1); // PART* -> PART1
		}

        if ( id.indexOf("MFX_TYPE") !== -1 ) {
            var val  = ctrl.getVal(id);
            mfxChange(val.toString());
        }

		if (ev == 'model') {
			if (id === curId) return;
			var item = $("#" + id);
			if (item.length) {
				update(id, item);
			}
		}
	}

	/* append/remove update listener to observer */
	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_effects_part');
	};

	window.parent.globals.observer.append('scene_effects_part', listner);

	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

		switch (divName) {
		case "SELECT":
            item.val(o.value);
            if ( $('#'+id).closest('tr').hasClass('rate')) {
                rateParam(id);
            }
			break;
		default:
			if ( ( o.max - o.min ) === 1 ) {
                $('label[for='+id+'] span.ui-button-text').text(o.string);
                item.prop('checked',(o.value - o.min) ? true : false).button('refresh');
			} else {
				item.mySlider('value', o.value);
				$('#'+id+'_Data').text(o.string);
			}
			break;
		}
	}

/* ================================ */
/* PART EFFECTS
/* ================================ */

    var mfxChange = function(value){
        $('.mfxParameter tr td:last-child').empty();
        $('.mfxParameter').hide();
        var type = value;
        switch (type) {
            case '0':
                $('table#thru').show();
                paramMake("thru");
                break;

            case '1':
                $('table#equalizer').show();
                paramMake("equalizer");
                break;

            case '2':
                $('table#spectrum').show();
                paramMake("spectrum");
                break;

            case '3':
                $('table#lowBoost').show();
                paramMake("lowBoost");
                break;

            case '4':
                $('table#stepFilter').show();
                paramMake("stepFilter");
                break;

            case '5':
                $('table#enhancer').show();
                paramMake("enhancer");
                break;

            case '6':
                $('table#autoWah').show();
                paramMake("autoWah");
                break;

            case '7':
                $('table#humanizer').show();
                paramMake("humanizer");
                break;

            case '8':
                $('table#speakerSimulator').show();
                paramMake("speakerSimulator");
                break;

            case '9':
                $('table#phaser1').show();
                paramMake("phaser1");
                break;

            case '10':
                $('table#phaser2').show();
                paramMake("phaser2");
                break;

            case '11':
                $('table#phaser3').show();
                paramMake("phaser3");
                break;

            case '12':
                $('table#stepPhaser').show();
                paramMake("stepPhaser");
                break;

            case '13':
                $('table#multiStagePhaser').show();
                paramMake("multiStagePhaser");
                break;

            case '14':
                $('table#infinitePhaser').show();
                paramMake("infinitePhaser");
                break;

            case '15':
                $('table#ringModulator').show();
                paramMake("ringModulator");
                break;

            case '16':
                $('table#tremolo').show();
                paramMake("tremolo");
                break;

            case '17':
                $('table#autoPan').show();
                paramMake("autoPan");
                break;

            case '18':
                $('table#slicer').show();
                paramMake("slicer");
                break;

            case '19':
                $('table#rotary1').show();
                paramMake("rotary1");
                break;

            case '20':
                $('table#rotary2').show();
                paramMake("rotary2");
                break;

            case '21':
                $('table#rotary3').show();
                paramMake("rotary3");
                break;

            case '22':
                $('table#chorus').show();
                paramMake("chorus");
                break;

            case '23':
                $('table#flanger').show();
                paramMake("flanger");
                break;

            case '24':
                $('table#stepFlanger').show();
                paramMake("stepFlanger");
                break;

            case '25':
                $('table#hexa-chorus').show();
                paramMake("hexa-chorus");
                break;

            case '26':
                $('table#tremoloChorus').show();
                paramMake("tremoloChorus");
                break;

            case '27':
                $('table#space-d').show();
                paramMake("space-d");
                break;

            case '28':
                $('table#overdrive').show();
                paramMake("overdrive");
                break;

            case '29':
                $('table#distortion').show();
                paramMake("distortion");
                break;

            case '30':
                $('table#guitarAmpSimulator').show();
                paramMake("guitarAmpSimulator");
                break;

            case '31':
                $('table#compressor').show();
                paramMake("compressor");
                break;

            case '32':
                $('table#limiter').show();
                paramMake("limiter");
                break;

            case '33':
                $('table#gate').show();
                paramMake("gate");
                break;

            case '34':
                $('table#delay').show();
                paramMake("delay");
                break;

            case '35':
                $('table#modulationDelay').show();
                paramMake("modulationDelay");
                break;

            case '36':
                $('table#3tapPanDelay').show();
                paramMake("3tapPanDelay");
                break;

            case '37':
                $('table#4tapPanDelay').show();
                paramMake("4tapPanDelay");
                break;

            case '38':
                $('table#multiTapDelay').show();
                paramMake("multiTapDelay");
                break;

            case '39':
                $('table#reverseDelay').show();
                paramMake("reverseDelay");
                break;

            case '40':
                $('table#timeCtrlDelay').show();
                paramMake("timeCtrlDelay");
                break;

            case '41':
                $('table#lofiCompress').show();
                paramMake("lofiCompress");
                break;

            case '42':
                $('table#bitCrasher').show();
                paramMake("bitCrasher");
                break;

            case '43':
                $('table#pitchShifter').show();
                paramMake("pitchShifter");
                break;

            case '44':
                $('table#2voicePitchShifter').show();
                paramMake("2voicePitchShifter");
                break;

            case '45':
                $('table#overdrive_chorus').show();
                paramMake("overdrive_chorus");
                break;

            case '46':
                $('table#overdrive_flanger').show();
                paramMake("overdrive_flanger");
                break;

            case '47':
                $('table#overdrive_delay').show();
                paramMake("overdrive_delay");
                break;

            case '48':
                $('table#distortion_chorus').show();
                paramMake("distortion_chorus");
                break;

            case '49':
                $('table#distortion_flanger').show();
                paramMake("distortion_flanger");
                break;

            case '50':
                $('table#distortion_delay').show();
                paramMake("distortion_delay");
                break;

            case '51':
                $('table#odds_touchWah').show();
                paramMake("odds_touchWah");
                break;

            case '52':
                $('table#odds_autoWah').show();
                paramMake("odds_autoWah");
                break;

            case '53':
                $('table#guitarAmpSim_chorus').show();
                paramMake("guitarAmpSim_chorus");
                break;

            case '54':
                $('table#guitarAmpSim_flanger').show();
                paramMake("guitarAmpSim_flanger");
                break;

            case '55':
                $('table#guitarAmpSim_phaser').show();
                paramMake("guitarAmpSim_phaser");
                break;

            case '56':
                $('table#guitarAmpSim_delay').show();
                paramMake("guitarAmpSim_delay");
                break;

            case '57':
                $('table#epAmpSim_tremolo').show();
                paramMake("epAmpSim_tremolo");
                break;

            case '58':
                $('table#epAmpSim_chorus').show();
                paramMake("epAmpSim_chorus");
                break;

            case '59':
                $('table#epAmpSim_flanger').show();
                paramMake("epAmpSim_flanger");
                break;

            case '60':
                $('table#epAmpSim_phaser').show();
                paramMake("epAmpSim_phaser");
                break;

            case '61':
                $('table#epAmpSim_delay').show();
                paramMake("epAmpSim_delay");
                break;

            case '62':
                $('table#enhancer_chorus').show();
                paramMake("enhancer_chorus");
                break;

            case '63':
                $('table#enhancer_flanger').show();
                paramMake("enhancer_flanger");
                break;

            case '64':
                $('table#enhancer_delay').show();
                paramMake("enhancer_delay");
                break;

            case '65':
                $('table#chorus_delay').show();
                paramMake("chorus_delay");
                break;

            case '66':
                $('table#flanger_delay').show();
                paramMake("flanger_delay");
                break;

            case '67':
                $('table#chorus_flanger').show();
                paramMake("chorus_flanger");
                break;

            default:
                $('table#thru').show();
                break;
        }
    };

/* MFX Type */
    $('td:last-child', 'table.common tr, table.effectsPartTable tr, table.mfxCtrl').each(function(){
        $(this).empty();
        var id = $(this).attr('class').replace(/_currentToneType_/, currentToneType)
                        .replace(/_currentTFX_/, currentTFX);
        var doc ='';
        var trClass = $(this).closest('tr').attr('class');
        if ( trClass === 'selector' ){
            var info = ctrl.get(id);
            var opt = info.stringer.enumrate();
            doc += (
                '<select id='+id+'>'
            );

            if ( id.indexOf("_SRC") !== -1 ) {
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) === info.value) ? " selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j + ((j > 31) ? 1 : 0))  + '"' + selected + '>' +
                        opt[j] +
                        '</option>'
                    );
                }
            } else if ( id.indexOf("MFX_TYPE") !== -1 ){
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) === info.value) ? " selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j) + '"' + selected + '>' +
                        ('0'+j+' : ').slice(-5) + opt[j] +
                        '</option>'
                    );
                }
            } else {
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) === info.value) ? " selected='selected'" : '';
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
        } else if ( trClass === 'slider' ){
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
        $(this).append(doc);
    });


	var msbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB";

    $('tr.selector td:last-child').each(function(){
        var id = $(this).children('select').attr('id');
        createSelector(id, ctrl);
    });

    $('tr.slider td:last-child').each(function(){
        var id = $(this).children('div').attr('id');
        createSlider(id, ctrl);
    });

    $('tr.button td:last-child').each(function(){
        var id = $(this).children('input').attr('id');
        createButton(id, ctrl);
    });

    $('td:first-child', 'table.common tr').css({'width':'40%','min-width':'100px'});

    // Init Mfx Param
    var mfxTypeId = $('select[id$=MFX_TYPE]').attr('id');
    mfxChange($('#'+mfxTypeId).val());

/* Table css */
    $('td:last-child', '.effectsPartTable tr, .mfxCtrl tr').css({'width':'60%','min-width':'100px'});
    $('table.mfxParameter td:nth-last-child(2)').css('padding-left','50px');

    var anchor = window.parent.globals.parameter.db.effectsAnchor;
    location.hash = anchor;
});