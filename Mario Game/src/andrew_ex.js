const game = new Phaser.Game(800, 600, Phaser.AUTO);
game.state.add("level1", Mario_Game.test1);
game.state.start("level1");

//independant to shayshus code
