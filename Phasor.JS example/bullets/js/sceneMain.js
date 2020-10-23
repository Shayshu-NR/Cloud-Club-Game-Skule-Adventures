class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload() {
        this.load.image("bullet", "images/bullet.png");
    }
    create() {
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });
        this.input.on('pointerdown', this.shoot, this);
    }
    shoot(pointer) {
        var bullet = this.bullets.get(pointer.x, pointer.y);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = -200;
        }
    }
    update() {
        this.bullets.children.each(function(b) {
            if (b.active) {
                if (b.y < 0) {
                    b.setActive(false);
                }
            }
        }.bind(this));
    }
}