var canvas_letters;
var canvas_line;
var body;
var ctx_letter;
var ctx_line
var config;
var err_text = document.getElementById("Err_Text");
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var LINESPACE = 50;
var SNAP_RANGE = 10;
var NUM_SOUNDS = 16;
var letters;

async function get_config() {
    code_textbox = document.getElementById("code_textbox");
    try {
        var response = await fetch(API_URL + "/" + code_textbox.value.toUpperCase());
    } catch(error) {
        err_text.innerHTML = error;
    }
    config = await response.json();
}

async function handle_start() {
    await get_config();
    if (!config) {
        err_text.innerHTML = "Invalid Code";
    } else {
        activity_init();
    }
}

function init() {
    let code_btn = document.getElementById('code-button');
    code_btn.addEventListener('click', handle_start, false);
}

function activity_init() {
    canvas_letters = document.getElementById("canvas_letters");
    canvas_line = document.getElementById("canvas_line");
    body = document.getElementsByTagName("BODY")[0];
    ctx_letter = canvas_letters.getContext("2d");
    ctx_line = canvas_line.getContext("2d");
    code_box = document.getElementsByClassName("center")[0];

    code_box.style = "visibility: hidden;"
    canvas_letters.style = "";
    canvas_line.style = "";

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    ctx_letter.canvas.width = window.innerWidth;
    ctx_letter.canvas.height = window.innerHeight;
    ctx_letter.font = "165px Primary Penmanship";
    ctx_line.canvas.width = window.innerWidth;
    ctx_line.canvas.height = window.innerHeight;

    canvas_letters.addEventListener('touchstart', touchDown, false);
    canvas_letters.addEventListener('touchend', upHandler, false);
    canvas_letters.addEventListener('touchmove', touchMove, false);
    canvas_letters.onmousedown = mouseDown;
    canvas_letters.onmouseup = upHandler;
    canvas_letters.onmousemove = myMove;
    window.addEventListener('resize', resizeCanvas, false);

    letters = new Array(config.alphabet.length);

    genLetters();

    drawTriline();

    return setInterval(draw, 10);
}

function genLetters() {
    for (let i = 0; i < config.alphabet.length; ++i) {
        letters[i] = new Letter(Math.random() * (WIDTH - 400) + 200, Math.random() * (HEIGHT - 400) + 200,
                        config.alphabet[i],
                        Math.floor(Math.random() * NUM_SOUNDS));
        let measurement = ctx_letter.measureText(letters[i].char);
        letters[i].setDim(measurement.width, measurement.height);
    }
}

function resizeCanvas() {
    activity_init();
}

function draw() {
    clear();
    drawLetters();
}

function clear() {
    ctx_letter.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawTriline() {
    ctx_line.setLineDash([]);
    ctx_line.strokeStyle = '#fc0515';
    ctx_line.beginPath();
    ctx_line.moveTo(0, (HEIGHT / 2) + LINESPACE);
    ctx_line.lineTo(WIDTH - 1, (HEIGHT / 2) + LINESPACE);
    ctx_line.stroke();

    ctx_line.strokeStyle = '#0da4e5';
    ctx_line.beginPath()
    ctx_line.moveTo(0, (HEIGHT / 2) - LINESPACE);
    ctx_line.lineTo(WIDTH - 1, (HEIGHT / 2) - LINESPACE);
    ctx_line.stroke();

    ctx_line.strokeStyle = '#0da4e5';
    ctx_line.setLineDash([15, 5]);
    ctx_line.beginPath();
    ctx_line.moveTo(0, (HEIGHT / 2));
    ctx_line.lineTo(WIDTH - 1, (HEIGHT / 2));
    ctx_line.stroke();
}

function drawLetters() {
    for (let i = 0; i < config.alphabet.length; ++i) {
        ctx_letter.fillText(letters[i].char, letters[i].x, letters[i].y);
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
    for (let i = 0; i < config.alphabet.length; ++i) {
        if (letters[i].dragging){
            letters[i].x = e.pageX - canvas_letters.offsetLeft;
            letters[i].y = e.pageY - canvas_letters.offsetTop;
            if (Math.abs(letters[i].y - ((HEIGHT / 2) + LINESPACE)) < SNAP_RANGE) {
                letters[i].dragging = false;
                //letters[i].locked = true;
                letters[i].sound.play();
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
    for (let i = 0; i < config.alphabet.length; ++i) {
        if (!letters[i].locked && e.pageX < letters[i].x + 100 + canvas_letters.offsetLeft && e.pageX > letters[i].x +
            canvas_letters.offsetLeft && e.pageY < letters[i].y + canvas_letters.offsetTop &&
            e.pageY > letters[i].y - 100 + canvas_letters.offsetTop){
        letters[i].x = e.pageX - canvas_letters.offsetLeft;
        letters[i].y = e.pageY - canvas_letters.offsetTop;
        letters[i].dragging = true;
        break;
        }
    }
}

function upHandler(e) {
    for (let i = 0; i < config.alphabet.length; ++i) {
        if (letters[i].dragging) {
            letters[i].dragging = false;
        }
    }
}

init();