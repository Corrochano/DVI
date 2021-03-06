var SpriteSheet = new function() {
    this.map = { };
    
    this.load = function(spriteData, callback) {
        this.map = spriteData;
        this.image = new Image();
        this.image.onload = callback;
        this.image.src = 'images/sprites.png';
    };

    this.draw = function(ctx,sprite,x,y,frame) {
        var s = this.map[sprite];
        if(!frame) frame = 0;
        ctx.drawImage(this.image,
            s.sx + frame * s.w,
            s.sy,
            s.w, s.h,
            x, y,   
            s.w, s.h);
    };
}

var Game = new function() {
    // Inicialización del juego
    // se obtiene el canvas, se cargan los recursos y se llama a callback
    this.initialize = function(canvasElementId, sprite_data, callback) {

        this.canvas = document.getElementById(canvasElementId);
        this.playerOffset = 10;
        this.canvasMultiplier= 1;
        this.setupMobile();
        this.width = this.canvas.width;
        this.height= this.canvas.height;
        this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
        if(!this.ctx) { return alert("Please upgrade your browser to play"); }
        this.setupInput();
        this.loop();
        if(this.mobile) {
        this.setBoard(4,new TouchControls());
        }
        SpriteSheet.load(sprite_data,callback);
    };
    
    // le asignamos un nombre lógico a cada tecla que nos interesa
    var KEY_CODES = { 37:'left', 39:'right', 32 :'fire' };
    this.keys = {};

    this.setupInput = function() {
        window.addEventListener('keydown',function(e) {
            if(KEY_CODES[e.keyCode]) {
                Game.keys[KEY_CODES[e.keyCode]] = true;
                e.preventDefault();
            }
        },false);
    
        window.addEventListener('keyup',function(e) {
            if(KEY_CODES[e.keyCode]) {
                Game.keys[KEY_CODES[e.keyCode]] = false;
                e.preventDefault();
            }
        },false);
    }
    
    var boards = [];

    this.loop = function() {
        var fps = 60;
        var dt = 1000/fps;
        // Cada pasada borramos el canvas
        Game.ctx.fillStyle = "#000";
        Game.ctx.fillRect(0,0,Game.width,Game.height);
        // y actualizamos y dibujamos todas las entidades
        for(var i=0,len = boards.length;i<len;i++) {
            if(boards[i]) {
                boards[i].step(dt/1000);
                boards[i].draw(Game.ctx);
            }
        }
        requestAnimationFrame(Game.loop);
    };
        
    
    // Change an active game board
    this.setBoard = function(num,board) { 
        boards[num] = board; 
    };

    this.setupMobile = function() {
        //hasTouch indica si las funciones táctiles están disponibles
        var container = document.getElementById("container"),
        hasTouch = !!('ontouchstart' in window),
        w = window.innerWidth, h = window.innerHeight;
        //indicar al juego que estamos en mobile
        if(hasTouch) { this.mobile = true; }
        //Si la pantalla es demasiado grande o no hay táctil terminamos
        if(screen.width >= 1280 || !hasTouch) {
            console.log('Dispositivo no compatible');
            return false;
        }
        //Avisamos de rotar la pantalla
        if(w > h) {
            alert("Por favor, rota el dispositivo y pulsa ACCEPTAR/OK");
            w = window.innerWidth; h = window.innerHeight;
        }
        //Hacemos el contenedor más grande que la pantalla
        container.style.height = h*2 + "px";
        //Y hacemos scroll para intentar quitar la barra de dirección del navegador
        window.scrollTo(0,1);
        //Utilizamos CSS para ajustar el ancho y alto
        h = window.innerHeight + 2;
        container.style.height = h + "px";
        container.style.width = w + "px";
        container.style.padding = 0;
        //Si la pantalla es muy grande (tablet) utilizamos un factor de multiplicación del canvas --> Es más eficiente que reescalar directamente con CSS
        if(h >= this.canvas.height * 1.75 || w >= this.canvas.height * 1.75) {
            this.canvasMultiplier = 2;
            this.canvas.width = w / 2;
            this.canvas.height = h / 2;
            this.canvas.style.width = w + "px";
            this.canvas.style.height = h + "px";
        } else //Si la pantalla no es demasiado grande reescalamos directamente
        {
            this.canvas.width = w;
            this.canvas.height = h;
        }
        //Colocamos el canvas de forma absoluta a la coordenada 0,0 de la ventana
        this.canvas.style.position='absolute';
        this.canvas.style.left="0px";
        this.canvas.style.top="0px";
    };
}

