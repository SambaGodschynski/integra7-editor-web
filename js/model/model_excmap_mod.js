//
//	model_excmap_mod.js
//
//	Copyright 2014 Roland Corporation. All rights reserved.
//

(function(globals) {

	var MOD_TW = [
		{ desc: 'Harmonic Bar 16"', id: 'MOD_TW_HBAR_16', init: 8, min: 0, max: 8 },
		{ desc: 'Harmonic Bar 5-1/3"', id: 'MOD_TW_HBAR_5_13', init: 8, min: 0, max: 8 },
		{ desc: 'Harmonic Bar 8"', id: 'MOD_TW_HBAR_8', init: 8, min: 0, max: 8 },
		{ desc: 'Harmonic Bar 4"', id: 'MOD_TW_HBAR_4', init: 0, min: 0, max: 8 },
		{ desc: 'Harmonic Bar 2-2/3"', id: 'MOD_TW_HBAR_2_23', init: 0, min: 0, max: 8 },
		{ desc: 'Harmonic Bar 2"', id: 'MOD_TW_HBAR_2', init: 0, min: 0, max: 8 },
		{ desc: 'Harmonic Bar 1-3/5"', id: 'MOD_TW_HBAR_1_35', init: 0, min: 0, max: 8 },
		{ desc: 'Harmonic Bar 1-1/3"', id: 'MOD_TW_HBAR_1_13', init: 0, min: 0, max: 8 },
		{ desc: 'Harmonic Bar 1"', id: 'MOD_TW_HBAR_1', init: 0, min: 0, max: 8 },
		{ desc: 'Percussion Switch', id: 'MOD_TW_PERC_SW', init: 1, min: 0, max: 1 },
		{ desc: 'Percussion Harmonic', id: 'MOD_TW_PERC_HARM', init: 1, min: 0, max: 1 },
		{ desc: 'Percussion Slow', id: 'MOD_TW_PERC_SLOW', init: 0, min: 0, max: 1 },
		{ desc: 'Key On Click Level', id: 'MOD_TW_ON_CLICK', init: 5, min: 0, max: 31 },
		{ desc: 'Key Off Click Level', id: 'MOD_TW_OFF_CLICK', init: 5, min: 0, max: 31 },
		{ desc: 'Percussion Soft Level', id: 'MOD_TW_PERC_SOFT_LEVEL', init: 3, min: 0, max: 15 },
		{ desc: 'Percussion Normal Level', id: 'MOD_TW_PERC_NORM_LEVEL', init: 10, min: 0, max: 15 },
		{ desc: 'Percussion Slow Time', id: 'MOD_TW_PERC_SLOW_TIME', init: 104, min: 0, max: 127 },
		{ desc: 'Percussion Fast Time', id: 'MOD_TW_PERC_FAST_TIME', init: 43, min: 0, max: 127 },
		{ desc: 'Percussion Recharge Time', id: 'MOD_TW_PERC_RECHARGE', init: 5, min: 0, max: 10 },
		{ desc: 'Percussion Harmonic Bar Level', id: 'MOD_TW_PERC_HBAR_LEVEL', init: 64, min: 0, max: 127 },
		{ desc: 'Percussion Soft', id: 'MOD_TW_PERC_SOFT', init: 0, min: 0, max: 1 },
		{ desc: 'Leakage Level', id: 'MOD_TW_LEAKAGE', init: 20, min: 0, max: 127 }
	];

	var MOD_SNAP = [
		{ desc: 'String Resonance', id: 'MOD_SNAP_STRING_RESO_LEVEL', init: 64, min: 0, max: 127 },
		{ desc: 'Key Off Resonance', id: 'MOD_SNAP_KEY_OFF_RESO_LEVEL', init: 64, min: 0, max: 127 },
		{ desc: 'Hammer Noise', id: 'MOD_SNAP_THUMP_LEVEL', init: 64, min: 62, max: 66 },
		{ desc: 'Stereo Width', id: 'MOD_SNAP_STEREO_WIDTH', init: 63, min: 0, max: 63 },
		{ desc: 'Nuance', id: 'MOD_SNAP_NUANCE', init: 0, min: 0, max: 2 },
		{ desc: 'Tone Character', id: 'MOD_SNAP_SPLIT_SHIFT', init: 64, min: 59, max: 69 }
	];

	var MOD_SNSTD = [
		{ desc: 'Noise Level (CC#16)', id: 'MOD_SNSTD_NOISE_LEVEL', init: 64, min: 0, max: 127, cc:16 },
		{ desc: 'Rate (CC#17)', id: 'MOD_SNSTD_RATE', init: 64, min: 0, max: 127, cc:17 },
		{ desc: 'Growl Sens (CC#18)', id: 'MOD_SNSTD_GROWL_SENS', init: 0, min: 0, max: 127, cc:18 },
		{ desc: 'Mode (CC#19)', id: 'MOD_SNSTD_MODE', init: 0, min: 0, max: 1, cc:19 },
		{ desc: 'Drone Level', id: 'MOD_SNSTD_DRONE_LEVEL', init: 64, min: 0, max: 127 },
		{ desc: 'Drone Pitch', id: 'MOD_SNSTD_DRONE_PITCH', init: 64, min: 52, max: 76 },
		{ desc: 'Play Scale', id: 'MOD_SNSTD_PLAY_SCALE', init: 0, min: 0, max: 0 },
		{ desc: 'Scale Key', id: 'MOD_SNSTD_SCALE_KEY', init: 0, min: 0, max: 11 },
		{ desc: 'Glide', id: 'MOD_SNSTD_GLIDE', init: 0, min: 0, max: 1 },
		{ desc: 'Variation', id: 'MOD_SNSTD_VARIATION', init: 0, min: 0, max: 0 },
		{ desc: 'Picking Harmonics', id: 'MOD_SNSTD_PICKHARM', init: 0, min: 0, max: 1 },
		{ desc: 'Buzz Key Switch', id: 'MOD_SNSTD_KEYSW', init: 0, min: 0, max: 1 },
		{ desc: 'Sub String Tune', id: 'MOD_SNSTD_OFFSET1', init: 64, min: 0, max: 127 }
	];

	var VariMarimba        = { desc: 'Variation', id: 'VARI_MARIMBA', init: 0, min: 0, max: 1 };
	var VariVibraphone     = { desc: 'Variation', id: 'VARI_VIBRAPHONE', init: 0, min: 0, max: 2 };
	var VariSteelStrGuitar = { desc: 'Variation', id: 'VARI_STEELSTRGUITAR', init: 0, min: 0, max: 2 };
	var VariFlamencoGuitar = { desc: 'Variation', id: 'VARI_FLAMENCOGUITAR', init: 0, min: 0, max: 2 };
	var VariJazzGuitar     = { desc: 'Variation', id: 'VARI_JAZZGUITAR', init: 0, min: 0, max: 2 };
	var VariAcousticBass   = { desc: 'Variation', id: 'VARI_ACOUSTICBASS', init: 0, min: 0, max: 2 };
	var VariFingeredBass   = { desc: 'Variation', id: 'VARI_FINGEREDBASS', init: 0, min: 0, max: 2 };
	var VariPickedBass     = { desc: 'Variation', id: 'VARI_PICKEDBASS', init: 0, min: 0, max: 2 };
	var VariViolin         = { desc: 'Variation', id: 'VARI_VIOLIN', init: 0, min: 0, max: 3 };
	var VariHarp           = { desc: 'Variation', id: 'VARI_HARP', init: 0, min: 0, max: 1 };
	var VariTimpani        = { desc: 'Variation', id: 'VARI_TIMPANI', init: 0, min: 0, max: 2 };
	var VariStrings        = { desc: 'Variation', id: 'VARI_STRINGS', init: 0, min: 0, max: 3 };
	var VariChoir          = { desc: 'Variation', id: 'VARI_CHOIR', init: 0, min: 0, max: 1 };
	var VariTrumpet        = { desc: 'Variation', id: 'VARI_TRUMPET', init: 0, min: 0, max: 2 };
	var VariFrenchHorn     = { desc: 'Variation', id: 'VARI_FRENCHHORN', init: 0, min: 0, max: 1 };
	var VariSax            = { desc: 'Variation', id: 'VARI_SAX', init: 0, min: 0, max: 3 };
	var VariPanFlute       = { desc: 'Variation', id: 'VARI_PANFLUTE', init: 0, min: 0, max: 2 };
	var VariShakuhachi     = { desc: 'Variation', id: 'VARI_SHAKUHACHI', init: 0, min: 0, max: 2 };
	var VariPipes          = { desc: 'Variation', id: 'VARI_PIPES', init: 0, min: 0, max: 2 };
	var VariSteelDrums     = { desc: 'Variation', id: 'VARI_STEELDRUMS', init: 0, min: 0, max: 1 };
	var VariSantoor        = { desc: 'Variation', id: 'VARI_SANTOOR', init: 0, min: 0, max: 2 };
	var VariYangChin       = { desc: 'Variation', id: 'VARI_YANGCHIN', init: 0, min: 0, max: 2 };
	var VariTinWhistle     = { desc: 'Variation', id: 'VARI_TINWHISTLE', init: 0, min: 0, max: 2 };
	var VariShamisen       = { desc: 'Variation', id: 'VARI_SHAMISEN', init: 0, min: 0, max: 3 };
	var VariKoto           = { desc: 'Variation', id: 'VARI_KOTO', init: 0, min: 0, max: 2 };
	var VariKalimba        = { desc: 'Variation', id: 'VARI_KALIMBA', init: 0, min: 0, max: 1 };
	var VariMandolin       = { desc: 'Variation', id: 'VARI_MANDOLIN', init: 0, min: 0, max: 2 };
	var VariTuba           = { desc: 'Variation', id: 'VARI_TUBA', init: 0, min: 0, max: 1 };

	var ScaleHarp = { desc: 'Play Scale', id: 'SCALE_HARP', init: 0, min: 0, max: 6 };
	var ScaleSax  = { desc: 'Play Scale', id: 'SCALE_SAX',  init: 0, min: 0, max: 5 };
	var ScaleKoto = { desc: 'Play Scale', id: 'SCALE_KOTO', init: 0, min: 0, max: 1 };

	var MONO = 0,
		POLY = 1;

	var INST_TABLE = [
		{ lsb: 64, pc:   0, monopoly: POLY, mod: MOD_SNAP,  scale: null, vari: null, desc: 'INT: Concert Grand' },
		{ lsb: 64, pc:   1, monopoly: POLY, mod: MOD_SNAP,  scale: null, vari: null, desc: 'INT: Grand Piano1' },
		{ lsb: 64, pc:   2, monopoly: POLY, mod: MOD_SNAP,  scale: null, vari: null, desc: 'INT: Grand Piano2' },
		{ lsb: 64, pc:   3, monopoly: POLY, mod: MOD_SNAP,  scale: null, vari: null, desc: 'INT: Grand Piano3' },
		{ lsb: 64, pc:   4, monopoly: POLY, mod: MOD_SNAP,  scale: null, vari: null, desc: 'INT: Mellow Piano' },
		{ lsb: 64, pc:   5, monopoly: POLY, mod: MOD_SNAP,  scale: null, vari: null, desc: 'INT: Bright Piano' },
		{ lsb: 64, pc:   6, monopoly: POLY, mod: MOD_SNAP,  scale: null, vari: null, desc: 'INT: Upright Piano' },
		{ lsb: 64, pc:   7, monopoly: POLY, mod: MOD_SNAP,  scale: null, vari: null, desc: 'INT: Concert Mono' },
		{ lsb: 64, pc:   8, monopoly: POLY, mod: MOD_SNAP,  scale: null, vari: null, desc: 'INT: Honky-tonk' },
		{ lsb:  0, pc:   4, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Pure Vintage EP1' },
		{ lsb:  1, pc:   4, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Pure Vintage EP2' },
		{ lsb:  2, pc:   4, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Pure Wurly' },
		{ lsb:  3, pc:   4, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Pure Vintage EP3' },
		{ lsb:  6, pc:   4, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Old Hammer EP' },
		{ lsb:  7, pc:   4, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Dyno Piano' },
		{ lsb:  0, pc:   7, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Clav CB Flat' },
		{ lsb:  1, pc:   7, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Clav CA Flat' },
		{ lsb:  2, pc:   7, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Clav CB Medium' },
		{ lsb:  3, pc:   7, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Clav CA Medium' },
		{ lsb:  4, pc:   7, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Clav CB Brillia' },
		{ lsb:  5, pc:   7, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Clav CA Brillia' },
		{ lsb:  6, pc:   7, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Clav CB Combo' },
		{ lsb:  7, pc:   7, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Clav CA Combo' },
		{ lsb:  0, pc:   9, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariMarimba, desc: 'INT: Glockenspiel' },
		{ lsb:  0, pc:  11, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariVibraphone, desc: 'INT: Vibraphone' },
		{ lsb:  0, pc:  12, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariMarimba, desc: 'INT: Marimba' },
		{ lsb:  0, pc:  13, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariMarimba, desc: 'INT: Xylophone' },
		{ lsb:  0, pc:  14, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariMarimba, desc: 'INT: Tubular Bells' },
		{ lsb: 65, pc:   0, monopoly: POLY, mod: MOD_TW,    scale: null, vari: null, desc: 'INT: TW Organ' },
		{ lsb:  0, pc:  21, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: French Accordion' },
		{ lsb:  1, pc:  21, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: ItalianAccordion' },
		{ lsb:  0, pc:  22, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Harmonica' },
		{ lsb:  0, pc:  23, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Bandoneon' },
		{ lsb:  0, pc:  24, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'INT: Nylon Guitar' },
		{ lsb:  1, pc:  24, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariFlamencoGuitar, desc: 'INT: Flamenco Guitar' },
		{ lsb:  0, pc:  25, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'INT: SteelStr Guitar' },
		{ lsb:  0, pc:  26, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariJazzGuitar, desc: 'INT: Jazz Guitar' },
		{ lsb:  0, pc:  27, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'INT: ST Guitar Half' },
		{ lsb:  1, pc:  27, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'INT: ST Guitar Front' },
		{ lsb:  2, pc:  27, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'INT: TC Guitar Rear' },
		{ lsb:  0, pc:  32, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariAcousticBass, desc: 'INT: Acoustic Bass' },
		{ lsb:  0, pc:  33, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariFingeredBass, desc: 'INT: Fingered Bass' },
		{ lsb:  0, pc:  34, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariPickedBass, desc: 'INT: Picked Bass' },
		{ lsb:  0, pc:  35, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariAcousticBass, desc: 'INT: Fretless Bass' },
		{ lsb:  0, pc:  40, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariViolin, desc: 'INT: Violin' },
		{ lsb:  1, pc:  40, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariViolin, desc: 'INT: Violin 2' },
		{ lsb:  0, pc:  41, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariViolin, desc: 'INT: Viola' },
		{ lsb:  0, pc:  42, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariViolin, desc: 'INT: Cello' },
		{ lsb:  1, pc:  42, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariViolin, desc: 'INT: Cello 2' },
		{ lsb:  0, pc:  43, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariViolin, desc: 'INT: Contrabass' },
		{ lsb:  0, pc:  46, monopoly: POLY, mod: MOD_SNSTD, scale: ScaleHarp, vari: VariHarp, desc: 'INT: Harp' },
		{ lsb:  0, pc:  47, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariTimpani, desc: 'INT: Timpani' },
		{ lsb:  0, pc:  48, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariStrings, desc: 'INT: Strings' },
		{ lsb:  1, pc:  48, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariStrings, desc: 'INT: Marcato Strings' },
		{ lsb:  0, pc:  52, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariChoir, desc: 'INT: London Choir' },
		{ lsb:  1, pc:  52, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariChoir, desc: 'INT: Boys Choir' },
		{ lsb:  0, pc:  56, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'INT: Trumpet' },
		{ lsb:  0, pc:  57, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'INT: Trombone' },
		{ lsb:  3, pc:  57, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'INT: Tb2 CupMute' },
		{ lsb:  0, pc:  59, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'INT: Mute Trumpet' },
		{ lsb:  0, pc:  60, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariFrenchHorn, desc: 'INT: French Horn' },
		{ lsb:  1, pc:  64, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariSax, desc: 'INT: Soprano Sax 2' },
		{ lsb:  1, pc:  65, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariSax, desc: 'INT: Alto Sax 2' },
		{ lsb:  2, pc:  66, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariSax, desc: 'INT: Tenor Sax 2' },
		{ lsb:  1, pc:  67, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariSax, desc: 'INT: Baritone Sax 2' },
		{ lsb:  0, pc:  68, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariFrenchHorn, desc: 'INT: Oboe' },
		{ lsb:  0, pc:  70, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariFrenchHorn, desc: 'INT: Bassoon' },
		{ lsb:  0, pc:  71, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariFrenchHorn, desc: 'INT: Clarinet' },
		{ lsb:  0, pc:  72, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariFrenchHorn, desc: 'INT: Piccolo' },
		{ lsb:  0, pc:  73, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariFrenchHorn, desc: 'INT: Flute' },
		{ lsb:  0, pc:  75, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariPanFlute, desc: 'INT: Pan Flute' },
		{ lsb:  0, pc:  77, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariShakuhachi, desc: 'INT: Shakuhachi' },
		{ lsb:  0, pc: 104, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'INT: Sitar' },
		{ lsb:  0, pc: 109, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariPipes, desc: 'INT: Uilleann Pipes' },
		{ lsb:  1, pc: 109, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariPipes, desc: 'INT: Bag Pipes' },
		{ lsb:  1, pc: 110, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariShakuhachi, desc: 'INT: Erhu' },
		{ lsb:  0, pc: 114, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelDrums, desc: 'INT: Steel Drums' },
		{ lsb:  0, pc:  15, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSantoor, desc: 'ExSN1: Santoor' },
		{ lsb:  1, pc:  46, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariYangChin, desc: 'ExSN1: Yang Chin' },
		{ lsb:  1, pc:  75, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTinWhistle, desc: 'ExSN1: Tin Whistle' },
		{ lsb:  1, pc:  77, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariShakuhachi, desc: 'ExSN1: Ryuteki' },
		{ lsb:  0, pc: 106, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariShamisen, desc: 'ExSN1: Tsugaru' },
		{ lsb:  1, pc: 106, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariShamisen, desc: 'ExSN1: Sansin' },
		{ lsb:  0, pc: 107, monopoly: POLY, mod: MOD_SNSTD, scale: ScaleKoto, vari: VariKoto, desc: 'ExSN1: Koto' },
		{ lsb:  1, pc: 107, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: null, desc: 'ExSN1: Taishou Koto' },
		{ lsb:  0, pc: 108, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariKalimba, desc: 'ExSN1: Kalimba' },
		{ lsb:  2, pc: 110, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: null, desc: 'ExSN1: Sarangi' },
		{ lsb:  0, pc:  64, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariSax, desc: 'ExSN2: Soprano Sax' },
		{ lsb:  0, pc:  65, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariSax, desc: 'ExSN2: Alto Sax' },
		{ lsb:  0, pc:  66, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariSax, desc: 'ExSN2: Tenor Sax' },
		{ lsb:  0, pc:  67, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariSax, desc: 'ExSN2: Baritone Sax' },
		{ lsb:  0, pc:  69, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariFrenchHorn, desc: 'ExSN2: English Horn' },
		{ lsb:  1, pc:  71, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariFrenchHorn, desc: 'ExSN2: Bass Clarinet' },
		{ lsb:  1, pc:  73, monopoly: MONO, mod: MOD_SNSTD, scale: ScaleSax, vari: VariFrenchHorn, desc: 'ExSN2: Flute 2' },
		{ lsb:  0, pc:  74, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariFrenchHorn, desc: 'ExSN2: Soprano Recorder' },
		{ lsb:  1, pc:  74, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariFrenchHorn, desc: 'ExSN2: Alto Recorder' },
		{ lsb:  2, pc:  74, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariFrenchHorn, desc: 'ExSN2: Tenor Recorder' },
		{ lsb:  3, pc:  74, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariFrenchHorn, desc: 'ExSN2: Bass Recorder' },
		{ lsb:  0, pc:  79, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariShakuhachi, desc: 'ExSN2: Ocarina SopC' },
		{ lsb:  1, pc:  79, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariShakuhachi, desc: 'ExSN2: Ocarina SopF' },
		{ lsb:  2, pc:  79, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariShakuhachi, desc: 'ExSN2: Ocarina Alto' },
		{ lsb:  3, pc:  79, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariShakuhachi, desc: 'ExSN2: Ocarina Bass' },
		{ lsb:  1, pc:  26, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariJazzGuitar, desc: 'ExSN3: TC Guitar w/Fing' },
		{ lsb:  2, pc:  26, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariJazzGuitar, desc: 'ExSN3: 335Guitar w/Fing' },
		{ lsb:  3, pc:  27, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'ExSN3: LP Guitar Rear' },
		{ lsb:  4, pc:  27, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'ExSN3: LP Guitar Front' },
		{ lsb:  5, pc:  27, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'ExSN3: 335 Guitar Half' },
		{ lsb:  1, pc:  32, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariAcousticBass, desc: 'ExSN3: Acoustic Bass 2' },
		{ lsb:  1, pc:  33, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariFingeredBass, desc: 'ExSN3: Fingered Bass 2' },
		{ lsb:  1, pc:  34, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariPickedBass, desc: 'ExSN3: Picked Bass 2' },
		{ lsb:  2, pc:  24, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: null, desc: 'ExSN4: Ukulele' },
		{ lsb:  3, pc:  24, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'ExSN4: Nylon Guitar 2' },
		{ lsb:  1, pc:  25, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'ExSN4: 12th Steel Gtr' },
		{ lsb:  2, pc:  25, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariMandolin, desc: 'ExSN4: Mandolin' },
		{ lsb:  3, pc:  25, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'ExSN4: SteelFing Guitar' },
		{ lsb:  4, pc:  25, monopoly: POLY, mod: MOD_SNSTD, scale: null, vari: VariSteelStrGuitar, desc: 'ExSN4: SteelStr Guitar2' },
		{ lsb:  1, pc:  56, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'ExSN5: ClassicalTrumpet' },
		{ lsb:  2, pc:  56, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'ExSN5: Flugel Horn' },
		{ lsb:  3, pc:  56, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'ExSN5: Trumpet 2' },
		{ lsb:  4, pc:  56, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'ExSN5: Mariachi Tp' },
		{ lsb:  1, pc:  57, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'ExSN5: Trombone 2' },
		{ lsb:  2, pc:  57, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'ExSN5: Bass Trombone' },
		{ lsb:  0, pc:  58, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTuba, desc: 'ExSN5: Tuba' },
		{ lsb:  1, pc:  59, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'ExSN5: StraightMute Tp' },
		{ lsb:  2, pc:  59, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariTrumpet, desc: 'ExSN5: Cup Mute Trumpet' },
		{ lsb:  1, pc:  60, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariFrenchHorn, desc: 'ExSN5: French Horn 2' },
		{ lsb:  2, pc:  60, monopoly: MONO, mod: MOD_SNSTD, scale: null, vari: VariFrenchHorn, desc: 'ExSN5: Mute French Horn' }
	];


	var POS_INST_VARIATION = 16,
		POS_INST_NUMBER    = 17,
		POS_SCALE          = 6,
		POS_VARIATION      = 9;

	function lookup(block, data, offset) {

		var lsb = data[offset + POS_INST_VARIATION];
		var pc  = data[offset + POS_INST_NUMBER];
		if (lsb == null) /* null or undefined ? */
			lsb = block[POS_INST_VARIATION].init;
		if (pc  == null) /* null or undefined ? */
			pc  = block[POS_INST_NUMBER].init;

		for (var i = 0, num = INST_TABLE.length; i < num; i++) {
			var o = INST_TABLE[i];
			if ((o.lsb == lsb) && (o.pc == pc))
				return o;
		}
		return null;
	}

	globals.model.option.mod = {

		reset: function() {},

		get: function(block, leaf, data, offset) {

			var inst = lookup(block, data, offset);
			if (inst == null)
				return null;

			var mod  = inst.mod,
				desc = '',
				opt  = null;

			switch (mod) {
				case MOD_TW:
					desc = 'TW';
					if (leaf.pos < mod.length)
						opt = mod[leaf.pos];
					break;

				case MOD_SNAP:
					desc = 'SNAP';
					if (leaf.pos < mod.length)
						opt = mod[leaf.pos];
					break;

				case MOD_SNSTD:
					desc = 'SN TONE';
					if (leaf.pos < mod.length) {
						if (leaf.pos == POS_SCALE && inst.scale != null) {
							opt = inst.scale;
						} else if (leaf.pos == POS_VARIATION && inst.vari != null) {
							opt = inst.vari;
						} else {
							opt = mod[leaf.pos];
						}
					}
					break;
			}

			return opt ? { desc:desc, leaf:opt } : null;
		},

		put: function(o, data) {

			var inst = lookup(o.block, data, o.offset);
			if (inst == null)
				return;

			var mod = inst.mod,
				v, id, addr, dt1;

			/* Mono/Poly ~ Octave Shift */
			dt1 = [];
			for (var i = 2; i <= 11; i++) {
				v = (i == 2) ? inst.monopoly : o.block[i].init;
				globals.model.make_dt1_data(v, o.block[i].bytes, dt1);
				data[o.offset + i] = v;
				globals.observer.notify('model', o.bid + '-' + o.block[i].id);
			}
			id = o.bid + '-' + o.block[2].id;
			addr = eval(id.replace(/-/g, '+'));
			globals.communicator.dt1(addr, dt1);

			/* Modify Parameter 1 ~ 32 */
			dt1 = [];
			for (var i = 18, x = 0; i <= 49; i++, x++) {
				if (x < mod.length) {
					v = mod[x].init;
					globals.model.make_dt1_data(v, o.block[i].bytes, dt1);
				} else {
					v = o.block[i].init;
				}
				data[o.offset + i] = v;
				globals.observer.notify('model', o.bid + '-' + o.block[i].id);
			}
			id = o.bid + '-' + o.block[18].id;
			addr = eval(id.replace(/-/g, '+'));
			globals.communicator.dt1(addr, dt1);

		}
	};

})(window.globals);
