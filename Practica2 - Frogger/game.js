// Grupo C, Álvaro Corrochano López y Pablo Álvarez García
var startGame = function() {
  Game.setBoard(0,new TitleScreen("START", "Press enter to start playing",
    playGame));
}

var playGame = function() {
    var board = new GameBoard();
    board.add(new Background());
    Game.setBoard(0,board);
    
    Game.setBoard(2,new GameBoard())

    var playBoard = new GameBoard();

    //(row, speed, rate, sprites)
    playBoard.add(new Spawner(0,50,500,this.sprites));
    playBoard.add(new Spawner(1,55,450,this.sprites));
    playBoard.add(new Spawner(2,43,420,this.sprites));
    playBoard.add(new Spawner(3,44,560,this.sprites));
    playBoard.add(new Spawner(4,57,500,this.sprites));

    playBoard.add(new Spawner(6,45,400,this.sprites));
    playBoard.add(new Spawner(7,55,450,this.sprites));
    playBoard.add(new Spawner(8,34,560,this.sprites));
    playBoard.add(new Spawner(9,56,300,this.sprites));
    playBoard.add(new Spawner(10,67,400,this.sprites));
    

    /*// Jugar sin spawners (solo sale una vez cada cosa)
    playBoard.add(new Car("blue_car", 2, 50));
    playBoard.add(new Car("red_truck", 1, 50));
    playBoard.add(new Car("yellow_car", 0, 50));
    playBoard.add(new Car("green_car", 3, 50));
    playBoard.add(new Car("brown_truck", 4, 50));

    playBoard.add(new Trunk("long_log", 6,55));
    playBoard.add(new Trunk("long_log", 7,55));
    playBoard.add(new Trunk("long_log", 8,55));
    playBoard.add(new Trunk("long_log", 9,55));
    playBoard.add(new Trunk("long_log", 10,55));

    //playBoard.add(new Tortoise("tortoise_swim", 7,55));
    //playBoard.add(new Tortoise("tortoise_swim", 9,55));
    */  
    
    playBoard.add(new Water());
    playBoard.add(new Home());

    playBoard.add(new Frog());
    
    Game.setBoard(1,playBoard);

    Game.setBoard(10,analytics);
};

var winGame = function() {
    Game.setBoard(2,new TitleScreen("You win!",
    "Press enter to play again",
    playGame));
};

var loseGame = function() {
    Game.setBoard(2,new TitleScreen("You lose!",
    "Press enter to play again",
    playGame));
};
    
var sprites = { 

    //0
    frog:            {sx:0, sy:338, w:39, h:53, frames:7},

    //1-5
    blue_car:        {sx:8, sy:8, w:90, h:47, frames:1},
    green_car:       {sx:109, sy:6, w:93, h:47, frames:1},
    yellow_car:      {sx:214, sy:7, w:93, h:47, frames:1},
    red_truck:       {sx:7, sy:64, w:123, h:42, frames:1},
    brown_truck:     {sx:147, sy:63, w:200, h:45, frames:1},

    //6-9
    short_log:       {sx:270, sy:172, w:131, h:40, frames:1},
    medium_log:      {sx:9, sy:123, w:191, h:40, frames:1},
    long_log:        {sx:9, sy:172, w:248, h:40, frames:1},
    tortoise_swim:   {sx:282, sy:344, w:53, h:43, frames:2},

    skull:           {sx:211, sy:127, w:48, h:36, frames:4},
    lilypad:         {sx:5, sy:235, w:42, h:39, frames:1},
    fly:             {sx:58, sy:240, w:28, h:31, frames:1},
    green_box:       {sx:95, sy:225, w:57, h:57, frames:1},
    blue_box:        {sx:159, sy:225, w:57, h:57, frames:1},
    road_box:        {sx:222, sy:225, w:57, h:57, frames:1},
    leaves:          {sx:285, sy:225, w:57, h:57, frames:1},
    leaves_lilypad:  {sx:348, sy:225, w:57, h:57, frames:1},
    tortoise_framed: {sx:6, sy:288, w:48, h:47, frames:8},
    logo:            {sx:8, sy:395, w:260, h:162, frames:1},
    background:      {sx:421, sy:0, w:550, h:625, frames:1},
    water:           {sx:421, sy:48, w:550, h:240, frames:1},
    home:           {sx:421, sy:0, w:550, h:48, frames:1},
};

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
    Game.initialize("game",sprites,startGame);
});