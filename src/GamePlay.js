const STATE_GAME_NONE = 0;
const STATE_GAME_LOADING = 1;
const STATE_GAME_PLAYING = 2;
const STATE_GAME_GAMEOVER = 3;
const STATE_GAME_WIN = 4;
const NUMBER_LEVELS = 5;
const STEP = 38;
const ADDED_POINTS = 100;
const BAR_VELOCITY = -0.5;
const SPEEDS = [60,75,65,85,80,60];
const MEMES = ["sparta", "peluchito", "xoripan", "nyancat"];
const TROLLEYS = ["trolley1", "trolley2", "trolley3", "trolley4"]
const TABLES = ["table1", "table2", "table3", "table4", "table5", "table7", "table8"]
const MAX_ENEMIES = 6;
const MIN_ENEMIES = 4;
const DIFFICULTY = 0.6;
const ROW_TROLLEY_MIN = 13;
const ROW_TROLLEY_MAX = 17;
const ROW_MEME_MIN = 4;
const ROW_MEME_MAX = 12;
const ANIMATION_FPS = 3;        
const ROW_MIN_TABLE = 305;
const ROW_DISTANCE_TABLE = 40;
const ROW_MAX_TABLE = ROW_MIN_TABLE + (ROW_DISTANCE_TABLE * 8);
const LEFT_BOUND = 130;
const RIGHT_BOUND = 570;
const PADLEFT = 6;

var xInitialGandalf = 0;
var yInitialGandalf = 0;

var stateGame = STATE_GAME_NONE;

var lives = 3;
var score = 0;
var highScore = 0;
var currentLevel = 0;

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

var currentSquare = 0;
var maxSquareArrived = 0;
var finalSquare = 0;

var isSurfing = false;

var headerStyle = { font: "23px consolas", fill: "#00FF00", align: "center" },
    centerStyle = { font: "bold 32px consolas", fill: "#ffffff", align: "center" },
    boldStyle = { font: "bold 32px consolas", fill: "#ffffff", align: "center" };

