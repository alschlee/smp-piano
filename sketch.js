let pianoImg;
let oscillators = [];
let keys = [];

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
        oscillators[i].start();
    }
}

function setupKeys() {
    let startX = 44;
    let startY = 55;
    let whiteW = 51;
    let whiteH = 170;
    let blackW = 31;
    let blackH = 112;

    let blackPositions = [
        {after: 0, offset: 0.65},
        {after: 1, offset: 0.65},
        {after: 3, offset: 0.65},
        {after: 4, offset: 0.65},
        {after: 5, offset: 0.65}
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
        {name: 'C5 (도)', freq: 523.25, white: true, pos: 7}
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
}