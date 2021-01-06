const game = new Phaser.Game(800, 600, Phaser.AUTO)
game.state.add("MenuScreen", Mario_Game.Menu)
game.state.add("SF_part_1", LEVEL1.SF_part_1)
game.state.add("SF_part_2", LEVEL1.SF_part_2)
game.state.add("SF_part_3", LEVEL1.SF_part_3)
game.state.add("SF_library", LEVEL2.SF_library)
game.state.add("Galbraith", LEVEL3.Galbraith)
game.state.add("Bahen", LEVEL4.Bahen)
game.state.add("GameOver", Game_over.go_screen)
game.state.start("MenuScreen")