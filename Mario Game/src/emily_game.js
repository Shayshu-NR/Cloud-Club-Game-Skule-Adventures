// Initialize the Phaser Game object and set default game window size
const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
})

// Declare shared variables at the top so all methods can access them
var score = 0
var coins = 0
var coinsText
var progressBar
var scoreText
var livesText
var platforms
var diamonds
var cursors
var player
var enemy
var text;
var qBlock
var timedEvent;
var hazard;
var powerUp
var state = 3
var lives = 3
var timing
var powerUpHierarchy = { 'fireflower': 4, 'hammer_powerUp': 3, 'mushroom': 2, 'small': 1 }
var fireballs;
var hammer;
var hammer_instance = 0;
var playerPowerUp;
var keyReset = false
var lastHit = 520
var progress
var totalDistance = 800
var enemyPoints = 100

function preload() {
    //~~~~~ Json file ~~~~~
    game.load.text("emily_test", "./JSON Files/emily_test.json")
        //~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Background ~~~~~
    game.load.image('sky', './assets/sky.png')
    game.load.image('coin', './assets/SF Pit/coin.png')
    game.load.image('playerFace', './assets/Main Sprite.png')
    game.load.image('hourglass','./assets/hourglass.png')
        //~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Neutral blocks ~~~~~
    game.load.image('ground', './assets/platform.png')
    game.load.image('brick', './assets/brick.png')
    game.load.spritesheet('qBlock', './assets/Question_block.png', 32, 32)
    game.load.image('iron', './assets/iron-block.png')
        //~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Enemies ~~~~~
    game.load.image('steve', './assets/steve.png')
    game.load.spritesheet('goomba', './assets/bluegoomba.png', 32, 32)
    game.load.spritesheet('astronaut', './assets/frosh_astronaut.png', 32, 32)
        //~~~~~~~~~~~~~~~~~~~

    //~~~~~ Power ups ~~~~~
    game.load.image('fireflower', './assets/fireflower.png')
    game.load.image('hammer_powerUp', './assets/32x32_hammer.png')
    game.load.image('mushroom', './assets/temp_mushroom.png')
    game.load.image('fireball', './assets/5d08f167c3a6a5d.png')
    game.load.image('coffee', './asssets/powerups/coffee_1.png')
        //~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Player model ~~~~~
    game.load.image('diamond', './assets/diamond.png')
    game.load.spritesheet('player', './assets/Main Sprite.png', 32, 32)
    game.load.spritesheet('big_purple_player', './assets/Big_Main_SpritePowerup.png', 32, 64)
    game.load.spritesheet('big_player', './assets/BigMain_Sprite.png', 32, 64)
        //~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Sound ~~~~~
    game.load.audio("mario_die", './assets/smb_mariodie.wav')
        //~~~~~~~~~~~~~~~~~
}

