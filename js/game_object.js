const GameObject = (() => {
    return class GameObject {
        constructor(pos) {
            this.pos = pos;
            this.shouldDestroy = false;
        }
        
        update() {
            
        }
        
        onDestroy() {
            
        }
        
        isCollision(point) {
            
        }
    };
})();