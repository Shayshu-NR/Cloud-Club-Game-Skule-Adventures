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
let platforms
let diamonds
let cursors
let player
var text;
var timedEvent;
var qBlock
var powerUp;

function preload() {
    // Load & Define our game assets
    game.load.image('sky', './assets/sky.png')
    game.load.image('ground', './assets/platform.png')
    game.load.image('diamond', './assets/diamond.png')
    game.load.spritesheet('woof', './assets/woof.png', 32, 32)
    game.load.image('steve', './assets/steve.png')
    game.load.audio("mario_die", './assets/smb_mariodie.wav')
    game.load.image('brick', './assets/brick.png')
    game.load.image('qBlock', './assets/question-block.png')
    game.load.image('iron', './assets/iron-block.png')
    game.load.image('fireflower', './assets/fireflower.png')
    game.load.spritesheet('goomba', './assets/bluegoomba.png', 32, 32)
    game.load.spritesheet('astronaut', './assets/frosh_astronaut.png', 32, 32)
    game.load.image('hammer_powerUp', './assets/32x32_hammer.png')
    game.load.image('mushroom', './assets/temp_mushroom.png')
}

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE)

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky')

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group()

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true

    // Here we create the ground.
    const ground = platforms.create(0, game.world.height - 64, 'ground')

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2)

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
    for (var i = 0; i < 12; i++) {
        const diamond = diamonds.create(i * 70, 0, 'diamond')

        //  Drop em from the sky and bounce a bit
        diamond.body.gravity.y = 1000
        diamond.body.bounce.y = 0.3 + Math.random() * 0.2
    }

    //Adding an enemey to the level
    enemy = game.add.group();

    enemy.enableBody = true;

    const steve = enemy.create(350, 350, 'steve');


    //  Create the score text
    scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })

    //  And bootstrap our controls
    cursors = game.input.keyboard.createCursorKeys()

    scoreText.text = 'Score: 0';


    //~~~~~ Demo of timer ~~~~~
    //Creating a timer...
    // 2:30 in seconds
    this.timeLimit = 30;
    this.timeText = game.add.text(700, 20, "00:00");
    this.timeText.fill = "#000000";
    this.timer = game.time.events.loop(1000, tick, this);

    console.log(this)
        //Start the timer once everyting is loaded...
        //~~~~~~~~~~~~~~~~~~~~~~~~~


    //~~~~~ Demo of birck ~~~~~
    brick = game.add.group()
    brick.enableBody = true

    const block = brick.create(50, game.world.height - 150, 'brick')
    block.body.immovable = true
    block.counter = 5;

    game.world.setBounds(0, 0, 8000, 600)
    game.camera.follow(player);
    //~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~~ question block ~~~~~
    qBlock = game.add.group()
    qBlock.enableBody = true

    const questionBlock = qBlock.create(100, game.world.height - 150, 'qBlock')
    questionBlock.body.immovable = true
    questionBlock.powerUp = 'mushroom'
    questionBlock.broken = false
        //~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ power ups ~~~~~
    powerUp = game.add.group()
    powerUp.enableBody = true
}

function update() {
    //  We want the player to stop when not moving
    player.body.velocity.x = 0

    //  Setup collisions for the player, diamonds, and our platforms
    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(diamonds, platforms)
    game.physics.arcade.collide(enemy, platforms)
    game.physics.arcade.collide(player, brick, brick_break, null, this)
    game.physics.arcade.collide(player, qBlock, question_break, null, this)
    game.physics.arcade.collide(powerUp, qBlock)
    game.physics.arcade.collide(diamonds, qBlock)

    //does the mario coin brick interaction where the diamond gets killed and added to score board
    //issue - we can't have diamonds prespawned on bricks
    game.physics.arcade.collide(brick, diamonds, collectBDiamond, null, this)

    //  Call callectionDiamond() if player overlaps with a diamond
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)

    //
    game.physics.arcade.overlap(player, enemy, kill_mario, null, this);

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

function collectBDiamond(brick, diamond){
    // Removes the diamond from the screen for the brick and diamond interaction
    diamond.kill()

    //  And update the score
    score += 10
    scoreText.text = 'Score: ' + score
}

function kill_mario(player, enemy) {
    enemy.kill();
    player.kill();

    var die_noise = game.add.audio("mario_die");
    die_noise.play();

    alert("Game over");

    location.reload();
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
    } else if (block.counter > 0){
        block.counter--
        var break_sound = game.add.audio('brick_sound')
        break_sound.play()
            //get coin to pop up from the top
            //does the coin jump up a lil before going down(?)
            //coin object probaby same logic as diamond
        const dia = diamonds.create(block_x, block_y - 50, 'diamond')
        dia.body.gravity.y = 1000
        dia.body.velocity.y = -100
        dia.body.bounce.y = 1
    } else {
        block.kill()
    }

}

function question_break(player, block) {
    //Only break the question mark block when the player is below 
    //and not hittin on the sides

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
    } else if (!block.broken){

        block.loadTexture('iron')
            //~~~~~ replace w/ question mark audio sound
        var break_sound = game.add.audio('brick_sound')
            //is that the same sound as the brick or nah
        break_sound.play()
            //get powerup to slide up from question mark brick
        const new_powerUp = powerUp.create(block_x, block_y - 32, block.powerUp)
        new_powerUp.power_type = block.powerUp
        new_powerUp.body.gravity.y = 0.98
        new_powerUp.body.bounce.y = 0.3 + Math.random() * 0.2
        block.broken = true

        // const diamond = diamonds.create(block_x, block_y - 32, 'diamond')
        // diamond.body.gravity.y = 1000
        // diamond.body.bounce.y = 0.3 + Math.random() * 0.2

    } else {
        return
    }

}