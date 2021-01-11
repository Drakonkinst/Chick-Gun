function mouseClicked() {
    Input.mouseClicked();
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

        getMousePos() {
            // TODO: Could optimize to only create new vector once per tick
            return new Vector(mouseX, mouseY);
        },

        isMousePressed() {
            return mouseIsPressed && mouseButton === LEFT;
        }
    };
})();