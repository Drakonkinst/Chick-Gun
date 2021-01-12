const World = (() => {
    const CELL_SIZE = 100;
    
    return class World {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.gameObjectList = [];
            this.gameObjectMap = new SpatialHashMap(CELL_SIZE);
            this.isPaused = false;
            this.bouncyWalls = false;
        }
        
        update() {
            if(this.isPaused) {
                return;
            }
            
            //Game.getPlayer().update();
            
            let wasDestroyed = false;
            for(let i = this.gameObjectList.length - 1; i >= 0; --i) {
                let gameObject = this.gameObjectList[i];
                gameObject.update();
                
                if(gameObject.shouldDestroy) {
                    gameObject.onDestroy();
                    this.gameObjectList.splice(i, 1);
                    this.gameObjectMap.removeAtKey(gameObject, gameObject.lastCell);
                    wasDestroyed = true;
                    continue;
                }
                
                // move to different hashmap cell if needed
                if(!gameObject.isStationary) {
                    gameObject.updatePosition(this.gameObjectMap);
                }
            }
            
            if(wasDestroyed) {
                this.gameObjectMap.clean();
            }
        }
        
        addGameObject(gameObject) {
            this.gameObjectList.push(gameObject);
            let key = this.gameObjectMap.insert(gameObject);
            gameObject.lastCell = key.toString();
            gameObject.onCreate();
        }
        
        isOutOfBounds(pos) {
            let x = pos.x;
            let y = pos.y;
            return x < 0.0 || x >= this.width || y < 0.0 || y >= this.height;
        }
        
        getWorldCenter() {
            return Vector.of(this.width / 2, this.height / 2);
        }
        
        // get cell size for spatial hashmap
        getCellSize() {
            return CELL_SIZE;
        }
    };
})();