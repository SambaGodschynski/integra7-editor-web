//
//  model_excmap_chorus.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

(function(globals) {

	var table = [

		{
			desc: 'OFF',
			leaf: [
				{ desc: '_', id: 'CHO_OFF_DUMMY', init: 32768, min: 32768, max: 32768 }
			]
		},

		{
			desc: 'CHORUS',
			leaf: [
				{ desc: 'Filter Type', id: 'CHO_CHO_FILT', init: 32770, min: 32768, max: 32770 },
				{ desc: 'Cutoff Freq', id: 'CHO_CHO_SPLT', init: 32774, min: 32768, max: 32784 },
				{ desc: 'Pre Delay', id: 'CHO_CHO_DELAY', init: 32788, min: 32768, max: 32893 },
				{ desc: 'Rate (sync sw)', id: 'CHO_CHO_RATE_SYNC', init: 32768, min: 32768, max: 32769 },
				{ desc: 'Rate (Hz)', id: 'CHO_CHO_RATE_HZ', init: 32778, min: 32769, max: 32968 },
				{ desc: 'Rate (note)', id: 'CHO_CHO_RATE_NOTE', init: 32786, min: 32768, max: 32789 },
				{ desc: 'Depth', id: 'CHO_CHO_DEPTH', init: 32798, min: 32768, max: 32895 },
				{ desc: 'Phase', id: 'CHO_CHO_PHS', init: 32858, min: 32768, max: 32858 },
				{ desc: 'Feedback', id: 'CHO_CHO_FB', init: 32768, min: 32768, max: 32895 }
			]
		},

		{
			desc: 'DELAY',
			leaf: [
				{ desc: 'Delay Left (sync sw)', id: 'CHO_DLY_DLY_L_SYNC', init: 32769, min: 32768, max: 32769 },
				{ desc: 'Delay Left (msec)', id: 'CHO_DLY_DLY_L_MSEC', init: 32968, min: 32768, max: 33768 },
				{ desc: 'Delay Left (note)', id: 'CHO_DLY_DLY_L_NOTE', init: 32775, min: 32768, max: 32789 },
				{ desc: 'Delay Right (sync sw)', id: 'CHO_DLY_DLY_R_SYNC', init: 32769, min: 32768, max: 32769 },
				{ desc: 'Delay Right (msec)', id: 'CHO_DLY_DLY_R_MSEC', init: 33168, min: 32768, max: 33768 },
				{ desc: 'Delay Right (note)', id: 'CHO_DLY_DLY_R_NOTE', init: 32778, min: 32768, max: 32789 },
				{ desc: 'Delay Center (sync sw)', id: 'CHO_DLY_DLY_C_SYNC', init: 32769, min: 32768, max: 32769 },
				{ desc: 'Delay Center (msec)', id: 'CHO_DLY_DLY_C_MSEC', init: 33368, min: 32768, max: 33768 },
				{ desc: 'Delay Center (note)', id: 'CHO_DLY_DLY_C_NOTE', init: 32780, min: 32768, max: 32789 },
				{ desc: 'Center Feedback', id: 'CHO_DLY_FBK', init: 32827, min: 32768, max: 32866 },
				{ desc: 'HF Damp', id: 'CHO_DLY_HF_DAMP', init: 32785, min: 32768, max: 32785 },
				{ desc: 'Left Level ', id: 'CHO_DLY_LEVEL_L', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Right Level', id: 'CHO_DLY_LEVEL_R', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Center Level', id: 'CHO_DLY_LEVEL_C', init: 32895, min: 32768, max: 32895 }
			]
		},

		{
			desc: 'GM2 CHORUS',
			leaf: [
				{ desc: 'Pre-LPF', id: 'CHO_GM2CHO_PRE_LPF', init: 32768, min: 32768, max: 32775 },
				{ desc: 'Level', id: 'CHO_GM2CHO_LEVEL', init: 32832, min: 32768, max: 32895 },
				{ desc: 'Feedback', id: 'CHO_GM2CHO_FB', init: 32776, min: 32768, max: 32895 },
				{ desc: 'Delay', id: 'CHO_GM2CHO_DELAY', init: 32848, min: 32768, max: 32895 },
				{ desc: 'Rate', id: 'CHO_GM2CHO_RATE', init: 32771, min: 32768, max: 32895 },
				{ desc: 'Depth', id: 'CHO_GM2CHO_DEPTH', init: 32787, min: 32768, max: 32895 },
				{ desc: 'Send Level to Reverb', id: 'CHO_GM2CHO_REV_SEND', init: 32768, min: 32768, max: 32895 }
			]
		}
	];

	globals.model.option.chorus = new model_excmap_bank(table, 0);

})(window.globals);
