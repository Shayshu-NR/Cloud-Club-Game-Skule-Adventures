// Linted with standardJS - https://standardjs.com/

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
let enemy
var text;
var qBlock
var timedEvent;
var hazard;
var powerUp
var state = 3
var lives = 3
var timing
var powerUpHierarchy = { 'fireflower': 3, 'mushroom': 2, 'small': 1 }

function preload() {
    // Load & Define our game assets
    game.load.text("emily_test", "./JSON Files/emily_test.json")
    game.load.image('sky', './assets/sky.png')
    game.load.image('ground', './assets/platform.png')
    game.load.image('diamond', './assets/diamond.png')
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
    game.load.spritesheet('player', './assets/Main Sprite.png', 32, 32)
    game.load.spritesheet('big_player', './assets/BigMain_Sprite.png', 32, 64)
    game.load.spritesheet('big_purple_player', './assets/Big_Main_SpritePowerup.png', 32, 64)
}

function create() {
    lastHit = 520

    json_parsed = JSON.parse(game.cache.getText('emily_test'))
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
    const ground = platforms.create(0, game.world.height - 64, 'ground')

    let ledge = platforms.create(400, 450, 'ground')
    ledge.body.immovable = true

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(5, 2)

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'player')
    player.lives = 3
    player.state = 3

    //  We need to enable physics on the player
    game.physics.arcade.enable(player)

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2
    player.body.gravity.y = 980
    player.body.collideWorldBounds = true
    player.currentState = 'small'

    //  Our two animations, walking left and right.
    player.animations.add('left', [10, 9, 8, 10, 7, 6, 10], 10, true)
    player.animations.add('left_blink', [10, 20, 9, 20, 8, 20, 10, 20, 7, 20, 6, 20, 10, 20], 10, true)
    player.animations.add('right_blink', [0, 20, 1, 20, 2, 20, 0, 20, 3, 20, 4, 20, 0, 20], 10, true)
    player.animations.add('right', [0, 1, 2, 0, 3, 4, 0], 10, true)
    player.animations.add('stop', [5], 10, true)
    player.animations.add('stop_blink', [20, 5, 20], 10, true)

    //  Finally some diamonds to collect
    diamonds = game.add.group()

    //  Enable physics for any object that is created in this group
    diamonds.enableBody = true
        //Adding an enemey to the level
    enemy = game.add.group();

    enemy.enableBody = true;

    //  Create the score text
    scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })

    //  And bootstrap our controls
    cursors = game.input.keyboard.createCursorKeys({
        up: 'up',
        down: 'down',
        left: 'left',
        right: 'right',
        space: 'spacebar'

    })

    scoreText.text = 'Score: 0';

    //~~~~~ Demo of timer ~~~~~
    //Creating a timer...
    // 2:30 in seconds
    this.timeLimit = 500;
    this.timeText = game.add.text(700, 20, "00:00");
    this.timeText.fill = "#000000";
    this.timer = game.time.events.loop(1000, tick, this);

    //~~~~~ Brick ~~~~~
    brick = game.add.group()
    brick.enableBody = true

    var brick_location = json_parsed.Bricks
    for (var i = 0; i < brick_location.length; i++) {
        var brick_x = brick_location[i].x
        var brick_y = brick_location[i].y
        var brick_counter = brick_location[i].counter

        const block = brick.create(brick_x, brick_y, 'brick')
        block.body.immovable = true
        block.counter = brick_counter
    }
    //~~~~~~~~~~~~~~~~~

    //~~~~~ Power Up ~~~~~
    powerUp = game.add.group()
    powerUp.enableBody = true
        //~~~~~~~~~~~~~~~~~~~~

    //~~~~~~ question block ~~~~~
    qBlock = game.add.group()
    qBlock.enableBody = true

    var qBlock_location = json_parsed.QBlocks
    for (var i = 0; i < qBlock_location.length; i++) {
        var qBlock_x = qBlock_location[i].x
        var qBlock_y = qBlock_location[i].y
        var power_Up = qBlock_location[i].powerUp

        const question_block = qBlock.create(qBlock_x, qBlock_y, 'qBlock')
        question_block.powerUp = power_Up
        question_block.broken = false
        question_block.body.immovable = true
        console.log(question_block)
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~

    hazard = game.add.group()
    hazard.enableBody = true

    //~~~~~~~~~~~astronaut~~~~~~~~~~~~~~~
    astronaut = enemy.create(400, 418, 'astronaut')
    astronaut.animations.add('walk', [2, 0, 3, 0], 4, true)
    astronaut.animations.play('walk')

    walking_astronaut = game.add.tween(astronaut)
    walking_astronaut.loop = -1
    walking_astronaut.to({ x: 700, y: 418 }, 10000, null, true, 0, 100000000, true)

    //~~~~~ World and camera settings ~~~~~
    game.world.setBounds(0, 0, 8000, 600)
    game.camera.follow(player);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

function update() {
    //  We want the player to stop when not moving
    player.body.velocity.x = 0

    timing = Math.floor(this.timeLimit)
    if ((lastHit - timing) > 2) {
        player.isInvincible = false
    }

    //  Setup collisions for the player, diamonds, and our platforms
    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(diamonds, platforms)
    game.physics.arcade.collide(enemy, platforms)
    game.physics.arcade.collide(player, qBlock, question_break, null, this)
    game.physics.arcade.collide(player, brick, brick_break, null, this)
    game.physics.arcade.collide(diamonds, qBlock)
    game.physics.arcade.collide(powerUp, qBlock)
    game.physics.arcade.collide(player, powerUp, powerUp_ingest, null, this)
    game.physics.arcade.collide(hazard, platforms)
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)

    if (!player.isInvincible)
        game.physics.arcade.overlap(player, enemy, kill_mario, null, this);

    //does the mario coin brick interaction where the diamond gets killed and added to score board
    //issue - we can't have diamonds prespawned on bricks
    game.physics.arcade.collide(brick, diamonds, collectBDiamond, null, this)

    //  Call callectionDiamond() if player overlaps with a diamond
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)


    // Configure the controls!
    if (cursors.left.isDown) {
        player.body.velocity.x = -300
        if (player.isInvincible) {
            player.animations.play('left_blink')
        } else {
            player.animations.play('left')
        }
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 300
        if (player.isInvincible) {
            player.animations.play('right_blink')
        } else {
            player.animations.play('right')
        }
    } else {
        // If no movement keys are pressed, stop the player

        if (player.isInvincible) {
            player.animations.play('stop_blink')
        } else {
            player.animations.play('stop')
        }
    }

    //  This allows the player to jump!
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -500
    }


    if (player.position.y >= 568) {
        falloutofworld(player)
    }

    this.timeText.x = 700 + this.camera.view.x
    scoreText.x = 16 + this.camera.view.x

}

