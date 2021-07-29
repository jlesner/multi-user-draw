
var socket;
let h;
let palette;

function setup() {
    createCanvas(700, 500);
    background(51);
    colorMode(HSB, 360, 100, 100);
    socket = io.connect('http://localhost:3000');
    socket.on('mouse', newDrawing);
    h = 0;
    palette = [];

    for (let i = 0; i < width / 50; i++) {
        let newHue = i * (360 / (width / 50));
        let newColor = new pigment(newHue, i * 50, height - 50, i);
        console.log(`Added Hue: ${newHue}`);
        palette.push(newColor);
    }

    console.log(palette);
}

class pigment {
    constructor(h, x, y, id) {
        this.h = h;
        this.x = x;
        this.y = y;
        this.id = id;
    }

    setHue() {
        h = this.h;
    }
}

function draw() {
    noStroke();
    fill(h, 100, 100);
    square(0, 0, 50);

    for (let hue of palette) {
        fill(hue.h, 100, 100);
        square(hue.x, hue.y, 50);
    }
}

function newDrawing(data) {
    noStroke();
    fill(data.h, 50, 100);
    ellipse(data.x, data.y, 36, 36);
}

function mouseDragged() {
    console.log('Sending: (' + mouseX + ', ' + mouseY + ') and Color: (' + h + ')');

    var data = {
        x: mouseX,
        y: mouseY,
        h: h
    };
    socket.emit('mouse', data);

    noStroke();
    fill(h, 100, 100);
    ellipse(mouseX, mouseY, 36, 36);
}

function doubleClicked() {
    console.log("clicked");
    for (let hue of palette) {
        if ((mouseX > hue.x && mouseX < hue.x + 50) && (mouseY > height - 50)) {
            hue.setHue();
            console.log('Changed to color ID: ' + hue.id + '; Hue: ' + hue.h);
            break;
        }
    }
}

// function setHue(hue) {
//     h = hue;
// }

// function keyPressed() {
//     if (keyCode === 82) {
//         console.log("red");
//         setHue(0);
//     }
//     if (keyCode === 66) {
//         console.log("blue");
//         h = 230;
//     }
//     if (keyCode === 71) {
//         console.log("green");
//         h = 120;
//     }
// }