class Letter {
    constructor(x, y, char, sound_name) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.dragging = false;
        this.locked = false;
        this.sound = new Audio("https://isaacwarren.github.io/Line_Orientation/sounds/" + String(sound_name) + ".ogg");
    }
    setDim(width, height){
        this.width = width;
        this.height = height;
    }
}

