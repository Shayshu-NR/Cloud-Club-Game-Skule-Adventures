var physicsConfig = {
    default: 'arcade',
    arcade: {
        debug: false
    }
}
var config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    parent: 'phaser-game',
    physics: physicsConfig,
    scene: [SceneMain]
};
var game = new Phaser.Game(config);