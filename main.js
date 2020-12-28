var canvas;
var body;
var ctx;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var LINESPACE = 50;
var SNAP_RANGE = 10;
var NUM_LETTERS = 5;
var letters = new Array(NUM_LETTERS);
var lower_alphabet = "abcdefghijklmnopqrstuvwxyz";
var upper_alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var alphabet =  lower_alphabet + upper_alphabet;


function init() {

    canvas = document.getElementById("canvas");
    body = document.getElementsByTagName("BODY")[0];
    ctx = canvas.getContext("2d");

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    canvas.addEventListener('touchstart', touchDown, false);
    canvas.addEventListener('touchend', upHandler, false);
    canvas.addEventListener('touchmove', touchMove, false);
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = upHandler;
    canvas.onmousemove = myMove;
    window.addEventListener('resize', resizeCanvas, false);

    genLetters();

    return setInterval(draw, 10);
}

function genLetters() {
    for (let i = 0; i < NUM_LETTERS; ++i) {
        letters[i] = new Letter(Math.random() * (WIDTH - 400) + 200, Math.random() * (HEIGHT - 400) + 200, alphabet[Math.floor(Math.random() * alphabet.length)]);
        let measurement = ctx.measureText(letters[i].char);
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
    ctx.font = "165px Primary Penmanship";
    for (let i = 0; i < NUM_LETTERS; ++i) {
        ctx.fillText(letters[i].char, letters[i].x, letters[i].y);
    }
}

function myMove(e){
    moveHandler(e);
}

function touchMove(e){
    e.preventDefault();
    moveHandler(e.targetTouches[0]);
}

function moveHandler(e) {
    for (let i = 0; i < NUM_LETTERS; ++i) {
        if (letters[i].dragging){
            letters[i].x = e.pageX - canvas.offsetLeft;
            letters[i].y = e.pageY - canvas.offsetTop;
            if (Math.abs(letters[i].y - ((HEIGHT / 2) + LINESPACE)) < SNAP_RANGE) {
                letters[i].dragging = false;
                //letters[i].locked = true;
                letters[i].y = (HEIGHT / 2) + LINESPACE;
                party.position(letters[i].x, (HEIGHT / 2) + LINESPACE);
            }
        }
    }
}

function mouseDown(e){
    downHandler(e);
}

function touchDown(touchE){
    let e = touchE.targetTouches[0];
    downHandler(e);
}

function downHandler(e) {
    for (let i = 0; i < NUM_LETTERS; ++i) {
        if (!letters[i].locked && e.pageX < letters[i].x + 100 + canvas.offsetLeft && e.pageX > letters[i].x +
            canvas.offsetLeft && e.pageY < letters[i].y + canvas.offsetTop &&
            e.pageY > letters[i].y - 100 + canvas.offsetTop){
        letters[i].x = e.pageX - canvas.offsetLeft;
        letters[i].y = e.pageY - canvas.offsetTop;
        letters[i].dragging = true;
        break;
        }
    }
}

function upHandler(e) {
    for (let i = 0; i < NUM_LETTERS; ++i) {
        if (letters[i].dragging) {
            letters[i].dragging = false;
        }
    }
}

init();