const Breakable = (() => {
    const DAMAGE_TICKS = 10;
    
    function min4(a, b, c, d) {
        let arr = [a, b, c, d];
        let min = arr[0];
        let minInd = 0;
        for(let i = 1; i < arr.length; i++) {
            if(arr[i] < min) {
                min = arr[i];
                minInd = i;
            }
        }
        return minInd;
    }
    
    return class Breakable extends GameObject {
        constructor(pos, width, color, health) {
            super(pos);
            this.setHealth(health);
            this.width = width;
            this.color = color;
            this.damageTicks = 0; 
        }
        
        update() {
            if(this.damageTicks > 0) {
                this.damageTicks--;
            }
            if(this.width <= 1) {
                this.shouldDestroy = true;
            }
        }
        
        setHealth(health) {
            if(health < 0) {
                health = 0;
            }
            this.health = health;
            
            if(this.health == 0) {
                this.shouldDestroy = true;
            }
        }
        
        damage(count) {
            count = count || 1;
            
            // i-frame if already damaged
            if(this.damageTicks > 0) {
                return;
            }
            
            this.setHealth(this.health - count);
            this.width -= 5;
            this.damageTicks = DAMAGE_TICKS;
        }
        
        onDestroy() {
            
        }
        
        // square box
        // return 1 if horizontal border, 2 if vertical border - both are truthy
        isCollision(point) {
            let x = point.x;
            let y = point.y;
            let halfWidth = this.width / 2;
            let minX = this.pos.x - halfWidth;
            let minY = this.pos.y - halfWidth;
            let maxX = this.pos.x + halfWidth;
            let maxY = this.pos.y + halfWidth;
            const approximate = halfWidth / 2;
            
            if(x >= minX && x <= maxX && y >= minY && y <= maxY) {
                let deltaMinX = Math.abs(x - minX);
                let deltaMaxX = Math.abs(x - maxX);
                let deltaMinY = Math.abs(y - minY);
                let deltaMaxY = Math.abs(y - maxY);
                let closest = min4(deltaMinX, deltaMaxX, deltaMinY, deltaMaxY);
                
                if(closest === 0 || closest === 1) {
                    return 1;
                } else {
                    return 2
                }
            }
        }
    }
})();