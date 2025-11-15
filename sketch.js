let pianoImg;

function preload() {
    pianoImg = loadImage('piano.png');
}

function setup() {
    createCanvas(800, 320);
}

function draw() {
    background(240);
    image(pianoImg, 0, 0, width, height);
}