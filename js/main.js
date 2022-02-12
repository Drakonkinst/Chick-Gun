const Game = (() => {
    let world;
    let player;
    let playerCamera;
    let clock;
    
    let currentMSPerUpdate = 0;
    let sumUpdates = 0;
    let numUpdates = 0;
    let avgMSPerUpdate = 0;
    
    const WORLD_WIDTH = 2000;
    const WORLD_HEIGHT = 1600;
    const TICK_RATE = 10;   // 10 = nearly twice speed of draw rate (~20)
    
    function randomPos() {
        // Note: INCLUDES DECIMALS!
        const MARGIN = 50;
        return Vector.of(MARGIN + Math.random() * (WORLD_WIDTH - MARGIN), MARGIN + Math.random() * (WORLD_HEIGHT - MARGIN));
    }
    
    function randomColor() {
        return color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }
    
    return {
        // called during initialization
        Init() {
            Input.setup();
            
            world = new World(WORLD_WIDTH, WORLD_HEIGHT);
            player = new Player();
            playerCamera = new Camera(player);
            clock = setInterval(Game.update, TICK_RATE);
            world.addGameObject(player);
            world.addGameObject(playerCamera);
            Game.Start();
        },
        
        // called after initialization
        Start() {
            /*
            for(let i = 0; i < 200; i++) {
                world.addGameObject(new Breakable(randomPos(), Math.random() * 26 + 50, randomColor(), Math.random() * 5 + 3));
            }
            //world.addGameObject(new Breakable(Vector.of(500, 100), 500, randomColor(), 999))
            //world.addGameObject(new Breakable(Vector.of(500, 700), 500, randomColor(), 999));
            //*/
            
            let density = 0.3;
            let grid = world.nodeGrid.grid;
            for(let i = 0; i < grid.length; ++i) {
                for(let j = 0; j < grid[0].length; ++j) {
                    if(Math.random() < density) {
                        let node = grid[i][j];
                        node.walkable = false;
                    }
                }
            }
        },
        
        update() {
            let start = performance.now();
            world.update();
            
            let end = performance.now();
            let elapsed = end - start;
            currentMSPerUpdate = elapsed;
            sumUpdates += elapsed;
            numUpdates++;
            avgMSPerUpdate = sumUpdates / numUpdates;
        },
        
        getWorld() {
            return world;
        },
        
        getPlayer() {
            return player;
        },
        
        getCamera() {
            return playerCamera;
        },
        
        getCurrentMSPerUpdate() {
            return currentMSPerUpdate;
        },
        
        getAverageMSPerUpdate() {
            return avgMSPerUpdate;
        },
        
        // storing temporary display variables
        temp: {}
    };
})();

/*
// document ready
$(function() {
    Game.Start();
});
*/
