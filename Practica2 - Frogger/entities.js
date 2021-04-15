///////////////////////////////
// SPRITE
///////////////////////////////
var Sprite = function() { }

Sprite.prototype.setup = function(sprite,props) {
    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w = SpriteSheet.map[sprite].w;
    this.h = SpriteSheet.map[sprite].h;
}
Sprite.prototype.merge = function(props) {
    if(props) {
        for (var prop in props) {
            this[prop] = props[prop];
        }
    }
}

Sprite.prototype.draw = function(ctx) {
    ctx.save();
   
    ctx.translate(this.x+this.w/2, this.y+this.h/2);
    ctx.rotate(this.rotation * Math.PI /180);
    ctx.translate(-(this.x+this.w/2), -(this.y+this.h/2));  
   
    SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
   
    ctx.restore();
};

Sprite.prototype.hit = function(damage) {
    this.board.remove(this);
}


var OBJECT_PLAYER = 1,
    OBJECT_VEHICLES = 2,
    OBJECT_TRONCOS = 4,
    OBJECT_BASE = 8,
    OBJECT_WATER = 16,
    OBJECT_HOME  = 32,
    OBJECT_SKULL = 64;

///////////////////////////////
//FROG
///////////////////////////////
var Frog = function(clear){
    
    this.setup('frog', { vx: 0, frame: 0 });

    this.x = Game.width/2 - 20;
    this.y = Game.height;
    this.w = SpriteSheet.map['frog'].w;
    this.h = SpriteSheet.map['frog'].h-10;
    this.overTrunk = false;
    this.rotation = 0;
    this.vx = 0;
  
    this.dontmove = false;
    this.win = false;

    this.reloadTime = 0.25;
    this.move = this.reloadTime;

    //Si la rana está encima de un tronco su velocidad se iguala
    Frog.prototype.onTrunk = function(_vx){
        this.overTrunk=true;
        this.vx=_vx;
    }

}

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;

Frog.prototype.step = function(dt){
	
	if (this.dontmove) return;
	
    this.move -= dt;
    if(this.move < 0){
        if(Game.keys['left']) {
            this.x += -40; this.vy = 0; this.move = this.reloadTime; 
            this.rotation = 270;
        }
        else if(Game.keys['right']) {
            this.x += 40; this.vy = 0; this.move = this.reloadTime;
            this.rotation = 90;
        }
        else if(Game.keys['up']) {
            this.y += -48; this.vx = 0; this.move = this.reloadTime;
            this.rotation = 0;
        }
        else if(Game.keys['down']) {
            this.y += 48; this.vx = 0; this.move = this.reloadTime; 
            this.rotation = 180;
        }
    }

    this.x += this.vx*dt;
    if(this.x < 0) { this.x = 0; }
    else if(this.x > Game.width - this.w) {
        this.x = Game.width - this.w;
    }

    if(this.y < 0) { this.y = 0; }
    else if(this.y > Game.height - this.h) {
        this.y = Game.height - this.h;
    }
    this.vx = 0;
}

Frog.prototype.hit = function(damage){
    if(!this.overTrunk){
        this.board.remove(this);
        if(damage == 2){
            winGame(this.board);
        }else{
            this.board.add(new AnimacionMuerte(this.x, this.y));
            loseGame(this.board);
        }
    }
    else{
        this.overTrunk = false;
    }
}


Frog.prototype.winCollision = function(){
    if(!this.win){
        winGame();
        this.dontmove = true;
        this.win = true;
    }
    else{
        this.win = false;
    }
}

///////////////////////////////
//CAR
///////////////////////////////
var Car = function(carTypeSprite, _row, _speed){
    
    this.setup(carTypeSprite, { });

    this.type = carTypeSprite
    this.row = _row;
    this.speed = _speed;
    this.w = SpriteSheet.map[carTypeSprite].w;
    this.h = SpriteSheet.map[carTypeSprite].h;
    this.x = -this.w;
    this.y = Game.height - this.h - 48 - 48 * this.row;
    this.rotation = 0;

    //Carriles al reves
    if((this.row == 0) || (this.row == 2)){
        if(this.type != "brown_truck"){
            this.speed = -this.speed;
            this.rotation = 180;
            this.x = Game.width;
        }
        else{
            this.speed = -this.speed;
            this.x = Game.width;
        }
    } else{
        if(this.type == "brown_truck"){
            this.rotation =180;
        }
    }  
}

Car.prototype = new Sprite();
Car.prototype.type = OBJECT_VEHICLES;

