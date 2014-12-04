(function($, win, doc, global, undefined) {
    'use strict';

    var game,
        ball,
        fpsInfo,
        socket,
        preloader,
        body,
        borderTop,
        borderBottom,
        divider,
        isSocket = false,
        isSound = true,
        cord = [],
        player = [],
        width = 1280,
        height = 720,
        conSpeed = 5,
        collisionZone = '',
        player1Score,
        player2Score,
        socketAddress = "ws://127.0.0.1:9512";

    var manifest = [
        { src: 'gfx/ball.png', id: 'gfx_ball' },
        { src: 'gfx/player.png', id: 'gfx_player' },
        { src: 'gfx/border.png', id: 'gfx_border' },
        { src: 'gfx/header.png', id: 'gfx_header' },
        { src: 'gfx/start.png', id: 'gfx_start' },
        { src: 'gfx/sound_on.png', id: 'gfx_sound_on' },
        { src: 'gfx/sound_off.png', id: 'gfx_sound_off' },
        { src: 'gfx/start-hover.png', id: 'gfx_start_hover' },
        { src: 'gfx/exit.png', id: 'gfx_exit' },
        { src: 'gfx/exit-hover.png', id: 'gfx_exit_hover' },
        { src: 'gfx/number.png', id: 'gfx_number' },
        { src: 'gfx/bg.png', id: 'gfx_bg' },
        { src: 'gfx/lens.png', id: 'gfx_lens' },
        { src: 'gfx/lens2.png', id: 'gfx_lens2' },
        { src: 'gfx/font-1.png', id: 'gfx_font1' },
        { src: 'gfx/font-2.png', id: 'gfx_font2' },
        { src: 'sounds/sfx/1.mp3|sounds/sfx/1.ogg', id: 'sfx_wall' },
        { src: 'sounds/sfx/5.mp3|sounds/sfx/5.ogg', id: 'sfx_wall_top' },
        { src: 'sounds/sfx/6.mp3|sounds/sfx/6.ogg', id: 'sfx_wall_bottom' },
        { src: 'sounds/sfx/2.mp3|sounds/sfx/2.ogg', id: 'sfx_player' },
        { src: 'sounds/sfx/3.mp3|sounds/sfx/3.ogg', id: 'sfx_player1' },
        { src: 'sounds/sfx/4.mp3|sounds/sfx/4.ogg', id: 'sfx_player2' },
        { src: 'sounds/music/1.mp3|sounds/music/1.ogg', id: 'music_start' },
        { src: 'sounds/music/2.mp3|sounds/music/2.ogg', id: 'music_game1' },
        { src: 'sounds/music/3.mp3|sounds/music/3.ogg', id: 'music_game2' },
        //{ src: 'sounds/themes/wroom.mp3|sounds/themes/wroom.ogg', id: 'wroom' },
        //{ src: 'sounds/themes/two_faced_lovers.mp3|sounds/themes/two_faced_lovers.ogg', id: 'two_faced_lovers' },
        //{ src: 'sounds/themes/still_alive.mp3|sounds/themes/still_alive.ogg', id: 'still_alive' },
        //{ src: 'sounds/themes/mozaik_roll.mp3|sounds/themes/mozaik_roll.ogg', id: 'mozaik_roll' },
        { src: 'sounds/themes/paranoid.mp3|sounds/themes/paranoid.ogg', id: 'paranoid' },
        { src: 'sounds/themes/through_the_fire_and_flames.mp3|sounds/themes/through_the_fire_and_flames.ogg', id: 'through_the_fire_and_flames' },
        //{ src: 'sounds/themes/the_pursuit_of_vikings.mp3|sounds/themes/the_pursuit_of_vikings.ogg', id: 'the_pursuit_of_vikings' },
        //{ src: 'sounds/themes/dragonborn.mp3|sounds/themes/dragonborn.ogg', id: 'dragonborn' }
    ];

    //var startScene = new createjs.Container();
    var startscene, gs, sound_btn;

    // loader
    var handleLoader = {
        onerror : function  ()
        {
            console.log('error');
        },
        oncomplete : function  ()
        {
            this.writeImage();

            // init fps
            this.initFPS();

            initSoundButton();

            initStartScene();

            $('#panel-container').append(game.panel);

        },
        onfileload : function  ()
        {
            console.log('fileload');
        }
    };

    // init game
    function init() {
        body = $('body');
        // game
        game = new Game('panel', width, height);
        game.manifest = manifest;
        game.preloader( handleLoader );
    };

    function initSoundButton ()
    {
        var gfx_on  = game.mfs.gfx_sound_on;
        var gfx_off = game.mfs.gfx_sound_off;

        sound_btn = new createjs.Container();

        sound_btn.addChild( gfx_on );

        sound_btn.scaleX = 0.12;
        sound_btn.scaleY = 0.12;

        sound_btn.x = 0;
        sound_btn.y = height-25;

        sound_btn.addEventListener('click', function () {
            if ( isSound === true ) {
                isSound = false;
                sound_btn.removeAllChildren();
                sound_btn.addChild(gfx_off);
                createjs.Sound.setMute(true);
            }
            else {
                isSound = true;
                sound_btn.removeAllChildren();
                sound_btn.addChild(gfx_on);
                createjs.Sound.setMute(false);
            }
            game.stage.update();
        });
    };

    // Start Scene0
    function initStartScene ()
    {
        if ( this !== undefined )
        {
            //this.music = null;
            //this.music.stop();
            //console.log( this.music );
            //createjs.Sound.removeAllSounds();
        }

        game.stage.removeAllChildren();
        game.container.removeAllChildren();
        game.stage.update();

        game.ready = false;

        startscene = new StartScene( game );

        game.stage.addChild( startscene.scene, sound_btn );
        game.stage.update();
        game.stage.enableMouseOver(20);

        startscene.changeScene = initGameScene; // button start on Click

        game.container.y = -height;
        createjs.Tween.get( game.container ).to( { alpha: 1, y: 0 }, 1200, createjs.Ease.bounceOut).call(function() {
            game.ready = false;
        });
    };

    function initGameScene ()
    {
        game.stage.removeAllChildren();
        game.container.removeAllChildren();
        game.stage.update();

        gs = new GameScene( game );

        //game.container.addChild( gs.scene, sound_btn );
        game.stage.addChild( gs.scene, sound_btn );

        gs.changeScene = initStartScene;

        // move game scene down
        game.container.alpha = 0;
        game.container.y = -height;
        createjs.Tween.get( game.container ).to( { alpha: 1, y: 0 }, 1200, createjs.Ease.bounceOut).call(function() {
            game.ready = true;
        });
    };

    // init socket client
    function intClient() {
        socket = new Socket( socketAddress );

        socket.server.onopen = function() {
            console.log('Socket connent');
            isSocket = true;
        };

        socket.server.onoclose = function() {
            console.log('Socket close');
            isSocket = false;
        };

        socket.server.onmessage = function( e ) {
            var obj = $.parseJSON( e.data );

            //updateDepthViewerCordQueue( obj );
            updateDepthViewerCordList( obj );

            socket.server.send('Hallo Socket');
        };
    };

    // game tick
    function update( e ) {
        if( game.ready === true )
        {
            gs.update();
        }

        // game
        game.update();
    };

    function player2Track()
    {
        var p = player[1],
            b = ball,
            by = b.y + b.rh,
            f = 1.8;

        if ( by > p.my )
        {
            p.y += f;
        }

        if ( by < p.my )
        {
            p.y -= f;
        }
        p.player.y = p.y;
        p.my = p.y+(p.h/2);

        p.cx = p.x + (p.w/2);
        p.cy = p.y;
    };

    $(doc).ready(function() {

        init();

        // start tick
        game.ticker( update );
    });


})(jQuery, window, document, this);
