function mouseClicked() {
    Input.mouseClicked();
}

function mouseWheel(event) {
    Input.mouseWheel(event.delta)
}

function mousePressed() {
    Input.mousePressed();
}

const Input = (() => {
    return {
        setup() {

        },

        mouseClicked() {
            
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