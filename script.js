
var dx;
var dy;
var score = 0;

var dir = "right";
var ctx;
var timer;
/* Configuration variables	*/
var overflow = false;
var left = false;
var right = true;
var up = false;
var down = false;
var step = 10;

var obstacle_array = [];
var snake_array = [];
var canvas = document.getElementById("canvas");

init_snake(); // Initi the Snake default length and  the first random food.



/***********************************						
			Models Definition
			
************************************/

function snake_portion(x, y, position) { // Portion of the snake object definition 

  this.position = position;
  this.x = x;
  this.y = y;
  this.width = 10;
  this.height = 10;


}


function obstacle(x1, y1, x2, y2, orientation) { // obstacle object definition 

  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.orientation = orientation;
}






/***********************************
	End Model definition
 
************************************/


function game_over() {
  clearInterval(timer);
  score = 0;
  snake_array = [];
  init_snake();
  return;

}


function pause() {

  clearInterval(timer);
  return;

}

function resume() {
  clearInterval(timer);
  init();
}


function new_game() {

  game_over();
  dx = getRandomArbitrary(0, canvas.width);
  dy = getRandomArbitrary(0, canvas.height);
  score = 0;
  snake_array = [];
  init_snake();
  init();

}


function getRandomArbitrary(min, max) {
  var tmp = Math.random() * (max - min) + min;
  return tmp - (tmp % step);
}






function detect_obstacle_collission() {

  var head = snake_array[0];

  for (var i = 0; i < obstacle_array.length; i++) {

    obs = obstacle_array[i];
    if (obs.orientation == "v") {

      if ((head.x == obs.x1) && (head.y >= obs.y1) && (head.y <= obs.y2)) {
        console.log("collision detected");
        $('#message').text("GAME OVER");
        dx = 1000;
        dy = 1000;
        game_over();

      }
    } else {

      if ((head.y == obs.y1) && (head.x >= obs.x1) && (head.x <= obs.x2)) {
        console.log("collision detected");
        $('#message').text("GAME OVER");
        dx = 1000;
        dy = 1000;
        game_over();

      }
    }

  }
}




function detect_self_collision() {


  var head = snake_array[0];

  for (var i = 1; i < snake_array.length; i++) {


    if ((head.x == snake_array[i].x) && (head.y == snake_array[i].y)) {
      console.log("collision detected");
      $('#message').text("GAME OVER");
      dx = 1000;
      dy = 1000;
      game_over();

    }

  }

}



/* Initialize the snake by inserting default portions in the array*/
function init_snake() {

  head = new snake_portion(100, 100, "head");
  p1 = new snake_portion(111, 100, "tail");
  p2 = new snake_portion(122, 100, "tail");
  p3 = new snake_portion(133, 100, "tail");
  p4 = new snake_portion(144, 100, "tail");
  p5 = new snake_portion(155, 100, "tail");

  snake_array.push(head);
  snake_array.push(p1);
  snake_array.push(p2);
  snake_array.push(p3);
  snake_array.push(p4);
  snake_array.push(p5);

  // init food coordinates

  console.log("init snake");
  dx = getRandomArbitrary(0, 600);
  dy = getRandomArbitrary(0, 600);

  // init obstacles for stage 1
  o1 = new obstacle(150, 200, 450, 200, 'h');
  o2 = new obstacle(150, 400, 450, 400, 'h');
  obstacle_array.push(o1);
  obstacle_array.push(o2);

}



// Draw a portion of the snake
function drawPortion(p) {

  //ctx.fillStyle = "green";
  ctx.fillRect(p.x, p.y, p.width, p.height);
  //ctx.fillRect(250, 250, 20, 20);
  //console.log("drawing portion");

}


// drawing all snake portions on the canvas
function drawSnake() {

  for (var i = 0; i < snake_array.length; i++) {


    drawPortion(snake_array[i]);

  }

}


/*    Move the head and each portion of the tail take the place of its successor */

function moveSnake() {



  // Move the head 
  var head = snake_array[0];
  var tmpX = head.x;
  var tmpY = head.y;

  var tmp2X;
  var tmp2Y;



  if (head.x == canvas.width) { // Handle border overflow
    head.x = 10;
  } else if (head.x == 0) {
    head.x = canvas.width - 10;
    console.log("collision left");
  } else if (head.y == canvas.height)
    head.y = 10;
  else if (head.y == 0) {
    head.y = canvas.height - 10;
    console.log("collision up");
  }

  movePortion(head);

  // snake self collision.
  detect_self_collision();
  //detect_obstacle_collission();


  /* Moving tail */
  for (var i = 1; i < snake_array.length; i++) {

    tmp2X = snake_array[i].x;
    tmp2Y = snake_array[i].y;

    snake_array[i].x = tmpX;
    snake_array[i].y = tmpY;

    tmpX = tmp2X;
    tmpY = tmp2Y;
  }

  // Eating the food
  if ((dx == head.x) && (dy == head.y)) {
    console.log("Eating food hummm");
    //var last = array_snake[array_snake.length-1];
    var px = new snake_portion(tmpX, tmpY, "tail");
    snake_array.push(px);
    console.log("length of snake : " + snake_array.length);
    dx = getRandomArbitrary(0, canvas.width);
    dy = getRandomArbitrary(0, canvas.height);
    score++;
    $('#score').text(score);

  }





}

// Move a given snake in the right direction
function movePortion(p) {


  //switch (p.direction) {
  switch (dir) {

    case "left":
      p.x -= step;
      break;
    case "right":
      p.x += step;
      break;
    case "down":
      p.y += step;
      break;
    case "up":
      p.y -= step;
      break;
  }

}





/*
	Drawing obstacle 		

*/

function drawObstacles() {

  for (var i = 0; i < obstacle_array.length; i++) {

    var obs = obstacle_array[i];
    ctx.beginPath();
    ctx.moveTo(obs.x1, obs.y1);

    ctx.lineWidth = 6;
    ctx.lineTo(obs.x2, obs.y2);

    ctx.stroke();

  }

}


// Initialize application
function init() {
  //window.addEventListener("keydown",doKeyDown,false);
  document.onkeydown = function(e) {
    e = e || window.event;

    if ((e.keyCode == '38') && (dir != "down")) {
      //console.log("UP arrow");
      dir = "up";
    } else if ((e.keyCode == '40') && (dir != "up")) {
      //console.log("down arrow");
      dir = "down";
    } else if ((e.keyCode == '37') && (dir != "right")) {
      //console.log("left arrow");
      dir = "left";
    } else if ((e.keyCode == '39') && (dir != "left")) {
      //console.log("right arrow");
      dir = "right";
    }


  };
  //barImg=document.getElementById("bar");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  $('#score').text(score);
  $('#message').text("");
  // coordinate of the 	FOOD
  // dx = getRandomArbitrary(0,canvas.width);
  // dy = getRandomArbitrary(0,canvas.width);

  timer = setInterval(draw, 100);
  return timer;
}


function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FAF7F8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#003300";
  //ctx.fillStyle = "black";

  //ctx.fillRect(250, 250, 20, 20);

  ctx.fillRect(dx, dy, 10, 10); // drawing food
  moveSnake();
  drawSnake();
  //drawObstacles();

}
