function mouseClicked() {
    Input.mouseClicked();
}

function mouseWheel(event) {
    Input.mouseWheel(event.delta)
}

function mousePressed() {
    Input.mousePressed();
}

function keyPressed() {
    return Input.onKey(keyCode);
}

const Input = (() => {
    const SPACE = 32;
    const ESCAPE = 27;
    const SHIFT = 16;
    
    const keyMap = {};
    let numKeyBinds = 0;
    
    function addOnKey(key, callback) {
        if(typeof key === "string") {
            key = key.charCodeAt(0);
        }

        if(!keyMap.hasOwnProperty(key)) {
            keyMap[key] = [];
        }
        let callbacks = keyMap[key];
        callbacks.push(callback);
        numKeyBinds++;
    }
    
    function togglePause() {
        let world = Game.getWorld();
        world.isPaused = !world.isPaused;
    }
    
    return {
        setup() {
            addOnKey("P", togglePause);
            addOnKey(SPACE, togglePause);
        },

        onKey(keyCode) {
            if(typeof keyCode === "string") {
                keyCode = keyCode.charCodeAt(0);
            }

            if(keyIsDown(SHIFT) || keyIsDown(CONTROL)) {
                return;
            }

            if(keyMap.hasOwnProperty(keyCode)) {
                let callbacks = keyMap[keyCode];
                for(let callback of callbacks) {
                    callback();
                }
                return false;
            }
        },
        
        mouseClicked() {
            let mousePos = Input.getMousePos();
            let mouseNode = Game.getWorld().nodeGrid.getNodeAt(mousePos);
            if(mouseNode != null) {
                mouseNode.walkable = !mouseNode.walkable;
            }
        },
        
        mousePressed() {
            
        },
        
        mouseWheel(delta) {
            if(delta > 0) {
                // Down
                Game.getPlayer().incrementGunChoice();
            } else {
                // Up
                Game.getPlayer().decrementGunChoice();
            }
        },

        getMousePos() {
            // TODO: Could optimize to only create new vector once per tick
            let pos = new Vector(mouseX, mouseY);
            let translateOffset = Graphics.getCameraOffset(Game.getCamera().pos);
            pos/*.divide(Graphics.getZoom())*/.subtract(translateOffset);

            return pos;
        },

        isMousePressed() {
            return mouseIsPressed && mouseButton === LEFT;
        }
    };
})();