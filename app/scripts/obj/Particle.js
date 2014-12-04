(function($, cjs, global) {
    'use strict';

    var Particle = Class.extend({

        color : null,
        particle : null,
        p : [],
        m : 1,
        pos : {},
        count : 50,

        init : function (w, h)
        {
            this.particle = new cjs.Container();
            this.particle.x = 0;
            this.particle.y = 0;
            this.particle.width = w;
            this.particle.height = h;
            this.w = w;
            this.h = h;
        },

        create : function (x, y)
        {
            function _create (x, y, m)
            {
                var g = new cjs.Graphics();
                var r = 1;
                g.beginFill(cjs.Graphics.getRGB(255,255,255));
                g.drawCircle(r, r, 2);

                var s = new cjs.Shape(g);

                s.x = x;
                s.y = y;

                var p = {
                    s : s,
                    x : x || 0,
                    y : y || 0,
                    radius : r,
                    vx : Math.random()*1.5,
                    vy : -1.5 + Math.random() *3
                };

                //console.log( p )

                return p;
            }
            this.particle.removeAllChildren();
            this.p = [];
            for(var i = 0; i < this.count; i++)
            {
                var s = _create( x, y, this.m )
                this.p.push( s );
                this.particle.addChild( s.s );
            }

        },

        emit : function ()
        {
            for(var i = 0; i < this.p.length; i++)
            {
                var item = this.p[i];

                if ( item.radius > 0)
                {
                    item.radius = item.radius;
                    item.s.scaleX = item.radius;
                    item.s.scaleY = item.radius;
                    item.s.x = item.x;
                    item.s.y = item.y;
                }

                item.x += item.vx;
                item.y += item.vy;

                item.s.x += item.x;
                item.s.y += item.y;

                item.radius = Math.max(item.radius - 0.05, 0.0);
            }
        }

    });

    global.Particle = Particle;

})(jQuery, createjs, this);
