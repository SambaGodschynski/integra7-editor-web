//
//  scale.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

globals.parameter.scaleTbl = [
   // C     CS     D    DS     E     F    FS     G    GS     A    AS     B
	[   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ], //  EQUAL
	[  16, -14,  20,  31,   2,  14, -16,  18, -12,   0,  33,   4 ], //  JUST-MAJ
	[  16,  49,  20,  31,   2,  14,  47,  18,  29,   0,  33,   4 ], //  JUST-MIN
	[  -6,   8,  -2, -12,   2,  -8,   6,  -4,  10,   0, -10,   4 ], //  PYTHAGORE
	[  10,   0,   3,   4,  -3,   8,   0,   7,   2,   0,   6,  -1 ], //  KIRNBERGE
	[  10, -14,   3,  21,  -3,  14, -10,   7, -17,   0,  17,  -7 ], //  MEANTONE
	[  12,   2,   4,   6,   2,  10,   0,   8,   4,   0,   8,   4 ], //  WERCKMEIS
	[  -6,  45,  -2, -12,  51,  -8,  43,  -4,  47,   0, -10, -49 ]  //  ARABIC
];



