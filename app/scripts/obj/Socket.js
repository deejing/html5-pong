(function($, win, global, undefined) {
    'use strict';

    var Socket = Class.extend({
    	server: null,
        msg : null,

    	init : function ( address )
    	{
    		this.server = new WebSocket( address );
    	}
    });

    global.Socket = Socket;

})(jQuery, window, this);
