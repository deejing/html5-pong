(function($, cjs, win, doc, global) {
    'use strict';

    var Numsp = Class.extend({
        x :         null,
        y :         null,
        w :         null,
        h :         null,
        gfx :       null,
        src :       null,
        sprite :    null,
        spData :    null,
        numsp :     null,
        btmap :     null,
        spMap :     [],
        _nr :       [],
        dev :       false,
        alpha :     1,

        init : function (x, y, w, h, gfx)
        {
            this.x = x;
            this.y = y;

            this.w = w;
            this.h = h;

            this.gfx = gfx;
            this.src = gfx.image.src;

            var $this = this;

            this.spData = {
                "images" : [ gfx.image.src ],
                "frames" : {
                    "width" : w,
                    "height": h,
                    "regX" : 0,
                    "regY" : 0,
                    "count" :10
                },
                "animations": {

                    "n0": 0,
                    "n1": 1,
                    "n2": 2,
                    "n3": 3,
                    "n4": 4,
                    "n5": 5,
                    "n6": 6,
                    "n7": 7,
                    "n8": 8,
                    "n9": 9
                }
            };

            this.spMap = ['n0', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9'];

            this.sprite = new cjs.SpriteSheet( this.spData );
        },

        setNumber : function ( nr )
        {
            var nr = new String(nr);
            this._nr = [];
            for (var i = 0; i < nr.length; i++)
            {
                var item = nr[i];
                this._nr[ this._nr.length ] = item;
            }
        },

        draw : function ()
        {
            this.numsp = new cjs.Container();
            this.numsp.x =  this.x;
            this.numsp.y =  this.y;
            this.update();
        },

        update : function ()
        {
            this.numsp.removeAllChildren();
            this.numsp.alpha = this.alpha;
            var width = 0;
            for (var i = 0; i < this._nr.length; i++)
            {
                var item = parseInt(this._nr[i]);
                var val = this.spMap[item];

                this.btmap = new cjs.Sprite( this.sprite, val );

                width += this.w;

                this.btmap.x = i*this.w;
                this.btmap.y = 0;


                this.numsp.addChild( this.btmap );
            }
            //this.numsp.cache(0, 0, 82, this.h);
        }


    });

    global.Numsp = Numsp;

})(jQuery, createjs, window, document, this);
