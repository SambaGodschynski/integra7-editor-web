//
//  scene_exp.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

$(function() {

	var curId = '';

	var ctrl = window.parent.globals.controller.exp;

	ctrl.readExpansion(function() {
		window.parent.globals.controller.indextop.toneUpdate();
		updateSelect();
	});

    var expArray = [
        {text:'--OFF--'},
        {text:'SRX-01 : Dynamic Drum Kits'},
        {text:'SRX-02 : Concert Piano'},
        {text:'SRX-03 : Studio SRX'},
        {text:'SRX-04 : Symphonique Strings'},
        {text:'SRX-05 : Supreme Dance'},
        {text:'SRX-06 : Complete Orchestra'},
        {text:'SRX-07 : Ultimate Keys'},
        {text:'SRX-08 : Platinum Trax'},
        {text:'SRX-09 : World Collection'},
        {text:'SRX-10 : Big Brass Ensemble'},
        {text:'SRX-11 : Complete Piano'},
        {text:'SRX-12 : Classic EPs'},
        {text:'ExSN1 : Ethnic (SuperNATURAL)'},
        {text:'ExSN2 : Wood Winds (SuperNATURAL)'},
        {text:'ExSN3 : Session (SuperNATURAL)'},
        {text:'ExSN4 : A.Guitar (SuperNATURAL)'},
        {text:'ExSN5 : Brass (SuperNATURAL)'},
        {text:'ExSN6 : SFX (SuperNATURAL)'},
        {text:'ExPCM : HQ GM2+HQ PCM Sound Collection'}
    ];

    $('select').empty();
    $.each(expArray, function(i){
        $('select').append($('<option>', { value : i+1, text : this.text}));
    });

    $('select').each(function(){
        var id = this.id;
        var value =  $('#'+id).val();
        selectable(id, value);
        $('option:selected', this).prop('disabled', false);
    });

    $('select').bind('change',function(){
        var selectedEx = $(this).val();
        var id = this.id;
        if (selectedEx !== "20"){
            selectable(id, selectedEx);
            $('select').prop('disabled', false);
            $('select option:selected').prop('disabled', false);
            var e = window.parent.globals.parameter.db.curExpansion;
            for (var i in e) {
                var $item = $("#"+ selID[i]);
                if ( $item.val() === "20") {
                    $item.val(0);
                }
            }
        /* All Slot ExPCM */
        } else if (selectedEx === "20"){
            $('select').not(this).prop('disabled', true);
        }
    });

/* disable already selected expansion */
    function selectable(id, value) {
        var selectedExA = $('select#expA option:selected').val();
        var selectedExB = $('select#expB option:selected').val();
        var selectedExC = $('select#expC option:selected').val();
        var selectedExD = $('select#expD option:selected').val();
        $('select').not('#'+id).each(function(){
            $('option', this).prop('disabled', false);
            $(this).children('[value='+selectedExA+']').prop('disabled',true);
            $(this).children('[value='+selectedExB+']').prop('disabled',true);
            $(this).children('[value='+selectedExC+']').prop('disabled',true);
            $(this).children('[value='+selectedExD+']').prop('disabled',true);
            $(this).children('[value=1]').prop('disabled', false);
        });
    }

/* table css */
    $('td:nth-child(1)').css({'width':'20px','min-width':'20px'});

    var selID = ["expA", "expB", "expC", "expD"];

    var saftyTimer = null;

	$("#load").button().blur().click(function(){
		var a = $("#expA").val() - 1;
		var b = $("#expB").val() - 1;
		var c = $("#expC").val() - 1;
		var d = $("#expD").val() - 1;

		if (a < 0) a = 0;
		if (b < 0) b = 0;
		if (c < 0) c = 0;
		if (d < 0) d = 0;

        var oldExp = window.parent.globals.parameter.db.curExpansion;
        var newExp = [a, b, c, d];
        if ( oldExp.toString() !== newExp.toString()) {
            var curDevice = window.parent.globals.device.current();
            if ( curDevice.length !== 2 ) {
                $(this).prop('checked', false).button('refresh');
                window.parent.$('#connectMsg').dialog('open');
            } else {
                window.parent.$('#prg_Dialog').dialog('open');
            }
        }


        ctrl.loadExpansion(parseInt(a), parseInt(b), parseInt(c), parseInt(d), function () {
			ctrl.readExpansion( function () {
				clearTimeout(saftyTimer);
				saftyTimer = null;
                window.parent.$('#prg_Dialog').dialog('close');
                window.parent.$('#expPrg').progressbar('disable').hide();
//				window.parent.globals.controller.indextop.updateContents();
				window.parent.globals.controller.indextop.toneUpdate();
				updateSelect();
			});
        });

        var F = function() {
            window.parent.$('#prg_Dialog').dialog('close');
            window.parent.$('#expPrg').progressbar('disable').hide();
			window.parent.globals.controller.indextop.toneUpdate();
			updateSelect();
            clearTimeout(saftyTimer);
			saftyTimer = null;
        };

        saftyTimer = setTimeout(F, 20*1000);

        $('.ui-button').blur();
	});

	var ExPCM_SLOT1 = 20; // db = 19
	var updateSelect = function () {
		var e = window.parent.globals.parameter.db.curExpansion;

		for (var i in e) {
			if (e[i] < ExPCM_SLOT1) {
				$("#"+ selID[i]).val(e[i] + 1);
				$("#"+ selID[i]).prop('disabled', false);
			} else {
				$("#"+ selID[i]).val(ExPCM_SLOT1).prop('disabled', true);

			}
		}
	};
	updateSelect();


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
		window.parent.globals.observer.remove('scene_exp');
	};

	window.parent.globals.observer.append('scene_exp', listner);

	function update(id, item) {
		var divName = item.get(0).tagName;
		var o = ctrl.get(id);

		switch (divName) {
		case "SELECT":
			item.val(o.value);
			break;
		default:
			break;
		}
	}
});