GamePlayManager = {
    init: function(){
        game.scale.pageAlignHoritzontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.cursors = game.input.keyboard.createCursorKeys();
        highScore = Cookies.get("highScore") != undefined ? Cookies.get("highScore") : 0;
    },
    preload: function(){
        stateGame = STATE_GAME_LOADING;

        game.load.image('background', 'assets/images/background.png?v=3');
        game.load.image('header', 'assets/images/header.png?v=3');

        game.load.spritesheet("buttonPlay", "assets/images/buttonPlay.png", 65, 65, 2);
        game.load.spritesheet('gandalf', 'assets/images/gandalf.png?v=1', 16, 32);
        game.load.spritesheet('explosion', 'assets/images/explosion.png?v=1', 80, 80);
        game.load.spritesheet('arrival', 'assets/images/arrival.png?v=1', 700, 30);
        game.load.spritesheet('fire', 'assets/images/fire.png?v=1', 32, 32, 4);

        //ENEMIES        
        game.load.spritesheet('sparta', 'assets/images/sparta.png?v=1', 30, 30, 3);
        game.load.spritesheet('peluchito', 'assets/images/peluchito.png?v=1', 30, 30, 3);
        game.load.spritesheet('xoripan', 'assets/images/xoripan.png?v=1', 30, 30, 3);
        game.load.spritesheet('nyancat', 'assets/images/nyancat.png?v=1', 30, 30, 3);

        //TROLLEYS
        game.load.spritesheet('trolley1', 'assets/images/trolley1.png?v=1', 50, 30, 3);
        game.load.spritesheet('trolley2', 'assets/images/trolley2.png?v=1', 50, 30, 3);
        game.load.spritesheet('trolley3', 'assets/images/trolley3.png?v=1', 50, 30, 3);
        game.load.spritesheet('trolley4', 'assets/images/trolley4.png?v=1', 50, 30, 3);

        //TABLES
        game.load.spritesheet('table1', 'assets/images/table1.png?v=1', 90, 50);
        game.load.spritesheet('table2', 'assets/images/table2.png?v=1', 90, 50);
        game.load.spritesheet('table3', 'assets/images/table3.png?v=1', 90, 50);
        game.load.spritesheet('table4', 'assets/images/table4.png?v=1', 90, 50);
        game.load.spritesheet('table5', 'assets/images/table5.png?v=1', 90, 50);
        game.load.spritesheet('table6', 'assets/images/table6.png?v=1', 90, 50);
        game.load.spritesheet('table7', 'assets/images/table7.png?v=1', 90, 50);
        game.load.spritesheet('table8', 'assets/images/table8.png?v=1', 90, 50);
        game.load.spritesheet('table9', 'assets/images/table9.png?v=1', 90, 50);

        //AUDIOS
        game.load.audio("explosion", "assets/sounds/explosion.wav");
        game.load.audio("level_up", "assets/sounds/level_up.wav");
        game.load.audio("fire", "assets/sounds/fire.wav");
        game.load.audio("fire", "assets/sounds/fire.wav");
        game.load.audio("game", "assets/sounds/game.wav");
        game.load.audio("lose", "assets/sounds/lose.wav");
        game.load.audio("win", "assets/sounds/win.ogg");
    },
    create: function(){     
        // Init Background
        this.background = game.add.image(0,0, 'background');
        
        //TIME BAR
        var pixel = game.add.bitmapData(1,1);
        pixel.ctx.fillStyle = "#fabada";
        pixel.ctx.fillRect(0,0,1,1);
        this.bar = game.add.sprite(0,game.height - 10,pixel);
        this.bar.anchor.setTo(0);
        this.reloadBar();
        this.bar.height = 10;        

        // Init Header
        game.add.image(0,0, 'header');

        this.livesText = game.add.text(game.world.bounds.width - 16, 0, "LIVES: " + lives, headerStyle);
        this.livesText.anchor.set(1, 0);

        this.levelText = game.add.text(game.world.bounds.width - 140, 0, "LEVEL: " + (currentLevel + 1).toString(), headerStyle);
        this.levelText.anchor.set(1, 0);

        this.scoreText = game.add.text(game.world.centerX, 0, '', headerStyle);
        this.scoreText.anchor.set(0.5, 0);

        this.highScoreText = game.add.text(16, 0, '', headerStyle);
        this.highScoreText.anchor.set(0, 0);

        //SOUNDS
        this.explodeSound = game.add.audio('explosion', 1, false);
        this.levelUp = game.add.audio('level_up', 1, false);
        this.fireSound = game.add.audio('fire', 1, false);
        this.gameMusic = game.add.audio('game', 1, true);
        this.winMusic = game.add.audio('win', 1, true);
        this.loseMusic = game.add.audio('lose', 1, true);     

        //FIRES
        for(var i = ROW_TROLLEY_MIN; i < ROW_TROLLEY_MAX; i++){
            for(var j = 0; j < Math.floor(game.width / STEP); j+=1){  
                var fire = game.add.sprite(j*STEP, game.height - (STEP * i) , "fire");
                fire.animations.add("fire");
                fire.play("fire",ANIMATION_FPS, true, false);
            }
        }

        game.add.image(0, 40, "arrival");

        //TABLES
        const rightFloat = game.width - 80;
        for(var i = ROW_MIN_TABLE; i <= ROW_MAX_TABLE; i+=ROW_DISTANCE_TABLE ){
            game.add.image(0, i, this.randomTable());
            game.add.image(rightFloat, i, this.randomTable());
        }
        game.add.image(rightFloat, 625, "table6");

        this.setupMemes();
        this.setupTrolleys();

        //GANDALF        
        this.reloadGandalf();

        //EXPLOSIONS
        this.explosions = game.add.group();
        this.explosions.createMultiple(10, 'explosion');
        this.explosions.setAll('anchor.x', 0.5);
        this.explosions.setAll('anchor.y', 0.5);
        this.explosions.forEach(function(explosion){
            explosion.animations.add('explode');
        }, this);                   

        this.showWelcomeText("WELCOME TO EUSKAL GANDFROGGER!!");
        this.updateScore();

    },
    startGame: function(){
        stateGame = STATE_GAME_PLAYING;

        this.buttonPlay.kill();
        this.welcomeText.kill();

        this.reloadBar();

        this.stopMusics();
        this.gameMusic.loop = true;
        this.gameMusic.play();

        lives = 3;
        currentLevel = 0;

        currentSquare = 0;        
        maxSquareArrived = 0;
        finalSquare = (game.height / STEP) - 1;
        
        score = 0;
        this.updateScore();
    },
    setupMemes: function(){
        this.memes = game.add.group();
        this.memes.enableBody = true;

        for(var i = ROW_MEME_MIN; i < ROW_MEME_MAX; i++){
            for(var j = 0; j < this.randomNumberOfEnemiesPerLine(); j++){                
                var randomSprite = this.randomMeme();
                var meme = this.memes.create(this.randomPosition(), game.height - (STEP * i) , randomSprite);
                meme.body.moves = true;
                meme.animations.add(randomSprite);
                meme.play(randomSprite, ANIMATION_FPS, true, false);
            }
        }
        for(var i = 0; i < this.memes.children.length; i++) {
            var meme = this.memes.children[i];
            if(this.leftOrRight(meme.y)){
                meme.body.velocity.x = -this.rowSpeed(meme.y);
            } else {
                meme.body.velocity.x = this.rowSpeed(meme.y);
            }
            meme.checkWorldBounds = true;
            meme.outOfBoundsKill = true;
        }

    },
    clearMemes: function(){      
        this.memes.removeAll();
    },
    checkMemes: function(){
      var meme = this.memes.getFirstDead();
      
      if(!meme){
        return
      }
      
      meme.checkWorldBounds = false;
      meme.outOfBoundsKill = false;
      if(this.leftOrRight(meme.y)){
        meme.reset(game.world.width, meme.y);
        meme.body.velocity.x = -this.rowSpeed(meme.y);
      } else {
        meme.reset(0-meme.width, meme.y);
        meme.body.velocity.x = this.rowSpeed(meme.y);
      }
      meme.checkWorldBounds = true;
      meme.outOfBoundsKill = true;
    },
    randomMeme: function(){
        var random = Math.floor(Math.random() * MEMES.length);
        return MEMES[random];
    },
    randomTable: function(){
        var random = Math.floor(Math.random() * TABLES.length);
        return TABLES[random];
    },
    setupTrolleys: function(){
        this.trolleys = game.add.group();
        this.trolleys.enableBody = true;

        for(var i = ROW_TROLLEY_MIN; i < ROW_TROLLEY_MAX; i++){
            for(var j = 0; j < this.randomNumberOfEnemiesPerLine(); j++){                
                var randomSprite = this.randomTrolley();
                var trolley = this.trolleys.create(this.randomPosition(), game.height - (STEP * i) , randomSprite);

                trolley.body.moves = true;
                trolley.animations.add(randomSprite);
                trolley.play(randomSprite,ANIMATION_FPS, true, false);
            }
        }
        for(var i = 0; i < this.trolleys.children.length; i++) {
            var trolley = this.trolleys.children[i];
            if(this.leftOrRight(trolley.y)){
                trolley.body.velocity.x = -this.rowSpeed(trolley.y);
            } else {
                trolley.body.velocity.x = this.rowSpeed(trolley.y);
                trolley.scale.x *= -1;  
            }
            trolley.checkWorldBounds = true;
            trolley.outOfBoundsKill = true;
        }

    },
    clearTrolleys: function(){      
        this.trolleys.removeAll();
    },
    checkTrolleys: function(){
      var trolley = this.trolleys.getFirstDead();
      
      if(!trolley){
        return
      }
      
      trolley.checkWorldBounds = false;
      trolley.outOfBoundsKill = false;
      if(this.leftOrRight(trolley.y)){
        trolley.reset(game.world.width, trolley.y);
        trolley.body.velocity.x = -this.rowSpeed(trolley.y);
      } else {
        trolley.reset(0-trolley.width, trolley.y);
        trolley.body.velocity.x = this.rowSpeed(trolley.y);
      }
      trolley.checkWorldBounds = true;
      trolley.outOfBoundsKill = true;
    },
    randomTrolley: function(){
        var random = Math.floor(Math.random() * TROLLEYS.length);
        return TROLLEYS[random];
    },
    randomNumberOfEnemiesPerLine: function(){
        var random = Math.floor(Math.random() * (MAX_ENEMIES - MIN_ENEMIES)) + MIN_ENEMIES;
        return random;
    },
    leftOrRight: function(row){
        return (row/STEP)%2 == 0;
    },
    rowSpeed: function(row){
        var number = SPEEDS[row%6];
        return number * DIFFICULTY * (currentLevel + 1);
    },
    randomPosition: function(){
        return Math.floor(Math.random() * (1 + game.width));
    },
    stepForward: function(){
        currentSquare += 1;
        if(currentSquare > maxSquareArrived){
            maxSquareArrived = currentSquare;
            score += ADDED_POINTS;
            this.updateScore();
        }

        if(currentSquare == finalSquare){
            this.nextLevel();
        }
    },
    stepBack: function(){
        currentSquare = currentSquare == 0 ? 0 : currentSquare - 1;
    },
    updateScore: function(){
        if (score > highScore) {
          highScore = score;
          Cookies.set('high_score', highScore, { expires: '9999-12-31' });
        }
        this.scoreText.text = this.pad(score, PADLEFT);
        this.highScoreText.text = "BEST SCORE: " + this.pad(highScore, PADLEFT);
        
    },
    nextLevel: function(){
        currentSquare = 0;        
        maxSquareArrived = 0;
        this.reloadBar();

        currentLevel += 1;
        
        this.clearMemes();
        this.setupMemes();

        this.clearTrolleys();
        this.setupTrolleys();
        
        this.reloadGandalf();

        this.levelUp.play();

        if(currentLevel == NUMBER_LEVELS){
            this.gameWin();
        }else{            
            this.levelText.text = "LEVEL: " + (currentLevel + 1).toString();
        }
    },
    reloadBar: function(){        
        this.bar.width = game.width;
    },
    refreshBar: function(){
        var value = BAR_VELOCITY * DIFFICULTY * (currentLevel + 1);
        var newWidth = this.bar.width + value;
        if(newWidth > game.width){
            newWidth = game.width;
        }
        if(newWidth <= 0){
            newWidth = 0;
            this.gameOver();
        }
        this.bar.width = newWidth;
    },    
    gandalfDie: function(){
        this.explode(this.gandalf);
        this.reloadGandalf();
        this.reloadBar();
        this.minusLive();
    },
    gandalfBurn: function(){
        this.burn(this.gandalf);
        this.reloadGandalf();
        this.reloadBar();
        this.minusLive();
    },
    gandalfSurfing: function(gandalf, trolley){
        this.gandalf.x = trolley.x + trolley.width / 2;
        this.gandalf.y = trolley.y + trolley.height / 2;
        isSurfing = true;
    },
    minusLive: function(){
        lives -= 1;
        this.livesText.text = "LIVES: " + lives;
        if(lives == 0){
            this.gameOver();
        }
    },
    explode: function(entity) {
        entity.kill();
        this.explodeSound.play();
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(entity.body.x + (entity.width / 2), entity.body.y + (entity.height / 2));
        explosion.play('explode', 30, false, true);
    },
    burn: function(entity) {
        entity.kill();
        this.fireSound.play();
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(entity.body.x + (entity.width / 2), entity.body.y + (entity.height / 2));
        explosion.play('explode', 30, false, true);
    },
    reloadGandalf: function(){
        if(this.gandalf != null){
            this.gandalf.kill();
        }        
        
        xInitialGandalf = game.width / 2;
        yInitialGandalf = game.height + 100;

        this.gandalf = game.add.sprite(xInitialGandalf, yInitialGandalf, 'gandalf');
        game.physics.enable(this.gandalf, Phaser.Physics.ARCADE);
        this.gandalf.anchor.setTo(0.5, 0.5);
        this.gandalf.body.bounce.x = 1;
        this.gandalf.body.collideWorldBounds = true;

        this.gandalf.x = xInitialGandalf;
        this.gandalf.y = yInitialGandalf;

        this.gandalf.animations.add('run');
        this.gandalf.animations.play('run', 3, true);

        currentSquare = 0;
        maxSquareArrived = 0;

        this.gandalf.revive();
    },
    gameOver: function(){
        stateGame = STATE_GAME_GAMEOVER;  
        this.restartGame();
        this.showWelcomeText("YOU LOSE...");
        this.loseMusic.play();
    },
    gameWin: function(){
        stateGame = STATE_GAME_WIN;      
        this.restartGame();        
        this.showWelcomeText("YOU WIN!");        
        this.winMusic.play();
    },
    restartGame: function(){
        currentLevel = 0;
        this.stopMusics();

        this.clearMemes();
        this.setupMemes();

        this.clearTrolleys();
        this.setupTrolleys();

        this.reloadGandalf();
    },
    stopMusics: function(){
        this.gameMusic.stop();
        this.winMusic.stop();
        this.loseMusic.stop();
    },
    showWelcomeText: function(text){
        this.buttonPlay = game.add.button(game.width/2, game.height/2, "buttonPlay", this.startGame, this, 1, 0, 1, 0);
        this.buttonPlay.anchor.setTo(0.5);
        
        this.welcomeText = game.add.text(10, -50, text, boldStyle);

        var welcomeTween = game.add.tween(this.welcomeText);
        welcomeTween.to({y: 80}, 700).easing(Phaser.Easing.Bounce.Out);
        welcomeTween.start();
    },
    pad: function(number, length) {
        var str = '' + number;
        while (str.length < length) {
          str = '0' + str;
        }
        return str;
    },
    update: function(){

        this.checkMemes();
        this.checkTrolleys();     

        switch(stateGame){
            case STATE_GAME_NONE:
                break;
            case STATE_GAME_LOADING:
                break;
            case STATE_GAME_PLAYING:           
                
                isSurfing = false;

                game.physics.arcade.overlap(this.gandalf, this.memes, this.gandalfDie, null, this);
                game.physics.arcade.overlap(this.gandalf, this.trolleys, this.gandalfSurfing, null, this);
                
        
                if(!isSurfing){
                    for(var i = ROW_TROLLEY_MIN-1; i < ROW_TROLLEY_MAX-1; i++){
                        if(currentSquare == i){
                            this.gandalfBurn();
                        }
                    }
                }

                if (this.cursors.left.isDown && !leftPressed) {
                    leftPressed = true;
                    if(this.gandalf.x > LEFT_BOUND){
                        this.gandalf.x -= STEP;
                    }
                }
            
                if (this.cursors.right.isDown && !rightPressed) {
                    rightPressed = true;
                    if(this.gandalf.x < RIGHT_BOUND){
                        this.gandalf.x += STEP;
                    }
                }
                
                if (this.cursors.up.isDown && !upPressed){
                    this.stepForward();
                    upPressed = true;
                    this.gandalf.y -= STEP;
                } 
            
                if (this.cursors.down.isDown && !downPressed) {
                    this.stepBack();
                    downPressed = true;
                    this.gandalf.y += STEP;
                }
            
                if(!this.cursors.left.isDown) {
                    leftPressed = false;
                }
            
                if(!this.cursors.right.isDown) {
                    rightPressed = false;
                }
            
                if(!this.cursors.up.isDown) {
                    upPressed = false;
                }
                
                if(!this.cursors.down.isDown) {
                    downPressed = false;
                }
                
                this.refreshBar();
                
                break;
            case STATE_GAME_GAMEOVER:
            
                break;
            case STATE_GAME_WIN:

                break; 
        }
    }

}

var game = new Phaser.Game(700, 760, Phaser.AUTO, 'game');

game.state.add('gameplay', GamePlayManager);

game.state.start('gameplay');