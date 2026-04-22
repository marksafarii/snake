
//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX;
var foodY;

//gameover reset
var gameOver = false

//score counter
var score = 0;



window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board
    
    placeFood();
    document.addEventListener("keyup", changeDirection);
    //update();
    setInterval(update, 1000/10); //100 milliseconds
}

function update() {
    if (gameOver) {
        return;
    }
   

    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle="white";
    context.font = "20px pixel";
    context.fillText("Score: " + score, 10, 25);    

    context.fillStyle="red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        score++;
        snakeBody.push([foodX, foodY])
        placeFood();
        playEatSound(); 
    }

for (let i = snakeBody.length-1; i > 0; i--) {
    snakeBody[i] = snakeBody[i-1]; //this is for the snake body to move from the tail towards the head
}
if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
}

    context.fillStyle="lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for(let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
    
    function HandleRestart(e) {
        var rect = board.getBoundingClientRect();
        var clickX = e.clientX - rect.left; 
        var clickY = e.clientY - rect.top;  

        if (
            clickX >= board.width / 3 && clickX <= board.width / 3 + 160 &&
            clickY >= board.height / 1.5 && clickY <= board.height / 1.5 + 30
        ) {
            // Reset game state
            snakeX = blockSize * 5;
            snakeY = blockSize * 5;
            velocityX = 0;
            velocityY = 0;
            snakeBody = [];
            score = 0;
            gameOver = false;
            placeFood();
        }
    }
    
    function showGameOver() {
        context.fillStyle = "blue";
        context.font = "50px Arial";
        context.fillText("GAME OVER", board.width / 5.5, board.height / 2);

        //restart button
        context.fillStyle = "green";
        context.fillRect(board.width / 3, board.height / 1.5, 160, 30);
        context.fillStyle = "black";
        context.font = "20px Arial";
        context.fillText("RESTART", board.width / 2.5, board.height / 1.4); 

    board.addEventListener("click", HandleRestart);
    }   

 //game over conditions
 if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows*blockSize) {
    gameOver = true;
    playGameOverSound();
    showGameOver();
 }
   for (let i = 0; i <snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
        gameOver = true;
        playGameOverSound();
        showGameOver();
    }
   }
}

function changeDirection(e) {


    if (e.code == "ArrowUp" && velocityY != 1) {
         velocityX = 0;
         velocityY = -1;
    }
     if (e.code == "ArrowDown" && velocityY != -1 ) {
         velocityX = 0;
         velocityY = 1;
    }
     if (e.code == "ArrowLeft" && velocityX != 1 ) {
         velocityX = -1;
         velocityY = 0;
    }
     if (e.code == "ArrowRight" && velocityX != -1) {
         velocityX = 1;
         velocityY = 0;
    }
    
   
}



function placeFood() {
    //Math.random brings 0.1) *cols -> (0-.19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}


function playEatSound() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);         // start note
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);   // jump up
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);                // volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2); // fade out
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.2);
}

function playGameOverSound() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
    
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);         // start note
    oscillator.frequency.setValueAtTime(110, audioCtx.currentTime + 0.1);   // jump down  
    oscillator.frequency.setValueAtTime(55, audioCtx.currentTime + 0.2);    // jump down again

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5); // fade out

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);         
}