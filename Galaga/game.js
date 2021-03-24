var startGame = function() {
    Game.setBoard(0,new TitleScreen("Alien Invasion", "Press fire to start playing",
    playGame));
}

var playGame = function() {
    var board = new GameBoard();
    board.add(new PlayerShip());
    board.add(new Level(level1,winGame));
    Game.setBoard(0,new Starfield(20,0.4,100,true))
    Game.setBoard(1,new Starfield(50,0.6,100))
    Game.setBoard(2,new Starfield(100,1.0,50));
    Game.setBoard(0,board); 
    Game.setBoard(10,analytics);
};

var winGame = function() {
    //TODO 0?
    Game.setBoard(0,new TitleScreen("You win!",
    "Press fire to play again",
    playGame));
};

var loseGame = function() {
    //TODO 0?
    Game.setBoard(0,new TitleScreen("You lose!",
    "Press fire to play again",
    playGame));
    };

var level1 = [
    // Start, End, Gap, Type, Override
    [ 0, 4000, 500, 'step' ],
    [ 6000, 13000, 800, 'ltr' ],
    [ 12000, 16000, 400, 'circle' ],
    [ 18200, 20000, 500, 'straight', { x: 150 } ],
    [ 18200, 20000, 500, 'straight', { x: 100 } ],
    [ 18400, 20000, 500, 'straight', { x: 200 } ],
    [ 22000, 25000, 400, 'wiggle', { x: 300 }],
    [ 22000, 25000, 400, 'wiggle', { x: 200 }]
];
    
var sprites = { 
    ship_player: {sx:0, sy:0, w:37, h:40, frames:1},
    ship_purple_enemy: {sx:37, sy:0, w:42, h:43, frames:1},
    ship_orange_enemy: {sx:79, sy:0, w:37, h:43, frames:1},
    ship_grey_enemy: {sx:116, sy:0, w:42, h:43, frames:1},
    ship_green_enemy: {sx:158, sy:0, w:33, h:32, frames:1},
    player_missile: {sx:0, sy:42, w:7, h:20, frames:1},
    enemy_missile: {sx:9, sy:42, w:3, h:20, frames:1},
    explosion: {sx:0, sy:64, w:64, h:46, frames:12},
};

var enemies = {
    straight: { x: 0, y: -50, sprite: 'ship_grey_enemy', health: 10,
            E: 100 },
    ltr: { x: 0, y: -100, sprite: 'ship_purple_enemy', health: 10,
            B: 200, C: 1, E: 200 },
    circle: { x: 400, y: -50, sprite: 'ship_green_enemy', health: 10,
            A: 0, B: -200, C: 1, E: 20, F: 200, G: 1, H: Math.PI/2 },
    wiggle: { x: 100, y: -50, sprite: 'ship_orange_enemy', health: 20,
            B: 100, C: 4, E: 100 },
    step: { x: 0, y: -50, sprite: 'ship_green_enemy', health: 10,
            B: 300, C: 1.5, E: 60 }
    };

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
    Game.initialize("game",sprites,startGame);
});

/*var callback = function(){
        SpriteSheet.draw(ctx, "ship_player", 0,0,0);
        SpriteSheet.draw(ctx, "ship_purple_enemy", 0,50,0);
        SpriteSheet.draw(ctx, "ship_orange_enemy", 0,100,0);
        SpriteSheet.draw(ctx, "ship_grey_enemy", 0,150,0);
        SpriteSheet.draw(ctx, "ship_green_enemy", 0,200,0);
        SpriteSheet.draw(ctx, "player_missile", 0,250,0);
        SpriteSheet.draw(ctx, "enemy_missile", 0,300,0);
        var i = 11;
        timer = setInterval(function() {
            SpriteSheet.draw(ctx, "explosion", 0,350,i)
            i -= 1;
            if(i == -1){
                clearInterval(timer);
            }
          }, 16);
    }*/