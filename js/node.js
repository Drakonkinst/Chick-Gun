const Node = (() => {
    return class Node {
        
        constructor(x, y, worldPos) {
            this.x = x;
            this.y = y;
            this.pos = worldPos;
            this.walkable = true;
            this.color = false;
            this.heapIndex = -1;
            this.reset();
        }
        
        reset() {
            this.gCost = -1;
            this.hCost = -1;
            this.parent = null;
            this.heapIndex = -1;
        }
        
        // this might be dynamic, so making it a logic method for now
        canWalk() {
            return this.walkable;
        }
        
        getFCost() {
            return this.gCost + this.hCost;
        }
        
        compareTo(other) {
            let compare = this.getFCost() - other.getFCost();
            if(compare == 0) {
                compare = this.hCost - other.hCost;
            }
            return -compare;
        }
    };
})();