Car.prototype.step = function(dt){
    this.x += this.speed * dt;

    //Comprobar si esta fuera del tablero (y eliminarlo en tal caso)
    if(this.x > Game.width) {
        this.board.remove(this);
    }

    if(this.x + this.w < 0 ) {
        this.board.remove(this);
    }
    
    var collision = this.board.collide(this,OBJECT_PLAYER);

    if(collision){
        collision.hit(1);
    }

}

///////////////////////////////
//TRUNK
///////////////////////////////
var Trunk = function(trunkTypeSprite, _row, _speed){
    
    this.setup(trunkTypeSprite, { });

    this.row = _row;
    this.speed = _speed;
    this.damage = 1;
    this.w = SpriteSheet.map[trunkTypeSprite].w;
    this.h = SpriteSheet.map[trunkTypeSprite].h;
    this.x = -this.w;
    this.y = Game.height - this.h - 48 - 48 * this.row;
    this.rotation = 0;

    //Water al reves
    if((this.row == 6) || (this.row == 10)){
        this.speed = -this.speed;
        this.rotation = 180;
        this.x = Game.width;
    }
}

Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_TRONCOS;

Trunk.prototype.step = function(dt){
    this.x += this.speed * dt;

    //Comprobar si esta fuera del tablero (y eliminarlo en tal caso)
    if(this.x > Game.width) {
        this.board.remove(this);
    }

    if(this.x + this.w < 0 ) {
        this.board.remove(this);
    }
    
    var collision = this.board.collide(this,OBJECT_PLAYER);

    if(collision){
        collision.onTrunk(this.speed);
    }
}

///////////////////////////////
//TORTOISE
///////////////////////////////
var Tortoise = function(tortoiseTypeSprite, _row, _speed){
    
    this.setup(tortoiseTypeSprite, { });

    this.row = _row;
    this.speed = _speed;
    this.damage = 1;
    this.w = SpriteSheet.map[tortoiseTypeSprite].w;
    this.h = SpriteSheet.map[tortoiseTypeSprite].h;
    this.x = -this.w;
    this.y = Game.height - this.h - 48 - 48 * this.row;
    this.rotation = 0;

    //Water al reves
    if((this.row == 6) || (this.row == 10)){
        this.speed = -this.speed;
        this.rotation = 180;
        this.x = Game.width;
    }
}

Tortoise.prototype = new Sprite();
Tortoise.prototype.type = OBJECT_TRONCOS;

Tortoise.prototype.step = function(dt){
    this.x += this.speed * dt;

    //Comprobar si esta fuera del tablero (y eliminarlo en tal caso)
    if(this.x > Game.width) {
        this.board.remove(this);
    }

    if(this.x + this.w < 0 ) {
        this.board.remove(this);
    }
    
    var collision = this.board.collide(this,OBJECT_PLAYER);

    if(collision){
        collision.onTrunk(this.speed);
    }
}

///////////////////////////////
//WATER
///////////////////////////////
var Water = function(){
    this.setup("water",{x: 0, y: 50,  w: Game.width, h: 48*5});
}

Water.prototype = new Sprite();
Water.prototype.type = OBJECT_WATER;

Water.prototype.step = function(dt){
    
    var collision = this.board.collide(this,OBJECT_PLAYER);

    if(collision){
        collision.hit(1);
    }
}

Water.prototype.draw = function(ctx){/*No dibuja nada*/};


///////////////////////////////
//HOME
///////////////////////////////

var Home = function(){
    this.setup("home",{x: 0, y: 0,  w: Game.width, h: 48});
}


Home.prototype.draw = function(ctx){/*No dibuja nada*/};
Home.prototype = new Sprite();

Home.prototype.step = function(dt){
    
    var collision = this.board.collide(this,OBJECT_PLAYER);

    if(collision){
        collision.winCollision();
    }
}
Home.prototype.type = OBJECT_HOME;

Home.prototype.draw = function(ctx){/*No dibuja nada*/};

