export function brick_break(player, block) {
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
    } else {
        block.kill()
    }

}