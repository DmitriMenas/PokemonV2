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
playerUpImg.src = "./assets/characterside-up.png"

let playerRightImg = new Image();
playerRightImg.src = "./assets/characterside-right.png"

let playerLeftImg = new Image();
playerLeftImg.src = "./assets/characterside-left.png"


let player;

class Player {
    img;
    width = 46;
    height = 46;
    movingRight = false;
    movingLeft = false;
    movingUp = false;
    movingDown = false;
    speed = 3; 

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

    update () {
        // collision detection
        let dx = 0;
        let dy = 0;



        if (this.movingRight) {
            this.x += this.speed;
            this.img = playerRightImg;
        }
        if (this.movingLeft) {
            this.x -= this.speed;
            this.img = playerLeftImg;
        }
        if (this.movingUp) {
            this.y -= this.speed;
            this.img = playerUpImg;
        }
        if (this.movingDown) {
            this.y += this.speed;
            this.img = playerDownImg;
        }
    }
}

class CollisionBox {
    constructor (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

let CollisionBoxes = [];

// Add collision boxes
CollisionBoxes.push(new CollisionBox(0, 0, 800, 50));
CollisionBoxes.push(new CollisionBox(0, 0, 50, 600));
CollisionBoxes.push(new CollisionBox(750, 0, 50, 600));
CollisionBoxes.push(new CollisionBox(0, 550, 800, 50));

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

//hi

function startGame ()  {
    // Game prestart stuff
    player = new Player(200, 300);
    
    // Add keyboard event listeners
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    // Start update loop
    setInterval(update, 1000/60);
}

function update() {
    // Draw background
    context.drawImage(worldMap, 0, 0, canvas.width, canvas.height);

    // Draw player
    player.update();
    player.draw();
}

function keyDown (e) {
    switch (e.key) {
        // W or Up
        case "w":
        case "ArrowUp":
            player.movingUp = true;
            break;
        // S or Down
        case "s":
            case "ArrowDown":
                player.movingDown = true;
            break;
        // A or Left
        case "a":
        case "ArrowLeft":
            player.movingLeft = true;
            break;
        // D or Right
        case "d":
        case "ArrowRight":
            player.movingRight = true;
            break;
    }
}
function keyUp (e) {
    switch (e.key) {
        // W or Up
        case "w":
        case "ArrowUp":
            player.movingUp = false;
            break;
        // S or Down
        case "s":
            case "ArrowDown":
                player.movingDown = false;
            break;
        // A or Left
        case "a":
        case "ArrowLeft":
            player.movingLeft = false;
            break;
        // D or Right
        case "d":
        case "ArrowRight":
            player.movingRight = false;
            break;
    }
}