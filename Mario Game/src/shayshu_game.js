// Initialize the Phaser Game object and set default game window size
const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
})

// Declare shared variables at the top so all methods can access them
var score = 0
var scoreText
var platforms
var diamonds
var cursors
var player
var enemy
var text;
var qBlock
var timedEvent
var hazard
var hammer
var powerUp
var state = 3
var lives = 3
var timing
var powerUpHierarchy = { 'fireflower': 4, 'hammer': 3, 'mushroom': 2, 'small': 1 }
var fireballs;
var playerPowerUp;
var keyReset = false
var lastHit = 520
var hammerReturn = false;

function preload() {
    //~~~~~ Json file ~~~~~
    game.load.text("shayshu_json", "./JSON Files/shayshu.json")
    //~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Background ~~~~~
    game.load.image('sky', './assets/sky.png')
    //~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Neutral blocks ~~~~~
    game.load.image('ground', './assets/platform.png')
    game.load.image('brick', './assets/brick.png')
    game.load.spritesheet('qBlock', './assets/Question_block.png', 32, 32)
    game.load.image('iron', './assets/iron-block.png')
    game.load.image('flag_pole', './assets/flag_pole.png')
    //~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Enemies ~~~~~
    game.load.image('steve', './assets/steve.png')
    game.load.image('spike', './assets/spike.png')
    game.load.spritesheet('goomba', './assets/bluegoomba.png', 32, 32)
    game.load.spritesheet('astronaut', './assets/frosh_astronaut64x64.png', 64, 64)
    //~~~~~~~~~~~~~~~~~~~

    //~~~~~ Power ups ~~~~~
    game.load.image('fireflower', './assets/fireflower.png')
    game.load.image('hammer', './assets/32x32_hammer.png')
    game.load.image('mushroom', './assets/temp_mushroom.png')
    game.load.image('fireball', './assets/5d08f167c3a6a5d.png')
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
    json_parsed = JSON.parse(game.cache.getText('shayshu_json'))
    console.log("Json file structure: ", json_parsed)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Physics engine ~~~~~
    game.physics.startSystem(Phaser.Physics.ARCADE)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Background ~~~~~
    sky = game.add.tileSprite(0, 0, 800, 600, json_parsed.Background)
    sky.fixedToCamera = true
    sky.tilePosition.x = game.camera.x * -0.2
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
    flag = game.add.group()
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
    flag.enableBody = true
    //~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Ground/ledge creation ~~~~~
    var ground_location = json_parsed.Ground
    for (var i = 0; i < ground_location.length; i++) {
        var grnd_start_x = ground_location[i].start_x
        var grnd_end_x = ground_location[i].end_x
        var grnd_src = ground_location[i].src

        const ground = platforms.create(grnd_start_x, game.world.height - 64, grnd_src);
        ground.scale.setTo((grnd_end_x - grnd_start_x) / 400, 2);
        ground.body.immovable = true
    }

    var platform_location = json_parsed.Platform
    for (var i = 0; i < platform_location.length; i++) {
        var plt_x = platform_location[i].x
        var plt_y = platform_location[i].y
        var plt_src = platform_location[i].src

        const ground = platforms.create(plt_x, plt_y, plt_src);
        ground.body.immovable = true
    }
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

    this.timeLimit = 500
    this.timeText = game.add.text(700, 20, "00:00")
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
    }

    var brick_location = json_parsed.Bricks
    for (var i = 0; i < brick_location.length; i++) {
        var brick_x = brick_location[i].x
        var brick_y = brick_location[i].y
        var brick_counter = brick_location[i].counter

        const block = brick.create(brick_x, brick_y, 'brick')
        block.body.immovable = true
        block.counter = brick_counter
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~~~~~~~ Enemy creation ~~~~~~~~~~~~~~~
    var enemy_location = json_parsed.Enemies
    for (var i = 0; i < enemy_location.length; i++) {
        var nme_x = enemy_location[i].x
        var nme_y = enemy_location[i].y
        var nme_src = enemy_location[i].src
        var nme_tween_x = enemy_location[i].tween_x
        var nme_tween_y = enemy_location[i].tween_y
        var nme_tween_speed = enemy_location[i].tween_speed
        const nme_animate = enemy_location[i].animate

        const new_nme = enemy.create(nme_x, nme_y, nme_src)


        if (nme_tween_x != false) {
            var new_tween = game.add.tween(new_nme)
            new_tween.to({ x: nme_tween_x, y: nme_tween_y }, nme_tween_speed, null, true, 0, 100000000, true)
        }

        if (nme_animate != false) {
            new_nme.animations.add(nme_animate.name, nme_animate.frames, nme_animate.delay, true)
            new_nme.animations.play(nme_animate.name)
        }
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Add Flag pole for end of level ~~~~~
    var flag_position = json_parsed.FlagPole
    const end_of_level = flag.create(flag_position.x, flag_position.y, flag_position.src)
    end_of_level.scale.setTo(1.5, 1.5)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ World and camera settings ~~~~~
    var world_bounds = json_parsed.World
    game.world.setBounds(0, 0, world_bounds.x, world_bounds.y)
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
    game.physics.arcade.collide(fireballs, enemy, function enemyKill(fireballs, enemy) { enemy.kill(); fireballs.kill(); }, null, this)
    game.physics.arcade.collide(platforms, fireballs, fireballKill, null, this)
    game.physics.arcade.collide(player, flag, function next_level(player, flag) { alert("You won"); location.reload(true); }, null, this)
    game.physics.arcade.collide(hammer, enemy, function enemyKill(hammer, enemy) {
        enemy.kill();
        hammer.body.velocity.x *= -1;
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
        falloutofworld(player);
    }

    if (player.currentState == 'fireflower') {
        if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && !keyReset) {
            keyReset = true;
            Fireballs(fireballs, player)
        }
        if (game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
            keyReset = false;
        }
    }

    if (player.currentState == 'hammer') {
        if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && !keyReset) {
            keyReset = true;
            hammerTime(hammer, player, this);
            console.log(this);
            var event = game.time.events.add(4000, function() {console.log("Return");}, this)
            console.log(event)
        }
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
    if (powerUpHierarchy[player.currentState] >= 2) {

        state--
        console.log("State:" + state)
        lastHit = timing
        player.isInvincible = true


    } else {
        //life is lost
        lives--
        if (lives <= 0) {
            //needs to be across the screen in big red letters
            alert("All lives lost! Game over");
            this.input.keyboard.enabled = false
        }
        player.kill();

        var die_noise = game.add.audio("mario_die");
        //die_noise.play();

        location.reload(true);
    }
}

var tick = function () {
    this.timeLimit--;
    var minutes = Math.floor(this.timeLimit / 60);
    var seconds = this.timeLimit - (minutes * 60);
    var timeString = addZeros(minutes) + ":" + addZeros(seconds);
    this.timeText.text = timeString;
    if (this.timeLimit === 0) {
        outofTime();
    }
};

var addZeros = function (num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
};

var outofTime = function () {
    var die_noise = game.add.audio("mario_die");
    die_noise.play();
    alert("Out of Time!");
    location.reload();
}

function falloutofworld(player) {
    player.kill();
    var die_noise = game.add.audio("mario_die");
    die_noise.play();
    alert("Restart?")
    location.reload(true);
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

    if (powerUpHierarchy[player.currentState] < powerUpHierarchy[powerUp.power_type]) {
        player.body.height = 64
        player.currentState = powerUp.power_type
        if (powerUp.power_type == 'fireflower') {
            player.loadTexture('big_purple_player')
        } else if (powerUp.power_type == 'mushroom') {
            player.loadTexture('big_player')
        }
        else if (powerUp.power_type == "hammer") {
            player.loadTexture("big_player")
            powerUp.kill()
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

//player shooting hammer like a boomerang when space is pressed
//can only shoot 1 at a time
function hammerTime(hammer, player, game) {
    var player_x = player.position.x;
    var player_y = player.position.y;

    //depends on player size, if the player is big, we need the projectile to be slightly lower to hit the enemy
    const h = hammer.create(player_x, player_y + 16, 'hammer')
    h.limit = player_x + 300 * player.facing;
    console.log(h.limit)
    var count = 0;

    //adding some spin
    h.body.angularVelocity = 1000;
    h.body.velocity.y = 0;
    h.body.velocity.x = 200 * player.facing;

    //ideas
    //loop ? x
    //when the hammer returns to the player
    //h.body.velocity.x *=-1
    //how to keep track of projectile position
    console.log(this)

}

function hammerGrab(player, hammer) {
    hammer.kill();
    keyReset = false;
}

function hammerReturn() {
    console.log("Return");
}

function fireballKill(platforms, fireballs) {
    fireballs.body.velocity.y = -100;
    fireballs.bounce++;
    if (fireballs.bounce == 5) {
        fireballs.kill();
    }

}
