//
//  scene_motionalsurround.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

    var ctrl = window.parent.globals.controller.motionalsurround;
    var curId = '';

    var curPart = window.parent.globals.parameter.db.curPart + 1;
    var extPart = window.parent.globals.parameter.db.curExtPartSw;

    var currentPart = 'FP1-NEFP_RSS';
    var currentPart_x = 'FP1-NEFP_RSS_X1';
    var currentPart_y = 'FP1-NEFP_RSS_Y1';
    var draggableText = '1';

    if ( extPart ) {
        currentPart = 'FRSS-NEFRSS_AUX_IN';
        currentPart_x = 'FRSS-NEFRSS_AUX_IN_X';
        currentPart_y = 'FRSS-NEFRSS_AUX_IN_Y';
        draggableText = 'EX';
    } else {
        currentPart = 'FP'+curPart+'-NEFP_RSS';
        currentPart_x = 'FP'+curPart+'-NEFP_RSS_X1';
        currentPart_y = 'FP'+curPart+'-NEFP_RSS_Y1';
        draggableText = curPart;
    }

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
        $('#'+id+'_Data').css({
            'width': '30px',
            'float': 'right',
            'text-align': 'right',
            'padding-right':'3px'
        });
    };

    var createButton = function (id, ctrl) {
        var info = ctrl.get(id);
        var initValue = (info.value === info.min) ? false : true;
        $('#'+id).after('<label for='+id+' onSelectStart="return false">'+ info.string +'</label>');
        $('#'+id).prop('checked', initValue);
        $('#'+id).button().click(function(){
            curId = id;
            ctrl.put(id, ((this.checked) ? info.max : info.min));
            var label = ctrl.getString(id);
            $('label[for='+id+'] span.ui-button-text').text(label);
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
        $("#"+id).change(function() {
            curId = id;
            var value = parseInt($('option:selected', this).val(), 10);
            ctrl.put(this.id, value);
            curId = '';
        });
    };


/* table css */
    $('td:nth-child(1)', '.motionalSurround, .motionalSurroundPart').css({'width':'40%','min-width':'100px'});
    $('td:nth-child(2)', '.motionalSurround, .motionalSurroundPart').css({'min-width':'100px'});

    function listner(ev, param) {
        var id = param;

    //  id = id.replace(/\d+/, 1); // PART* -> PART1

        if (ev == 'model') {
            if (id === curId) return;
            var item = $("#" + id);
            if (item.length) {
                update(id, item);
            } else if ( id.indexOf('RSS') !== -1 && id.indexOf('POS') !== -1 ) {
                updateOtherPos(id);
            }
        }
    }

    /* append/remove update listener to observer */
    window.onbeforeunload = function() {
        window.parent.globals.observer.remove('scene_motionalsurround');
    };
    window.parent.globals.observer.append('scene_motionalsurround', listner);

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

                if (id.indexOf("-NEFP_RSS_X") !== -1 ) {
                    $('#sliderLR_Data').text(o.string);
                    var val = o.value;
                    var posId = id.replace(/PRM-_PRF-_FP/, '').replace(/-NEFP_RSS_X1POS/, '');
                    $('#pos'+posId).css({left: 2*val });
                } else if (id.indexOf("-NEFP_RSS_Y") !== -1 ) {
                    $('#sliderFB_Data').text(o.string);
                    var val = o.value;
                    var posId = id.replace(/PRM-_PRF-_FP/, '').replace(/-NEFP_RSS_Y1POS/, '');
                    $('#pos'+posId).css({top:255 - 2*val });
                } else if (id.indexOf("AUX_IN_X") !== -1 ) {
                    $('#sliderLR_Data').text(o.string);
                    var val = o.value;
                    $('#posEX').css({left: 2*val });
                } else if (id.indexOf("AUX_IN_Y") !== -1 ) {
                    $('#sliderFB_Data').text(o.string);
                    var val = o.value;
                    $('#posEX').css({top: 255 - 2*val});
                }
            }
            break;
        }
    }

    function updateOtherPos(id) {
        if (id.indexOf("-NEFP_RSS_X") !== -1 ) {
            var val = ctrl.getVal(id);
            var posId = id.slice(id.indexOf('FP')+2, -15);
            $('#pos'+posId).css({left: 2*val });
        } else if (id.indexOf("-NEFP_RSS_Y") !== -1 ) {
            var val = ctrl.getVal(id);
            var posId = id.slice(id.indexOf('FP')+2, -15);
            $('#pos'+posId).css({top:255 - 2*val });
        } else if (id.indexOf("AUX_IN_X") !== -1 ) {
            var val = ctrl.getVal(id);
            $('#posEX').css({left: 2*val });
        } else if (id.indexOf("AUX_IN_Y") !== -1 ) {
            var val = ctrl.getVal(id);
            $('#posEX').css({top: 255 - 2*val});
        }
    }

