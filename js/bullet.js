const Bullet = (() => {
    const DEFAULT_SIZE = 10.0;
    const DEFAULT_SPEED = 10.0;
    const DEFAULT_COLOR = "blue";
    const DEFAULT_DAMAGE = 1;
    function setIfEmpty(obj, prop, value) {
        if(!obj.hasOwnProperty(prop)) {
            obj[prop] = value;
        }    
    }
    
    return class Bullet extends GameObject {
        constructor(options) {
            super(Vector.of(-100, -100));
            this.options = options;
            setIfEmpty(this.options, "size", DEFAULT_SIZE);
            setIfEmpty(this.options, "speed", DEFAULT_SPEED);
            setIfEmpty(this.options, "color", DEFAULT_COLOR);
            setIfEmpty(this.options, "damage", DEFAULT_DAMAGE);
            setIfEmpty(this.options, "isBouncy", false);
            this.template = true;
        }
        
        create(pos, facing) {
            let bullet = new Bullet(this.options);
            bullet.pos = pos.copy();
            bullet.facing = facing;
            bullet.velocity = Vector.of(FastMath.cos(facing), FastMath.sin(facing)).scale(this.options.speed);
            bullet.template = false;
            return bullet;
        }
        
        update() {
            if(this.template) {
                return;
            }
            this.pos.add(this.velocity);
            
            if(Game.getWorld().isOutOfBounds(this)) {
                this.shouldDestroy = true;
            }
            
            let gameObjectList = Game.getWorld().gameObjectList;
            
            for(let gameObject of gameObjectList) {
                // we could do circle intersection with a dynamic hitbox, but
                // for now we'll just test the center point
                let collisionResult = gameObject.isCollision(this.pos);
                if(collisionResult > 0) {
                    if(gameObject instanceof Breakable) {
                        gameObject.damage(this.damage);
                        
                        if(this.options.isBouncy) {
                            // TODO if optimization needed, add a vector method to scale components
                            if(collisionResult === 1) {
                                // hit horizontal side, reverse x velocity sign
                                this.velocity = Vector.of(-this.velocity.x, this.velocity.y);
                            } else if(collisionResult === 2) {
                                // hit vertical side, reverse y velocity sign
                                this.velocity = Vector.of(this.velocity.x, -this.velocity.y);
                            } else {
                                this.shouldDestroy = true;
                            }
                        } else {
                            this.shouldDestroy = true;
                        }
                        
                    }
                }
            }
        }
        
        onDestroy() {
            
        }
    };
})(); 