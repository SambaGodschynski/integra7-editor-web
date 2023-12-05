//
//  scene_base_controller.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

//////////////////////////////////////////////////////////////////////

//	function globals.controller.base() {};

(function() {

	globals.controller.base = function(){};
	globals.controller.base.prototype = {

		checkId : function(id) {
			if ( id.slice(0, 3) != "PRM") return false;
			return true;
		},
		/**
		*	Default�@Range
		*/
		defaultRange: {
			min: 0,
			max: 127
		},
		defaultStrings : [
			{ 0 : "OFF"},
			{ 1 : "ON" }
		],
		invalidValue: -1,
		/**
		*	param {Number} id
		*/
		getVal: function(id) {
			if (!this.checkId(id)) return 0;
			var addr = eval(id.replace(/-/g, '+'));
			return globals.model.getValue(addr);
		},

		/**
		*	param {Number} id
		*/
		get: function(id) {
			if (!this.checkId(id)) return 0;

			var addr = eval(id.replace(/-/g, '+'));
			return globals.model.get(addr);
		},

		/**
		*	param {Number} id
		*	param {Number} v
		*/
		put: function(id, v) {
			if (!this.checkId(id)) return;

			var addr = eval(id.replace(/-/g, '+'));
			globals.model.put(addr, v);
		},

		/**
		*	param {Number} id
		*/
		strings: function(id) {
			if (!this.checkId(id)) return this.defaultStrings ;

			var addr = eval(id.replace(/-/g, '+'));
			return globals.model.strings(addr);
		},

		/**
		*	param {Number} id
		*	param {Number} value
		*/
		getString: function(id) {
			if (!this.checkId(id)) return "---";

			var addr = eval(id.replace(/-/g, '+'));
			return globals.model.getString(addr);
		},

		/**
		*	param {Number} id
		*/
		getPrmName: function (id) {
			switch (id) {
			default:
				break;
			}
			return "Undefined";
   		},

		/**
		*	param {Number} id
		*/
		range: function(id) {
			if (!this.checkId(id)) return this.defaultRange;

			var addr = eval(id.replace(/-/g, '+'));
			return globals.model.range(addr);
		},

		/**
		*	param {String} id
		*/
		getAddr: function(id) {
			var addr = eval(id.replace(/-/g, '+'));
			return addr;
		},

		masterTuneTbl : [
			-1000, -996, -991, -987, -983, -979, -975, -971, -966, -962, -958, -954, -950, -946, -941, -937,
			 -933, -929, -925, -921, -917, -912, -908, -904, -900, -896, -892, -888, -883, -879, -875, -871,
			 -867, -863, -859, -854, -850, -846, -842, -838, -834, -830, -825, -821, -817, -813, -809, -805,
			 -801, -797, -793, -788, -784, -780, -776, -772, -768, -764, -760, -755, -751, -747, -743, -739,
			 -735, -731, -727, -723, -719, -714, -710, -706, -702, -698, -694, -690, -686, -682, -678, -673,
			 -669, -665, -661, -657, -653, -649, -645, -641, -637, -633, -629, -624, -620, -616, -612, -608,
			 -604, -600, -596, -592, -588, -584, -580, -576, -571, -567, -563, -559, -555, -551, -547, -543,
			 -539, -535, -531, -527, -523, -519, -515, -511, -507, -502, -498, -494, -490, -486, -482, -478,
			 -474, -470, -466, -462, -458, -454, -450, -446, -442, -438, -434, -430, -426, -422, -418, -414,
			 -410, -406, -402, -398, -393, -389, -385, -381, -377, -373, -369, -365, -361, -357, -353, -349,
			 -345, -341, -337, -333, -329, -325, -321, -317, -313, -309, -305, -301, -297, -293, -289, -285,
			 -281, -277, -273, -269, -265, -261, -257, -253, -249, -245, -241, -237, -233, -229, -225, -221,
			 -217, -213, -209, -205, -201, -197, -193, -189, -185, -181, -177, -173, -170, -166, -162, -158,
			 -154, -150, -146, -142, -138, -134, -130, -126, -122, -118, -114, -110, -106, -102,  -98,  -94,
			  -90,  -86,  -82,  -78,  -74,  -70,  -67,  -63,  -59,  -55,  -51,  -47,  -43,  -39,  -35,  -31,
			  -27,  -23,  -19,  -15,  -11,   -7,   -3,    0,    3,    7,   11,   15,   19,   23,   27,   31,
			   35,   39,   43,   47,   51,   54,   58,   62,   66,   70,   74,   78,   82,   86,   90,   94,
			   98,  101,  105,  109,  113,  117,  121,  125,  129,  133,  137,  141,  144,  148,  152,  156,
			  160,  164,  168,  172,  176,  180,  183,  187,  191,  195,  199,  203,  207,  211,  215,  218,
			  222,  226,  230,  234,  238,  242,  246,  250,  253,  257,  261,  265,  269,  273,  277,  280,
			  284,  288,  292,  296,  300,  304,  308,  311,  315,  319,  323,  327,  331,  335,  338,  342,
			  346,  350,  354,  358,  362,  365,  369,  373,  377,  381,  385,  389,  392,  396,  400,  404,
			  408,  412,  415,  419,  423,  427,  431,  435,  438,  442,  446,  450,  454,  458,  462,  465,
			  469,  473,  477,  481,  484,  488,  492,  496,  500,  504,  507,  511,  515,  519,  523,  527,
			  530,  534,  538,  542,  546,  549,  553,  557,  561,  565,  568,  572,  576,  580,  584,  587,
			  591,  595,  599,  603,  606,  610,  614,  618,  622,  625,  629,  633,  637,  641,  644,  648,
			  652,  656,  660,  663,  667,  671,  675,  679,  682,  686,  690,  694,  697,  701,  705,  709,
			  713,  716,  720,  724,  728,  731,  735,  739,  743,  746,  750,  754,  758,  762,  765,  769,
			  773,  777,  780,  784,  788,  792,  795,  799,  803,  807,  810,  814,  818,  822,  825,  829,
			  833,  837,  840,  844,  848,  852,  855,  859,  863,  867,  870,  874,  878,  882,  885,  889,
			  893,  897,  900,  904,  908,  911,  915,  919,  923,  926,  930,  934,  938,  941,  945,  949,
			  953,  956,  960,  964,  967,  971,  975,  979,  982,  986,  990,  993,  997, 1000,
		],
		/* 415.3Hz - 466.2Hz (0.1Hz step) from SC-8850 */
		DECI_HZ_MIN : 4153,
		DECI_HZ_MAX : 4662,

		GSDeciCentToDeciHz : function(theDeciCent) {
	         var i;

	         for (i = 0; i < this.DECI_HZ_MAX - this.DECI_HZ_MIN; i++) {
	             if (theDeciCent <= this.masterTuneTbl[i]) {
	                 break;
	             }
	        }
	    	return this.DECI_HZ_MIN + i;
	   	},
		GSDeciHzToDeciCent : function(theDeciHz) {
			if (theDeciHz < this.DECI_HZ_MIN) {
				theDeciHz = this.DECI_HZ_MIN;
			} else if (theDeciHz > this.DECI_HZ_MAX) {
				theDeciHz = this.DECI_HZ_MAX;
			}

			return this.masterTuneTbl[theDeciHz - this.DECI_HZ_MIN];
		}
	};

})();


