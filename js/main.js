const Game = (() => {
    let world;
    let player;
    
    return {
        Init() {
            player = new Player();
            world = new World(1000, 800);
        },
        
        update() {
            world.update();
        },
        
        getWorld() {
            return world;
        },
        
        getPlayer() {
            return player;
        }
    };
})();



function setup() {
    Input.setup();
    Game.Init();
    Graphics.setup();
}

function draw() {
    Game.update();
    Graphics.draw();
}

