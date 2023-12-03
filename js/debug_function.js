//
//  scene_base_controller.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

//////////////////////////////////////////////////////////////////////

(function() {
		
	globals.debug_func = {

		isIE: function () {
			var userAgent = window.navigator.userAgent.toLowerCase();
			if (userAgent.indexOf('msie') != -1) {
  				return true;	
			} 
			return false;
		}
	};
})();
