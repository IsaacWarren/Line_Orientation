class Letter {
    constructor(x, y, char) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.dragging = false;
        this.locked = false;
    }
    setDim(width, height){
        this.width = width;
        this.height = height;
    }
}

