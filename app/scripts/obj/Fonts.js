(function($, cjs, win, doc, global) {
    'use strict';

    var Fonts = Class.extend({
    	tpl :   ' "#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~!',
        gfx :   null,
        _val :  null,
        w :     null,
        h :     null,
        text :  null,

    	init : function ( w, h, lh, gfx )
    	{
            this.gfx = gfx;
            this.w = w;
            this.h = h;
            this.lh = lh;

            this.initCharMap();
    	},

        initCharMap : function ()
        {
            this.charMap = [];
            for ( var i = 0; i < this.tpl.length; i++ )
            {
                this.charMap[ this.charMap.length ] = this.tpl[i];
            }
        },

        setText : function ( text )
        {
            var val = [];
            this._val = null;
            for ( var i = 0; i <= text.length; i++ )
            {
                var item = text[i];

                for ( var j = 0; j < this.charMap.length; j++ )
                {
                    var mapItem = this.charMap[j];
                    if ( mapItem === item )
                    {
                        val[val.length] = j;
                        continue;
                    }
                }
            }
            this._val = val;
            return this;
        },

        getWidth : function ()
        {
            var w = 0;
            for ( var i = 0; i < this._val.length; i++ )
            {
                w += this.w;
            }
            return w;
        },

        draw : function ()
        {
            var c = document.createElement('canvas');
            var width = this.getWidth();
            c.setAttribute('width', width);
            c.setAttribute('height', this.h);

            var ctx = c.getContext('2d');
            var img = this.gfx.image;
            var map = this.charMap;

            var w = 0;

            for ( var i = 0; i < this._val.length; i++ )
            {
                var index = this._val[i];
                var x = index*this.w;
                ctx.drawImage(img, x, 0, this.w, this.h,  w, 0, this.w, this.h );
                w += this.w;
            }

            this.text = new cjs.Bitmap( ctx.canvas );
            this.width = this.text.image.width;
            this.height = this.text.image.width;
            return this;
        },

        scale : function (x, y)
        {
            this.text.scaleX = x;
            this.text.scaleY = y;

            return this;
        },

        getData : function ()
        {
            var container = new cjs.Container();
            if (this.text !== null )
            {
                return container.addChild( this.text );
            }
            else
            {
                return container;
            }
        }
    });

    global.Fonts = Fonts;

})(jQuery, createjs, window, document, this);
