var Game_over = {}
Game_over.go_screen = function(game) {};

Game_over.go_screen.prototype = {
    preload: function() {
        game.load.image('gameover_screen', './assets/game_over_screen.png')
    },
    create: function() {
        game.add.tileSprite(0, 0, 800, 600, 'gameover_screen')
    },
    update: function() {
        if (game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)) {
            keyReset = false;
        }

        if (game.input.mousePointer.x > 308 && game.input.mousePointer.x < 478) {
            if (game.input.mousePointer.y > 458 && game.input.mousePointer.y < 500) {
                if (game.input.activePointer.isDown) {
                    this.menu()
                }
            }
        }
    },
    menu: function() {
        this.state.start("MenuScreen")
    }
}