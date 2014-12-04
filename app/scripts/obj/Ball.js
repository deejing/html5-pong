(function($, cjs, global) {
    'use strict';

    var Ball = Class.extend({
        x : null,
        y : null,
        ox : null,
        oy : null,
        w : null,
        h : null,
        rw : null,
        rh : null,
        mx : null,
        my : null,
        ch: null,
        cw: null,
        cx: null,
        cy: null,
        ball : null,
        color: null,

        alpha: .85,

        speedX : 1,
        speedY : 1,
        conSpeed : 1,

        difA : 0,
        difB : 0,

        dev: false,

        tmp : {
            x: 0, y: 0
        },

        point : {
            cx: 0, cy: 0,
            hx: 0, hy: 0,
            vx: 0, vy: 0
        },

        direction: '',
        collision: '',

        init : function (w, h, color)
        {
            this.w = w;
            this.h = h;
            this.rw = w/2;
            this.rh = h/2;
            this.cx = 0;
            this.cy = 0;
            this.color = color;
        },

        draw : function ()
        {

            this.color.alpha = this.alpha;

            this.ball = new cjs.Container();
            this.ball.addChild( this.color );

            this.ball.x = this.x;
            this.ball.y = this.y;
            this.mx =  this.x+this.rw;
            this.my =  this.y+this.rh;

            if ( this.dev === true )
            {
                var g = new cjs.Graphics();

                g.setStrokeStyle(1);
                g.beginFill(cjs.Graphics.getRGB(255,0,0));
                g.drawCircle(this.rw,this.rh,2);

                var s = new cjs.Shape(g);

                this.ball.addChild(s);
            }
        },

        cache : function ()
        {
            this.ball.cache( 0, 0, this.w, this.h );
        },

        move : function ()
        {
            var $this = this;

            this.x += this.ox;
            this.y += this.oy;

            this.mx =  this.x+this.rw;
            this.my =  this.y+this.rh;

            this.ball.x = this.x;
            this.ball.y = this.y;

            this.cx = this.mx;
            this.cy = this.my;

            if ( this.cx > this.tmp.x && this.cy > this.tmp.y )
            {
                this.direction = 'right_down';
                this.point = {
                    cx : $this.cx + ( $this.rw + $this.conSpeed ),
                    cy : $this.cy + ( $this.rh + $this.conSpeed ),
                    hx : $this.cx,
                    hy : $this.cy + ( $this.rh + $this.conSpeed ),
                    vx : $this.cx + ( $this.rw + $this.conSpeed ),
                    vy : $this.cy
                };
            }
            else if ( this.cx > this.tmp.x && this.cy < this.tmp.y )
            {
                this.direction = 'right_up';
                this.point = {
                    cx : $this.cx + ( $this.rw + $this.conSpeed ),
                    cy : $this.cy - ( $this.rh + $this.conSpeed ),
                    hx : $this.cx,
                    hy : $this.cy - ( $this.rh + $this.conSpeed ),
                    vx : $this.cx + ( $this.rw + $this.conSpeed ),
                    vy : $this.cy
                };
            }
            else if ( this.cx < this.tmp.x && this.cy > this.tmp.y )
            {
                this.direction = 'left_down';
                this.point = {
                    cx : $this.cx - ( $this.rw + $this.conSpeed ),
                    cy : $this.cy + ( $this.rh + $this.conSpeed ),
                    hx : $this.cx,
                    hy : $this.cy + ( $this.rh + $this.conSpeed ),
                    vx : $this.cx - ( $this.rw + $this.conSpeed ),
                    vy : $this.cy
                };
            }
            else if ( this.cx < this.tmp.x && this.cy < this.tmp.y )
            {
                this.direction = 'left_up';
                this.point = {
                    cx : $this.cx - ( $this.rw + $this.conSpeed ),
                    cy : $this.cy - ( $this.rh + $this.conSpeed ),
                    hx : $this.cx,
                    hy : $this.cy - ( $this.rh + $this.conSpeed ),
                    vx : $this.cx - ( $this.rw + $this.conSpeed ),
                    vy : $this.cy
                };
            }

            this.tmp.x = this.cx;
            this.tmp.y = this.cy;
        },

        transision : function (x, y)
        {
            this.ox = x;
            this.oy = y;
        },

        bounce : function (a, b)
        {
            if ( this.cx > a  - this.difA )
            {
                this.transision( -this.ox, this.oy );
                this.collision = 'border_right';
            }
            else if ( this.cx < 0 + this.difA )
            {
                this.transision( -this.ox, this.oy );
                this.collision = 'border_left';
            }

            if ( this.cy > b - this.difB )
            {
                this.transision( this.ox, -this.oy );
                this.collision = 'border_bottom';
            }
            else if ( this.cy < 0 + this.difB )
            {
                this.transision( this.ox, -this.oy );
                this.collision = 'border_top';
            }
        }

    });

    global.Ball = Ball;

})(jQuery, createjs, this);
