const Player = (() => {
    const PATH = [Vector.of(300, 240), Vector.of(1700, 240), Vector.of(1700, 1360), Vector.of(300, 1360)];
    let pathIndex = 0;
    
    const Gun1 = new Gun("gun1", "Gun", 10.0, 25.0, 5.0, 3.5, function (anchor, dir, gun) {
        let offset = Graphics.toRadians(15.0);
        let bulletTemplate = new Bullet({
            "size": 10,
            "speed": 10.0,
            "color": "blue",
            "damage": 1,
            "isBouncy": true
        });
        bulletTemplate.isBouncy = true;
        gun.fireBullet(anchor, dir, bulletTemplate);
        gun.fireBullet(anchor, dir + offset, bulletTemplate);
        gun.fireBullet(anchor, dir - offset, bulletTemplate);
    });
    const Gun2 = new Gun("gun2", "Gun", 7.5, 35.0, 5.0, 7.5, function (anchor, dir, gun) {
        let bulletTemplate = new Bullet({
            "size": 15,
            "speed": 5.0,
            "color": "orange",
            "damage": 3,
            "isBouncy": true
        });
        gun.fireBullet(anchor, dir, bulletTemplate);
    });
    
    return class Player extends Unit {
        constructor() {
            super(PATH[pathIndex].x, PATH[pathIndex].y);
            this.inventory = new Inventory();
            this.maxVelocity = 2.0;
            
            this.setNextPathTarget();
            this.setCurrentGun(Gun1);
            
            this.health = 75.0;
            this.maxHealth = 100.0;
        }
        
        setFireRate(rate) {
            this.fireInterval = (1.0 / rate) * 1000.0;
            this.nextAllowedFire = performance.now();
        }
        
        setNextPathTarget() {
            let next;
            do {
                next = ~~(Math.random() * PATH.length);
            } while(next === pathIndex);
            //let next = (pathIndex + 1) % PATH.length;
            this.target = PATH[next];
            pathIndex = next;
            
            //this.currentPath = Game.getWorld().getFollowTask(this.pos, this.target);
        }
        
        calculatePath() {
            
        }
        doBehavior() {
            
            // gun input
            if(Input.isMousePressed()) {
                this.fireGun();
            }
            
            // NOTE: big performance hit here, calculate paths live
            let attempts = 0;
            //this.currentPath = Game.getWorld().getFollowTask(this.pos, this.target);
            /*
            while(attempts < 100 && this.currentPath == null) {
                this.setNextPathTarget();
                this.currentPath = Game.getWorld().getFollowTask(this.pos, this.target);
                attempts++;
            }

            if(this.currentPath == null) {
                //console.error("Error: max attempts eached to find path")
                this.velocity = Vector.of(0, 0);
                return;
            }
            
            let seekPos = this.currentPath.update(this.pos);
            attempts = 0;
            while(attempts < 100 && seekPos == null) {
                console.warn("Warning: Null seek pos");
                this.setNextPathTarget();
                this.calculatePath();
                seekPos = this.currentPath.update(this.pos);
                attempts++;
            }
            
            if(seekPos == null) {
                console.log("Error: Max attempts reaches to calculate new seekPos!");
                this.velocity = Vector.of(0, 0);
                return;
            }
            
            this.steering.seek(seekPos, 0);*/
            
            
            /*
            this.doAvoidBehavior();
            
            // min player speed = 0.75 * max
            
            let magnitude = this.velocity.magnitude();
            if(magnitude < 0.75 * this.maxVelocity) {
                this.velocity.scaleToMagnitude(this.maxVelocity * 0.75)
            }
            //*/
        }
        
        doAvoidBehavior() {
            // calculate points to check
            const AHEAD_MULTIPLIER = 50.0;
            const AHEAD_ANGLE = Graphics.toRadians(30.0);
            const MIN_AVOID_DISTANCE = 25;
            const MAX_AVOID_DISTANCE = 100;
            let aheadDistance = AHEAD_MULTIPLIER * this.velocity.magnitude();
            let p1 = Vector.of(
                this.pos.x + aheadDistance * FastMath.cos(this.facing),
                this.pos.y + aheadDistance * FastMath.sin(this.facing));
            let p2 = Vector.of(
                this.pos.x + (aheadDistance / 2) * FastMath.cos(this.facing + AHEAD_ANGLE),
                this.pos.y + (aheadDistance / 2) * FastMath.sin(this.facing + AHEAD_ANGLE));
            let p3 = Vector.of(
                this.pos.x + (aheadDistance / 2) * FastMath.cos(this.facing + AHEAD_ANGLE),
                this.pos.y + (aheadDistance / 2) * FastMath.sin(this.facing + AHEAD_ANGLE));
            let p4 = Vector.of(
                this.pos.x + (aheadDistance / 2) * FastMath.cos(this.facing),
                this.pos.y + (aheadDistance / 2) * FastMath.sin(this.facing));
            
            // check nearby objects at every point
            let pointsToCheck = [p1, p2, p3, p4, this.pos];
            let keysChecked = [];
            let objectsChecked = [];
            let world = Game.getWorld();
            let map = world.gameObjectMap;
            
            let outOfBounds = false;
            for(let point of pointsToCheck) {
                if(world.isOutOfBounds(point)) {
                    outOfBounds = true;
                }
                
                let key = map.key(point);
                if(key in keysChecked) {
                    continue;
                }
                keysChecked.push(key);
                let nearbyObjects = map.querySingle(this.pos);
                for(let obj of nearbyObjects) {
                    if(obj in objectsChecked) {
                        continue;
                    }
                    objectsChecked.push(obj);
                    if(obj instanceof Breakable) {
                        if(obj.isCollision(point)) {
                            let distance = this.pos.distance(obj.pos);
                            if(distance < MAX_AVOID_DISTANCE) {
                                let strength = (MAX_AVOID_DISTANCE - distance) / (MAX_AVOID_DISTANCE - MIN_AVOID_DISTANCE);
                                this.steering.flee(obj.pos, this.maxVelocity * strength);
                            }
                        }
                    }
                }
            }
            
            /*
            if(outOfBounds) {
                this.steering.seek(world.getWorldCenter());
            }*/
            
            /*
            // avoid boxes
            let nearbyObjects = Game.getWorld().gameObjectMap.queryNearby(this.pos);
            let minDist = 25;
            let maxDist = 100;
            let closestObj = null;
            for(let obj of nearbyObjects) {
                if(obj instanceof Breakable) {
                    let distance = this.pos.distance(obj.pos);
                    if(distance < maxDist) {
                        this.steering.flee(obj.pos, this.maxVelocity * ((maxDist - distance) / (maxDist - 25)));
                        if(distance < minDist) {
                            minDist = distance;
                            closestObj = obj;
                        }
                    } else if(distance < 100) {
                        //this.steering.flee(obj.pos, this.maxVelocity / 2);
                    }
                }
            }

            if(closestObj != null) {
                //this.steering.flee(closestObj.pos);
            }*/
        }
        
        fireGun() {
            let now = performance.now();
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
                this.setCurrentGun(Gun2);
            } else {
                this.setCurrentGun(Gun1);
            }
        }
        
        setCurrentGun(gun) {
            this.currentGun = gun;
            this.setFireRate(gun.fireRate);
        }
    };
})();