// import { Bullet } from './bullet.js'
// Linted with standardJS - https://standardjs.com/

// var Bullet = new Phaser.Class({

//     Extends: Phaser.GameObjects.Image,

//     initialize:

//     // Bullet Constructor
//         function Bullet(scene) {
//         Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
//         this.speed = 1;
//         this.born = 0;
//         this.direction = 0;
//         this.xSpeed = 0;
//         this.ySpeed = 0;
//         this.setSize(12, 12, true);
//     },

//     // Fires a bullet from the player to the reticle
//     fire: function(shooter, target) {
//         this.setPosition(shooter.x, shooter.y); // Initial position
//         this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

//         // Calculate X and y velocity of bullet to moves it from shooter to target
//         if (target.y >= this.y) {
//             this.xSpeed = this.speed * Math.sin(this.direction);
//             this.ySpeed = this.speed * Math.cos(this.direction);
//         } else {
//             this.xSpeed = -this.speed * Math.sin(this.direction);
//             this.ySpeed = -this.speed * Math.cos(this.direction);
//         }

//         this.rotation = shooter.rotation; // angle bullet with shooters rotation
//         this.born = 0; // Time since new bullet spawned
//     },

//     // Updates the position of the bullet each cycle
//     update: function(time, delta) {
//         this.x += this.xSpeed * delta;
//         this.y += this.ySpeed * delta;
//         this.born += delta;
//         if (this.born > 1800) {
//             this.setActive(false);
//             this.setVisible(false);
//         }
//     }

// });


// Initialize the Phaser Game object and set default game window size
const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
})


// Declare shared variables at the top so all methods can access them
let score = 0
let scoreText
let platforms
let diamonds
let cursors
let player
let hazard
var plat_x
var plat_y
var enemy1
var tween1
var brick
var text;
var timedEvent;
var sky
var json_parsed
var goomba
var walking_goomba
var state = 3

function preload() {
    // Load & Define our game assets
    game.load.image('sky', './assets/sky.png')
    game.load.image('ground', './assets/platform.png')
    game.load.image('diamond', './assets/diamond.png')
    game.load.spritesheet('woof', './assets/Main Sprite.png', 32, 32)
    game.load.spritesheet('new_state', './assets/woof.png', 32, 32)
    game.load.spritesheet('goomba', './assets/mimic.png', 32, 32)
    game.load.audio("mario_die", './assets/smb_mariodie.wav')
    game.load.spritesheet("spike", "./assets/spike.png", 32, 32)
    game.load.spritesheet("brick", "./assets/brick.png", 32, 32)
        //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    game.load.text("Json_test", "./data/test.json")
        //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    game.load.audio('coin_sound', './assets/smb_coin.wav')
    game.load.audio('brick_sound', './assets/smb_breakblock.wav')

    game.load.spritesheet('blue_goomba', './assets/bluegoomba.png', 32, 32)
}

function create() {
    //!
    json_parsed = JSON.parse(game.cache.getText("Json_test"))
    console.log("Json file: ", json_parsed)
        //!

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE)



    //~~~~~ Tiling the background ~~~~~
    sky = game.add.tileSprite(0, 0, 800, 600, 'sky')
    sky.fixedToCamera = true
    sky.tilePosition.x = game.camera.x * -0.2
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group()

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true

    // Here we create the ground.
    const ground = platforms.create(0, game.world.height - 32, 'ground')

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(20, 2)

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true

    //  Now let's create two ledges

    //! ~~~~~ Parsing a json file and creating platforms ~~~~~
    var platform_locations = json_parsed.Platforms
    console.log("Platforms: ", platform_locations)
    var ledge
    for (var i = 0; i < platform_locations.length; i++) {
        plat_x = platform_locations[i].x
        plat_y = platform_locations[i].y

        console.log("Creating platform at: ", plat_x, plat_y)
        ledge = platforms.create(plat_x, plat_y, 'ground')
        ledge.body.immovable = true
    }
    //! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'new_state')

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0
    player.body.gravity.y = 990
    player.body.collideWorldBounds = true

    //  Our two animations, walking left and right.
    player.animations.add('left', [0], 10, true)
    player.animations.add('right', [1], 10, true)

    //  Finally some diamonds to collect
    diamonds = game.add.group()

    //  Enable physics for any object that is created in this group
    diamonds.enableBody = true

    //! ~~~~~ CHANGE TO PARSE FROM JSON FILE ~~~~~
    var diamound_location = json_parsed.Diamounds
    for (var i = 0; i < diamound_location.length; i++) {
        var diamound_x = diamound_location[i].x
        var diamound_y = diamound_location[i].y

        const diamond = diamonds.create(diamound_x, diamound_y, 'diamond')

        //  Drop em from the sky and bounce a bit
        diamond.body.gravity.y = 1000
        diamond.body.bounce.y = 0.3 + Math.random() * 0.2
    }
    //! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    //  Create the score text
    scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })

    //  And bootstrap our controls
    cursors = game.input.keyboard.createCursorKeys()

    scoreText.text = 'Score: 0';


    //~~~~~ Demo of timer ~~~~~
    //Creating a timer...
    // 2:30 in seconds
    this.timeLimit = 30;
    this.timeText = game.add.text(15, 50, "00:00");
    this.timeText.fill = "#000000";
    this.timer = game.time.events.loop(1000, tick, this);
    //Start the timer once everyting is loaded...
    //~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Demo of moving enemy ~~~~~
    hazard = game.add.group()
    hazard.enableBody = true

    const spike = hazard.create(525, 420, 'spike')
    spike.body.gravity = 1000
    spike.body.immovable = true

    enemy1 = hazard.create(100, 300, 'goomba')
    enemy1.animations.add('fly', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6, true)
    enemy1.animations.play('fly')

    tween1 = game.add.tween(enemy1)
    tween1.loop = -1
    tween1.to({ x: 350, y: 300 }, 2000, null, true, 0, 100000, true)

    console.log("Game object: ", this);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Demo of birck ~~~~~
    brick = game.add.group()
    brick.enableBody = true

    const block = brick.create(50, game.world.height - 150, 'brick')
    block.body.immovable = true

    game.world.setBounds(0, 0, 8000, 600)
    game.camera.follow(player);
    //~~~~~~~~~~~~~~~~~~~~~~~~~

    //! ~~~~~ Moving goomba w/ animations ~~~~~
    goomba = hazard.create(1000, 368, 'blue_goomba')
    goomba.animations.add('walk', [2, 1, 2, 0], 4, true)
    goomba.animations.play('walk')
    goomba.enableBody = true
    goomba.body.gravity.y = 1000

    walking_goomba = game.add.tween(goomba)
    walking_goomba.loop = -1
    walking_goomba.to({ x: 1250, y: 368 }, 2000, null, true, 0, 1000000, true)
        //! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

