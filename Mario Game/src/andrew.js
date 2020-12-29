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
var hazard;
var powerUp
var state = 3
var lives = 3
var timing
var powerUpHierarchy = { 'fireflower': 3, 'coffee': 3, 'bubbletea': 3, 'mushroom': 2, 'small': 1 }

function preload() {
    // Load & Define our game assets
    game.load.text("emily_test", "./JSON Files/andrew.json")
    game.load.image('sky', './assets/sky.png')
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
    game.load.spritesheet('astronaut', './assets/frosh_astronaut64x64.png', 64, 64)
        //~~~~~~~~~~~~~~~~~~~

    //~~~~~ Power ups ~~~~~
    game.load.image('fireflower', './assets/fireflower.png')
    game.load.image('hammer_powerUp', './assets/32x32_hammer.png')
    game.load.image('mushroom', './assets/temp_mushroom.png')
    game.load.image('fireball', './assets/5d08f167c3a6a5d.png')

    //Changes only show up if I add them to then main game.js file, is there a way to circumvent this problem?

    //Adding coffee powerup, why not show up??
    game.load.image('coffee', './assets/powerups/coffee_1.png')

    //~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Player model ~~~~~
    game.load.image('diamond', './assets/diamond.png')
    game.load.spritesheet('player', './assets/Main Sprite.png', 32, 32)
    game.load.spritesheet('big_purple_player', './assets/Big_Main_SpritePowerup.png', 32, 64) <<
        << << < HEAD
    game.load.spritesheet('big_player', './assets/BigMain_Sprite.png', 32, 64)
        //~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Sound ~~~~~
    game.load.audio("mario_die", './assets/smb_mariodie.wav')
        //~~~~~~~~~~~~~~~~~
        ===
        === =

        game.load.image('coffee', './assets/powerups/coffee_1.png')
    game.load.image('bubbletea', './assets/powerups/bbt.png')

    >>>
    >>> > e661e3518f50129258a484682ff22db813bb4060
}

function create() {
    //~~~~~ Loading json file ~~~~~
    json_parsed = JSON.parse(game.cache.getText('emily_test'))
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
    hazard.enableBody = true
        //~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~ Ground/ledge creation ~~~~~
    const ground = platforms.create(0, game.world.height - 64, 'ground')
    ground.scale.setTo(6, 2)
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
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~~~~~~~ Enemy creation ~~~~~~~~~~~~~~~
    astronaut = enemy.create(400, 386, 'astronaut')
    astronaut.animations.add('walk', [2, 0, 3, 0], 4, true)
    astronaut.animations.play('walk')

    walking_astronaut = game.add.tween(astronaut)
    walking_astronaut.loop = -1
    walking_astronaut.to({ x: 700, y: 386 }, 10000, null, true, 0, 100000000, true)
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
    game.physics.arcade.collide(fireballs, enemy, function enemyKill(fireballs, enemy) { enemy.kill();
        fireballs.kill(); }, null, this)
    game.physics.arcade.collide(platforms, fireballs, fireballKill, null, this)

    if (!player.isInvincible)
        game.physics.arcade.overlap(player, enemy, kill_mario, null, this);

    //does the mario coin brick interaction where the diamond gets killed and added to score board
    //issue - we can't have diamonds prespawned on bricks
    game.physics.arcade.collide(brick, diamonds, collectBDiamond, null, this)

    //  Call callectionDiamond() if player overlaps with a diamond
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)

    <<
    << << < HEAD

    // Configure the controls!
    if (cursors.left.isDown) {
        if (player.currentState == 'coffee') // Adding various nested if statements depending on whether or not the person has coffee or not
        {
            player.facing = -1;
            player.body.velocity.x = -600
            if (player.isInvincible) { ===
                === =
                var velocity_x = 300;
                var velocity_y = 500
                    // Configure the controls!
                if (player.currentState == 'coffee') {
                    velocity_x = 500;
                }
                if (cursors.left.isDown) {
                    player.body.velocity.x = -velocity_x;
                    if (player.isInvincible) { >>>
                        >>> > e661e3518f50129258a484682ff22db813bb4060
                        player.animations.play('left_blink')
                    } else {
                        player.animations.play('left')
                    }
                } <<
                << << < HEAD
                else {
                    player.facing = -1;
                    player.body.velocity.x = -300
                    if (player.isInvincible) {
                        player.animations.play('left_blink')
                    } else {
                        player.animations.play('left')
                    }
                }
            } else if (cursors.right.isDown) {
                if (player.currentState == 'coffee') {
                    player.facing = -1;
                    player.body.velocity.x = 600
                    if (player.isInvincible) { ===
                        === =
                    } else if (cursors.right.isDown) {
                        player.body.velocity.x = velocity_x;
                        if (player.isInvincible) { >>>
                            >>> > e661e3518f50129258a484682ff22db813bb4060
                            player.animations.play('right_blink')
                        } else {
                            player.animations.play('right')
                        }
                    } else {
                        player.facing = 1;
                        player.body.velocity.x = 300
                        if (player.isInvincible) {
                            player.animations.play('right_blink')
                        } else {
                            player.animations.play('right')
                        }
                    }
                } else {
                    // If no movement keys are pressed, stop the player

                    if (player.isInvincible) {
                        player.animations.play('stop_blink')
                    } else {
                        player.animations.play('stop')
                    }
                }
                if (player.currentState == 'bubbletea') {
                    velocity_y = 700
                }
                //  This allows the player to jump!
                if (cursors.up.isDown && player.body.touching.down) { <<
                    << << < HEAD

                    if (player.currentState == 'coffee') //Adding a y-velocity due to coffee
                    {
                        player.body.velocity.y = -650
                    } else {
                        player.body.velocity.y = -500
                    } ===
                    === =
                    player.body.velocity.y = -velocity_y; >>>
                    >>> > e661e3518f50129258a484682ff22db813bb4060
                }


                if (player.position.y >= 568) {
                    falloutofworld(player)
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

                if (powerUpHierarchy[player.currentState] <= powerUpHierarchy[powerUp.power_type]) {
                    player.currentState = powerUp.power_type
                    if (powerUp.power_type == 'fireflower') {
                        player.loadTexture('big_purple_player')
                    } else if (powerUp.power_type == 'mushroom') {
                        player.loadTexture('big_player')
                    } else if (powerUp.power_type == 'coffee') { //Makes player have coffee powerup when they eat coffee
                        player.loadTexture('big_player');
                        game.time.events.add(10000, function(player) {
                            console.log("Getting rid of coffee")
                            player[0].currentState = "mushroom";
                        }, this, [player])
                        console.log("coffeee powerup is working")
                    } else if (powerUp.power_type == 'bubbletea') { //Make player have bubble tea powerup
                        player.loadTexture('big_player')
                        game.time.events.add(10000, function(player) {
                            console.log("Getting rid of bubbletea")
                            player[0].currentState = "mushroom";
                        }, this, [player])
                    } else if (powerUp.power_type == 'coffee') {
                        player.loadTexture('big_player')
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