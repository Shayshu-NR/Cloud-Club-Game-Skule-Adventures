LEVEL6.Lassonde_part_3 = function(game) {}

LEVEL6.Lassonde_part_3.prototype = {
    preload: function() {
        // Load & Define our game assets
        game.load.text("lassonde_json", "./JSON Files/lassonde_part_3.json")
            //~~~~~ Background ~~~~~
        game.load.image('L', './assets/lassonde/background.png')
            //~~~~~~~~~~~~~~~~~~~

        //~~~~~ Neutral blocks ~~~~~
        game.load.image('pipe', './assets/lassonde/pipe.png')
        game.load.image('brick', './assets/brick.png')
        game.load.spritesheet('qBlock', './assets/Question_block.png', 32, 32)
        game.load.image('flag_pole', './assets/flag_pole.png')
        game.load.image('door', './assets/SF_Pit/door.png')
        game.load.spritesheet('coin', './assets/SF_Pit/coin.png', 32, 32)
        game.load.image('playerFace', './assets/Main Sprite.png')
        game.load.image('hourglass', './assets/hourglass.png')
        game.load.spritesheet("button", './assets/SF_Pit/e-switch.png', 32, 32)
        game.load.image("toike", './assets/SF_Pit/toike.png')

        //~~~~~~~~~~~~~~~~~~~

        //~~~~~ Enemies ~~~~~
        game.load.image('spike', './assets/spike.png')
        game.load.spritesheet('astronaut', './assets/frosh_astronaut64x64.png', 64, 64)
        game.load.spritesheet('goomba', './assets/bluegoomba.png', 32, 32)
        game.load.spritesheet('derivative', './assets/derivative_1.png', 32, 32)
            //~~~~~~~~~~~~~~~~~~~

        //~~~~~ Power ups ~~~~~
        game.load.image('fireflower', './assets/fireflower.png')
        game.load.image('hammer', './assets/32x32_hammer.png')
        game.load.image('mushroom', './assets/temp_mushroom.png')
        game.load.image('fireball', './assets/5d08f167c3a6a5d.png')
        game.load.spritesheet('text', './assets/textbook.png', 32, 32)
        game.load.image('derivative', './assets/derivative_1.png')
        game.load.image('integral', './assets/integral_1.png')
        game.load.image('coffee', './assets/powerups/coffee_1_30x32.png')
            //~~~~~~~~~~~~~~~~~~~~~

        //~~~~~ Player model ~~~~~
        game.load.image('diamond', './assets/diamond.png')
        game.load.spritesheet('player', './assets/Main Sprite.png', 32, 32)
        game.load.spritesheet('big_purple_player', './assets/Big_Main_SpritePowerup.png', 32, 64)
        game.load.spritesheet('big_player', './assets/BigMain_Sprite.png', 32, 64)
            //~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~~~ Sound ~~~~~
        game.load.audio("mario_die", './assets/smb_mariodie.wav')

        //~~~~~ Misc ~~~~~
        game.load.image("space_ship", './assets/lazer_red.png')
            //~~~~~~~~~~~~~~~~
    },

    create: function() {
        //~~~~~ Loading json file ~~~~~
        json_parsed = JSON.parse(game.cache.getText('lassonde_json'))
        console.log("Json file structure: ", json_parsed)
        current_level = "Lassonde_part_3"
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var music = game.add.audio('lofi-hiphop')
        music.play();


        //~~~~~ Physics engine ~~~~~
        game.physics.startSystem(Phaser.Physics.ARCADE)
            //~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~~~ Background ~~~~~
        var background_location = json_parsed.Background
        for (var i = 0; i < background_location.length; i++) {
            var bgd_x = background_location[i].x
            var bgd_y = background_location[i].y
            var bgd_src = background_location[i].src
            var bgd_tile = background_location[i].tile


            if (bgd_tile) {
                var bgd_height = background_location[i].height
                var bgd_width = background_location[i].width
                const new_tile = game.add.tileSprite(bgd_x, bgd_y, bgd_width, bgd_height, bgd_src)
                new_tile.fixedToCamera = true
                new_tile.tilePosition.x = game.camera.x * -0.2
            } else {
                const new_background = game.add.image(bgd_x, bgd_y, bgd_src)
            }
        }

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
        derivative = game.add.group()
        integral = game.add.group()
        book = game.add.group()
        flag = game.add.group()
        lazer = game.add.group()
        door = game.add.group();
        button = game.add.group()
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
        lazer.enableBody = true
        derivative.enableBody = true
        integral.enableBody = true
        book.enableBody = true
        door.enableBody = true
        button.enableBody = true;
        //~~~~~~~~~~~~~~~~~~~~~~~


        //~~~~~ Ground/ledge creation ~~~~~
        var ground_location = json_parsed.Ground
        for (var i = 0; i < ground_location.length; i++) {
            var grnd_start_x = ground_location[i].start_x
            var grnd_end_x = ground_location[i].end_x
            var grnd_height = ground_location[i].height
            var grnd_src = ground_location[i].src

            const ground = platforms.create(grnd_start_x, grnd_height, grnd_src);
            ground.scale.setTo((grnd_end_x - grnd_start_x) / 400, grnd_height / 32);
            ground.body.immovable = true
        }

        var platform_location = json_parsed.Platform
        for (var i = 0; i < platform_location.length; i++) {
            var plt_x = platform_location[i].x
            var plt_y = platform_location[i].y
            var plt_src = platform_location[i].src
            var plt_height = platform_location[i].height
            var plt_width = platform_location[i].width

            const ground = platforms.create(plt_x, plt_y, plt_src);
            ground.scale.setTo(plt_width / 400, plt_height / 32)
            ground.body.immovable = true

            if (platform_location[i].tween) {
                var new_tween = game.add.tween(ground)

                new_tween.to({ x: platform_location[i].tween.x, y: platform_location[i].tween.y }, platform_location[i].tween.speed, null, true, 0, 100000000, true)
            }
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~~~ Player attributes ~~~~~
        player = game.add.sprite(json_parsed.Player.x, json_parsed.Player.y, 'player')
        game.physics.arcade.enable(player)
        player.lives = game.player_attributes["lives"]
        player.state = 3
        player.facing = 1;
        player.body.bounce.y = 0
        player.body.gravity.y = 1000
        player.body.collideWorldBounds = true
        player.currentState = game.player_attributes["current_state"]

        player.animations.add('left', [10, 9, 8, 10, 7, 6, 10], 10, true)
        player.animations.add('left_blink', [10, 23, 9, 23, 8, 23, 10, 23, 7, 23, 6, 23, 10, 23], 10, true)
        player.animations.add('right_blink', [0, 23, 1, 23, 2, 23, 0, 23, 3, 23, 4, 23, 0, 23], 10, true)
        player.animations.add('right', [0, 1, 2, 0, 3, 4, 0], 10, true)
        player.animations.add('stop', [5], 10, true)
        player.animations.add('stop_blink', [23, 5, 23], 10, true)

        if (player.currentState == 'fireflower') {
            player.loadTexture('big_purple_player')
            player.body.height = 64
        } else if (player.currentState == 'mushroom') {
            player.loadTexture('big_player')
            player.body.height = 64
        } else if (player.currentState == "hammer") {
            player.loadTexture("big_player")
            player.body.height = 64
        } else if (player.currentState == "text") {
            player.loadTexture("big_player")
            player.body.height = 64
        } else if (player.currentState == "derivative") {
            player.loadTexture("big_player")
            player.body.height = 64
        } else if (player.currentState == "integral") {
            player.loadTexture("big_player")
            player.body.height = 64
        } else if (player.currentState == 'coffee') {
            player.loadTexture('big_player');
            player.body.height = 64
            game.time.events.add(10000, function(player) {
                console.log("Getting rid of coffee")
                player[0].currentState = "mushroom";
            }, this, [player])
            player.body.height = 64
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~~~ Create the score text and timer ~~~~~
        score = game.player_attributes["score"]
        scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#FFFFFF' })
        scoreText.text = 'Score: ' + score;
        scoreText.fixedToCamera = true

        livesText = game.add.text(55, 52, '', { fontSize: '32px', fill: '#FFFFFF' })
        livesText.text = lives;
        livesText.fixedToCamera = true;
        progressBar = game.add.tileSprite(200, 16, 32, 32, 'playerFace')
        face = game.add.tileSprite(10, 46, 32, 32, 'playerFace')
        face.fixedToCamera = true;
        coins = game.player_attributes["coins"]
        coin = game.add.image(16, 85, 'coin')
        coin.fixedToCamera = true;
        coin.button = false;
        coinsText = game.add.text(55, 91, '', { fontSize: '32px', fill: '#FFFFFF' })
        coinsText.text = coins;
        coinsText.fixedToCamera = true;

        //progress bar tracks
        track = game.add.tileSprite(210, 35, 392, 16, 'tracks')
        track.fixedToCamera = true;


        pole = game.add.image(580, 12, 'pole')
        pole.scale.setTo(0.2, 0.2)
        pole.fixedToCamera = true;
        hourglass = game.add.tileSprite(665, 14, 32, 32, 'hourglass')
        hourglass.fixedToCamera = true;
        this.timeLimit = 500
        this.timeText = game.add.text(700, 20, "00:00")
        this.timeText.fill = "#FFFFFF"
        this.timeText.fixedToCamera = true;
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
            new_nme.static = enemy_location[i].static
            new_nme.health = enemy_location[i].health

            if (new_nme.static) {
                new_nme.body.immovable = true
            }
            if (nme_tween_x != false) {
                var new_tween = game.add.tween(new_nme)
                new_tween.to({ x: nme_tween_x, y: nme_tween_y }, nme_tween_speed, null, true, 0, 100000000, true)
            }

            if (nme_animate != false) {
                console.log(nme_animate)
                var anims_name
                var anims_frames
                var anims_delay

                for (var y = 0; y < nme_animate.length; y++) {
                    anims_name = nme_animate[y].name
                    anims_frames = nme_animate[y].frames
                    anims_delay = nme_animate[y].delay

                    new_nme.animations.add(anims_name, anims_frames, anims_delay, true)


                }
                if (nme_animate[0].play == true) {
                    new_nme.animations.play(nme_animate[0].name)
                }
            }

            if (enemy_location[i].lazer) {
                new_nme.lazer_src = enemy_location[i].lazer.src

                var event = game.time.events.loop(enemy_location[i].lazer.frequency, function(enemy_projectile) {
                    const new_lazer = lazer.create(enemy_projectile[0].position.x, enemy_projectile[0].position.y, enemy_projectile[0].lazer_src);
                    new_lazer.body.velocity.x = -500;
                }, this, [new_nme])

                new_nme.lazer_timer = event
            }

            console.log(new_nme)
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //~~~~~ Add Flag pole for end of level ~~~~~
        var flag_position = json_parsed.FlagPole
        const end_of_level = flag.create(flag_position.x, flag_position.y, flag_position.src)
        end_of_level.body.immovable = true
        end_of_level.scale.setTo(1.5, 1.5)
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        arrayOfCoins = []
        es_coins = json_parsed.ESCoins
        for (var i = 0; i < es_coins.length; i++) {
            const es_coin = diamonds.create(es_coins[i].x, es_coins[i].y, 'coin')
            es_coin.button = true
            es_coin.animations.add('spin', [0, 1, 2, 3, 4, 5], 20, true)
            es_coin.animations.play('spin')
            arrayOfCoins.push(es_coin)
        }

        es_switch_location = json_parsed.Eswitch
        button = button.create(es_switch_location.x, es_switch_location.y, 'button')
        button.body.immovable = true
        button.animations.add('pressed', [0, 1, 2, 3, 4], 20, false)
        button.animations.add('depressed', [4, 3, 2, 1, 0], 20, false)

        // Add toike
        diamonds.create(json_parsed.Toike.x, json_parsed.Toike.y, 'toike')

        //~~~~~ World and camera settings ~~~~~
        var world_bounds = json_parsed.World
        totalDistance = world_bounds.x
        game.world.setBounds(0, 0, world_bounds.x, world_bounds.y)
        game.camera.follow(player)
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    },

    update: function() {
        //  We want the player to stop when not moving
        player.body.velocity.x = 0

        timing = Math.floor(this.timeLimit)
        if ((lastHit - timing) > 2) {
            player.isInvincible = false
        }

        //  Setup collisions for the player, diamonds, and our platforms
        //  Setup collisions for the player, diamonds, and our platforms
        game.physics.arcade.collide(player, button, function buttonChange() {

            if (buttonPressed == false) {
                // button.animations.play('pressed')

                buttonPressed = true;
                button.animations.play('pressed')

                if (isBrick == true) {
                    for (var i = 0; i < arrayOfCoins.length; i++) {
                        if (arrayOfCoins[i] != null && arrayOfCoins[i].button) {
                            arrayOfCoins[i].kill()
                            arrayOfCoins[i] = diamonds.create(es_coins[i].x, es_coins[i].y, 'coin')
                            arrayOfCoins[i].animations.add('spin', [0, 1, 2, 3, 4, 5], 20, true)
                            arrayOfCoins[i].animations.play('spin')
                            arrayOfCoins[i].body.immovable = true
                        }
                    }
                    isBrick = false;
                } else if (isBrick == false) {
                    for (var i = 0; i < arrayOfCoins.length; i++) {
                        if (arrayOfCoins[i] != null) {
                            arrayOfCoins[i].kill()
                            arrayOfCoins[i] = brick.create(es_coins[i].x, es_coins[i].y, 'brick')
                            arrayOfCoins[i].button = true;
                            arrayOfCoins[i].body.immovable = true
                        }
                    }
                    isBrick = true
                }

                game.time.events.add(4000, eswitch_timer, this, [button])
            }

        })

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
            if (!enemy.static) enemy.kill();
            fireballs.kill();
            score += enemyPoints;
            scoreText.text = 'Score: ' + score

            if (enemy.lazer_timer) {
                enemy.lazer_timer.loop = false
            }
        }, null, this)
        game.physics.arcade.collide(derivative, enemy, function enemyKill(derivative, enemy) {
            if (!enemy.static) enemy.kill();
            derivative.kill();
            score += enemyPoints;
            scoreText.text = 'Score: ' + score

            if (enemy.lazer_timer) {
                enemy.lazer_timer.loop = false
            }
        }, null, this)
        game.physics.arcade.collide(integral, enemy, function enemyKill(integral, enemy) {
            if (!enemy.static) enemy.kill();
            integral.kill();
            score += enemyPoints;
            scoreText.text = 'Score: ' + score
            if (enemy.lazer_timer) {
                enemy.lazer_timer.loop = false
            }
        }, null, this)
        game.physics.arcade.collide(hammer, enemy, function enemyKill(hammer, enemy) {
            if (!enemy.static) enemy.kill();
            score += enemyPoints;
            scoreText.text = 'Score: ' + score
            if (enemy.lazer_timer) {
                enemy.lazer_timer.loop = false
            }
            hammer.body.velocity.x *= -1;
        }, null, this)


        game.physics.arcade.collide(platforms, fireballs, fireballKill, null, this)
        game.physics.arcade.collide(player, flag, function next_level(player, flag) {
            game.state.start('Galbraith');
        }, null, this)
        game.physics.arcade.collide(platforms, integral, integralKill, null, this)
        game.physics.arcade.collide(platforms, derivative, derivativeKill, null, this)
        game.physics.arcade.collide(platforms, hammer, function hammerReturn(platforms, hammer) {
            hammer.kill();
            keyReset = false;
        }, null, this)
        game.physics.arcade.collide(hammer, player, hammerGrab, null, this)


        if (!player.isInvincible) {
            game.physics.arcade.overlap(player, enemy, function(enemy, player) {
                kill_mario(enemy, player)
                    //enemy.lazer_timer.loop = false
            }, null, this);
            game.physics.arcade.collide(player, lazer, kill_mario, null, this)
        }

        //does the mario coin brick interaction where the diamond gets killed and added to score board
        //issue - we can't have diamonds prespawned on bricks
        game.physics.arcade.collide(brick, diamonds, collectBDiamond, null, this)

        //  Call callectionDiamond() if player overlaps with a diamond
        game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)

        var velocity_x = 300
        var velocity_y = -500
            // Configure the controls!
        if (player.currentState == 'coffee') {
            velocity_x = 700;
        }
        if (cursors.left.isDown) {
            player.facing = -1;
            player.body.velocity.x = -velocity_x;
            if (player.isInvincible) {
                player.animations.play('left_blink')
            } else {
                player.animations.play('left')
            }
        } else if (cursors.right.isDown) {
            player.facing = 1;
            player.body.velocity.x = velocity_x;
            if (player.isInvincible) {
                player.animations.play('right_blink')
            } else {
                player.animations.play('right')
            }
        } else {
            if (player.isInvincible) {
                player.animations.play('stop_blink')
            } else {
                player.animations.play('stop')
            }
        }
        if (player.currentState == 'bubbletea') {
            velocity_y = -700
        }

        //  This allows the player to jump!
        if (player.body.touching.down) {
            jumpCount = 2;
        }
        if (game.input.keyboard.justPressed(Phaser.Keyboard.UP) && jumpCount > 0 && !keyResetJump) {
            keyResetJump = true;
            player.body.velocity.y = velocity_y;
            jumpCount--;
        }
        if (game.input.keyboard.justReleased(Phaser.Keyboard.UP)) {
            keyResetJump = false;
        }

        //Progress bar
        progress = player.body.position.x / totalDistance * 400 + 200

        progressBar.x = progress + this.camera.view.x

        if (player.position.y - 32 + player.body.height >= 568) {
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
                console.log("Make hammer")
                hammer_instance = hammerTime(hammer, player)
            }
        }

        if (player.currentState == 'text') {
            if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && !keyReset) {
                keyReset = true;
                TextBook(book, player)
            }
            if (game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
                keyReset = false;
            }

        }

        if (player.currentState == 'text') {
            if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && !keyReset) {
                keyReset = true;
                TextBook(book, player)
            }
            if (game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
                keyReset = false;
            }
        }

        if (player.currentState == 'derivative') {
            if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && !keyReset) {
                keyReset = true;
                Derivatives(derivative, player)
            }
            if (game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
                keyReset = false;
            }
        }

        if (player.currentState == 'integral') {
            if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && !keyReset) {
                keyReset = true;
                Integrals(integral, derivative, player)
            }
            if (game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
                keyReset = false;
            }
        }

        if (hammer_instance != 0) {
            if (hammer_instance.limit > 0) {
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

        this.timeText.x = 700 + this.camera.view.x
        scoreText.x = 16 + this.camera.view.x

    }
}