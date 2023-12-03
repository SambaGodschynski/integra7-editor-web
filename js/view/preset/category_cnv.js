//
//  category_cnv.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

(function(){

	globals.parameter.ToCategory36 = function(category) {
	    switch (category) {
			case CATEG_NO   : return CATEGORY36_NO                 ; // "No assign"          : "No assign"
			case CATEG_APNO : return CATEGORY36_PIANO              ; // "Ac.Piano"           : "Piano"
			case CATEG_PPNO : return CATEGORY36_PIANO              ; // "Pop Piano"          : "Piano"
			case CATEG_EGP 	: return CATEGORY36_PIANO              ; // "E.Grand Piano"      : "Piano"
			case CATEG_EP1 	: return CATEGORY36_ELECTRIC_PIANO     ; // "E.Piano1"           : "E.Piano"
			case CATEG_EP2 	: return CATEGORY36_ELECTRIC_PIANO     ; // "E.Piano2"           : "E.Piano"
			case CATEG_EORG : return CATEGORY36_ORGAN              ; // "E.Organ"            : "Organ"
			case CATEG_PORG : return CATEGORY36_ORGAN              ; // "Pipe Organ"         : "Organ"
			case CATEG_RORG : return CATEGORY36_ORGAN              ; // "Reed Organ"         : "Organ"
			case CATEG_KEYH : return CATEGORY36_OTHER_KEYBOARDS    ; // "Harpsichord"        : "Other Keyboards"
			case CATEG_KEYCV: return CATEGORY36_OTHER_KEYBOARDS    ; // "Clav"               : "Other Keyboards"
			case CATEG_KEYCL: return CATEGORY36_OTHER_KEYBOARDS    ; // "Celesta"            : "Other Keyboards"
			case CATEG_ACD 	: return CATEGORY36_ACCORDION_HARMONICA; // "Accordion"          : "Accordion/Harmonica"
			case CATEG_HRM 	: return CATEGORY36_ACCORDION_HARMONICA; // "Harmonica"          : "Accordion/Harmonica"
			case CATEG_BEL 	: return CATEGORY36_BELL_MALLET        ; // "Bell"               : "Bell/Mallet"
			case CATEG_MLT 	: return CATEGORY36_BELL_MALLET        ; // "Mallet"             : "Bell/Mallet"
			case CATEG_AGT 	: return CATEGORY36_ACOUSTIC_GUITAR    ; // "Ac.Guitar"          : "Ac.Guitar"
			case CATEG_EGT 	: return CATEGORY36_ELECTRIC_GUITAR    ; // "E.Guitar"           : "E.Guitar"
			case CATEG_DGT 	: return CATEGORY36_DISTORTION_GUITAR  ; // "Dist.Guitar"        : "Dist.Guitar"
			case CATEG_ABS 	: return CATEGORY36_ACOUSTIC_BASS      ; // "Ac.Bass"            : "Ac.Bass"
			case CATEG_EBS 	: return CATEGORY36_ELECTRIC_BASS      ; // "E.Bass"             : "E.Bass"
			case CATEG_SBS 	: return CATEGORY36_SYNTH_BASS         ; // "Synth Bass"         : "Synth Bass"
			case CATEG_PLK 	: return CATEGORY36_PLUCKED_STROKE     ; // "Plucked/Stroke"     : "Other Plucked/Stroke"
			case CATEG_SSTR : return CATEGORY36_STRINGS            ; // "Solo Strings"       : "Strings"
			case CATEG_ESTR : return CATEGORY36_STRINGS            ; // "Ensemble Strings"   : "Strings"
			case CATEG_ORC 	: return CATEGORY36_STRINGS            ; // "Orchestral"         : "Strings"
			case CATEG_SBRS : return CATEGORY36_BRASS              ; // "Solo Brass"         : "Brass"
			case CATEG_EBRS : return CATEGORY36_BRASS              ; // "Ensemble Brass"     : "Brass"
			case CATEG_WND 	: return CATEGORY36_WIND               ; // "Wind"               : "Wind"
			case CATEG_FLT 	: return CATEGORY36_FLUTE              ; // "Flute"              : "Flute"
			case CATEG_SAX 	: return CATEGORY36_SAX                ; // "Sax"                : "Sax"
			case CATEG_RECO : return CATEGORY36_RECORDER           ; // "Recorder"           : "Recorder"
			case CATEG_VOXC : return CATEGORY36_VOX_CHOIR          ; // "Vox/Choir"          : "Vox/Choir"
			case CATEG_VOXS : return CATEGORY36_VOX_CHOIR          ; // "Scat"               : "Vox/Choir"
			case CATEG_SLD 	: return CATEGORY36_SYNTH_LEAD         ; // "Synth Lead"         : "Synth Lead"
			case CATEG_SBR 	: return CATEGORY36_SYNTH_BRASS        ; // "Synth Brass"        : "Synth Brass"
			case CATEG_SPD 	: return CATEGORY36_SYNTH_PAD_STRINGS  ; // "Synth Pad/Strings"  : "Synth Pad/Strings"
			case CATEG_BPD 	: return CATEGORY36_SYNTH_BELLPAD      ; // "Synth Bellpad"      : "Synth Bellpad"
			case CATEG_SPK 	: return CATEGORY36_SYNTH_POLY_KEY     ; // "Synth PolyKey"      : "Synth PolyKey"
			case CATEG_FX   : return CATEGORY36_FX                 ; // "FX"                 : "FX"
			case CATEG_SSEQ : return CATEGORY36_SYNTH_SEQ_POP      ; // "Synth Seq/Pop"      : "Synth Seq/Pop"
			case CATEG_PHRS : return CATEGORY36_PHRASE             ; // "Phrase"             : "Phrase"
			case CATEG_PLS	: return CATEGORY36_PULSATING          ; // "Pulsating"          : "Pulsating"
			case CATEG_BTS 	: return CATEGORY36_BEAT_GROOVE        ; // "Beat&Groove"        : "Beat&Groove"
			case CATEG_HIT 	: return CATEGORY36_HIT                ; // "Hit"                : "Hit"
			case CATEG_SFX 	: return CATEGORY36_SOUND_FX           ; // "Sound FX"           : "Sound FX"
			case CATEG_DRM 	: return CATEGORY36_DRUMS              ; // "Drums"              : "Drums"
			case CATEG_PRC 	: return CATEGORY36_PERCUSSION         ; // "Percussion"         : "Percussion"
			case CATEG_STK  : return CATEGORY36_COMBINATION        ; // "Stack"              : "Combination"
			case CATEG_ZONE : return CATEGORY36_COMBINATION        ; // "Zone"               : "Combination"
				// ���� category �ɊY������ tone �͎��݂��Ȃ��B
				//case CATEG_DST  : return CATEGORY36_DISTORTED ; // "Distorted"          : "Distorted?"
			default: -1;
	    }
	};

	globals.parameter.ToCategory50 = function(category) {
	    // ���Ȃ���瑽����ւ̕ϊ��Ȃ̂ŁA�������Ή�����ꍇ�͐擪�̂��̂ɕϊ�����B
	    switch (category) {
			case CATEGORY36_NO                 : return CATEG_NO  ; // "No assign"            : "No assign"
			case CATEGORY36_PIANO              : return CATEG_APNO; // "Piano"                : "Ac.Piano"
			case CATEGORY36_ELECTRIC_PIANO     : return CATEG_EP1 ; // "E.Piano"              : "E.Piano1"
			case CATEGORY36_ORGAN              : return CATEG_EORG; // "Organ"                : "E.Organ"
			case CATEGORY36_OTHER_KEYBOARDS    : return CATEG_KEYH; // "Other Keyboards"      : "Harpsichord"
			case CATEGORY36_ACCORDION_HARMONICA: return CATEG_ACD ; // "Accordion/Harmonica"  : "Accordion"
			case CATEGORY36_BELL_MALLET        : return CATEG_BEL ; // "Bell/Mallet"          : "Bell"
			case CATEGORY36_ACOUSTIC_GUITAR    : return CATEG_AGT ; // "Ac.Guitar"            : "Ac.Guitar"
			case CATEGORY36_ELECTRIC_GUITAR    : return CATEG_EGT ; // "E.Guitar"             : "E.Guitar"
			case CATEGORY36_DISTORTION_GUITAR  : return CATEG_DGT ; // "Dist.Guitar"          : "Dist.Guitar"
			case CATEGORY36_ACOUSTIC_BASS      : return CATEG_ABS ; // "Ac.Bass"              : "Ac.Bass"
			case CATEGORY36_ELECTRIC_BASS      : return CATEG_EBS ; // "E.Bass"               : "E.Bass"
			case CATEGORY36_SYNTH_BASS         : return CATEG_SBS ; // "Synth Bass"           : "Synth Bass"
			case CATEGORY36_PLUCKED_STROKE     : return CATEG_PLK ; // "Other Plucked/Stroke" : "Plucked/Stroke"
			case CATEGORY36_STRINGS            : return CATEG_SSTR; // "Strings"              : "Solo Strings"
			case CATEGORY36_BRASS              : return CATEG_SBRS; // "Brass"                : "Solo Brass"
			case CATEGORY36_WIND               : return CATEG_WND ; // "Wind"                 : "Wind"
			case CATEGORY36_FLUTE              : return CATEG_FLT ; // "Flute"                : "Flute"
			case CATEGORY36_SAX                : return CATEG_SAX ; // "Sax"                  : "Sax"
			case CATEGORY36_RECORDER           : return CATEG_RECO; // "Recorder"             : "Recorder"
			case CATEGORY36_VOX_CHOIR          : return CATEG_VOXC; // "Vox/Choir"            : "Vox/Choir"
			case CATEGORY36_SYNTH_LEAD         : return CATEG_SLD ; // "Synth Lead"           : "Synth Lead"
			case CATEGORY36_SYNTH_BRASS        : return CATEG_SBR ; // "Synth Brass"          : "Synth Brass"
			case CATEGORY36_SYNTH_PAD_STRINGS  : return CATEG_SPD ; // "Synth Pad/Strings"    : "Synth Pad/Strings"
			case CATEGORY36_SYNTH_BELLPAD      : return CATEG_BPD ; // "Synth Bellpad"        : "Synth Bellpad"
			case CATEGORY36_SYNTH_POLY_KEY     : return CATEG_SPK ; // "Synth PolyKey"        : "Synth PolyKey"
			case CATEGORY36_FX                 : return CATEG_FX  ; // "FX"                   : "FX"
			case CATEGORY36_SYNTH_SEQ_POP      : return CATEG_SSEQ; // "Synth Seq/Pop"        : "Synth Seq/Pop"
			case CATEGORY36_PHRASE             : return CATEG_PHRS; // "Phrase"               : "Phrase"
			case CATEGORY36_PULSATING          : return CATEG_PLS ; // "Pulsating"            : "Pulsating"
			case CATEGORY36_BEAT_GROOVE        : return CATEG_BTS ; // "Beat&Groove"          : "Beat&Groove"
			case CATEGORY36_HIT                : return CATEG_HIT ; // "Hit"                  : "Hit"
			case CATEGORY36_SOUND_FX           : return CATEG_SFX ; // "Sound FX"             : "Sound FX"
			case CATEGORY36_DRUMS              : return CATEG_DRM ; // "Drums"                : "Drums"
			case CATEGORY36_PERCUSSION         : return CATEG_PRC ; // "Percussion"           : "Percussion"
			case CATEGORY36_COMBINATION        : return CATEG_STK ; // "Combination"          : "Stack"
			default: return -1;
	    }
	};

})();
