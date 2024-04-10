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

// Player class
class Player {
    img;
    width = 46;
    height = 46;
    movingRight = false;
    movingLeft = false;
    movingUp = false;
    movingDown = false;
    speed = 3; 
    minFightDelay = 3000
    fightAddedRandomDelay = 5000;
    inFightZone = false;
    fightScheduled = false;
    isFighting = false;

    // Create the player
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.img = playerDownImg;
    }

    // Draw player
    draw () {
        // Once image is loaded, draw the player
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    // Player update manager
    update() {
        if (!this.isFighting) {
            this.updateMovement();
            this.checkFight();
        }
        
    }

    // Update the player's movement position
    updateMovement () {
        // Requested movement amounts
        let dx = 0;
        let dy = 0;

        // Update desired movement amounts.
        // Check right
        if (this.movingRight) {
            dx += this.speed;
            this.img = playerRightImg;
        }
        // Check left
        if (this.movingLeft) {
            dx -= this.speed;
            this.img = playerLeftImg;
        }
        // Check up
        if (this.movingUp) {
            dy -= this.speed;
            this.img = playerUpImg;
        }
        // Check down
        if (this.movingDown) {
            dy += this.speed;
            this.img = playerDownImg;
        }

        // Slow down the player if moving diagonally.
        if (dx != 0 && dy != 0) {
            // Scale down the x and y movement
            dx *= 0.8;
            dy *= 0.8;
        }

        // Process collisions with barrier boxes
        for (let i = 0; i < barrierBoxes.length; i++) {
            let box = barrierBoxes[i];
            // Check if requested x position collides with a barrier
            if (collideObjects(this.x + dx, this.y, this.width, this.height,
                box.x, box.y, box.width, box.height)) {
                // Collision in x direction
                // Check which way player was moving to align with side of object
                if (player.movingRight) {
                    // Limit movement to left edge of object
                    dx = box.x - (player.x + player.width);
                } else {
                    // Limit movement to right edge of object
                    dx = -(player.x - (box.x + box.width));
                }
            }

            // Check if the requested y position collides with a barrier
            if (collideObjects(this.x, this.y + dy, this.width, this.height,
                box.x, box.y, box.width, box.height)) {
                // Collision in y direction
                // Check which wya player was moving to align with side of object
                if (player.movingDown) {
                    // Limit movement to top edge of object
                    dy = box.y - (player.y + player.height);
                } else {
                    // Limit movement to bottom edge of object
                    dy = -(player.y - (box.y + box.height));
                }
            }
        }

        // Update player position with the resulting allowed movement changes
        this.x += dx;
        this.y += dy;

        // Keep player inside the map horizontally
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        } else if (this.x < 0) {
            this.x = 0;
        }

        // Keep palyer inside the map vertically
        if (this.y + this.height > canvasHeight) {
            this.y = canvasHeight - this.height;
        } else if (this.y < 0) {
            this.y = 0;
        }
    }

    // Check if the player can start a fight
    checkFight () {
        // Update if player is in a fight zone.
        this.inFightZone = false;
        for (let i = 0; i < fightBoxes.length; i++) {
            let box = fightBoxes[i];
            if (collideObjects(this.x, this.y, this.width, this.height,
                box.x, box.y, box.width, box.height)) {
                // In a fight zone
                this.inFightZone = true;
                break;
            }
        }
        
        // Attempt to schedule a new fight
        if (this.inFightZone && !this.fightScheduled) {
            console.log("Fight Scheduled");
            // Schedule a fight attempt at a random time
            setTimeout(function () {
                this.attemptFight();
            }.bind(this), this.minFightDelay + 
                Math.floor(Math.random() * this.fightAddedRandomDelay));
            // Disable scheduling more fights
            this.fightScheduled = true;
        }
    }

    // Attempt beginning the fight
    attemptFight () {
        // Clear fight schedule
        this.fightScheduled = false;
        // Check if still in a fight zone
        if (this.inFightZone) {
            // Start the fight
            this.isFighting = true;
            document.getElementById('game-window').style.zIndex = '3';
            titlesfx.pause();
            document.getElementById('game-window').style.visibility = 'visible';
            transition();
        } else {
            console.log("Fight failed, not in zone");
        }
    }
}

