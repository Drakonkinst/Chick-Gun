const Game = (() => {
    let world;
    let player;
    let clock;
    
    let currentMSPerUpdate = 0;
    let sumUpdates = 0;
    let numUpdates = 0;
    let avgMSPerUpdate = 0;
    
    const WORLD_WIDTH = 1000;
    const WORLD_HEIGHT = 800;
    const TICK_RATE = 10;   // 10 = nearly twice speed of draw rate (~20)
    
    function randomPos() {
        // Note: INCLUDES DECIMALS!
        return Vector.of(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT);
    }
    
    function randomColor() {
        return color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }
    
    return {
        // called during initialization
        Init() {
            Input.setup();
            player = new Player();
            world = new World(WORLD_WIDTH, WORLD_HEIGHT);
            clock = setInterval(Game.update, TICK_RATE);
            world.addGameObject(player);
        },
        
        // called after initialization
        Start() {
            for(let i = 0; i < 25; i++) {
                world.addGameObject(new Breakable(randomPos(), Math.random() * 51 + 50, randomColor(), Math.random() * 5 + 3));
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
        
        getCurrentMSPerUpdate() {
            return currentMSPerUpdate;
        },
        
        getAverageMSPerUpdate() {
            return avgMSPerUpdate;
        }
    };
})();

// document ready
$(function() {
    Game.Start();
});

