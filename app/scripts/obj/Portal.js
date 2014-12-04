(function($, cjs, global) {
    'use strict';

    var Portal = Class.extend({
        x : null,
        y : null,
        color : null,
        portal : null,

        init : function (w, h, color)
        {
            this.color = color;
        }
    });

    global.Portal = Portal;

})(jQuery, createjs, this);
