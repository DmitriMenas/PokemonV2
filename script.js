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


window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.fillStyle = "black";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    //draw title screen & enter game - using space bar
    setTimeout(function() {
        context.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    }, 1500);
    context.font = "100px Arial";
    context.fillStyle = "black";
    context.fillText("Press Any Key to Start", canvasWidth / 2, canvasWidth / 2);
    document.addEventListener("keydown", startGame)
}

function startGame ()  {
    document.removeEventListener("keydown", newGame);

    //draw world map
    setTimeout(function() {
        context.drawImage(worldMap, 0, 0, canvas.width, canvas.height);
    }, 2000);
    setInterval(update, 1000/60);
}