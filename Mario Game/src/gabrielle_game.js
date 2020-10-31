// Linted with standardJS - https://standardjs.com/

// Initialize the Phaser Game object and set default game window size
const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
})

// Declare shared variables at the top so all methods can access them
let score = 0
let scoreText
let powerText
let platforms
let diamonds
let cursors
let player
var text;
var timedEvent;
var sky
var json_parsed
var state = 3
var lives = 3

function preload() {
    // Load & Define our game assets
    game.load.image('sky', './assets/sky.png')
    game.load.image('ground', './assets/platform.png')
    game.load.image('diamond', './assets/diamond.png')
    game.load.spritesheet('woof', './assets/Main Sprite.png', 32, 32)
    game.load.spritesheet('woof2', './assets/Cloud Character.png', 32, 32)
    game.load.spritesheet('goomba', './assets/mimic.png', 32, 32)
    game.load.audio("mario_die", './assets/smb_mariodie.wav')
    game.load.spritesheet("spike", "./assets/spike.png", 32, 32)
    game.load.spritesheet("brick", "./assets/brick.png", 32, 32)
    game.load.text("test", "./JSON Files/gabrielle_test.json")
}

function create() {
    json_parsed = JSON.parse(game.cache.getText("test"))
        //console.log(json_parsed)


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
    let ledge = platforms.create(400, 450, 'ground')
    ledge.body.immovable = true


    ledge = platforms.create(-75, 350, 'ground')
    ledge.body.immovable = true

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'woof')

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2
    player.body.gravity.y = 980
    player.body.collideWorldBounds = true

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1], 10, true)
    player.animations.add('right', [2, 3], 10, true)

    //  Finally some diamonds to collect
    diamonds = game.add.group()

    //  Enable physics for any object that is created in this group
    diamonds.enableBody = true

    //  Create 12 diamonds evenly spaced apart
    var DIamonds = json_parsed.Diamonds
    for (var i = 0; i < DIamonds.length; i++) {
        diamond = diamonds.create(DIamonds[i].y, 0, 'diamond')

        //  Drop em from the sky and bounce a bit
        diamond.body.gravity.y = 1000
        diamond.body.bounce.y = 0.3 + Math.random() * 0.2
    }

    //  Create the score text
    //scoreText.destroy();
    //scoreText.fixedToCamera = true;
    //scoreText = game.add.text(player.x, 16, "SCORE: 0", {fontSize: '56px', color: '#fff'})
    scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })
    power = game.add.text(16, 80, '', { fontSize: '32px', fill: '#000' })
        //  And bootstrap our controls
    cursors = game.input.keyboard.createCursorKeys()
        //power.text = 3
    scoreText.text = 'Score: 0';


    //~~~~~ Demo of timer ~~~~~
    //Creating a timer...
    // 2:30 in seconds
    this.timeLimit = 60;
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
    tween1.to({ x: 350, y: 300 }, 2000, null, true, 0, loop = 100, true)

    //console.log(this);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Demo of birck ~~~~~
    brick = game.add.group()
    brick.enableBody = true

    var brick_location = json_parsed.Bricks
    for (var j = 0; j < brick_location.length; j++) {
        const block = brick.create(brick_location[j].x, brick_location[j].y, 'brick')
        block.body.immovable = true
    }



    game.world.setBounds(0, 0, 8000, 600)
    game.camera.follow(player);
    keySpace = this.input.keyboard.addKey(Phaser.Keyboard.KeyCodes.SPACE)

    //~~~~~~~~~~~~~~~~~~~~~~~~~
}


function update() {
    //  We want the player to stop when not moving
    player.body.velocity.x = 0
    power.text = "Lives:" + lives;
    //scoreText.setViisibility = false
    //scoreText = this.add.text(player.x, 16, "SCORE: 0", {fontSize: '56px', color: '#fff'})

    //  Setup collisions for the player, diamonds, and our platforms
    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(diamonds, platforms)
    game.physics.arcade.collide(hazard, platforms, kill_mario, null, this)
    game.physics.arcade.collide(player, hazard, kill_mario, null, this)
    game.physics.arcade.collide(player, brick, brick_break, null, this)

    //  Call callectionDiamond() if player overlaps with a diamond
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)

    // Configure the controls!
    if (cursors.left.isDown) {
        player.body.velocity.x = -300
        player.animations.play('right')
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 300
        player.animations.play('left')
    } else {
        // If no movement keys are pressed, stop the player
        player.animations.stop()
    }

    //  This allows the player to jump!
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -500
    }
    // Show an alert modal when score reaches 120
    if (score === 120) {
        alert('You win!')
        score = 0
    }
}

function collectDiamond(player, diamond) {
    // Removes the diamond from the screen
    diamond.kill()

    //  And update the score
    score += 10
    scoreText.text = 'Score: ' + score
}

var tick = function() {
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
    //this checks whether mario has a power up or not.
    if (state >= 2) {
        state--
        player.position.x = player.position.x - 15;
        console.log(state)
        player.loadTexture('woof')
    } else {
        //life is lost
        lives--
        if (lives == 0) {
            //needs to be across the screen in big red letters
            alert("All lives lost! Game over");
            this.input.keyboard.enabled = false
        }
        player.kill();

        var die_noise = game.add.audio("mario_die");
        //die_noise.play();
        location.reload();
        create()
        state = 1
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

    if (player_y < block_y || player_x > block_x + 16 || player_x < block_x - 16) {
        return
    } else {
        //For player state upgrades~~~
        if (state < 3) {
            state++;
        }
        player.loadTexture('woof2')
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        block.kill()
    }


}