/* Common */
    createButton("PRM-_PRF-_FRSS-NEFRSS_RSS_SW", ctrl);   //Motional Surroud Switch
    createSelector("PRM-_PRF-_FRSS-NEFRSS_RSS_ROOM_TYPE", ctrl);   //Room Type
    createSelector("PRM-_PRF-_FRSS-NEFRSS_REV_ROOMSIZE", ctrl);   //Room Size
    createSlider("PRM-_PRF-_FRSS-NEFRSS_SP4XTALKC", ctrl); //Motional Surround Depth
    createSlider("PRM-_PRF-_FRSS-NEFRSS_REV_LEVEL", ctrl);  //Ambient Level
    createSlider("PRM-_PRF-_FRSS-NEFRSS_REV_TIME", ctrl);   //Ambient Time
    createSlider("PRM-_PRF-_FRSS-NEFRSS_REV_DENSITY", ctrl);//Ambient Density
    createSlider("PRM-_PRF-_FRSS-NEFRSS_REV_HFDUMP", ctrl);  //Ambient HF Damp
/* Control */
    createSelector("PRM-_PRF-_FRSS-NEFRSS_AUX_IN_CTRL_CH", ctrl);

    /* show/hide view by RSS SW */
    // var partShow = function() {
    //     if ( ctrl.getVal('PRM-_PRF-_FRSS-NEFRSS_RSS_SW') ) {
    //         $('#boxRight').show();
    //     } else {
    //         $('#boxRight').hide();
    //     }
    // };
    // partShow();
    // $('#PRM-_PRF-_FRSS-NEFRSS_RSS_SW').bind('click.partShow', function(){
    //     partShow();
    // });


