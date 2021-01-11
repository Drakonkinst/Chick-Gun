const Bullet = (() => {
    return class Bullet extends GameObject {
        constructor(size, speed, color, damage) {
            super(Vector.of(-100, -100));
            this.size = size;
            this.speed = speed;
            this.color = color;
            this.damage = damage || 1;
            this.template = true;
            this.isBouncy = false;
        }
        
        create(pos, facing) {
            let bullet = new Bullet(this.size, this.speed, this.color, this.damage);
            bullet.pos = pos.copy();
            bullet.facing = facing;
            bullet.velocity = Vector.of(FastMath.cos(facing), FastMath.sin(facing)).scale(this.speed);
            bullet.template = false;
            // todo: make an "options" object so we dont have to rewrite this for every bullet property - { isBouncy: true }
            // todo: can also apply this to the fundamental properties
            bullet.isBouncy = this.isBouncy;
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
                        
                        if(this.isBouncy) {
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