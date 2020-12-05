var keyReset = false;

var Mario_Game = {};
Mario_Game.Menu = function(game) {

};

Mario_Game.Menu.prototype = {
    preload: function() {
        game.load.image('start_screen', '../../assets/menu_screen_2.png')
    },

    create: function() {
        game.add.tileSprite(0, 0, 800, 600, 'start_screen')
    },

    update: function() {
        if (game.input.keyboard.justPressed(Phaser.Keyboard.ENTER) && !keyReset) {
            keyReset = true;
            this.level_1();
        }
        if (game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)) {
            keyReset = false;
        }
    },

    render: function() {
        this.game.debug.text(`Debugging Phaser ${Phaser.VERSION}`, 200, 20, 'yellow', 'Segoe UI');
        this.game.debug.text(`Mouse X: ${this.game.input.mousePointer.x}`, 200, 50, 'yellow', 'Segoe UI')
        this.game.debug.text(`Mouse Y: ${this.game.input.mousePointer.y}`, 200, 80, 'yellow', 'Segoe UI')
    },

    level_1: function() {
        console.log("Start Level 1");
        this.state.start("Level_1");
    }
}