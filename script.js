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
    speed = 50; 
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

    draw () {
        // Once image is loaded, draw the player
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        if (!this.isFighting) {
            this.updateMovement();
            this.checkFight();
        }
        
    }

    updateMovement () {
        // Desired movement amount
        let dx = 0;
        let dy = 0;

        // Update desired movement amounts.
        if (this.movingRight) {
            // Right
            dx += this.speed;
            this.img = playerRightImg;
        }
        if (this.movingLeft) {
            // Left
            dx -= this.speed;
            this.img = playerLeftImg;
        }
        if (this.movingUp) {
            // Up
            dy -= this.speed;
            this.img = playerUpImg;
        }
        if (this.movingDown) {
            // Down
            dy += this.speed;
            this.img = playerDownImg;
        }

        // Slow down the player if moving diagonally.
        if (dx != 0 && dy != 0) {
            // Scale x and y by 
            dx *= 0.8;
            dy *= 0.8;
        }

        // Process collisions
        for (let i = 0; i < barrierBoxes.length; i++) {
            let box = barrierBoxes[i];
            // Check x direction
            if (collideObjects(this.x + dx, this.y, this.width, this.height,
                box.x, box.y, box.width, box.height)) {
                // Collision in x direction
                // Check which way player was moving to align with side of object
                if (player.movingRight) {
                    // Align with left edge of object
                    dx = box.x - (player.x + player.width);
                } else {
                    // Alight with right edge of object
                    dx = -(player.x - (box.x + box.width));
                }
            }

            // Check y direction
            if (collideObjects(this.x, this.y + dy, this.width, this.height,
                box.x, box.y, box.width, box.height)) {
                // Collision in y direction
                // Check which wya player was moving to align with side of object
                if (player.movingDown) {
                    // Align with top edge of object
                    dy = box.y - (player.y + player.height);
                } else {
                    // Align with bottom edge of object
                    dy = -(player.y - (box.y + box.height));
                }
            }
        }

        // Update player position with the allowed change
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

    // Check if the player can start a fight
    checkFight () {
        // Check if player is in a fight zone.
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
            console.log("Fight Started!");
        } else {
            console.log("Fight failed, not in zone");
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
let barrierBoxes = [];
barrierBoxes.push(new CollisionBox(544, 73, 129, 96));
barrierBoxes.push(new CollisionBox(54, 226, 140, 96));
barrierBoxes.push(new CollisionBox(514, 303, 97, 120));
barrierBoxes.push(new CollisionBox(674, 351, 127, 96));
barrierBoxes.push(new CollisionBox(258, 450, 156, 101));
barrierBoxes.push(new CollisionBox(3, 3, 800, 92));
barrierBoxes.push(new CollisionBox(1, 504, 64, 97));

let fightBoxes = [];
fightBoxes.push(new CollisionBox(293, 124, 151, 71));

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
    barrierBoxes.forEach(box => box.draw());

    // Draw fight boxes
    fightBoxes.forEach(box => box.draw());
}

// Key down presses
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


// ########## Collision Box Placement Mode ##########
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
    } else if (calibrating == 1) {
        scaleX = canvasWidth / (e.x - xoff); // mouse distance / game distance
        scaleY = canvasHeight / (e.y - yoff);
        calibrating++;
    } else {
        if (clickNum % 2 == 0) {
            nextX = e.x - xoff;
            nextY = e.y - yoff;
        } else {
            console.log(`barrierBoxes.push(new CollisionBox(${Math.floor(nextX * scaleX)}, ${Math.floor(nextY * scaleY)}, ${Math.floor(((e.x - xoff) - nextX) * scaleX)}, ${Math.floor(((e.y - yoff) - nextY) * scaleY)}));`);
        }
        clickNum += 1;
    }
}
