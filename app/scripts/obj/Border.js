(function($, cjs, win, doc, global) {
    'use strict';

    var Border = Class.extend({
        x : null,
        y : null,
        w : null,
        h : null,
        cx: null,
        cy: null,
       	border: null,

        dev: false,

        init : function (x, y, w, h, color)
        {
        	this.x = x;
        	this.y = y;

        	this.w = w;
        	this.h = h;

            this.color = color;
        },

        draw : function ()
        {
            var g = new cjs.Graphics();
            g.beginBitmapFill( this.color.image );
            g.rect(0, 0, this.w, this.h);


            var border = new cjs.Shape(g);

        	this.border = new cjs.Container();
            this.border.addChild( border );

            this.border.x = this.x;
            this.border.y = this.y;

            if ( this.dev === true )
            {
                var g = new cjs.Graphics();

                g.setStrokeStyle(1);
                g.beginFill(cjs.Graphics.getRGB(255,0,255));
                g.drawRoundRect(0, this.h/2, this.w, 1, 0);

                var s = new cjs.Shape(g);

                this.border.addChild(s);
            }

            this.border.cache(0, 0, this.w, this.h);
        }

    });

    global.Border = Border;

})(jQuery, createjs, window, document, this);