///////////////////////////////
//SPAWNER
///////////////////////////////
var Spawner = function(row, speed, rate, sprites) {
    // playBoard.add(new Car("blue_car", 2, 50));
    this.setup('home',{x: -5, y: -5,  w: 0, h: 0});
    this.row = row;
    this.speed = speed;
    this.maxrate = rate;
    this.actrate = -1;
    this.randomSprite = -1;
    this.sprites = sprites;
    
    this.getRandomArbitrary= function(min,max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
  
    this.step = function(dt) {
        if(this.actrate < 0)
        {
            this.actrate = this.maxrate;

            if(row < 5 )
            {
                //COCHES 1-5
                this.randomSprite = this.getRandomArbitrary(1,6);
                this.board.addFirst(new Car(Object.keys(this.sprites)[this.randomSprite], row, speed));
            }
            else
            {
                //TRONCOS 6-9
                this.randomSprite = this.getRandomArbitrary(6,10);

                //Si es 9 -> tortuga
                if(this.randomSprite != 9)
                {
                    this.board.addFirst(new Trunk(Object.keys(this.sprites)[this.randomSprite], row, speed));
                }
                else
                {
                    this.board.addFirst(new Tortoise(Object.keys(this.sprites)[this.randomSprite], row, speed));
                }
            }
        }
        
        this.actrate = this.actrate -1;
        
    }
    this.draw = function(ctx) {}
  }
  
  Spawner.prototype = new Sprite();
  Spawner.prototype.type = OBJECT_SKULL;

///////////////////////////////
//ANIMACION DE MUERTE
///////////////////////////////
var AnimacionMuerte = function(x,y){
    this.setup('skull',{ x: x, y: y, vx: 0, frame: 0, reloadTime: 0.25, maxVel: 0, maxFrames:4});
    this.subFrame = 0;
    this.step = function(dt){
        this.frame = Math.floor(this.subFrame++ / 30);
        if(this.frame == this.maxFrames){ 
            this.board.remove(this);
        }
    }
}

  AnimacionMuerte.prototype = new Sprite();
  AnimacionMuerte.prototype.type = OBJECT_SKULL;

///////////////////////////////
//BACKGROUND
///////////////////////////////

var Background = function(clear) {
    this.setup('background', { vx: 0, frame: 0})
    this.x = 0;
    this.y = 0;
    this.w = SpriteSheet.map['background'].w;
    this.h = SpriteSheet.map['background'].h;
}

Background.prototype = new Sprite();

Background.prototype.step = function(dt){};

///////////////////////////////
//ANALYTICS
///////////////////////////////

var analytics = new function(){
    var lastDate = Date.now();
    var time = 0;
    var frames = 0;
    var fps = 0;
    this.step = function(dt){
        var now = Date.now();
        //Ignoramos el dt que nos indica el método loop()
        var dt = (now-lastDate);
        lastDate = now;
        time += dt;
        ++frames;
        fps = frames*1000 / time ;
        if(time>5000){
            time = 0;
            frames = 0;
        }
    }
    this.draw = function(ctx){
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.font = "bold 16px arial";
    ctx.fillText(Math.round(fps * 100) / 100,0,20);
    }
}


///////////////////////////////
//TOUCHCONTROLS
///////////////////////////////

var TouchControls = function() {

    var gutterWidth = 10;
    var unitWidth = Game.width/5;
    var blockWidth = unitWidth-gutterWidth;

    this.drawSquare = function(ctx,x,y,txt,on) {
        ctx.globalAlpha = on ? 0.9 : 0.6;
        ctx.fillStyle = "#CCC";
        ctx.fillRect(x,y,blockWidth,blockWidth);

        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.globalAlpha = 1.0;
        ctx.font = "bold " + (3*unitWidth/4) + "px arial";

        ctx.fillText(txt,
                    x+blockWidth/2,
                    y+3*blockWidth/4+5);
    };

    this.draw = function(ctx) {
        ctx.save();

        var yLoc = Game.height - unitWidth;
        this.drawSquare(ctx,gutterWidth,yLoc,"\u25C0", Game.keys['left']);
        this.drawSquare(ctx,unitWidth + gutterWidth,yLoc,"\u25B6", Game.keys['right']);
        this.drawSquare(ctx,4*unitWidth,yLoc,"A",Game.keys['fire']);
        ctx.restore();
    };

    this.step = function(dt) { };

    this.trackTouch = function(e) {
        var touch, x;

        e.preventDefault();
        Game.keys['left'] = false;
        Game.keys['right'] = false;

        for(var i=0;i<e.targetTouches.length;i++) {
            touch = e.targetTouches[i];
            x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
            if(x < unitWidth) {
                Game.keys['left'] = true;
            }
            if(x > unitWidth && x < 2*unitWidth) {
                Game.keys['right'] = true;
            }
        }

        if(e.type == 'touchstart' || e.type == 'touchend') {
            for(i=0;i<e.changedTouches.length;i++) {
                touch = e.changedTouches[i];
                x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
                if(x > 4 * unitWidth) {
                    Game.keys['fire'] = (e.type == 'touchstart');
                }
            }
        }
    };

    Game.canvas.addEventListener('touchstart',this.trackTouch,true);
    Game.canvas.addEventListener('touchmove',this.trackTouch,true);
    Game.canvas.addEventListener('touchend',this.trackTouch,true);

    Game.playerOffset = unitWidth + 20;
};