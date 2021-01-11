const Game = (() => {
    let world;
    let player;
    const WORLD_WIDTH = 1000;
    const WORLD_HEIGHT = 800;
    
    function randomPos() {
        // Note: INCLUDES DECIMALS!
        return Vector.of(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);
    }
    
    function randomColor() {
        return color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }
    
    return {
        Init() {
            player = new Player();
            world = new World(WORLD_WIDTH, WORLD_HEIGHT);
            world.addGameObject(player);
            
            for(let i = 0; i < 25; i++) {
                world.addGameObject(new Breakable(randomPos(), Math.random() * 51 + 50, randomColor(), Math.random() * 5 + 3));
            }
            
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