function create() {
    //~~~~~ Loading json file ~~~~~
    json_parsed = JSON.parse(game.cache.getText('emily_test'))
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Physics engine ~~~~~
    game.physics.startSystem(Phaser.Physics.ARCADE)
        //~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Background ~~~~~
    sky = game.add.tileSprite(0, 0, 800, 600, 'sky')
    sky.fixedToCamera = true
    sky.tilePosition.x = game.camera.x * -0.2
    
    //totalDistance =
        //~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Groups ~~~~~
    platforms = game.add.group()
    brick = game.add.group()
    qBlock = game.add.group()
    diamonds = game.add.group()
    powerUp = game.add.group()
    enemy = game.add.group()
    fireballs = game.add.group()
    hammer = game.add.group()
    hazard = game.add.group()
        //~~~~~~~~~~~~~~~~~~

    //~~~~~ Enable body ~~~~~
    platforms.enableBody = true
    brick.enableBody = true
    qBlock.enableBody = true
    diamonds.enableBody = true
    powerUp.enableBody = true
    enemy.enableBody = true
    fireballs.enableBody = true
    hammer.enableBody = true
    hazard.enableBody = true
        //~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Ground/ledge creation ~~~~~
    const ground = platforms.create(0, game.world.height - 64, 'ground')
    ground.scale.setTo(5, 2)
    ground.body.immovable = true

    let ledge = platforms.create(400, 450, 'ground')
    ledge.body.immovable = true
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Player attributes ~~~~~
    player = game.add.sprite(32, game.world.height - 150, 'player')
    game.physics.arcade.enable(player)
    player.lives = 3
    player.state = 3
    player.facing = 1;
    player.body.bounce.y = 0
    player.body.gravity.y = 980
    player.body.collideWorldBounds = true
    player.currentState = 'small'


    player.animations.add('left', [10, 9, 8, 10, 7, 6, 10], 10, true)
    player.animations.add('left_blink', [10, 20, 9, 20, 8, 20, 10, 20, 7, 20, 6, 20, 10, 20], 10, true)
    player.animations.add('right_blink', [0, 20, 1, 20, 2, 20, 0, 20, 3, 20, 4, 20, 0, 20], 10, true)
    player.animations.add('right', [0, 1, 2, 0, 3, 4, 0], 10, true)
    player.animations.add('stop', [5], 10, true)
    player.animations.add('stop_blink', [20, 5, 20], 10, true)
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Create the score text and timer ~~~~~
    scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })
    scoreText.text = 'Score: 0';
    scoreText.fixedToCamera = true

    livesText = game.add.text(50, 50, '', { fontSize: '32px', fill: '#000' })
    livesText.text = lives;
    livesText.fixedToCamera = true;
    progressBar = game.add.tileSprite(200, 10, 32, 32, 'playerFace')
    //progressBar.fixedToCamera = true;
    face = game.add.tileSprite(12, 50, 32, 32, 'playerFace')
    face.fixedToCamera = true;
    coin = game.add.tileSprite(12, 85, 32, 32, 'coin')
    coin.fixedToCamera = true;
    coinsText = game.add.text(50, 85, '', { fontSize: '32px', fill: '#000' })
    coinsText.text = coins;
    coinsText.fixedToCamera = true;
    hourglass = game.add.tileSprite(665,20,32,32,'hourglass')
    hourglass.fixedToCamera = true;
    this.timeLimit = 500
    this.timeText = game.add.text(700, 20, "00:00")
    this.timeText.fixedToCamera = true
    this.timeText.fill = "#000000"
    this.timer = game.time.events.loop(1000, tick, this)
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Cursors ~~~~~
    cursors = game.input.keyboard.createCursorKeys({
            up: 'up',
            down: 'down',
            left: 'left',
            right: 'right',
            space: 'spacebar'
        })
        //~~~~~~~~~~~~~~~~~~~

    //~~~~~ Brick and Qblock parsing from json file ~~~~~
    var brick_location = json_parsed.Bricks
    for (var i = 0; i < brick_location.length; i++) {
        var brick_x = brick_location[i].x
        var brick_y = brick_location[i].y
        var brick_counter = brick_location[i].counter

        const block = brick.create(brick_x, brick_y, 'brick')
        block.body.immovable = true
        block.counter = brick_counter
    }

    var qBlock_location = json_parsed.QBlocks
    for (var i = 0; i < qBlock_location.length; i++) {
        var qBlock_x = qBlock_location[i].x
        var qBlock_y = qBlock_location[i].y
        var power_Up = qBlock_location[i].powerUp

        const question_block = qBlock.create(qBlock_x, qBlock_y, 'qBlock')
        question_block.powerUp = power_Up
        question_block.broken = false
        question_block.body.immovable = true
        question_block.animations.add('q_break', [0, 1, 2, 3], 150, true)
        console.log(question_block)
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~~~~~~~ Enemy creation ~~~~~~~~~~~~~~~
    astronaut = enemy.create(400, 418, 'astronaut')
    astronaut.animations.add('walk', [2, 0, 3, 0], 4, true)
    astronaut.animations.play('walk')

    walking_astronaut = game.add.tween(astronaut)
    walking_astronaut.loop = -1
    walking_astronaut.to({ x: 700, y: 418 }, 10000, null, true, 0, 100000000, true)
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ World and camera settings ~~~~~
    game.world.setBounds(0, 0, 8000, 600)
    game.camera.follow(player)
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
    game.physics.arcade.collide(fireballs, enemy, function enemyKill(fireballs, enemy) {
        enemy.kill();
        score += enemyPoints;
        scoreText.text = 'Score: ' + score
        fireballs.kill();
    }, null, this)
    game.physics.arcade.collide(platforms, fireballs, fireballKill, null, this)
    game.physics.arcade.collide(hammer, enemy, function enemyKill(hammer, enemy) {
        enemy.kill();
        score += enemyPoints;
        scoreText.text = 'Score: ' + score
        hammer.body.velocity.x *= -1;
    }, null, this)
    game.physics.arcade.collide(platforms, hammer, function hammerReturn(platforms, hammer){
        hammer.kill();
        keyReset = false;
    }, null, this)
    game.physics.arcade.collide(hammer, player, hammerGrab, null, this)

    if (!player.isInvincible)
        game.physics.arcade.overlap(player, enemy, kill_mario, null, this);

    //does the mario coin brick interaction where the diamond gets killed and added to score board
    //issue - we can't have diamonds prespawned on bricks
    game.physics.arcade.collide(brick, diamonds, collectBDiamond, null, this)

    //  Call callectionDiamond() if player overlaps with a diamond
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)


    // Configure the controls!
    if (cursors.left.isDown) {
        player.facing = -1;
        player.body.velocity.x = -300
        if (player.isInvincible) {
            player.animations.play('left_blink')
        } else {
            player.animations.play('left')
        }
    } else if (cursors.right.isDown) {
        player.facing = 1;
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
    
    //Progress bar
    progress = player.body.position.x/totalDistance*100+200
    progressBar.x = progress+this.camera.view.x

    if (player.currentState == 'fireflower') {
        if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && !keyReset) {
            keyReset = true;
            Fireballs(fireballs, player);
            console.log("is down 1");
        }
        if (game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
            keyReset = false;
        }

    }

    if (player.currentState == 'hammer_powerUp') {
        if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && !keyReset) {
            keyReset = true;
            console.log("Make hammer")
            hammer_instance = hammerTime(hammer, player)
        }
    }

    if (hammer_instance != 0) {
        if (hammer_instance.limit > 0){
            if (hammer_instance.body.position.x >= hammer_instance.forward_limit) {
                hammer_instance.body.velocity.x *= -1
            } else if (hammer_instance.body.position.x < hammer_instance.backwards_limit) {
                console.log("Reached backwards limit")
                hammer_instance.kill()
                keyReset = false
                hammer_instance = 0
            }
        } else {
            if (hammer_instance.body.position.x <= hammer_instance.forward_limit) {
                hammer_instance.body.velocity.x *= -1
            } else if (hammer_instance.body.position.x > hammer_instance.backwards_limit) {
                console.log("Reached backwards limit")
                hammer_instance.kill()
                keyReset = false
                hammer_instance = 0
            }
        }
    }
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
    coins += 1
    coinsText.text = ''+coins
}

