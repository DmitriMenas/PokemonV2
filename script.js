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
        // Once image is loaded, draw the player
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        this.updateMovement();
    }

    updateMovement () {
        // Amount to be moved
        let dx = 0;
        let dy = 0;

        if (this.movingRight) {
            dx += this.speed;
            this.img = playerRightImg;
        }
        if (this.movingLeft) {
            dx -= this.speed;
            this.img = playerLeftImg;
        }
        if (this.movingUp) {
            dy -= this.speed;
            this.img = playerUpImg;
        }
        if (this.movingDown) {
            dy += this.speed;
            this.img = playerDownImg;
        }

        // Process collisions
        for (let i = 0; i < collisionBoxes.length; i++) {
            let box = collisionBoxes[i];
            // Check x direction
            if (collideObjects(this.x + dx, this.y, this.width, this.height,
                box.x, box.y, box.width, box.height)) {
                // Collision in x direction
                dx = 0;
            }

             // Check y direction
            if (collideObjects(this.x, this.y + dy, this.width, this.height,
                box.x, box.y, box.width, box.height)) {
                // Collision in x direction
                dy = 0;
            }
        }

        this.x += dx;
        this.y += dy;

        // Don't fall off horizontal map edges
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        } else if (this.x < 0) {
            this.x = 0;
        }

        // Don't fall off vertial map edges
        if (this.y + this.height > canvasHeight) {
            this.y = canvasHeight - this.height;
        } else if (this.y < 0) {
            this.y = 0;
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

    draw () {
        context.fillStyle = "rgba(255,0,0,0.40)";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Collision boxes
let collisionBoxes = [];
collisionBoxes.push(new CollisionBox(544, 73, 129, 96));
collisionBoxes.push(new CollisionBox(34, 226, 160, 96));
collisionBoxes.push(new CollisionBox(514, 303, 97, 120));
collisionBoxes.push(new CollisionBox(674, 351, 127, 96));
collisionBoxes.push(new CollisionBox(258, 450, 156, 101));
collisionBoxes.push(new CollisionBox(3, 3, 800, 92));
collisionBoxes.push(new CollisionBox(1, 504, 64, 97));


// Collide two box objects
function collideObjects(obj1x, obj1y, obj1w, obj1h, obj2x, obj2y, obj2w, obj2h) {
    return obj1x + obj1w > obj2x && 
        obj1x < obj2x + obj2w && 
        obj1y + obj1h > obj2y && 
        obj1y < obj2y + obj2h;
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

    // Draw collision boxes
    collisionBoxes.forEach(box => box.draw());
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

// Collision box locator code
addEventListener("click", boxPosition);
// Mouse click calibration (click the top left corner of the game)
let calibrating = 0;
let xoff;
let yoff;
let scaleX;
let scaleY;
// Alternate clicks for marking top left and bottom right corner of box
let clickNum = 0;
let nextX = 0;
let nextY = 0;
// Print box position to console
function boxPosition (e) {
    if (calibrating == 0) {
        // First click goes in top left for calibration
        xoff = e.x;
        yoff = e.y;
        calibrating++;
        console.log("Calibrated top left");
    } else if (calibrating == 1) {
        scaleX = canvasWidth / (e.x - xoff); // mouse distance / game distance
        scaleY = canvasHeight / (e.y - yoff);
        calibrating++;
    } else {
        if (clickNum % 2 == 0) {
            nextX = e.x - xoff;
            nextY = e.y - yoff;
        } else {
            console.log(`collisionBoxes.push(new CollisionBox(${Math.floor(nextX * scaleX)}, ${Math.floor(nextY * scaleY)}, ${Math.floor(((e.x - xoff) - nextX) * scaleX)}, ${Math.floor(((e.y - yoff) - nextY) * scaleY)}));`);
        }
        clickNum += 1;
    }
}
