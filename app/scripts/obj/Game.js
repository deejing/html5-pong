(function($, win, global, undefined) {
    'use strict';

    var fpsCount = 0;

    var Game = Class.extend({
        stage :         null,
        offset :        null,
        panel :         null,
        width :         null,
        height :        null,
        manifest :      null,
        sound :         null,
        lastUpdate :    null,
        container :     null,
        queue:          null,
        world :         null,
        b2d :           null,
        ready :         false,
        manifestReady:  false,
        deltaTime :     0,
        fps :           '',
        mfs :           {},

        init : function ( pID, width, height )
        {
            this.panel = $('<canvas/>');

            this.panel.attr({
                'id': pID,
                'width': width,
                'height': height
            });

            this.panel.css({
                'width': width,
                'height': height
            });

            this.width = width;
            this.height = height;

            this.stage   = new createjs.Stage(this.panel[0]);
            this.offset  = new createjs.Point();

            this.lastUpdate = Date.now();

            this.container = new createjs.Container();

        },

        update : function ()
        {

            this.stage.update();

            var now = Date.now();
            this.deltaTime = now - this.lastUpdate;

            this.lastUpdate = now;

        },

        ticker : function ( fn )
        {
            createjs.Ticker.addEventListener("tick", fn);
            createjs.Ticker.useRAF = true;
            createjs.Ticker.setFPS( 60 );
        },

        initFPS : function ()
        {
            var $this = this;
            setInterval( function() {
                $this.fps = (fpsCount / 2 );
                fpsCount = 0;
            }, 2000);
        },

        updateFPS : function ()
        {
            fpsCount++;
        },

        preloader: function ( fn )
        {
            this.queue = new createjs.LoadQueue();
            this.queue.installPlugin( createjs.Sound );

            this.queue.addEventListener("fileload", handleFileload);
            this.queue.addEventListener("error", handleError);
            this.queue.addEventListener("complete", handleComplete);

            if (this.sound !== null && this.sound.length > 0 )
            {
                this.queue.loadManifest(this.sound);
            }

            if (this.manifest !== null && this.manifest.length > 0 )
            {
                this.queue.loadManifest(this.manifest);
            }

            var $this = this;

            function handleComplete()
            {
                $this.manifestReady = true;
                if( typeof fn.oncomplete === 'function' )
                {
                    fn.oncomplete.call($this);
                }
            }

            function handleFileload()
            {
                if( typeof fn.onfileload === 'function' )
                {
                    fn.onfileload.call($this);
                }
            }

            function handleError()
            {
                if( typeof fn.onfileload === 'function' )
                {
                    fn.onerror.call($this);
                }
            }
        },

        writeImage : function ()
        {
            if ( this.manifestReady === true )
            {
                var body = $('body');
                for ( var i = 0; i < this.manifest.length; i++ )
                {
                    var m = this.manifest[i];

                    var img = this.queue.getResult( m.id );

                    this.mfs[ m.id ] = new createjs.Bitmap(img);

                    $(img).addClass('tmp-img');

                    body.append(img);
                }
            }
        },

        getRandom : function ( min, max )
        {
            return Math.floor( (Math.random() * (max - min)) + min );
        },

        scale : function ( maxpixel, maxsize, pos, td )
        {
            var val = ( ((maxsize/maxpixel) * 2) * pos) * (maxpixel/maxsize) - ((td === true ) ? (maxpixel/2 - maxsize/2) : 0);

            if (val > maxpixel)
            {
                return maxpixel;
            }
            if ( val < 0 )
            {
                return 0;
            }
            return val;
        },

        playSound : function ( id )
        {
            return createjs.Sound.play( id );
        }

    });


    global.Game = Game;

})(jQuery, window, this);