function collectBDiamond(brick, diamond) {
    // Removes the diamond from the screen for the brick and diamond interaction
    diamond.kill()

    //  And update the score
    score += 10
    scoreText.text = 'Score: ' + score
    coins += 1
    coinsText.text = ''+coins
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
    } else if (!block.broken) {
        console.log(block)
        block.animations.play('q_break', 60, false)
            // block.loadTexture('iron')
        var break_sound = game.add.audio('brick_sound')
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
        } else if (powerUp.power_type == 'hammer_powerUp') {
            player.loadTexture('big_player')
        } else if (powerUp.power_type == 'mushroom') {
            player.loadTexture('big_player')
        }
    }

    powerUp.kill()

}

//mario shooting fireballs function
function Fireballs(fireballs, player) {

    console.log(player.body.velocity)
    const f = fireballs.create(player.position.x, player.position.y, "fireball")
    f.body.gravity.y = 400;
    f.body.velocity.y = 0;
    f.bounce = 0;
    f.body.velocity.x = 400 * player.facing;

}

function fireballKill(platforms, fireballs) {
    fireballs.body.velocity.y = -100;
    fireballs.bounce++;
    if (fireballs.bounce == 5) {
        fireballs.kill();
    }

}

//player shooting hammer like a boomerang when space is pressed
//can only shoot 1 at a time
function hammerTime(hammer, player) {
    var player_x = player.position.x;
    var player_y = player.position.y;

    //depends on player size, if the player is big, we need the projectile to be slightly lower to hit the enemy
    const h = hammer.create(player_x, player_y + 16, 'hammer_powerUp')
    h.limit = 300 * player.facing;
    h.forward_limit = player_x + (300 * player.facing)
    h.backwards_limit = player_x
        //adding some spin

    h.return = false;
    //h.body.angularVelocity = 1000;
    h.body.velocity.y = 0;
    h.body.velocity.x = 200 * player.facing;
    return h;
}

function hammerGrab(player, hammer) {
    hammer.return = true;
    hammer.kill();
    keyReset = false;
}