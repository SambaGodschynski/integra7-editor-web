//
//  scene_effects_master.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

	var contents = window.parent.globals.parameter.db.curContents;
	window.parent.globals.parameter.db.contentsAreaScene[contents] = 2;


    var ctrl = window.parent.globals.controller.effects;
    var curId = '';

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
        $("#"+id).change(function() {
            curId = id;
            var value = parseInt($('option:selected', this).val(), 10);
            ctrl.put(id, value);
            curId = "";
        });
    };

    var choParamMake = function(choType) {
        $('td.slider, td.selector', 'table.chorusParameter').children().remove();
        $('tr', 'table#'+choType).each(function(i){
            var id = 'PRM-_PRF-_FH-NEFH_CHO_PRM'+(i+1);
            var info = ctrl.get(id);
            var tdClass = $('td:last-child', this).attr('class');
            if ( tdClass === 'selector' ){
                var opt = info.stringer.enumrate();
                var doc = (
                    '<select id='+id+'>'
                );
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) === info.value) ? "selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j) + '"' + selected + '>' +
                        opt[j] +
                        '</option>'
                    );
                }
                doc += (
                    '</select>'
                );
                $('td:last-child', this).append(doc);
                createSelector(id, ctrl);

            } else if ( tdClass === 'slider' ) {
                var doc = (
                    '<div id="'+id+'"></div>'+
                    '<span id="'+id+'_Data"></span>'
                );
                $('td:last-child', this).append(doc);
                createSlider(id, ctrl);
            }
        });
        $('tr.rate', 'table#'+choType).each(function(){
            var rateId = $(this).find('select').attr('id');
            rateParam(rateId);
            $('#'+rateId).change(function(){
                rateParam(rateId);
            });
        });
    };

    var revParamMake = function(revType) {
        $('td.slider', 'table.reverbParameter').children().remove();
        $('tr', 'table#'+revType).each(function(i){
            var id = 'PRM-_PRF-_FV-NEFV_REV_PRM'+(i+1);
            var info = ctrl.get(id);
            var tdClass = $('td:last-child', this).attr('class');
            if ( tdClass === 'slider' ){
                var doc = (
                    '<div id="'+id+'"></div>'+
                    '<span id="'+id+'_Data"></span>'
                );
                $('td:last-child', this).append(doc);
                createSlider(id, ctrl);
            }
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

        if( id.indexOf("CHO_TYPE") !== -1 ) {
            var val  = ctrl.getVal(id);
            choChange(val.toString());
        } else if ( id.indexOf("REV_TYPE") !== -1 ) {
            var val = ctrl.getVal(id);
            revChange(val.toString());
        }
        if (ev == 'model') {
            if (id === curId) return;
            var item = $("#" + id);
            if (item.length) {
                update(id, item);
            }
        }
        if ( id.indexOf("RSS_SW") !== -1 ) {
            window.parent.globals.controller.indextop.updateContents();
        }
    }

    /* append/remove update listener to observer */
    window.onbeforeunload = function() {
        window.parent.globals.observer.remove('scene_effects_master');
    };

    window.parent.globals.observer.append('scene_effects_master', listner);

    function update(id, item) {
        var divName = item.get(0).tagName;
        var o = ctrl.get(id);

        switch (divName) {
        case "SELECT":
            item.val (o.value);
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

    $('td:last-child', '.effectsMasterTable tr').each(function(){
        var id = $(this).attr('class');
        var doc = '';
        var trClass = $(this).closest('tr').attr('class');
        if ( trClass === 'selector' ){
            var info = ctrl.get(id);
            var opt = info.stringer.enumrate();
            doc += (
                '<select id='+id+'>'
            );

            if ( id.indexOf("CHO_TYPE") !== -1 || id.indexOf("REV_TYPE") !== -1 ){
                 for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) === info.value) ? "selected='selected'" : '';
                    doc += (
                        '<option value="' + (info.min + j) + '"' + selected + '>' +
                        '0'+j+' : '+ opt[j] +
                        '</option>'
                    );
                }
            } else {
                for (var j = 0, len = opt.length; j < len; j++) {
                    var selected = ((info.min + j) === info.value) ? "selected='selected'" : '';
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

    //Chorus Type Change
    var choChange = function(value) {
        $('.chorusParameter tr td:last-child').empty();
        $('.chorusParameter').hide();
        var type = value;
        switch (type) {
            case '0':
                $('table#off').show();
                choParamMake("off");
                break;

            case '1':
                $('table#chorus').show();
                choParamMake("chorus");
                break;

            case '2':
                $('table#delay').show();
                choParamMake("delay");
                break;

            case '3':
                $('table#gm2Chorus').show();
                choParamMake("gm2Chorus");
                break;

            default:
                break;
        }
        var rssId = "PRM-_PRF-_FRSS-NEFRSS_RSS_SW";
        if ( ctrl.getVal(rssId) ) {
            $('#chorusTable, .chorusParameter').hide();
            $('.disableMsg').show();
        }
    };

    //Reverb Type Change
    var revChange = function(value) {
        $('.reverbParameter tr td:last-child').empty();
        $('.reverbParameter').hide();
        var type = value;
        switch (type) {
            case '0':
                $('table#off').show();
                revParamMake('off');
                break;

            case '6':
                $('table#gm2Reverb').show();
                revParamMake('gm2Reverb');
                break;

            default:
                $('table#other').show();
                revParamMake('other');
                break;
        }
        var rssId = "PRM-_PRF-_FRSS-NEFRSS_RSS_SW";
        if ( ctrl.getVal(rssId) ) {
            $('#reverbTable, .reverbParameter').hide();
            $('.disableMsg').show();
        }
    };

    // Init Chorus Param
    var choTypeId = $('select[id*=CHO_TYPE]').attr('id');
    var choTypeValue = $('#'+choTypeId).val().toString();
    choChange(choTypeValue);

    // Init Reverb Param
    var revTypeId = $('select[id*=REV_TYPE]').attr('id');
    var revTypeValue = $('#'+revTypeId).val().toString();
    revChange(revTypeValue);

    $('#PRM-_PRF-_FH-NEFH_CHO_OUT_SELECT').change(function () {
        if ( $('option:selected', this).val() === '1' ) {
            $('#PRM-_PRF-_FH-NEFH_CHO_OUT_ASGN').prop("disabled",true);
        } else {
            $('#PRM-_PRF-_FH-NEFH_CHO_OUT_ASGN').prop("disabled",false);
        }
    });

/* Table CSS */
    $('table.chorusParameter td:nth-last-child(2)').css('padding-left','50px');
    $('table.reverbParameter td:nth-last-child(2)').css('padding-left','50px');
    $('table[class$=Table] td:nth-child(1)').css({'width':'40%','min-width':'100px'});
    $('table[class$=Table] td:nth-child(2)').css({'min-width':'100px'});
    $('table[class$=Parameter] td:nth-last-child(2)').css({'width':'40%','min-width':'100px','padding-left':'10%'});
    $('table[class$=Parameter] td:nth-last-child(1)').css({'min-width':'100px'});
    $('.masterEq td:nth-last-child(3)').css({'width':'10%','min-width':'30px'});
    $('.masterEq td:nth-last-child(2)').css({'width':'30%','min-width':'70px'});
    $('.masterEq td:last-child').css('min-width','100px');

    var anchor = window.parent.globals.parameter.db.effectsAnchor;
    location.hash = anchor;

});