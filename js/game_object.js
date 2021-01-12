const GameObject = (() => {
    return class GameObject {
        constructor(pos) {
            this.pos = pos;
            this.shouldDestroy = false;
            this.isStationary = false;
            this.lastCell = null;
        }
        
        update() {
            
        }
        
        updatePosition(map) {
            if(this.lastCell != null) {
                let currentCell = map.key(this.pos).toString();
                if(currentCell != this.lastCell) {
                    map.removeAtKey(this, this.lastCell);
                    map.insertAtKey(this, currentCell);
                    
                    this.lastCell = currentCell;
                }
            }    
        }
        
        onCreate() {
            
        }
        
        onDestroy() {
            
        }
        
        isCollision(point) {
            
        }
    };
})();