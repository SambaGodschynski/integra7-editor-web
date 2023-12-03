//
//  scene_studioset_common.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

	var contents = window.parent.globals.parameter.db.curContents;
	window.parent.globals.parameter.db.contentsAreaScene[contents] = 8;
/* table css */
    $('table.parameter td:nth-child(1)').css({'width':'40%','min-width':'100px'});
    $('table.parameter td:nth-child(2)').css({'min-width':'100px'});

    var ctrl = window.parent.globals.controller.studioset_common;
	var curId = '';

    var createSlider = function (id, ctrl) {
        var info = ctrl.get(id);

        $('#'+id).after('<div id="'+id+'_Data"></div>');
        $('#'+id).mySlider({
            range: 'min',
            value: info.value,
            min: info.min,
            max: info.max,
            slide: function(event, ui) {
  				curId = this.id;
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
        $('#'+id+'_Data').text(ctrl.getString(id)).css({
            'width': '30px',
            'float': 'right',
            'text-align': 'right',
            'padding-right':'3px'
        });
    };

    var createButton = function (id, ctrl) {
        var info = ctrl.get(id);
        $('#'+id).after('<label for='+id+' onSelectStart="return false">'+info.string+'</label>');
        $('#'+id).button().click(function(){
            ctrl.put(id, ((this.checked) ? info.max : info.min));
            var label = ctrl.getString(id);
            $('label[for='+id+'] span.ui-button-text').text(label);
			curId = this.id;
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

    var createSelector = function(id, ctrl) {
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

	    $('#'+id).change(function() {
			curId = this.id;
			ctrl.put(this.id, this.selectedIndex);
			curId = '';
     	});
    };

    var createSelectorForToneCtrlSrc = function(id, ctrl) {
        var info = ctrl.get(id);
        var opt = info.stringer.enumrate();
        var doc = '';
        for (var j = 0, len = opt.length; j < len; j++) {
            var selected = ((info.min + j + + ((j > 31) ? 1 : 0)) == info.value) ? "selected='selected'" : '';
            doc += (
                '<option value="' + (info.min + j + ((j > 31) ? 1 : 0)) + '"' + selected + '>' +
                opt[j] +
                '</option>'
            );
        }
        $('#'+id).append(doc);

	    $('#'+id).change(function() {
			curId = this.id;
			ctrl.put(this.id, this.value);
			curId = '';
     	});
    };



	function listner(ev, param) {
		var id = param;

		if (ev == 'model') {
			if (id === curId) return;
			var item = $("#" + id);
			if (item.length) {
				update(id, item);
			}
		}
	}

	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_studioset_common');
	};

	window.parent.globals.observer.append('scene_studioset_common', listner);

	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

		switch (divName) {
		case "SELECT":
			item.val(ctrl.getVal(id));
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

    createSlider("PRM-_PRF-_FC-NEFC_OR_TEMPO", ctrl);
    createSelector('PRM-_PRF-_FC-NEFC_COMPEQ_PART', ctrl);
    createSelectorForToneCtrlSrc('PRM-_PRF-_FC-NEFC_CTRL1_SRC', ctrl);
    createSelectorForToneCtrlSrc('PRM-_PRF-_FC-NEFC_CTRL2_SRC', ctrl);
    createSelectorForToneCtrlSrc('PRM-_PRF-_FC-NEFC_CTRL3_SRC', ctrl);
    createSelectorForToneCtrlSrc('PRM-_PRF-_FC-NEFC_CTRL4_SRC', ctrl);

/* phase lock */
    $('#phaseLock td').each(function(i){
        $(this).html('<input type="checkbox" id="PRM-_PRF-_FM'+(i+1)+'-NEFM_PHASE_LOCK" />');
        createButton('PRM-_PRF-_FM'+(i+1)+'-NEFM_PHASE_LOCK', ctrl);
    });

/* checkbox all */
    $('#allCh').button().click(function(){
        var label = (this.checked) ? 'ON' : 'OFF';
        var val = (this.checked) ? 1 : 0;
        $('input[id*=NEFM_PHASE_LOCK]').each(function(){
            var id = this.id;
            this.checked = val;
            $('label[for='+id+'] span.ui-button-text').text(label);
            $(this).button('refresh');
            ctrl.put(id, val);
        });
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
                $('input[id*=NEFM_PHASE_LOCK]').each(function(){
                    var id = this.id;
                    $(this).prop('checked', true).button('refresh');
                    $('label[for='+id+'] span.ui-button-text').text('ON');
                    ctrl.put(id, 1);
                });
                break;

            case 40: // Key[↓]
                $(this).prop('checked', false).button('refresh');
                $('input[id*=NEFM_PHASE_LOCK]').each(function(){
                    var id = this.id;
                    $(this).prop('checked', false).button('refresh');
                    $('label[for='+id+'] span.ui-button-text').text('OFF');
                    ctrl.put(id, 0);
                });
                break;

            default:
                break;
        }
    });

});