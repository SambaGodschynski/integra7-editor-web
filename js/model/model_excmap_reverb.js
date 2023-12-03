//
//  model_excmap_reverb.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

(function(globals) {

	var table = [

		{
			desc: 'OFF',
			leaf: [
				{ desc: '_', id: 'REV_OFF_DUMMY', init: 32768, min: 32768, max: 32768 }
			]
		},

		{
			desc: 'ROOM 1',
			leaf: [
				{ desc: '', id: 'REV_REVRM1_LEVEL', init: 32863, min: 32768, max: 32895 },
				{ desc: 'Pre Delay', id: 'REV_REVRM1_PREDLY', init: 32768, min: 32768, max: 32868 },
				{ desc: 'Time', id: 'REV_REVRM1_TIME', init: 32777, min: 32769, max: 32868 },
				{ desc: 'Density', id: 'REV_REVRM1_DNSTY', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Diffusion', id: 'REV_REVRM1_DFSN', init: 32895, min: 32768, max: 32895 },
				{ desc: 'LF Damp', id: 'REV_REVRM1_LFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'HF Damp', id: 'REV_REVRM1_HFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'Spread', id: 'REV_REVRM1_SPRED', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Tone', id: 'REV_REVRM1_TONE', init: 32832, min: 32768, max: 32895 }
			]
		},

		{
			desc: 'ROOM 2',
			leaf: [
				{ desc: '', id: 'REV_REVRM2_LEVEL', init: 32863, min: 32768, max: 32895 },
				{ desc: 'Pre Delay', id: 'REV_REVRM2_PREDLY', init: 32768, min: 32768, max: 32868 },
				{ desc: 'Time', id: 'REV_REVRM2_TIME', init: 32777, min: 32769, max: 32868 },
				{ desc: 'Density', id: 'REV_REVRM2_DNSTY', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Diffusion', id: 'REV_REVRM2_DFSN', init: 32895, min: 32768, max: 32895 },
				{ desc: 'LF Damp', id: 'REV_REVRM2_LFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'HF Damp', id: 'REV_REVRM2_HFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'Spread', id: 'REV_REVRM2_SPRED', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Tone', id: 'REV_REVRM2_TONE', init: 32832, min: 32768, max: 32895 }
			]
		},

		{
			desc: 'HALL 1',
			leaf: [
				{ desc: '', id: 'REV_REVHL1_LEVEL', init: 32863, min: 32768, max: 32895 },
				{ desc: 'Pre Delay', id: 'REV_REVHL1_PREDLY', init: 32768, min: 32768, max: 32868 },
				{ desc: 'Time', id: 'REV_REVHL1_TIME', init: 32794, min: 32769, max: 32868 },
				{ desc: 'Density', id: 'REV_REVHL1_DNSTY', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Diffusion', id: 'REV_REVHL1_DFSN', init: 32895, min: 32768, max: 32895 },
				{ desc: 'LF Damp', id: 'REV_REVHL1_LFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'HF Damp', id: 'REV_REVHL1_HFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'Spread', id: 'REV_REVHL1_SPRED', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Tone', id: 'REV_REVHL1_TONE', init: 32832, min: 32768, max: 32895 }
			]
		},

		{
			desc: 'HALL 2',
			leaf: [
				{ desc: '', id: 'REV_REVHL2_LEVEL', init: 32863, min: 32768, max: 32895 },
				{ desc: 'Pre Delay', id: 'REV_REVHL2_PREDLY', init: 32768, min: 32768, max: 32868 },
				{ desc: 'Time', id: 'REV_REVHL2_TIME', init: 32794, min: 32769, max: 32868 },
				{ desc: 'Density', id: 'REV_REVHL2_DNSTY', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Diffusion', id: 'REV_REVHL2_DFSN', init: 32895, min: 32768, max: 32895 },
				{ desc: 'LF Damp', id: 'REV_REVHL2_LFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'HF Damp', id: 'REV_REVHL2_HFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'Spread', id: 'REV_REVHL2_SPRED', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Tone', id: 'REV_REVHL2_TONE', init: 32832, min: 32768, max: 32895 }
			]
		},

		{
			desc: 'PLATE',
			leaf: [
				{ desc: '', id: 'REV_PLATE_LEVEL', init: 32863, min: 32768, max: 32895 },
				{ desc: 'Pre Delay', id: 'REV_PLATE_PREDLY', init: 32788, min: 32768, max: 32868 },
				{ desc: 'Time', id: 'REV_PLATE_TIME', init: 32794, min: 32769, max: 32868 },
				{ desc: 'Density', id: 'REV_PLATE_DNSTY', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Diffusion', id: 'REV_PLATE_DFSN', init: 32895, min: 32768, max: 32895 },
				{ desc: 'LF Damp', id: 'REV_PLATE_LFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'HF Damp', id: 'REV_PLATE_HFDMP', init: 32818, min: 32768, max: 32868 },
				{ desc: 'Spread', id: 'REV_PLATE_SPRED', init: 32895, min: 32768, max: 32895 },
				{ desc: 'Tone', id: 'REV_PLATE_TONE', init: 32832, min: 32768, max: 32895 }
			]
		},

		{
			desc: 'GM2 REVERB',
			leaf: [
				{ desc: 'Character', id: 'REV_GM2REV_CHAR', init: 32772, min: 32768, max: 32773 },
				{ desc: '', id: 'REV_GM2REV_LEVEL', init: 32832, min: 32768, max: 32895 },
				{ desc: '', id: 'REV_GM2REV_PREDLY', init: 32768, min: 32768, max: 32868 },
				{ desc: 'Time', id: 'REV_GM2REV_TIME', init: 32832, min: 32768, max: 32895 }
			]
		}

	];

	globals.model.option.reverb = new model_excmap_bank(table, 0);

})(window.globals);
