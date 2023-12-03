//
//  widget_menu.js
//
//  Copyright 2014 Roland Corporation. All rights reserved.
//

(function( $, undefined ) {

	$.widget( "ui.myMenu", $.ui.menu , {
		_keydown: function( event ) {
			this._super('_keydown', this, arguments);

			switch ( event.keyCode ) {
				case $.ui.keyCode.UP:
					this.previous( event );
					break;
				case $.ui.keyCode.DOWN:
					this.next( event );
					break;
				default:
					break;
			}
		}
	});
}( jQuery ));