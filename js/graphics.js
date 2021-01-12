const Graphics = (() => {
    const WINDOW_WIDTH = 1000;
    const WINDOW_HEIGHT = 800;
    
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
        
        getCameraOffset(cameraPos) {
            return Vector.of(-cameraPos.x + width / 2, -cameraPos.y + height / 2);
        },
        
        // initialization phase
        setup() {
            Game.Init();
            createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
        },
        
        draw() {
            clear();
            reset();
            background(200);
            
            let cameraPos = Game.getCamera().pos;
            let offset = this.getCameraOffset(cameraPos);
            translate(offset.x, offset.y);
            
            this.drawCells();
            
            this.drawGameObjects();
            this.drawPlayer();
            
            translate(-offset.x, -offset.y);
            this.drawUI();
            
        },
        
        // draws cells of spatial hashmap
        drawCells() {
            let world = Game.getWorld();
            let cellSize = world.getCellSize();
            let width = world.width;
            let height = world.height;
            stroke(0);
            strokeWeight(0.5);
            
            // adding + cellSize padding so a border shows up in bottom/right sides
            // vertical
            for(let i = 0; i < width + cellSize; i += cellSize) {
                line(i, 0, i, height);
            }
            
            // horizontal
            for(let j = 0; j < height + cellSize; j += cellSize) {
                line(0, j, width, j);
            }
        },
        
        drawUI() {
            stroke(0);
            fill(0);
            strokeWeight(0.5);
            
            textAlign(LEFT);
            
            let numObjects = Game.getWorld().gameObjectList.length;
            text("Number of Game Objects: " + numObjects, 25, 25);
            text("CLICK to Fire, SCROLL to Select Weapon", 25, 40);
            
            textAlign(RIGHT);
            let fps = frameRate();
            text("FPS: " + fps.toFixed(2), width - 25, 25);
            text("MS per Update: " + Game.getCurrentMSPerUpdate().toFixed(2), width - 25, 40);
            text("Avg MS: " + Game.getAverageMSPerUpdate().toFixed(2), width - 25, 55);
            
            const HEALTH_BAR_WIDTH = 250;
            const HEALTH_BAR_HEIGHT = 25;
            let player = Game.getPlayer();
            let healthPercent = player.health / player.maxHealth;
            noStroke();
            fill(150);
            rect(25, height - 25 - HEALTH_BAR_HEIGHT, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
            fill(color(250, 77, 77));
            rect(25, height - 25 - HEALTH_BAR_HEIGHT, HEALTH_BAR_WIDTH * healthPercent, HEALTH_BAR_HEIGHT);
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
            this.drawPlayerAvoidSight();
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
            reset();
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
        },
        
        drawPlayerAvoidSight() {
            let player = Game.getPlayer();
            let aheadDistance = 50.0 * player.velocity.magnitude();
            console.log(aheadDistance);
            let facing = player.facing;
            let x = player.pos.x;
            let y = player.pos.y;
            
            let halfAheadDistance = aheadDistance / 2.0;
            let interval = toRadians(30.0);
            let a2 = facing + interval;
            let a3 = facing - interval;
            
            let p1 = Vector.of(
                x + aheadDistance * FastMath.cos(facing),
                y + aheadDistance * FastMath.sin(facing));
            let p2 = Vector.of(
                x + halfAheadDistance * FastMath.cos(a2),
                y + halfAheadDistance * FastMath.sin(a2));
            let p3 = Vector.of(
                x + halfAheadDistance * FastMath.cos(a3),
                y + halfAheadDistance * FastMath.sin(a3));
            let p4 = Vector.of(
                x + halfAheadDistance * FastMath.cos(facing),
                y + halfAheadDistance * FastMath.sin(facing));
            
            stroke(0);
            line(x, y, p1.x, p1.y);
            line(x, y, p2.x, p2.y);
            line(x, y, p3.x, p3.y);
            
            let objs = [];
            let pts = [p1, p2, p3, p4, player.pos];
            let map = Game.getWorld().gameObjectMap;
            
            stroke("blue");
            strokeWeight(2.0);
            for(let pt of pts) {
                let list = map.querySingle(pt);
                for(let obj of list) {
                    if(obj instanceof Breakable && !(obj in objs) && obj.isCollision(pt)) {
                        objs.push(obj);
                        line(x, y, obj.pos.x, obj.pos.y);
                    }
                }    
            }
            
            reset();
        }
    };
})();

function setup() {
    Graphics.setup();
}

function draw() {
    Graphics.draw();
}