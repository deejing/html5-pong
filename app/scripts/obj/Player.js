(function($, cjs, win, doc, global) {
    'use strict';

    var Player = Class.extend({
        x : null,
        y : null,
        mx : null,
        my : null,
        w : null,
        h : null,
        ox : null,
        oy : null,
        ch: null,
        cw: null,
        cx: null,
        cy: null,
        dx: null,
        dy: null,
        sp : 10,

        score: 0,

        player : null,
        color: null,
        bindUp : null,
        bindDown : null,
        deltaTime : 1,
        moveField : [],

        gameWidth: 0,
        gameHeight: 0,
        difY : 0,

        dev: false,

        tmp: {x:0, y:0},

        direction : '',

        isMove : false,

        moveable : true,

        init : function (x, y, w, h, color)
        {
        	this.mx = x;
        	this.my = y;
        	this.x = x-(w/2);
        	this.y = y-(h/2);
            this.cx = this.x + (w/2);
            this.cy = this.y;
            this.ox = 0;
            this.oy = 0;
            this.w = w;
            this.h = h;
            this.moveField = [];
            this.color = color;
        },

        draw : function ()
        {
        	this.player = new cjs.Container();
            this.player.addChild( this.color );


            this.player.x = this.x;
            this.player.y = this.y;

            if ( this.dev === true )
            {
                var g = new cjs.Graphics();

                g.setStrokeStyle(1);
                g.beginFill(cjs.Graphics.getRGB(255,0,0));
                g.drawRoundRect(this.w/2, 0, 1, this.h, 0);

                var s = new cjs.Shape(g);

                this.player.addChild(s);
            }

            this.player.cache(0, 0,this.w, this.h);
        },

        getCollisionZone : function ( b )
        {
            var p = this,
                c1 = ((p.h/2)/2),
                c2 = (p.h/2),
                c3 = (p.h/2)+c1,
                c4 = p.h,
                val = '';

            if ( b.cy > p.cy && b.cy < p.cy+c1 )
            {
                val = 'c1';
            }
            else if ( b.cy > p.cy+c1 && b.cy < p.cy+c2 )
            {
                val = 'c2';
            }
            else if ( b.cy > p.cy+c2 && b.cy < p.cy+c3 )
            {
                val = 'c3';
            }
            else if ( b.cy > p.cy+c3 && b.cy < p.cy+c4 )
            {
                val = 'c4';
            }
            return val;
        },

        move : function ()
        {
            this.y += this.oy;

            if ( this.y < this.sp*3 || this.y+this.h > this.gameHeight- (this.sp*3) )
            {
                this.y = this.y;
            }
            else
            {
                this.my = this.y+(this.h/2);
                this.cy = this.y;
                this.player.y = this.y;

                if ( this.my > this.tmp.y ) {
                    this.direction = 'down';
                }
                else if ( this.my < this.tmp.y )
                {
                    this.direction = 'up';
                }
            }

            this.tmp.y = this.my;

            this.x = this.x;
            this.mx = this.x+(this.w/2);
            this.cx = this.x + (this.w/2);
            this.tmp.x = this.mx;

        },

        movePlayer : function ()
        {
            if ( this.bindUp !== null && this.bindDown !== null )
            {
                var $this = this;

                $(doc).on('keydown', function ( e ) {
                    //up
                    if ( e.which === $this.bindUp )
                    {
                        $this.oy = $this.sp * -1;// / $this.deltaTime;
                    }

                    //down
                    if ( e.which === $this.bindDown)
                    {
                        $this.oy = $this.sp; // / $this.deltaTime;
                    }

                    $this.isMove = true;

                }).on('keyup', function ( e ) {

                    $this.moveField = [];
                    $this.oy = 0;
                    $this.ox = 0;
                    $this.isMove = false;
                });
            }

        }

    });

    global.Player = Player;

})(jQuery, createjs, window, document, this);
