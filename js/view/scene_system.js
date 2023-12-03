//
//  system.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//


$(function() {

	var ctrl = window.parent.globals.controller.system;

	var curId = '';

	/**
	* 	@param {String} id
	*	@param {Object} ctrl
	*/
    var createSlider = function (id, ctrl) {
        var info = ctrl.get(id);
        $('#'+id).after('<div id="'+id+'_Data">'+info.string+'</div>');
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
            'width':'65%',
            'float':'left',
            'margin':'2px 10px 2px 10px'
        });
        $('#'+id+'_Data').css({
            'width': '75px',
            'float': 'right',
            'text-align': 'right',
            'padding-right':'3px'
        });


   };

  var createSliderForTune = function (id, ctrl) {

    var info = ctrl.get(id);
       var valHz = ctrl.GSDeciCentToDeciHz(info.value-1024);

       $('#'+id).after('<div id="'+id+'_Data">'+ parseInt(valHz/10, 10)+'.'+valHz.toString().slice(-1) + " [Hz]"+'</div>');
       $('#'+id).mySlider({
           range: 'min',
           value: valHz,
           min: ctrl.DECI_HZ_MIN,
           max: ctrl.DECI_HZ_MAX,
           slide: function(event, ui) {
            curId  = id;
            ctrl.put(id, ctrl.GSDeciHzToDeciCent(ui.value)+1024);
            $('#'+id+'_Data').text( parseInt(ui.value/10, 10)+'.'+ui.value.toString().slice(-1) + " [Hz]");
            curId = '';
           }
       })
       .css({
           'width':'65%',
           'float':'left',
           'margin':'2px 10px 2px 10px'
       });
       $('#'+id+'_Data').css({
           'width': '75px',
           'float': 'right',
           'text-align': 'right',
           'padding-right':'3px'
       });


  };
	/**
	* 	@param {String} id
	*	@param {Object} ctrl
	*/
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

	/**
	* 	@param {String} id
	*	@param {Object} ctrl
	*/
    var createSelector = function(id, ctrl /*, array */) {
        var info = ctrl.get(id);
  		var opt = info.stringer.enumrate();

  		if (arguments[2]) {
  			opt = arguments[2];
  		}

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


	createSelector('PRM-_SYS-_SC-NESC_CLK_SRC', ctrl);
  createSelector('PRM-_SYS-_SC-NESC_PRF_CTRL_CH', ctrl);
  createSelector('PRM-_SYS-_SC-NESC_RSS_OUTMODE', ctrl);
  createSelectorForToneCtrlSrc('PRM-_SYS-_SC-NESC_CTRL1_SRC', ctrl);
  createSelectorForToneCtrlSrc('PRM-_SYS-_SC-NESC_CTRL2_SRC', ctrl);
  createSelectorForToneCtrlSrc('PRM-_SYS-_SC-NESC_CTRL3_SRC', ctrl);
  createSelectorForToneCtrlSrc('PRM-_SYS-_SC-NESC_CTRL4_SRC', ctrl);
  createSelector('PRM-_SYS-_SC-NESC_CTRL_SRC', ctrl);
	createButton('PRM-_SYS-_SC-NESC_RX_PC', ctrl);
	createButton('PRM-_SYS-_SC-NESC_RX_BS', ctrl);
	createButton('PRM-_SYS-_SC-NESC_RSS_CENTERSP_SW', ctrl);
	createButton('PRM-_SYS-_SC-NESC_RSS_WOOFER_SW', ctrl);
	createSlider('PRM-_SYS-_SC-NESC_LEVEL', ctrl);
	createSliderForTune('PRM-_SYS-_SC-NESC_TUNE', ctrl);
	createSlider('PRM-_SYS-_SC-NESC_KEY_SHIFT', ctrl);
	createSlider('PRM-_SYS-_SC-NESC_TEMPO', ctrl);
  createSelector('PRM-_SYS-_SC-NESC_OR_TEMPO', ctrl, ["SYSTEM", "STUDIO SET"] );

    /* table css */
    $('td:nth-child(1)').css({'width':'40%','min-width':'100px'});
    $('td:nth-child(2)').css({'min-width':'100px'});

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
	/* append/remove update listener to observer */
	window.onbeforeunload = function() {

		window.parent.globals.observer.remove('scene_system');
	};

	window.parent.globals.observer.append('scene_system', listner);

	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

		switch (divName) {
		case "SELECT":
			item.val( ctrl.getVal(id) );
			break;
		default:
			if ( ( o.max - o.min ) === 1 ) {
        $('label[for='+id+'] span.ui-button-text').text(o.string);
        item.prop('checked',(o.value - o.min) ? true : false).button('refresh');
			} else if (id.indexOf("-NESC_TUNE") !== -1) {
				var val = ctrl.getVal(id);
				var valHz = ctrl.GSDeciCentToDeciHz(val-1024);
				item.mySlider('value', valHz);
        $('#'+id+'_Data').text( parseInt(valHz/10, 10)+'.'+ valHz.toString().slice(-1) + " [Hz]");
			} else {
				item.mySlider('value', o.value);
				$('#'+id+'_Data').text(o.string);
			}
			break;
		}
	}

});