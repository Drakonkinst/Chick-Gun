const Graphics = (() => {
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    function vectorVertex(vector) {
        vertex(vector.x, vector.y);
    }

    function reset() {
        stroke(0);
        strokeWeight(1);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(15);
    }
    
    return {
        toRadians,
        toDegrees,
        
        // initialization phase
        setup() {
            Game.Init();
            let world = Game.getWorld();
            createCanvas(world.width, world.height);
        },
        
        draw() {
            clear();
            reset();
            background(200);
            
            
            
            this.drawGameObjects();
            this.drawPlayer();
            
            this.drawUI();
            
        },
        
        drawUI() {
            stroke(0);
            textAlign(LEFT);
            
            let numObjects = Game.getWorld().gameObjectList.length;
            text("Number of Game Objects: " + numObjects, 25, 25);
            text("CLICK to Fire, SCROLL to Select Weapon", 25, 40);
            
            textAlign(RIGHT);
            let fps = frameRate();
            text("FPS: " + fps.toFixed(2), width - 25, 25);
            text("MS per Update: " + Game.getCurrentMSPerUpdate().toFixed(2), width - 25, 40);
            text("Avg MS: " + Game.getAverageMSPerUpdate().toFixed(2), width - 25, 55);
        },
        
        drawGameObjects() {
            let gameObjects = Game.getWorld().gameObjectList;
            for(let gameObject of gameObjects) {
                if(gameObject === Game.getPlayer()) {
                    continue;
                }
                if(gameObject instanceof Bullet) {
                    this.drawBullet(gameObject);
                } else if(gameObject instanceof Breakable) {
                    this.drawBreakable(gameObject);
                }
            }    
        },
        
        drawPlayer() {
            let player = Game.getPlayer();
            let mousePos = Input.getMousePos();
            let x = player.pos.x;
            let y = player.pos.y;
            let dir = Math.atan2(mousePos.y - y, mousePos.x - x);
            this.drawUnit(player);
            this.drawGun(player.pos, dir, player.currentGun);
        },
        
        drawUnit: (() => {
            const PRIMARY_LENGTH = 30;
            const SECONDARY_LENGTH = PRIMARY_LENGTH / 2;
            const SECONDARY_ANGLE = toRadians(120);
            const PLAYER_COLOR = "red";

            return function (unit) {
                var pos = unit.pos;
                stroke(0);
                fill(PLAYER_COLOR);

                // get vertices of isoceles triangle
                var theta1 = unit.facing;
                var theta2 = theta1 + SECONDARY_ANGLE;
                var theta3 = theta1 - SECONDARY_ANGLE;

                // draw object in p5
                beginShape();
                vertex(pos.x, pos.y);
                vertex(pos.x + (SECONDARY_LENGTH * FastMath.cos(theta2)), pos.y + (SECONDARY_LENGTH * FastMath.sin(theta2)));
                vertex(pos.x + (PRIMARY_LENGTH * FastMath.cos(theta1)), pos.y + (PRIMARY_LENGTH * FastMath.sin(theta1)));
                vertex(pos.x + (SECONDARY_LENGTH * FastMath.cos(theta3)), pos.y + (SECONDARY_LENGTH * FastMath.sin(theta3)));
                endShape(CLOSE);
            }
        })(),
        
        // TODO player gun only for now but enemies could have guns later
        drawGun(anchorPos, dir, gun) {
            const x = anchorPos.x;
            const y = anchorPos.y;
            const width = gun.width;
            const lengthFront = gun.frontLength;
            const lengthBack = gun.backLength;
            
            const offset = Graphics.toRadians(90.0);
            let leftDir = dir + offset;
            let rightDir = dir - offset;
            
            let backX = x - lengthBack * Math.cos(dir);
            let backY = y - lengthBack * Math.sin(dir);
            let frontX = x + lengthFront * Math.cos(dir);
            let frontY = y + lengthFront * Math.sin(dir);
            
            fill("black");
            beginShape();
            vertex(backX + (width / 2) * Math.cos(leftDir), backY + (width / 2) * Math.sin(leftDir));
            vertex(frontX + (width / 2) * Math.cos(leftDir), frontY + (width / 2) * Math.sin(leftDir));
            vertex(frontX + (width / 2) * Math.cos(rightDir), frontY + (width / 2) * Math.sin(rightDir));
            vertex(backX + (width / 2) * Math.cos(rightDir), backY + (width / 2) * Math.sin(rightDir));
            endShape(CLOSE);
            //line(anchorPos.x, anchorPos.y, mousePos.x, mousePos.y);
        },
        
        drawBullet(bullet) {
            noStroke();
            fill(bullet.options.color);
            ellipse(bullet.pos.x, bullet.pos.y, bullet.options.size);
        },
        
        drawBreakable(breakable) {
            if(breakable.damageTicks > 0) {
                fill("red");
            } else {
                fill(breakable.color);
            }
            
            let halfWidth = breakable.width / 2;
            
            rect(breakable.pos.x - halfWidth, breakable.pos.y - halfWidth, breakable.width, breakable.width);
        }
    };
})();

function setup() {
    Graphics.setup();
}

function draw() {
    Graphics.draw();
}