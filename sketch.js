let pianoImg;
let oscillators = [];
let keys = [];
let audioStarted = false;

function preload() {
    pianoImg = loadImage('piano.png');
}

function setup() {
    createCanvas(800, 320);
    setupKeys();

    for (let i = 0; i < keys.length; i++) {
        oscillators[i] = new p5.Oscillator('sine');
        oscillators[i].amp(0);
        oscillators[i].freq(keys[i].freq);
    }
}

function setupKeys() {
    let startX = 44;
    let startY = 55;
    let whiteW = 51;
    let whiteH = 170;
    let blackW = 31;
    let blackH = 112;

    let whitePositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    let blackPositions = [
        {after: 0, offset: 0.65},
        {after: 1, offset: 0.65},
        {after: 3, offset: 0.65},
        {after: 4, offset: 0.65},
        {after: 5, offset: 0.65},
        {after: 7, offset: 0.65},
        {after: 8, offset: 0.65},
        {after: 10, offset: 0.65},
        {after: 11, offset: 0.65},
        {after: 12, offset: 0.65}
    ];

    let allNotes = [
        {name: 'C (도)', freq: 261.63, white: true, pos: 0},
        {name: 'C#', freq: 277.18, white: false, blackIdx: 0},
        {name: 'D (레)', freq: 293.66, white: true, pos: 1},
        {name: 'D#', freq: 311.13, white: false, blackIdx: 1},
        {name: 'E (미)', freq: 329.63, white: true, pos: 2},
        {name: 'F (파)', freq: 349.23, white: true, pos: 3},
        {name: 'F#', freq: 369.99, white: false, blackIdx: 2},
        {name: 'G (솔)', freq: 392.00, white: true, pos: 4},
        {name: 'G#', freq: 415.30, white: false, blackIdx: 3},
        {name: 'A (라)', freq: 440.00, white: true, pos: 5},
        {name: 'A#', freq: 466.16, white: false, blackIdx: 4},
        {name: 'B (시)', freq: 493.88, white: true, pos: 6},
        {name: 'C5 (도)', freq: 523.25, white: true, pos: 7},
        {name: 'C5#', freq: 554.37, white: false, blackIdx: 5},
        {name: 'D5 (레)', freq: 587.33, white: true, pos: 8},
        {name: 'D5#', freq: 622.25, white: false, blackIdx: 6},
        {name: 'E5 (미)', freq: 659.25, white: true, pos: 9},
        {name: 'F5 (파)', freq: 698.46, white: true, pos: 10},
        {name: 'F5#', freq: 739.99, white: false, blackIdx: 7},
        {name: 'G5 (솔)', freq: 783.99, white: true, pos: 11},
        {name: 'G5#', freq: 830.61, white: false, blackIdx: 8},
        {name: 'A5 (라)', freq: 880.00, white: true, pos: 12},
        {name: 'A5#', freq: 932.33, white: false, blackIdx: 9},
        {name: 'B5 (시)', freq: 987.77, white: true, pos: 13}
    ];

    for (let note of allNotes) {
        if (note.white) {
            keys.push({
                name: note.name,
                freq: note.freq,
                x: startX + note.pos * whiteW,
                y: startY,
                w: whiteW - 1,
                h: whiteH,
                isBlack: false,
                isPressed: false
            });
        }
    }

    for (let note of allNotes) {
        if (!note.white) {
            let blackInfo = blackPositions[note.blackIdx];
            let blackX = startX + blackInfo.after * whiteW + whiteW * blackInfo.offset;
            keys.push({
                name: note.name,
                freq: note.freq,
                x: blackX,
                y: startY,
                w: blackW,
                h: blackH,
                isBlack: true,
                isPressed: false
            });
        }
    }
}

function draw() {
    background(240);
    image(pianoImg, 0, 0, width, height);

    for (let key of keys) {
        if (key.isPressed) {
            if (key.isBlack) {
                fill(80, 80, 120, 150);
            } else {
                fill(180, 180, 220, 120);
            }
            noStroke();
            rect(key.x, key.y, key.w, key.h);
        }
    }

    fill(0);
    noStroke();
    textAlign(CENTER);
    textSize(16);
    if (!audioStarted) {
        text('아무 건반이나 클릭하여 피아노 연주를 시작하세요 🎈', width / 2, 25);
    } else {
        text('피아노 연주 중...🎶🪽', width / 2, 25);
    }

    fill(80, 80, 80);
    textSize(12);
    textAlign(LEFT);
    text('🐭👆마우스 위치: ' + mouseX + ', ' + mouseY, 10, height - 10);
}

function mousePressed() {
    if (!audioStarted) {
        userStartAudio();
        for (let osc of oscillators) {
            osc.start();
        }
        audioStarted = true;
    }

    for (let i = keys.length - 1; i >= 0; i--) {
        let key = keys[i];
        if (key.isBlack) {
            if (mouseX >= key.x && mouseX <= key.x + key.w &&
                mouseY >= key.y && mouseY <= key.y + key.h) {
                playNote(i);
                console.log('Black key pressed: ' + key.name);
                return;
            }
        }
    }

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (!key.isBlack) {
            if (mouseX >= key.x && mouseX <= key.x + key.w &&
                mouseY >= key.y && mouseY <= key.y + key.h) {
                playNote(i);
                console.log('White key pressed: ' + key.name);
                return;
            }
        }
    }
}

function mouseReleased() {
    for (let i = 0; i < oscillators.length; i++) {
        oscillators[i].amp(0, 0.1);
        keys[i].isPressed = false;
    }
}

function playNote(index) {
    oscillators[index].amp(0.4, 0.05);
    keys[index].isPressed = true;
    console.log('Playing: ' + keys[index].name + ' - ' + keys[index].freq + ' Hz');
}