var TitleScreen = function TitleScreen(title,subtitle,callback) {
    var up = false;
    
    this.step = function(dt) {
        if( ! Game.keys['fire'] ) up = true;
        if( up && Game.keys['fire'] && callback ) callback();
    };
    
    this.draw = function(ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";

        ctx.font = "bold 40px bangers";
        ctx.fillText(title,Game.width/2,Game.height/2);

        ctx.font = "bold 20px bangers";
        ctx.fillText(subtitle,Game.width/2,Game.height/2 + 140);
    };
};

var GameBoard = function() {
    var board = this;
    // The current list of objects
    this.objects = [];
    this.cnt = {};

    // Add a new object to the object list
    this.add = function(obj) {
        obj.board=this;
        this.objects.push(obj);
        this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
        return obj;
    };
    
    // Reset the list of removed objects
    this.resetRemoved = function() { this.removed = []; };
    // Mark an object for removal
    this.remove = function(obj) {
        var idx = this.removed.indexOf(obj);
        if(idx == -1) {
            this.removed.push(obj);
            return true;
        } else {
            return false;
        }
    };
    
    // Removed an objects marked for removal from the list
    this.finalizeRemoved = function() {
        for(var i=0,len=this.removed.length;i<len;i++) {
            var idx = this.objects.indexOf(this.removed[i]);
            if(idx != -1) {
                this.cnt[this.removed[i].type]--;
                this.objects.splice(idx,1);
            }
        }
    };
    
    // Call the same method on all current objects
    this.iterate = function(funcName) {
        var args = Array.prototype.slice.call(arguments,1);
        for(var i=0,len=this.objects.length; i < len; i++) {
            var obj = this.objects[i];
            obj[funcName].apply(obj,args);
        }
    };
    // Find the first object for which func is true
    this.detect = function(func) {
        for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
            if(func.call(this.objects[i])) return this.objects[i];
        }
        return false;
    };
        
    // Call step on all objects and them delete
    // any object that have been marked for removal
    this.step = function(dt) {
        this.resetRemoved();
        this.iterate('step',dt);
        this.finalizeRemoved();
    };
    // Draw all the objects
    this.draw= function(ctx) {
        this.iterate('draw',ctx);
    };

    var boards = [];
    this.loop = function() {
        var dt = 30 / 1000;
        // Cada pasada borramos el canvas
        Game.ctx.fillStyle = "#000";
        Game.ctx.fillRect(0,0,Game.width,Game.height);
        // y actualizamos y dibujamos todas las entidades
        for(var i=0,len = boards.length;i<len;i++) {
            if(boards[i]) {
                boards[i].step(dt);
                boards[i].draw(Game.ctx);
            }
        }
        setTimeout(Game.loop,30);
    };

    // Change an active game board
    this.setBoard = function(num,board) { boards[num] = board; };

    this.overlap = function(o1,o2) {
        return !((o1.y+o1.h-1 < o2.y) || (o1.y > o2.y+o2.h-1) ||
        (o1.x+o1.w-1 < o2.x) || (o1.x > o2.x+o2.w-1));
    };

    this.collide = function(obj,type) {
        return this.detect(function() {
            if(obj != this) {
                var col = (!type || this.type & type) && board.overlap(obj,this);
                return col ? this : false;
            }
        });
    };

    this.remove = function(obj) {
        var idx = this.removed.indexOf(obj);
        if(idx == -1) {
            this.removed.push(obj);
            return true;
        } else {
            return false;
        }
    };

    //board.collide(enemy, OBJECT_PLAYER | OBJECT_PLAYER_PROJECTILE)

};