function render() {
    this.game.debug.text(`Debugging Phaser ${Phaser.VERSION}`, 200, 20, 'yellow', 'Segoe UI');
    this.game.debug.cameraInfo(this.game.camera, 200, 32);
    this.game.debug.spriteInfo(player, 500, 32);
}

function collectDiamond(player, diamond) {
    console.log("Unique ID for diamound: ", diamond.unique)
        // Removes the diamond from the screen
    diamond.kill()

    //  And update the score
    score += 10
    scoreText.text = 'Score: ' + score
}

function collectBDiamond(brick, diamond) {
    // Removes the diamond from the screen for the brick and diamond interaction
    diamond.kill()

    //  And update the score
    score += 10
    scoreText.text = 'Score: ' + score
}

function kill_mario(player, hazard) {
    //this checks whether mario has a power up or not.
    if (state >= 2) {

        state--
        //player.position.x = player.position.x - 15;
        console.log("State:" + state)
            //player.loadTexture('woof')

        lastHit = timing
        console.log(lastHit)

        console.log(hazard.position.x, player.position.x)
            //console.log(lastHit - timer)

        player.isInvincible = true
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
    }
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

function falloutofworld(player) {
    player.kill();
    var die_noise = game.add.audio("mario_die");
    die_noise.play();
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
    } else if (block.counter > 0) {
        block.counter--
            var break_sound = game.add.audio('brick_sound')
        break_sound.play()
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
        //how do i check if the block's texture is iron
        //} else if (block == 'iron'){
        //return
    } else if (!block.broken) {
        console.log(block)
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
    } else {
        return
    }

}

function falloutofworld(player) {
    player.kill();
    var die_noise = game.add.audio("mario_die");
    die_noise.play();
    alert("Game over");
    location.reload();
}

function powerUp_ingest(player, powerUp) {
    console.log(player)
    player.body.height = 64

    if (powerUpHierarchy[player.currentState] < powerUpHierarchy[powerUp.power_type]) {
        player.currentState = powerUp.power_type

        if (powerUp.power_type == 'fireflower') {
            player.loadTexture('big_purple_player')
        } else if (powerUp.power_type == 'mushroom') {
            player.loadTexture('big_player')
        }
    }
    powerUp.kill()

}