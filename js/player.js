const Player = (() => {
    const LEFT_TARGET = Vector.of(100, 400);
    const RIGHT_TARGET = Vector.of(900, 400);
    
    const Gun1 = new Gun("gun1", "Gun", 10.0, 25.0, 5.0, function (anchor, dir, gun) {
        let offset = Graphics.toRadians(15.0);
        let bulletTemplate = new Bullet({
            "size": 10,
            "speed": 20.0,
            "color": "blue",
            "damage": 1,
            "isBouncy": true
        });
        bulletTemplate.isBouncy = true;
        gun.fireBullet(anchor, dir, bulletTemplate);
        gun.fireBullet(anchor, dir + offset, bulletTemplate);
        gun.fireBullet(anchor, dir - offset, bulletTemplate);
    });
    const Gun2 = new Gun("gun2", "Gun", 7.5, 35.0, 5.0, function (anchor, dir, gun) {
        let bulletTemplate = new Bullet({
            "size": 15,
            "speed": 10.0,
            "color": "orange",
            "damage": 3,
            "isBouncy": true
        });
        gun.fireBullet(anchor, dir, bulletTemplate);
    });
    
    return class Player extends Unit {
        constructor() {
            super(LEFT_TARGET.x, LEFT_TARGET.y);
            this.inventory = new Inventory();
            this.setFireRate(5.0);
            this.maxVelocity = 4.0;
            
            this.target = RIGHT_TARGET;
            this.currentGun = Gun1;
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
                this.fireGun();
            }
        }
        
        fireGun() {
            let now = new Date().getTime();
            if(now >= this.nextAllowedFire) {
                this.nextAllowedFire = now + this.fireInterval;
            } else {
                return;
            }
            
            let playerPos = Game.getPlayer().pos;
            let mousePos = Input.getMousePos();
            let dir = Math.atan2(mousePos.y - playerPos.y, mousePos.x - playerPos.x);
            this.currentGun.fire(this.pos, dir);
        }
        
        incrementGunChoice() {
            this.toggleGun();
        }
        
        decrementGunChoice() {
            this.toggleGun();    
        }
        
        toggleGun() {
            if(this.currentGun === Gun1) {
                this.currentGun = Gun2;
            } else {
                this.currentGun = Gun1;
            }
        }
    };
})();