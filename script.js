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

//player image
let playerWidth = 46;
let playerHeight = 46;
let playerX = canvasWidth / 2 - playerWidth / 2;
let playerY = canvasHeight / 2 - playerHeight;
let playerRightImg;
let playerLeftImg;
let playerUpImg;
let playerDownImg;

let player = {
    img: null,
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight,
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
    document.addEventListener("keydown", startGame);
    document.addEventListener("keydown", titleScreen);
}

function titleScreen() {
    context.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    document.removeEventListener("keydown", titleScreen);
}

function startGame ()  {
    document.removeEventListener("keydown", startGame);
    //draw world map
    setTimeout(function() {
    context.drawImage(worldMap, 0, 0, canvas.width, canvas.height);
    }, 2000);
    setInterval(update, 1000/60);

    // Load player images
    playerDownImg = new Image();
    playerDownImg.src = "./assets/characterside-down.png";
    player.img = playerDownImg;
    playerDownImg.onload = function() {
        // Once image is loaded, draw the player
        context.drawImage(player.img, player.x, player.y, player.width, player.height);
    };
}

function update() {
    

}