const World = (() => {
    return class World {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.gameObjectList = [];
        }
        
        update() {
            Game.getPlayer().update();
            
            for(let i = this.gameObjectList.length - 1; i >= 0; --i) {
                let gameObject = this.gameObjectList[i];
                if(this.isOutOfBounds(gameObject)) {
                    this.gameObjectList.splice(i, 1);
                }
                gameObject.update();
            }
        }
        
        addGameObject(gameObject) {
            this.gameObjectList.push(gameObject);
        }
        
        isOutOfBounds(gameObject) {
            let x = gameObject.pos.x;
            let y = gameObject.pos.y;
            return x < 0.0 || x >= this.width || y < 0.0 || y >= this.height;
        }
    };
})();