//
//  scene_studioset_partview.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

function isIE () {
	var userAgent = window.navigator.userAgent.toLowerCase();
	if (userAgent.indexOf('msie') != -1) {
		return true;
	}
	return false;
}

$(function() {

	var contents = window.parent.globals.parameter.db.curContents;
	window.parent.globals.parameter.db.contentsAreaScene[contents] = 9;


    var ctrl = window.parent.globals.controller.studiosetPartview;
    window.parent.globals.controller.studiosetPartview.curId = '';

    /**
    *   slider
    *   @param {id}
    *   @param {ctr}
    */
    var createSlider = function (id, ctrl) {
        var info = ctrl.get(id);
        $('#'+id).mySlider({
            range: 'min',
            value: info.value,
            min: info.min,
            max: info.max,
            slide: function(event, ui) {
				window.parent.globals.controller.studiosetPartview.curId = this.id;
                ctrl.put(id, ui.value);
				window.parent.globals.controller.studiosetPartview.curId = '';
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
        var initValue = (info.value === info.min) ? false : true;
        $('label[for='+id+']').text(info.string).bind('selectstart', function(){ return false; });
        $('#'+id).prop('checked', initValue);
        $('#'+id).button().click(function(){
            ctrl.put(id, ((this.checked) ? info.max : info.min));
            var label = ctrl.getString(id);
            $('label[for='+id+'] span.ui-button-text').text(label);
			window.parent.globals.controller.studiosetPartview.curId = this.id;
			window.parent.globals.controller.studiosetPartview.curId = '';
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
			window.parent.globals.controller.studiosetPartview.curId = this.id;
			ctrl.put(this.id, this.selectedIndex);
			window.parent.globals.controller.studiosetPartview.curId = '';
        });

    };

	function listner(ev, param) {
		var id = param;

		if (ev == 'model') {
			if (id === window.parent.globals.controller.studiosetPartview.curId) return;
			var item = $("#" + id);
			if (item.length) {
				update(id, item);
			} else if (id === "PRM-_PRF-_FC-NEFC_SOLO_PART") {
				var val =  ctrl.getVal(id);

				for (var i = 0; i < 16; i++) {
                    var $item = $("#part_"+ i + "SoloSw");
                    $item.removeClass('soloPart');
                    $item.prop('checked', false);
                    $item.button('refresh');
				}

				if (val !== 0) {
                    var $item = $("#part_"+ val + "SoloSw");
					$item.addClass('soloPart');

					$item.prop('checked',(val) ? "checked" : false);
                    $item.button('refresh');

				}
			}
		}
	}

	window.onbeforeunload = function() {
		window.parent.globals.observer.remove('scene_studioset_partview');
	};

	var msbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_MSB";
	var lsbId = "PRM-_PRF-_FP1-NEFP_PAT_BS_LSB";
	var pcId = "PRM-_PRF-_FP1-NEFP_PAT_PC";


	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

		switch (divName) {
		case "SELECT":
			var cnvId = id.replace(/\d+/, 1); // PART* -> PART1
			var part = id.match(/\d+/) - 1;

			switch (cnvId) {
			default:
				item.val(o.value);
				break;
			case msbId:
				ctrl.typeSelectUpdate(part);
				ctrl.bankSelectUpdate(part);
				ctrl.toneSelectUpdate(part);
				ctrl.categorySelectUpdate(part);
				break;
			case lsbId:
				ctrl.typeSelectUpdate(part);
				ctrl.bankSelectUpdate(part);
				ctrl.toneSelectUpdate(part);
				ctrl.categorySelectUpdate(part);
				break;
			case pcId:
				ctrl.typeSelectUpdate(part);
				ctrl.bankSelectUpdate(part);
				ctrl.toneSelectUpdate(part);
				ctrl.categorySelectUpdate(part);
				break;
			}
//			item.val( ctrl.getVal(id) );
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


/* Create table */

    var delayCreTbl = function () {
	    var doc = (
	        '<tr>' +
	        '<th>PART</th>' +
	        '<th>TYPE</th>' +
	        '<th>BANK</th>' +
	        '<th>CATEGORY</th>' +
	        '<th>TONE</th>' +
	        '<th>LEVEL</th>' +
	        '<th>PAN</th>' +
	        '<th>CHORUS</th>' +
	        '<th>REVERB</th>' +
	        '<th>MUTE</th>' +
	        '<th>SOLO</th>' +
	        '</tr>'
	    );

	    for (var i = 0; i < 16; i++) {
	        doc += (
	            '<tr id="part_' + (i+1) + '">' +
	            '<td align="center" id="partNum_' + (i+1) + '">' + (i+1) + '</td>' +
	            '<td align="center"><select id="PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_BS_MSB"></select></td>' +
		            '<td align="center"><select id="PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_BS_LSB"></select></td>' +
		            '<td align="center"><div id="category_' + (i+1) + '"></div></td>' +
		            '<td align="center"><select id="PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_PC"></select></td>' +
		            '<td align="center"><div id="PRM-_PRF-_FP' + (i+1) + '-NEFP_LEVEL"></div><div id="PRM-_PRF-_FP' + (i+1) + '-NEFP_LEVEL_Data"></div></td>' +
		            '<td align="center"><div id="PRM-_PRF-_FP' + (i+1) + '-NEFP_PAN"></div><div id="PRM-_PRF-_FP' + (i+1) + '-NEFP_PAN_Data"></div></td>' +
		            '<td align="center"><div id="PRM-_PRF-_FP' + (i+1) + '-NEFP_CHO_SEND"></div><div id="PRM-_PRF-_FP' + (i+1) + '-NEFP_CHO_SEND_Data"></div></td>' +
		            '<td align="center"><div id="PRM-_PRF-_FP' + (i+1) + '-NEFP_REV_SEND"></div><div id="PRM-_PRF-_FP' + (i+1) + '-NEFP_REV_SEND_Data"></div></td>' +
		            '<td align="center"><input type="checkbox" id="PRM-_PRF-_FP' + (i+1) + '-NEFP_MUTE_SW" /><label for="PRM-_PRF-_FP' + (i+1) + '-NEFP_MUTE_SW"></label></td>' +
		            '<td align="center"><input type="radio" name="solo" id="part_' + (i+1) + 'SoloSw" /><label for ="part_' + (i+1) + 'SoloSw" onSelectStart="return false">SOLO</label></td>' +
		            '</tr>'
		    );
	    }

	    //Ex Ch
		doc += (
			'<tr id="part_Ex">' +
			'<td align="center" id="partNum_Ex">EX</td>' +
			'<td></td>' +
			'<td></td>' +
			'<td></td>' +
			'<td></td>' +
			'<td><div id="PRM-_PRF-_FC-NEFC_IN_LEVEL"></div><div id="PRM-_PRF-_FC-NEFC_IN_LEVEL_Data"></div></td>' +
			'<td></td>' +
			'<td><div id="PRM-_PRF-_FC-NEFC_IN_CHO_SEND_LEVEL"></div><div id="PRM-_PRF-_FC-NEFC_IN_CHO_SEND_LEVEL_Data"></div></td>' +
			'<td><div id="PRM-_PRF-_FC-NEFC_IN_REV_SEND_LEVEL"></div><div id="PRM-_PRF-_FC-NEFC_IN_REV_SEND_LEVEL_Data"></div></td>' +
			'<td align="center"><input type="checkbox" id="PRM-_PRF-_FC-NEFC_IN_MUTE_SW" /><label for="PRM-_PRF-_FC-NEFC_IN_MUTE_SW"></label></td>' +
			'<td></td>' +
			'</tr>'
		);
		$('#partView').append(doc);


		/* table css */
		$('th:nth-child(1)').css({'width':'40px','min-width':'40px'});
		$('th:nth-child(6), th:nth-child(7), th:nth-child(8), th:nth-child(9)').css({'width':'12%','min-width':'60px'});
    };



/* TYPE */
    var delayCreSelect = [];
    delayCreSelect[0] = function () {
	    $('select[id$=NEFP_PAT_BS_MSB]').each(function(){
	        createSelector(this.id , ctrl);
	    });
    };

/* BANK */
    delayCreSelect[1] = function () {
	    $('select[id$=NEFP_PAT_BS_LSB]').each(function(){
	        createSelector(this.id , ctrl);
	    });
    };

/* TONE */
    delayCreSelect[2] = function () {
	    $('select[id$=NEFP_PAT_PC]').each(function(){
	        createSelector(this.id , ctrl);
	    });
    };

/* LEVEL */
    var delayCreSlider = [];
    delayCreSlider[0] = function () {
	    $('div[id$=NEFP_LEVEL]').each(function(){
	        createSlider(this.id , ctrl);
	    });
	    // Ext Part Level
	    createSlider('PRM-_PRF-_FC-NEFC_IN_LEVEL', ctrl);
    };

/* PAN */
    delayCreSlider[1] = function () {
	    $('div[id$=NEFP_PAN]').each(function(){
	        createSlider(this.id , ctrl);
	    });
    };

/* CHORUS */
    delayCreSlider[2] = function () {
	    $('div[id$=NEFP_CHO_SEND]').each(function(){
	        createSlider(this.id , ctrl);
	    });
	    // Ext Part Chorus
	    createSlider('PRM-_PRF-_FC-NEFC_IN_CHO_SEND_LEVEL', ctrl);
    };

/* REVERB */
    delayCreSlider[3] = function () {
	    $('div[id$=NEFP_REV_SEND]').each(function(){
	        createSlider(this.id , ctrl);
	    });
	    // Ext Part Reverb
	    createSlider('PRM-_PRF-_FC-NEFC_IN_REV_SEND_LEVEL', ctrl);
    };

    var delayCreSw = function () {
	/* MUTE */
	    $('input[id$=_MUTE_SW]').each(function(){
	        createButton(this.id , ctrl);
	    });

	/* SOLO */
	    var soloPart = ctrl.getString("PRM-_PRF-_FC-NEFC_SOLO_PART");
	    if (soloPart !== 'OFF' ) {
	        $('input[id=part_' + soloPart + 'SoloSw]').prop('checked', true);
	    }

	    $('input[id$=SoloSw]').each(function(i){
	        $('#'+this.id).button().click(function () {
	            if ($(this).hasClass('soloPart')) {
	                $(this).removeClass('soloPart').prop('checked', false).button('refresh');
	                ctrl.put("PRM-_PRF-_FC-NEFC_SOLO_PART", 0);
	            } else {
	                $('input[name="solo"]').removeClass('soloPart');
	                $(this).addClass('soloPart');
	                /* Add class to latest checked button */
	                ctrl.put("PRM-_PRF-_FC-NEFC_SOLO_PART", i+1);
	            }
	        })
	        .keydown(function(e){
	            if(e.keyCode === 38 || e.keyCode === 40){
	                return false;
	            }
	        })
	        .keyup(function(e){
	            switch(e.keyCode){
	                case 38: // Key[↑]
	                    if ($(this).hasClass('soloPart')) {
	                    } else {
	                        $('input[name="solo"]').removeClass('soloPart');
	                        $(this).addClass('soloPart');
	                        /* Add class to latest checked button */
	                        ctrl.put("PRM-_PRF-_FC-NEFC_SOLO_PART", i+1);
	                    }
	                    break;

	                case 40: // Key[↓]
	                    if ($(this).hasClass('soloPart')) {
	                        $(this).removeClass('soloPart').prop('checked', false).button('refresh');
	                        ctrl.put("PRM-_PRF-_FC-NEFC_SOLO_PART", 0);
	                    }
	                    break;

	                default:
	                    break;
	            }
	        });
	    });
    };

    var delayCreCate = function () {
	    for (var i = 0; i < 16; i++) {
	        ctrl.init(i ,
	            $('#PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_BS_MSB'),
	            $('#PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_BS_LSB'),
	            $('#PRM-_PRF-_FP'+(i+1)+'-NEFP_PAT_PC')	,
	            $('#category_'+(i+1))
	        );
	        ctrl.typeSelectUpdate(i);
	        ctrl.bankSelectUpdate(i);
	        ctrl.toneSelectUpdate(i);
	        ctrl.categorySelectUpdate(i);
	    }
    };

    if (isIE()) {

    	setTimeout( delayCreTbl, 100);

    	for (var i in delayCreSelect) {
    		setTimeout( delayCreSelect[i], 700);
    	}
    	for (var i in delayCreSlider ) {
    		setTimeout( delayCreSlider[i], 900);
    	}
    	setTimeout( delayCreSw, 100);
    	setTimeout( delayCreCate, 700);


    	var F = function () {
    		window.parent.globals.observer.append('scene_studioset_partview', listner);
      	};
    	setTimeout(F, 900);

    } else {
    	delayCreTbl();
    	for (var i in delayCreSelect) {
    		delayCreSelect[i]();
    	}

    	for (var i in delayCreSlider ) {
    		delayCreSlider[i]();
    	}
    	delayCreSw();
        delayCreCate();
        window.parent.globals.observer.append('scene_studioset_partview', listner);
    }


});