// Collision Box class
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

// Barrier Boxes (restrict the player's movement)
let barrierBoxes = [];
barrierBoxes.push(new CollisionBox(544, 73, 129, 96));
barrierBoxes.push(new CollisionBox(54, 226, 140, 96));
barrierBoxes.push(new CollisionBox(514, 303, 97, 120));
barrierBoxes.push(new CollisionBox(674, 351, 127, 96));
barrierBoxes.push(new CollisionBox(258, 450, 156, 101));
barrierBoxes.push(new CollisionBox(3, 3, 800, 92));
barrierBoxes.push(new CollisionBox(1, 504, 64, 97));

// Fight Boxes (zones where fights can be triggered)
let fightBoxes = [];
fightBoxes.push(new CollisionBox(293, 124, 151, 71));

// Check if two boxes collide (each box has the form x, y, width, height)
function collideObjects(obj1x, obj1y, obj1w, obj1h, obj2x, obj2y, obj2w, obj2h) {
    return obj1x + obj1w > obj2x && 
        obj1x < obj2x + obj2w && 
        obj1y + obj1h > obj2y && 
        obj1y < obj2y + obj2h;
}

// Function called when the window loads
window.onload = function () {
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

// Display the title screen for a short time
function titleScreen() {
    context.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    document.removeEventListener("keydown", titleScreen);
    setTimeout(startGame, 2000);
}

// Start the game
function startGame ()  {
    // Game prestart stuff
    player = new Player(200, 300);
    
    // Add keyboard event listeners
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    
    //intro music
    titlesfx.play();
    // Start the game's frame update loop
    setInterval(update, 1000/60);
}

// Game frame updates
function update() {
    // Draw background
    context.drawImage(worldMap, 0, 0, canvas.width, canvas.height);

    // Draw player
    player.update();
    player.draw();

    // Draw collision boxes
    barrierBoxes.forEach(box => box.draw());

    // Draw fight boxes
    fightBoxes.forEach(box => box.draw());
}

// Keydown presses
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

// Key releases
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




// // ########## Collision Box Placement Mode ##########
// // For developer use to add collision boxes
// console.log("CB placement activated, beginning calibration");
// console.log("Click the top-left and bottom-right corners of the map.");
// addEventListener("click", boxPosition);
// // Mouse click calibration (click the top left corner of the game)
// let calibrating = 0;
// let xoff;
// let yoff;
// let scaleX;
// let scaleY;
// // Alternate clicks for marking top left and bottom right corner of box
// let clickNum = 0;
// let nextX = 0;
// let nextY = 0;
// // Print box position to console
// function boxPosition (e) {
//     if (calibrating == 0) {
//         // First click goes in top left for calibration
//         xoff = e.x;
//         yoff = e.y;
//         calibrating++;
//     } else if (calibrating == 1) {
//         scaleX = canvasWidth / (e.x - xoff); // mouse distance / game distance
//         scaleY = canvasHeight / (e.y - yoff);
//         calibrating++;
//         console.log("Calibrated. Click the top left and bottom right corners of each box");
//     } else {
//         if (clickNum % 2 == 0) {
//             nextX = e.x - xoff;
//             nextY = e.y - yoff;
//         } else {
//             let collisionBoxString = `barrierBoxes.push(new CollisionBox(` + 
//             `${Math.floor(nextX * scaleX)}, ${Math.floor(nextY * scaleY)}, ` + 
//             `${Math.floor(((e.x - xoff) - nextX) * scaleX)},` + 
//             `${Math.floor(((e.y - yoff) - nextY) * scaleY)}));`;
//             console.log(collisionBoxString);
//         }
//         clickNum += 1;
//     }
// }
