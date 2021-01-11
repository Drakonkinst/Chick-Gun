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
        textSize(16);
    }
    
    return {
        toRadians,
        toDegrees,
        
        setup() {
            let world = Game.getWorld();
            createCanvas(world.width, world.height);
        },
        
        getBulletAnchor() {
            let playerPos = Game.getPlayer().pos;
            let x = playerPos.x;
            let y = playerPos.y;
            let mousePos = Input.getMousePos();
            let dir = Math.atan2(mousePos.y - playerPos.y, mousePos.x - playerPos.x);
            const lengthFront = 50.0;

            let frontX = x + (lengthFront / 2) * Math.cos(dir);
            let frontY = y + (lengthFront / 2) * Math.sin(dir);
            return Vector.of(frontX, frontY);
        },
        
        draw() {
            clear();
            reset();
            background(200);
            
            this.drawGameObjects();
            this.drawUnit(Game.getPlayer());
            this.drawGun(Game.getPlayer().pos);
            
            this.drawUI();
            
        },
        
        drawUI() {
            let numObjects = Game.getWorld().gameObjectList.length + 1; // + player
            stroke(0);
            textAlign(LEFT);
            text("Number of Game Objects: " + numObjects, 25, 25);
        },
        
        drawGameObjects() {
            let gameObjects = Game.getWorld().gameObjectList;
            for(let gameObject of gameObjects) {
                if(gameObject instanceof Bullet) {
                    this.drawBullet(gameObject);
                }
            }    
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
        drawGun(anchorPos) {
            let playerPos = Game.getPlayer().pos;
            let x = playerPos.x;
            let y = playerPos.y;
            let mousePos = Input.getMousePos();
            let dir = Math.atan2(mousePos.y - playerPos.y, mousePos.x - playerPos.x);
            const offset = Graphics.toRadians(90.0);
            let leftDir = dir + offset;
            let rightDir = dir - offset;
            
            const width = 10.0;
            const lengthFront = 50.0;
            const lengthBack = 10.0;
            
            let backX = x - (lengthBack / 2) * Math.cos(dir);
            let backY = y - (lengthBack / 2) * Math.sin(dir);
            let frontX = x + (lengthFront / 2) * Math.cos(dir);
            let frontY = y + (lengthFront / 2) * Math.sin(dir);
            
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
            fill("blue");
            ellipse(bullet.pos.x, bullet.pos.y, 10);
        }
    };
})();