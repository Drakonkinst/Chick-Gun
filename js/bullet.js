const Bullet = (() => {
    return class Bullet extends GameObject {
        constructor(initialPos, facing, speed) {
            super(initialPos.copy());
            this.directionVector = Vector.of(FastMath.cos(facing), FastMath.sin(facing)).scale(speed);
        }
        
        update() {
            this.pos.add(this.directionVector);
        }
    };
})(); 