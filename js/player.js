const Player = (() => {
    const LEFT_TARGET = Vector.of(100, 400);
    const RIGHT_TARGET = Vector.of(900, 400);
    
    return class Player extends Unit {
        constructor() {
            super(LEFT_TARGET.x, LEFT_TARGET.y);
            this.inventory = new Inventory();
            this.setFireRate(10.0);
            this.maxVelocity = 4.0;
            
            this.target = RIGHT_TARGET;
        }
        
        setFireRate(rate) {
            this.fireInterval = (1.0 / rate) * 1000.0;
            this.nextAllowedFire = new Date().getTime();
        }
        
        doBehavior() {
            let threshold = 50;
            let dst = this.pos.distance(this.target);
            if(dst > threshold) {
                this.steering.seek(this.target, threshold);
            } else {
                if(this.target === LEFT_TARGET) {
                    this.target = RIGHT_TARGET;
                } else {
                    this.target = LEFT_TARGET;
                }
            }
            
            if(Input.isMousePressed()) {
                this.fireBullet();
            }
        }
        
        fireBullet() {
            let now = new Date().getTime();
            if(now >= this.nextAllowedFire) {
                this.nextAllowedFire = now + this.fireInterval;
            } else {
                return;
            }
            
            let playerPos = Game.getPlayer().pos;
            let mousePos = Input.getMousePos();
            let dir = Math.atan2(mousePos.y - playerPos.y, mousePos.x - playerPos.x);
            let offset = Graphics.toRadians(30.0);
            let dir1 = dir + offset;
            let dir2 = dir - offset;
            let anchorPos = Graphics.getBulletAnchor();
            Game.getWorld().addGameObject(new Bullet(anchorPos, dir, 20.0));
            Game.getWorld().addGameObject(new Bullet(anchorPos, dir1, 20.0));
            Game.getWorld().addGameObject(new Bullet(anchorPos, dir2, 20.0));
        }
    };
})();