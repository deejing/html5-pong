(function($, cjs, win, doc, global, undefined) {
    'use strict';

    var Scene = Game.extend({
    	conSpeed : 5,
        collisionZone : '',
        _countdown : 0,
        _countdownTime: 0,
        _speedUpInfo : 0,
        cTime : 2,
        timer : 0,
        roundTimer : 0,
        isSpeedUp : false,
        gameStart : false,
        gameOver: false,
        sound : true,

        player1 : null,
        player2 : null,
        ball : null,
        music: null,

        dev: true,

        changeScene : null,

    	init : function ( _game )
    	{
    		this.game 		= _game;
    		this.stage 		= _game.stage;
    		this.width 		= _game.width;
    		this.height 	= _game.height;

    		this.manifest 	= _game.manifest;
    		this.mfs  		= _game.mfs;

            this.body       = $('body');

    		this.scene  = new cjs.Container();

    		this.players;
    		this.ball;

            // Text
            this.initText();

    		// init game border
    		this.initBorder();

    		// init ball
    		this.initBall();
            this.initRandomStartDirection();

    		// init divider
    		this.initDivider();

    		// init player
    		this.player1 = this.initPlayer( 50, this.height/2);
            this.player2 = this.initPlayer( this.width-50, this.height/2);
            this.bindMovePlayer();

            // init score number
            this.initScoreScene();

            // init coundown
            this.initCountdown();

            // backbtn
            this.initBackButton();

            // sound btn

            this.initParticle();

            this.draw();

            this.initSound();
    	},

        initSound : function ()
        {
            this.music = this.game.playSound('through_the_fire_and_flames');

            this.music.setVolume(.50);

            this.music.addEventListener('complete', loop );

            function loop( obj ) {
                var instance = obj.target;
                instance.play();
            }
        },

    	initBall: function ()
    	{
    		this.ball = new Ball(54, 54, this.mfs.gfx_ball);

        	this.ball.x = (this.width/2) - (this.ball.w/2);
	        this.ball.y = (this.height/2) - (this.ball.h/2);


	        this.ball.dev = true;

	        this.ball.difB = this.borderTop.h;

	        this.ball.draw();


            var gc = new cjs.Graphics();

            gc.setStrokeStyle(1);
            gc.beginFill(cjs.Graphics.getRGB(0,255,0));
            gc.drawCircle(0,0,2);

            this.__testB = new cjs.Shape(gc);
            this.__testB2 = new cjs.Shape(gc);
            this.__testB3 = new cjs.Shape(gc);

	        this.ball.cache();
    	},

    	initPlayer : function (x, y)
    	{
    		var player = new Player(x, y, 54, 162, this.mfs.gfx_player);

	        player.dev = true;

	        player.gameHeight = this.height;
	        player.gameWidth = this.width;

	        player.difY = this.borderTop.h;

	        player.draw();

	        return player;
    	},

    	initBorder : function ()
    	{
    		var gfx_border = this.mfs.gfx_border;

        	this.borderTop = new Border(0, 0, this.width, 47, gfx_border);

        	this.borderBottom = new Border(0, this.height-47, this.width, 47, gfx_border);

        	this.borderTop.dev = false;
        	this.borderBottom.dev = false;

        	this.borderTop.draw();
        	this.borderBottom.draw();
    	},

    	initDivider : function ()
    	{
    		var gb = new cjs.Graphics();
	        gb.setStrokeStyle(1, 1);
	        gb.beginStroke('#fff');
	        gb.rect(0, 0, 10, 608);
	        gb.endFill();

	        var sb = new cjs.Shape(gb);

	        var blurFilter = new cjs.BlurFilter(7, 7, 3);

	        sb.filters = [blurFilter];

	        var bounds = blurFilter.getBounds();

	        sb.cache(-20+bounds.x, bounds.y, 40+bounds.width, 608+bounds.height);

	        sb.alpha = .60;


	        var g = new cjs.Graphics();
	        g.setStrokeStyle(1, 1);
	        g.beginStroke('#fff');
	        g.beginFill('rgba(0,0,0,0.30)');
	        g.rect(0, 0, 10, 608);
	        g.endFill();
	        var s = new cjs.Shape(g);

	        s.alpha = .30;

	        this.divider = new cjs.Container();

	        this.divider.x = this.width/2 - 5;
	        this.divider.y = 55;

	        this.divider.addChild( sb, s );
    	},

    	initScoreScene : function ()
	    {
	        var gfx = this.mfs.gfx_number;
	        this.player1Score = new Numsp( (this.width/2)-246, 100, 82, 81,  gfx);
	        this.player1Score.setNumber('00');

	        this.player1Score.alpha = .60;
	        this.player1Score.draw();

	        this.player2Score = new Numsp( (this.width/2)+82 , 100, 82, 81,  gfx);
	        this.player2Score.setNumber('00');

	        this.player2Score.alpha = .60;
	        this.player2Score.draw();

            var $this = this;

            this.ps1 = {
                x : $this.player1Score.numsp.x,
                y : $this.player1Score.numsp.y
            };

            this.ps2 = {
                x : $this.player2Score.numsp.x,
                y : $this.player2Score.numsp.y
            };
	    },

        initParticle : function ()
        {
            this.particle = new Particle( this.width, this.height );
        },

        initText : function ()
        {
            this.stageText = new cjs.Container();
            this.txt = new Fonts( 21, 34, 20, this.mfs.gfx_font1 );
        },

        initClient : function ()
        {

        },

        initCountdown : function ()
        {
            var gfx = this.mfs.gfx_number;
            this.countdownNr = new Numsp( (this.width/2)-82, (this.height/2)-45, 82, 81,  gfx);
            this.countdownNr.setNumber('00');
            this.countdownNr.draw();

            this._countdown = this.cTime;
        },

        initBackButton : function ()
        {
            this.backBtn =  this.txt.setText('<< Back').draw().scale(0.6, 0.6).getData();
            this.backBtn.x = 0;
            this.backBtn.y = 15;

            var $this = this;

            this.backBtn.addEventListener('mouseover', function() {
                $this.body.css({
                    'cursor' : 'pointer'
                });
                cjs.Tween.get( $this.backBtn ).to({alpha: 1}, 100);
            });

            this.backBtn.addEventListener('mouseout', function () {

                $this.body.css({
                    'cursor' : 'default'
                });

                cjs.Tween.get( $this.backBtn ).to({alpha: 0.5}, 100);
            });

            this.backBtn.addEventListener('click', function ( e ) {

                //$this.music.removeEventListener("complete", function(){});
                cjs.Sound.stop();

                cjs.Sound.removeSound('music_game2');

                cjs.Tween.get( $this.scene ).to({y:-$this.height}, 500, cjs.Ease.cubicInOut).call( function ( e ) {
                    if ( typeof $this.changeScene === 'function' )
                    {
                        //reset game Data
                        $this.scene.removeAllChildren();
                        $this.game.ready = false;

                        $this.conSpeed = 5,
                        $this.collisionZone = '',
                        $this._countdown = 0,
                        $this._countdownTime = 0,
                        $this.cTime = 5,
                        $this.gameStart = false,
                        $this.gameOver = false,

                        $this.changeScene.call( $this );
                    }
                });
            });
        },

        initRandomStartDirection : function ()
        {
            var rx = this.game.getRandom(0, 2);

            var dx = (rx === 0) ? -1 : 1;

            this.setBallStartDirection( dx );
        },

        setBallStartDirection : function ( dx )
        {
            var ry = this.game.getRandom(0, 2);
            var dy = (ry === 0) ? -1 : 1;

            this.ball.speedX = 10;
            this.ball.speedY = this.game.getRandom(4, 8);
            this.ball.conSpeed = this.conSpeed;

            this.ball.ox = dx * (this.ball.speedX + this.conSpeed);
            this.ball.oy = dy * this.ball.speedY;
        },

        setCountdown : function ( )
        {
            var t = 60;

            if ( this._countdownTime < this.cTime * t &&  this.gameStart == false)
            {
                if ( Math.ceil( this._countdownTime % t) === 0 )
                {
                    this._countdown--;
                    this.updateCoundown();
                    this._wait++;
                }

                this._countdownTime++;
                this.gameStart = false;
            }
            else {
                this.gameStart = true;
                this._countdown = 3;
                this._countdownTime = 0;
                this.countdownNr.alpha = 0;
                this.countdownNr.update();
            }
        },

        updateCoundown : function ()
        {
            var countdown = this.countdownNr;
            var val = ( this._countdown < 10 ) ? '0'+this._countdown : this._countdown;
            var $this = this;

            cjs.Tween.get( countdown.numsp ).to({alpha: 0, y: ($this.height/2)-20}, 100).call( _cb );

            function _cb() {
                countdown.alpha = 0;
                countdown.setNumber( val )
                countdown.update();
                cjs.Tween.get( countdown.numsp ).to({alpha: 1, y: ($this.height/2)-45 }, 500, cjs.Ease.bounceOut);
            }
        },

        updateSpeed : function ()
        {
            var $this = this;
            var b = this.ball;
            var c = (this.width/2);

            if ( this.roundTimer > 0 && this.isSpeedUp === true && this.conSpeed < 20)
            {
                b.x = (this.width/2) - (this.ball.w/2);
                b.y = b.y;

                this.conSpeed += 5;

                if ( b.ox < 0 )
                {
                    b.ox = -1 * (10 + $this.conSpeed);
                }
                else if ( b.ox > 0 )
                {
                    b.ox = (10 + $this.conSpeed);
                }
                this._speedUpInfo = 'SPEEDUP (>_<)';
                this.isSpeedUp = false;
            }
            else
            {
                this._speedUpInfo = '';
            }

            if ( b.cx === c )
            {
                if ( this.roundTimer > 0 && (this.roundTimer%10) === 0 )
                {
                    this.isSpeedUp = true;
                }
                else {
                    this.isSpeedUp = false;
                }
                this.roundTimer++;
            }

            this.timer++;
        },

        bindMovePlayer : function ()
        {
            this.player1.bindUp = 87; // w
            this.player1.bindDown = 83; // s

            this.player2.bindUp = 38; // arrow up
            this.player2.bindDown = 40; // arrow down

            this.player1.movePlayer();
            this.player2.movePlayer();
        },
        setCollision : function ()
        {
            var b = this.ball, p1 = this.player1, p2 = this.player2, conSpeed = this.conSpeed, r = this.ball.rw;

            if (b.collision === 'border_right')
            {
                this.setPlayerScore( p1, this.player1Score);
                b.collision = '';

                // restart
                /*b.x = (this.width/2) - (b.w/2);
                b.y = (this.height/2) - (b.h/2);

                this.setBallStartDirection( -1 );

                this.gameStart = false;
                this.cTime = 3;*/
                //this.conSpeed += 5;
                //this.ball.ox -= this.conSpeed;

                this.game.playSound('sfx_wall');
            }
            else if ( b.collision === 'border_left' )
            {
                this.setPlayerScore( p2, this.player2Score);
                b.collision = '';

                // restart

                /*b.x = (this.width/2) - (b.w/2);
                b.y = (this.height/2) - (b.h/2);

                this.setBallStartDirection( 1 );

                this.gameStart = false;
                this.cTime = 3;*/

                //this.conSpeed += 5;
                //this.ball.ox -= this.conSpeed;

                this.game.playSound('sfx_wall');
            }


            if ( b.cx-conSpeed >= p1.cx && b.cx-conSpeed <= p1.cx && b.cy >= p1.cy && b.cy <= p1.cy+p1.h )
            {
                b.transision( -b.ox, b.oy );
                b.collision = 'player_1';
                this.collisionZone = p1.getCollisionZone ( b );

                this.game.playSound('sfx_player1');
            }

            if ( b.cx+conSpeed >= p2.cx && b.cx+conSpeed <= p2.cx  && b.cy >= p2.cy && b.cy <= p2.cy+p2.h )
            {
                b.transision( -b.ox, b.oy );
                b.collision = 'player_2';
                this.collisionZone = p2.getCollisionZone ( b );

                this.game.playSound('sfx_player2');
            }


            if (b.collision === 'border_top')
            {
                this.game.playSound('sfx_wall_top');
                b.collision = '';
            }
            if (b.collision === 'border_bottom')
            {
                this.game.playSound('sfx_wall_bottom');
                b.collision = '';
            }
        },

	    setPlayerScore : function ( p, nr )
	    {
	        p.score += 1;

	        var val = ( p.score < 10 ) ? '0'+p.score : p.score;

	        cjs.Tween.get( nr.numsp ).to({alpha: 0, y : -20}, 100).call( _cb );

	        function _cb() {
	            nr.alpha = 0;
	            nr.setNumber( val )
	            nr.update();
	            cjs.Tween.get( nr.numsp ).to({alpha: 1, y : 100}, 300, cjs.Ease.bounceOut).call(function () {
                    cjs.Tween.get( nr.numsp ).to({alpha: 0.60, y : 100}, 2000);
                });
	        }
	    },

        updateBackground : function ()
        {
            var b = this.ball;
            var xPos = b.x;
            var yPos = b.y;
            var mx = Math.round(xPos / this.width * 100);
            var my = Math.round(yPos / this.height * 100);

            var bgX = (mx / 100) * 25;
            var bgY = (my / 100) * 15;

            this.bg_gfx.x = bgX * -1;
            this.bg_gfx.y = bgY * -1;

            var bglX = (mx / 100) * 50;
            var bglY = (my / 100) * 30;

            this.bg_lens.x = bglX * -1
            this.bg_lens.y = bglY * -1;

            var bgl2X = (mx / 100) * 90;
            var bgl2Y = (my / 100) * 60;

            this.bg_lens2.x = bgl2X * -1
            this.bg_lens2.y = bgl2Y * -1;

        },

        // Kinect Data
        updateDepthViewerCordQueue : function ( data )
        {
            //cord = [];

            var item = data;

            var x = Math.round((item.width/2) +item.x);
            var y = Math.round((item.height/2) +item.y);

            var sx = scale(width, 680, x, true);
            var sy = scale(height, 480, y, false);

            sx = Math.round(sx);
            sy = Math.round(sy);


            var d = {
                id: item.id,
                x: sx,
                y: sy,
                ox: item.x,
                oy: item.y,
                w: item.width,
                h: item.height,
                t: 'dpv'
            };

            cord[ cord.length ] = d;
        },

        updateDepthViewerCordList : function ( data )
        {
            if ( data.blobs !== undefined )
            {
                cord = [];
                for ( var i = 0; i < data.blobs.length; i++ )
                {
                    var item = data.blobs[i];

                    var x = Math.round((item.width/2) +item.x);
                    var y = Math.round((item.height/2) +item.y);

                    var sx = scale(width, 680, x, true);
                    var sy = scale(height, 480, y, false);

                    sx = Math.round(sx);
                    sy = Math.round(sy);


                    var d = {
                        id: item.id,
                        x: sx,
                        y: sy,
                        ox: item.x,
                        oy: item.y,
                        w: item.width,
                        h: item.height,
                        t: 'dpvl'
                    };

                    cord[ cord.length ] = d;
                }
            }
        },

        updatePlayerCord : function ()
        {
            var p1 = this.player1;
            var p2 = this.player2;

            for (var i = 0; i < cord.length; i++ )
            {
                var item = cord[i];

                if ( item.x < width/2)
                {
                    playerController(p1, item);
                }
                else if ( item.x > width/2 )
                {
                    playerController(p2, item);
                }

                if( item.t === 'dpv')
                {
                    cord.splice(0, i);
                }
            }
        },

        draw : function ()
        {
            this.bg_gfx = this.mfs.gfx_bg;
            this.bg_lens = this.mfs.gfx_lens;
            this.bg_lens2 = this.mfs.gfx_lens2;

            this.bg_lens.alpha = 0.12;
            this.bg_lens2.alpha = 0.22;

            this.scene.addChild( this.bg_gfx );

            this.scene.addChild( this.borderTop.border, this.borderBottom.border, this.divider );
            this.scene.addChild( this.player1.player, this.player2.player, this.player1Score.numsp, this.player2Score.numsp );
            this.scene.addChild( this.ball.ball, this.stageText, this.countdownNr.numsp );

            this.scene.addChild( this.bg_lens, this.bg_lens2 );

            this.scene.addChild( this.backBtn );

            // dev
            this.scene.addChild( this.__testB, this.__testB2, this.__testB3 );


        },

	    update : function ()
	    {

            if( this.gameStart === true )
            {
                this.setCollision();
                this.ball.move();
                this.ball.bounce(this.width, this.height);

                // ball debug
                this.__testB.x = this.ball.point.cx;
                this.__testB.y = this.ball.point.cy;
                this.__testB2.x = this.ball.point.hx;
                this.__testB2.y = this.ball.point.hy;
                this.__testB3.x = this.ball.point.vx;
                this.__testB3.y = this.ball.point.vy;

                this.updateBackground();

                // update ballspeed
                this.updateSpeed();
            }

            // player
            this.player1.move();
            this.player2.move();

            // debug
            this.stageText.removeAllChildren();
            if ( this.dev === true )
            {
                this.___DEV();
            }

            this.game.updateFPS();

            // set game Countdown
            this.setCountdown();

            if( this.isSocket === true )
            {
                //updatePlayerCord ();
            }
	    },

        ___DEV : function ()
        {
            var scale = { w : 0.4, h : 0.4 };
            var x = 100, y = 80;

            // FPS
            var dev =  this.txt.setText('DEV Info').draw().scale(0.6, 0.6).getData();
            dev.x = x;
            dev.y = y;

            // FPS
            var fps =  this.txt.setText('FPS: ' + this.game.fps + ', dTime: ' + this.game.deltaTime ).draw().scale(scale.w, scale.h).getData();
            fps.x = x;
            fps.y = dev.y + this.txt.lh*2;

            // player
            var player1 =  this.txt.setText('player1: ' + this.player1.direction + ', move: '+ this.player1.isMove).draw().scale(scale.w, scale.h).getData();
            player1.x = x;
            player1.y = fps.y + this.txt.lh;

            var player2 =  this.txt.setText('player2: ' + this.player2.direction + ', move: '+ this.player2.isMove).draw().scale(scale.w, scale.h).getData();
            player2.x = x;
            player2.y = player1.y + this.txt.lh;

            // ball
            var ball =  this.txt.setText('Ball: ' + this.ball.direction + ', round: ' + this.roundTimer + ',speed: ' + this.conSpeed).draw().scale(scale.w, scale.h).getData();
            ball.x = x;
            ball.y = player2.y + this.txt.lh;

            var collision =  this.txt.setText('collision: ' + this.ball.collision).draw().scale(scale.w, scale.h).getData();
            collision.x = x;
            collision.y = ball.y + this.txt.lh;

            var pos =  this.txt.setText('position: ' + this.ball.cx + ', '+this.ball.cy).draw().scale(scale.w, scale.h).getData();
            pos.x = x;
            pos.y = collision.y + this.txt.lh;

            var cz =  this.txt.setText('cz: ' + this.collisionZone ).draw().scale(scale.w, scale.h).getData();
            cz.x = x;
            cz.y = pos.y + this.txt.lh;

            var countdown =  this.txt.setText('countdown: ' + this._countdown ).draw().scale(scale.w, scale.h).getData();
            countdown.x = x;
            countdown.y = cz.y + this.txt.lh;

            this.stageText.addChild(dev, fps, player1, player2, ball, collision, pos, cz, countdown);
        }
    });

    global.GameScene = Scene;

})(jQuery, createjs, window, document, this);
