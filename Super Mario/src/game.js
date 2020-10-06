const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
})


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);


}

function update() {
    game.physics.arcade.overlap(player, goomba, killPlayer, null, this);

}

function killPlayer(player, goomba) {

}