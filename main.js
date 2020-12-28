var canvas;
var body;
var ctx;
var x = 75;
var y = 100;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var dragok = false;
var LINESPACE = 50;
var DOT_GAP = 10;
var textWidth = 50;
var NUM_LETTERS = 5;
var letters = new Array(NUM_LETTERS);
var alphabet = "abcdefghijklmnopqrstuvwxyz";

class Letter {
    constructor(x, y, char) {
        this.x = x;
        this.y = y;
        this.char = char;
    }
    setDim(width, height){
        this.width = width;
        this.height = height;
    }
}



function init() {
    x = 75;
    y = 100;

    canvas = document.getElementById("canvas");
    body = document.getElementsByTagName("BODY")[0];
    ctx = canvas.getContext("2d");

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    canvas.addEventListener('touchstart', touchDown, false);
    canvas.addEventListener('touchend', touchUp, false);
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    window.addEventListener('resize', resizeCanvas, false);

    genLetters();

    return setInterval(draw, 10);
}

function genLetters() {
    for (let i = 0; i < NUM_LETTERS; ++i) {
        letters[i] = new Letter(Math.random() * (WIDTH - 400) + 200, Math.random() * (HEIGHT - 400) + 200, char = alphabet[Math.floor(Math.random() * alphabet.length)]);
        measurement = ctx.measureText(letters[i].char);
        letters[i].setDim(measurement.width, measurement.height);
    }
}

function resizeCanvas() {
    init();
}

function draw() {
    clear();
    drawTriline();
    drawLetters();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawTriline() {
    ctx.setLineDash([]);
    ctx.strokeStyle = '#fc0515';
    ctx.beginPath();
    ctx.moveTo(0, (HEIGHT / 2) + LINESPACE);
    ctx.lineTo(WIDTH - 1, (HEIGHT / 2) + LINESPACE);
    ctx.stroke();

    ctx.strokeStyle = '#0da4e5';
    ctx.beginPath()
    ctx.moveTo(0, (HEIGHT / 2) - LINESPACE);
    ctx.lineTo(WIDTH - 1, (HEIGHT / 2) - LINESPACE);
    ctx.stroke();

    ctx.strokeStyle = '#0da4e5';
    ctx.setLineDash([15, 5]);
    ctx.beginPath();
    ctx.moveTo(0, (HEIGHT / 2));
    ctx.lineTo(WIDTH - 1, (HEIGHT / 2));
    ctx.stroke();
}

function drawLetters() {
    ctx.font = "160px Primary Penmanship";
    for (let i = 0; i < NUM_LETTERS; ++i) {
        ctx.fillText(letters[i].char, letters[i].x, letters[i].y);
    }
}

function myMove(e){
    if (dragok){
     x = e.pageX - canvas.offsetLeft;
     y = e.pageY - canvas.offsetTop;
    }
}

function touchMove(e){
    if (dragok){
     e.preventDefault();
     x = e.targetTouches[0].pageX - canvas.offsetLeft;
     y = e.targetTouches[0].pageY - canvas.offsetTop;
    }
}

function myDown(e){
    if (e.pageX > x + canvas.offsetLeft && e.pageX < x + textWidth +
    canvas.offsetLeft && e.pageY < y + canvas.offsetTop &&
    e.pageY > y - 100 + canvas.offsetTop){
     x = e.pageX - canvas.offsetLeft;
     y = e.pageY - canvas.offsetTop;
     dragok = true;
     canvas.onmousemove = myMove;
    }
}

function touchDown(touchE){
    let e = touchE.targetTouches[0];
    if (e.pageX < x + textWidth + canvas.offsetLeft && e.pageX > x +
                    canvas.offsetLeft && e.pageY < y + canvas.offsetTop &&
                    e.pageY > y - 100 + canvas.offsetTop){
        x = e.pageX - canvas.offsetLeft;
        y = e.pageY - canvas.offsetTop;
        dragok = true;
        canvas.addEventListener('touchmove', touchMove, false);
    }
}

function myUp(){
    dragok = false;
    canvas.onmousemove = null;
}

function touchUp(){
    dragok = false;
    canvas.removeEventListener('touchmove', touchMove, false);
}

init();