let canvas;
let canvasWidth = 800;
let canvasHeight = 600;
let context;

//title screen image
let startImage = new Image();
startImage.src = "./assets/pkmntitle.png";

//world map image
let worldMap = new Image();
worldMap.src = "./assets/world.png";

// Player images
let playerDownImg = new Image();
playerDownImg.src = "./assets/characterside-down.png"

let playerUpImg = new Image();
playerUpImg.src = "./assets/characterside-right.png"

let playerRightImg = new Image();
playerRightImg.src = "./assets/characterside-down.png"

let playerLeftImg = new Image();
playerLeftImg.src = "./assets/characterside-left.png"


let player;

class Player {
    img;
    width = 46;
    height = 46;

    // Create the player
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.img = playerDownImg;
    }

    draw () {
        console.log("drawing player");
        // Once image is loaded, draw the player
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.fillStyle = "black";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // press any key to start text
    context.font = "50px Arial";
    context.fillStyle = "white";
    context.fillText("Press Any Key to Start", canvasWidth* 1/6, canvasWidth / 2.5 );
    document.addEventListener("keydown", titleScreen);
}

function titleScreen() {
    context.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    document.removeEventListener("keydown", titleScreen);
    setTimeout(startGame, 2000);
}

function startGame ()  {
    // Game prestart stuff
    player = new Player(200, 300);
    
    // Start update loop
    setInterval(update, 1000/60);
}

function update() {
    // Draw background
    context.drawImage(worldMap, 0, 0, canvas.width, canvas.height);

    // Draw player
    player.draw();
}