/* Part */
    $('.otherPos').each(function(i){
        if ( i < 16 ) {
            var muted = ctrl.getVal('PRM-_PRF-_FP'+(i+1)+'-NEFP_MUTE_SW');
            if ( !muted ) {
                var oLrId = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RSS_X1POS';
                var oFbId = 'PRM-_PRF-_FP'+(i+1)+'-NEFP_RSS_Y1POS';
                var oLrInfo = ctrl.get(oLrId);
                var oFbInfo = ctrl.get(oFbId);
                $(this).html('<img src="./img/RSS_Simple3.png" width="30px" height="30px"><p>'+(i+1)+'</p>').css({left:oLrInfo.value*2, top:255 -oFbInfo.value*2, "z-index":17-i}).show();
            }
        } else {
            var muted = ctrl.getVal('PRM-_PRF-_FC-NEFC_IN_MUTE_SW');
            if ( !muted ) {
                var exLrId = 'PRM-_PRF-_FRSS-NEFRSS_AUX_IN_XPOS';
                var exFbId = 'PRM-_PRF-_FRSS-NEFRSS_AUX_IN_YPOS';
                var exLrInfo = ctrl.get(exLrId);
                var exFbInfo = ctrl.get(exFbId);
                $(this).html('<img src="./img/RSS_Simple3.png" width="30px" height="30px"><p>EX</p>').css({left:exLrInfo.value*2, top:255 - exFbInfo.value*2, "z-index":1}).show();
            }
        }
    });

    $('.otherPos p').css({
        'position': 'relative',
        'color': 'white',
        'margin': '0px',
        'text-align': 'center',
        'top': '-27px',
        'valign': 'middle'
    });

    $('.otherPos img').css({'opacity': '0.8'});

    $('#pos'+draggableText).addClass('draggable');
    partReload(currentPart, currentPart_x, currentPart_y);

    function partReload(part, part_x, part_y) {
        $('#part').find('h2').empty().append('PART  :  '+draggableText);

        $('#sliderLR_Data, #sliderFB_Data, #sliderLR, #sliderFB').empty();

        var lrId = ('PRM-_PRF-__partX_POS').replace(/_partX_/, part_x);
        var lrInfo = ctrl.get(lrId);
        $('#sliderLR_Data').text(lrInfo.string);
        $('#sliderLR').append('<div style="width:255px" id="'+lrId+'"></div>');
        $('#'+lrId).mySlider({
            range: 'min',
            value: lrInfo.value,
            min: lrInfo.min,
            max: lrInfo.max,
            slide: function(event, ui) {
                curId = lrId;
                var value = ui.value;
                ctrl.put(lrId, value);
                $('#sliderLR_Data').text(ctrl.getString(lrId));
                curId = '';
                $('.draggable').css({left:value*2});
            }
        });

        var fbId = ('PRM-_PRF-__partY_POS').replace(/_partY_/, part_y);
        var fbInfo = ctrl.get(fbId);
        $('#sliderFB_Data').text(fbInfo.string);
        $('#sliderFB').append('<div style="height:255px" id="'+fbId+'"></div>');
        $('#'+fbId).mySlider({
            orientation: "vertical",
            range: 'min',
            value: fbInfo.value,
            min: fbInfo.min,
            max: fbInfo.max,
            slide: function(event, ui) {
                curId = fbId;
                var value = ui.value;
                ctrl.put(fbId, value);
                $('#sliderFB_Data').text(ctrl.getString(fbId));
                curId = '';
                $('.draggable').css({top:255 - value*2});
            }
        });

        $('.motionalSurroundPart tr td:last-child').each(function(){
            $(this).empty();
            var tdClass = $(this).attr('class');
            var id = tdClass.replace(/_currentPart_/, part);
            var doc = '<div id="'+id+'"></div>';
            $(this).append(doc);
            createSlider(id, ctrl);
        });


        // '.draggable' init
        var valueX = ctrl.getVal(lrId);
        var valueY = ctrl.getVal(fbId);
        $('.draggable').css({"z-index":18, top:255-valueY*2, left:valueX*2});
        $('.draggable img').attr('src', './img/RSS_SimpleRed.png');
        $('p', '.draggable').css({
            'position': 'relative',
            'color': 'white',
            'margin': '0px',
            'text-align': 'center',
            'top': '-27px',
            'valign': 'middle'
        });

    /* get Position */
        $('.draggable').draggable({
            containment: '#xyPad',
            scroll:false,
            cursor:'move',
            opacity:0.6,
            cursorAt:{top:15, left:15},
            stack: '.otherPos',
            drag: function(e, ui) {
                var valueX = parseInt(ui.position.left/2, 10);
                var valueY = 127 - parseInt(ui.position.top/2, 10);
                ctrl.put(lrId, valueX);
                ctrl.put(fbId, valueY);
                $('#sliderLR_Data').text(ctrl.getString(lrId));
                $('#sliderFB_Data').text(ctrl.getString(fbId));
                $('#sliderLR').children('div').mySlider('value', valueX);
                $('#sliderFB').children('div').mySlider('value', valueY);
            },
            stop: function(e, ui) {
                var valueX = ctrl.getVal(lrId);
                var valueY = ctrl.getVal(fbId);
                $(this).css({top:255-valueY*2, left:valueX*2});
            }
        });

        $('.otherPos').not('.draggable').draggable({
            containment: '#xyPad',
            scroll:false,
            cursor:'move',
            opacity:0.6,
            cursorAt:{top:15, left:15},
            start: function(e, ui) {
                $('.draggable').removeClass('draggable').css('z-index','16').find('img').attr('src', './img/RSS_Simple3.png');
                $(this).addClass('draggable');
                var newPart = $(this).attr('id').replace(/pos/, '');
                switch (newPart) {
                    case 'EX':
                        currentPart = 'FRSS-NEFRSS_AUX_IN';
                        currentPart_x = 'FRSS-NEFRSS_AUX_IN_X';
                        currentPart_y = 'FRSS-NEFRSS_AUX_IN_Y';
                        draggableText = 'EX';
                        break;
                    default :
                        currentPart = 'FP'+newPart+'-NEFP_RSS';
                        currentPart_x = 'FP'+newPart+'-NEFP_RSS_X1';
                        currentPart_y = 'FP'+newPart+'-NEFP_RSS_Y1';
                        draggableText = newPart;
                        break;
                }
                partReload(currentPart, currentPart_x, currentPart_y);
            }
        });
    }

});