//
//  scene_effects_partEq.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

	var contents = window.parent.globals.parameter.db.curContents;
	window.parent.globals.parameter.db.contentsAreaScene[contents] = 1;

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
        $('#'+id).change(function() {
            curId = id;
            var value = parseInt($('option:selected', this).val(), 10);
            ctrl.put(id, value);
            curId = "";
        });
    };

	function listner(ev, param) {
		var id = param;
		var part;

		if (id.indexOf("-_PRF-_FPEQ") !== -1) {
			id = id.replace(/\d+/, 1); // PART* -> PART1
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
		window.parent.globals.observer.remove('scene_effects_partEq');
	};

	window.parent.globals.observer.append('scene_effects_partEq', listner);

	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

		switch (divName) {
		case "SELECT":
            item.val (o.value);
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

    $('tr.selector td:last-child').each(function(){
        var id = $(this).attr('class');
        var info = ctrl.get(id);
        var opt = info.stringer.enumrate();
        var doc = (
            '<select id='+id+'>'
        );
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
        createSelector(id, ctrl);
    });

    $('tr.slider td:last-child').each(function(){
        var id = $(this).attr('class');
        var info = ctrl.get(id);
        var doc = (
            '<div id="'+id+'"></div>'+
            '<span id="'+id+'_Data"></span>'
        );
        $(this).append(doc);
        createSlider(id, ctrl);
    });

    $('tr.button td:last-child').each(function(){
        var id = $(this).attr('class');
        var doc = (
            '<input type="checkbox" id="'+id+'" />'+
            '<label for="'+id+'"></label>'
        );
        $(this).append(doc).css({'width':'60%','min-width':'100px'});
        createButton(id, ctrl);
    });

    $('td:last-child', 'table tr').css({'width':'60%','min-width':'100px'});

});