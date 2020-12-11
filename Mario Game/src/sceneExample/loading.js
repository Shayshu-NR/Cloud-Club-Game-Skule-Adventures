var keyReset = false;

var Mario_Game = {};
Mario_Game.Loading = function(game) {

};

Mario_Game.Loading.prototype = {
    preload = function() {

    },

    create = function() {
        game.stage.backgroundColor = "#4488AA";

        setTimeout(function() {
            game.state.start(level_name);
        }, 5000)
    }
}