function update() {
    //  We want the player to stop when not moving
    player.body.velocity.x = 0

    //  Setup collisions for the player, diamonds, and our platforms
    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(diamonds, platforms)
    game.physics.arcade.collide(hazard, platforms)
    game.physics.arcade.collide(player, hazard, kill_mario, null, this)
    game.physics.arcade.collide(player, brick, brick_break, null, this)

    //  Call callectionDiamond() if player overlaps with a diamond
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)

    // Configure the controls!
    if (cursors.left.isDown) {
        player.body.velocity.x = -300
        player.animations.play('left')
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 300
        player.animations.play('right')
    } else {
        // If no movement keys are pressed, stop the player
        player.animations.stop()
    }

    //! ~~~~~ Double jump demo ~~~~~
    const jump_pressed = game.input.keyboard.justPressed(cursors.up)
    var jump = 0
    var duration = cursors.up.duration
        //console.log("Jump pressed: ", jump_pressed)
    if (cursors.up.isDown && player.body.touching.down) {

        player.body.velocity.y = -500

    }
    //! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Show an alert modal when score reaches 120
    if (score === 120) {
        alert('You win!')
        score = 0
    }
}

function render() {
    this.game.debug.text(`Debugging Phaser ${Phaser.VERSION}`, 200, 20, 'yellow', 'Segoe UI');
    this.game.debug.cameraInfo(this.game.camera, 200, 32);
    this.game.debug.spriteInfo(player, 500, 32);
}

function collectDiamond(player, diamond) {

    console.log("Collect diamound ", player, diamond)
    var coin_sound = game.add.audio('coin_sound')
    coin_sound.play()
        // Removes the diamond from the screen
    diamond.kill()


    //  And update the score
    score += 10
    scoreText.text = 'Score: ' + score
}

var tick = function() {
    console.log("Tick: ", this)
    this.timeLimit--;
    var minutes = Math.floor(this.timeLimit / 60);
    var seconds = this.timeLimit - (minutes * 60);
    var timeString = addZeros(minutes) + ":" + addZeros(seconds);
    this.timeText.text = timeString;
    if (this.timeLimit === 0) {
        outofTime();
    }
};

var addZeros = function(num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
};

var outofTime = function() {
    var die_noise = game.add.audio("mario_die");
    die_noise.play();
    alert("Out of Time!");
    location.reload();
}

function kill_mario(player, enemy) {
    if (state >= 2) {
        player.position.x = player.position.x - 25
        state--
        player.loadTexture('woof')
        console.log("state: ", state)
        return
    } else {
        game.input.keyboard.disabled = true;
        //player.animation.play('DIE')
        player.kill();

        var die_noise = game.add.audio("mario_die");
        die_noise.play();

        alert("Game over");

        location.reload();
    }
}

function brick_break(player, block) {
    //Only break the brick when the player is below 
    //and not hittin gon the sides
    console.log('Player (x,y):', "(", player.position.x, player.position.y, ")")
    console.log('Block (x,y):', "(", block.position.x, block.position.y, ")")

    var player_x = player.position.x
    var player_y = player.position.y

    var block_x = block.position.x
    var block_y = block.position.y

    if (player_y < block_y) {
        return
    } else if (player_x > block_x + 16) {
        return
    } else if (player_x < block_x - 16) {
        return
    } else {

        block.kill()
        var break_sound = game.add.audio('brick_sound')
        break_sound.play()
    }

}