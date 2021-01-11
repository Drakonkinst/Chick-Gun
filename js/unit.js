const Unit = (() => {
    return class Unit extends GameObject {
        constructor(x, y) {
            super(Vector.of(x, y));
            this.velocity = Vector.of(0, 0);
            this.maxVelocity = 2.0;
            this.steering = new SteeringManager(this);
            this.facing = 0;
        }
        
        doBehavior() {
            
        }
        
        update() {
            this.doBehavior();
            this.steering.update();
            this.updateFacing();
        }

        updateFacing() {
            if(this.velocity.magnitudeSquared() > 0.0001) {
                this.facing = Math.atan2(this.velocity.y, this.velocity.x);
            }
        }
    };
})();