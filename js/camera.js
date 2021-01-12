const Camera = (() => {
    return class Camera extends Unit {
        constructor(anchor) {
            super(anchor.pos.x, anchor.pos.y);
            this.anchor = anchor;
            this.maxVelocity = 5.0;
        }
        
        doBehavior() {
            this.steering.seek(this.anchor.pos, 50 * this.maxVelocity);
        }
    }
})();