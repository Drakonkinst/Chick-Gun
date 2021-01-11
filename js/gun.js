const Gun = (() => {
    return class Gun {
        constructor(id, name, width, frontLength, backLength, onFire) {
            this.id = id;
            this.name = name;
            this.width = width;
            this.frontLength = frontLength;
            this.backLength = backLength;
            this.onFire = onFire;
        }
        
        fire(host, dir) {
            let anchor = Vector.of(
                host.x + this.frontLength * FastMath.cos(dir),
                host.y + this.frontLength * FastMath.sin(dir));
            this.onFire(anchor, dir, this);
        }
        
        fireBullet(anchor, dir, bulletTemplate) {
            let world = Game.getWorld();
            world.addGameObject(bulletTemplate.create(anchor, dir));
        }
        
    }
})();