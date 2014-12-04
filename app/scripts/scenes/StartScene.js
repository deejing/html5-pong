(function($, cjs, win, doc, global, undefined) {
    'use strict';

    var Scene = Game.extend({
        start_btn : null,
        sound : true,
        init : function ( _game )
        {
            this.game       = _game;
            this.stage      = _game.stage;
            this.width      = _game.width;
            this.height     = _game.height;
            this.manifest   = _game.manifest;
            this.mfs        = _game.mfs;
            this.body = $('body');

            this.scene = new cjs.Container();

            this.initSound();

            this.initButtons();
            this.initHeader();
            this.initInfo();

            this.draw();

            this.onMouseMove();
        },

        initSound : function ()
        {
            this.music = this.game.playSound('paranoid');

            this.music.addEventListener('complete', loop );

            function loop( obj ) {
                var instance = obj.target;
                instance.play();
            }

        },

        initButtons : function ()
        {
            var $this = this;

            var gfx = this.mfs.gfx_start;

            this.start_btn = new cjs.Container();

            this.start_btn.addChild( gfx );
            this.start_btn.x = (this.width/2) - (gfx.image.width / 2);
            this.start_btn.y = 400;
            this.start_btn.cache(0, 0, gfx.image.width, gfx.image.height);

            this.start_btn_plx = new cjs.Container();

            this.start_btn_plx.addChild( gfx );
            this.start_btn_plx.x = (this.width/2) - (gfx.image.width / 2);
            this.start_btn_plx.y = 400-20;
            this.start_btn_plx.alpha = .15;
            this.start_btn_plx.cache(0, 0, gfx.image.width, gfx.image.height);


            this.exit_btn = this.mfs.gfx_exit;
            this.exit_btn.x = (this.width/2) - (this.exit_btn.image.width / 2);
            this.exit_btn.y = 500;

            // start button
            gfx.addEventListener('mouseover', function() {

                $this.body.css({
                    'cursor' : 'pointer'
                });
                cjs.Tween.get( $this.start_btn ).to({alpha: .40}, 300);

            });

            gfx.addEventListener('mouseout', function () {

                $this.body.css({
                    'cursor' : 'default'
                });

                cjs.Tween.get( $this.start_btn ).to({alpha: 1}, 300);
            });

            gfx.addEventListener('click', function ( e ) {
                cjs.Sound.stop();
                cjs.Tween.get( $this.scene ).to({y:-$this.height}, 500, cjs.Ease.cubicInOut).call( function ( e ) {
                    if ( typeof $this.changeScene === 'function' )
                    {
                        // reset scene
                        $this.scene.removeAllChildren();

                        $this.changeScene.call( $this );
                    }
                });
            });
        },
        initHeader : function()
        {

            var gfx = this.mfs.gfx_header;

            this.header_gfx = new cjs.Container();
            this.header_gfx.addChild(gfx);

            this.header_gfx.x = (this.width/2) - (gfx.image.width / 2);
            this.header_gfx.y = 50;
            this.header_gfx.cache(0, 0, gfx.image.width, gfx.image.height);

            this.header_gfx_plx = new cjs.Container();
            this.header_gfx_plx.addChild(gfx);

            this.header_gfx_plx.x = (this.width/2) - (gfx.image.width / 2);
            this.header_gfx_plx.y = 50+30;
            this.header_gfx_plx.alpha = 0.15;
            this.header_gfx_plx.cache(0, 0, gfx.image.width, gfx.image.height);
        },
        initInfo : function ()
        {
            var $this = this;

            this.font = new Fonts( 21, 34, 20, this.mfs.gfx_font1 );

            this.info = this.font.setText('JavaScript PONG Version 0.1 ').draw().scale(0.4, 0.4).getData();

            this.infourl = this.font.setText('http://www.deejing.de').draw().scale(0.4, 0.4).getData();
            this.infourl.x = this.info.image.width *0.4;
            this.infourl.alpha = 0.5;

            this.infourl.addEventListener('mouseover', function() {
                $this.body.css({
                    'cursor' : 'pointer'
                });
                cjs.Tween.get( $this.infourl ).to({alpha: 1}, 100);
            });

            this.infourl.addEventListener('mouseout', function () {

                $this.body.css({
                    'cursor' : 'default'
                });

                cjs.Tween.get( $this.infourl ).to({alpha: 0.5}, 100);
            });

            this.infourl.addEventListener('click', function ( e ) {
                var nw = win.open('http://www.deejing.de','_blank');
                nw.focus();
            });

            this.text1 = this.font.setText('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. djsbahdsajdhsadhsajhdsahdsahd').draw().scale(0.8, 0.8).getData();
            this.text1.y = this.font.lh;

            this.text2 = this.font.setText('Aenean commodo ligula eget dolor. Aenean massa. Cum ').draw().scale(1.6, 1.6).getData();
            this.text2.y = this.font.lh*2;


            this.infotext = new cjs.Container();
            this.infotext.addChild(this.info, this.infourl, this.text1, this.text2);
        },
        draw : function ()
        {
            this.bg_gfx = this.mfs.gfx_bg;
            this.scene.addChild(this.bg_gfx, this.header_gfx_plx, this.header_gfx, this.start_btn_plx, this.start_btn, this.infotext);
        },
        changeScene: function()
        {

        },

        onMouseMove : function ()
        {
            var $this = this;
            var panel = $('#panel');
            var cWidth = $('body')[0].clientWidth;
            var cHeight = $('body')[0].clientHeight;

            var hpx = $this.header_gfx_plx.x;
            var hpy = $this.header_gfx_plx.y;

            var hx = $this.header_gfx.x;
            var hy = $this.header_gfx.y;

            var spx = $this.start_btn_plx.x;
            var spy = $this.start_btn_plx.y;

            var sx = $this.start_btn.x;
            var sy = $this.start_btn.y;

            $('body').on('mousemove', function (e) {
                var offset = $(this).offset();
                var xPos = e.pageX;
                var yPos = e.pageY;

                var mx = Math.round(xPos / $this.width * 100);
                var my = Math.round(yPos / $this.height * 100);

                var headerPlxX = (mx / 100) * 50;
                var headerPlxY = (my / 100) * 30;

                $this.header_gfx_plx.x = hpx + headerPlxX;
                $this.header_gfx_plx.y = hpy + headerPlxY;

                var headerX = (mx / 100) * 80;
                var headerY = (my / 100) * 60;
                $this.header_gfx.x = hx + headerX;
                $this.header_gfx.y = hy + headerY;

                var bgX = (mx / 100) * 15;
                var bgY = (my / 100) * 10;

                $this.bg_gfx.x = bgX*-1;
                $this.bg_gfx.y = bgY*-1;

                var btnPlxX = (mx / 100) * 25;
                var btnPlxY = (my / 100) * 15;

                $this.start_btn_plx.x = sx + btnPlxX;
                $this.start_btn_plx.y = sy + btnPlxY;


                var btnX = (mx / 100) * 40;
                var btnY = (my / 100) * 30;

                $this.start_btn.x = sx + btnX;
                $this.start_btn.y = sy + btnY;
            });
        }
    });

    global.StartScene = Scene;

})(jQuery, createjs, window, document, this);
