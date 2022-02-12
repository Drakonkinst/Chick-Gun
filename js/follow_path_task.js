const FollowPathTask = (() => {
    const DIST_SUCCESS = 150;
    const SKIP_DISTANCE = 3;
    return class FollowPathTask {
        constructor(path, destinationPos) {
            this.path = path;
            this.destinationPos = destinationPos;
            this.pathIndex = 0;
            this.setCurrentTarget();
        }
        
        setCurrentTarget() {
            if(this.pathIndex < 0 || this.pathIndex >= this.path.length) {
                console.error("Error: path index out of bounds")
                return;
            }
            this.targetPos = this.path[this.pathIndex].pos;
            Game.temp.targetNode = this.path[this.pathIndex];
        }
        
        nextTarget() {
            this.pathIndex += SKIP_DISTANCE;
            if(this.pathIndex >= this.path.length) {
                this.pathIndex = this.path.length - 1;
            }
            if(this.pathIndex >= this.path.length - 1) {
                this.targetPos = this.destinationPos;
            } else {
                this.setCurrentTarget();
            }
        }
        
        // returns position to seek, or null if done
        update(currPos) {
            if(this.targetPos == null) {
                console.error("Error: No target pos set");
                return null;
            }
            while(currPos.distanceSquared(this.targetPos) <= DIST_SUCCESS) {
                if(this.pathIndex >= this.path.length - 1) {
                    // done
                    console.log("Finished path");
                    return null;
                }
                this.nextTarget();
            }
            return this.targetPos;
        }
    };
})();