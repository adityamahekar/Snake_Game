let inputDir = {x: 0, y: 0};
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
// const musicSound = new Audio('music/music.mp3');
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{x: 13, y: 15}];
let food = {x: 6, y: 7};
let board = document.getElementById("board");
let scoreBox = document.getElementById("scoreBox");
let hiscoreBox = document.getElementById("hiscoreBox");

let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore === null ? 0 : JSON.parse(hiscore);
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;

function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1/speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake){
    for(let i=1;i<snake.length;i++)
        if(snake[i].x===snake[0].x && snake[i].y===snake[0].y) return true;
    if(snake[0].x>=18 || snake[0].x<=0 || snake[0].y>=18 || snake[0].y<=0) return true;
    return false;
}

function gameEngine(){
    // Game over
    if(isCollide(snakeArr)){
        gameOverSound.play();
        // musicSound.pause();
        inputDir = {x:0,y:0};
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x:13,y:15}];
        score = 0;
        scoreBox.innerHTML = "Score: "+score;
        // musicSound.play();
    }

    // If food eaten
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        foodSound.play();
        score++;
        if(score > hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({...snakeArr[0]});
        let a=2, b=16;
        food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())};
    }

    // Move snake
    for(let i = snakeArr.length-2; i>=0; i--)
        snakeArr[i+1] = {...snakeArr[i]};
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render board
    board.innerHTML = "";
    snakeArr.forEach((e,i)=>{
        let el = document.createElement('div');
        el.style.gridRowStart = e.y;
        el.style.gridColumnStart = e.x;
        el.classList.add(i===0 ? 'head' : 'snake');
        board.appendChild(el);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
};

// musicSound.play();
window.requestAnimationFrame(main);
gameEngine();

window.addEventListener('keydown', e => {
    moveSound.play();
    switch(e.key){
        case "ArrowUp": if(inputDir.y !== 1) inputDir={x:0,y:-1}; break;
        case "ArrowDown": if(inputDir.y !== -1) inputDir={x:0,y:1}; break;
        case "ArrowLeft": if(inputDir.x !== 1) inputDir={x:-1,y:0}; break;
        case "ArrowRight": if(inputDir.x !== -1) inputDir={x:1,y:0}; break;
    }
});
