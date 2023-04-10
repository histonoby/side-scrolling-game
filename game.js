const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
// canvas size
canvas.width = 540;
canvas.height = 540;

const backgroundCanvas = document.createElement("canvas");
const backgroundContext = backgroundCanvas.getContext("2d");
backgroundCanvas.width = 1200;
backgroundCanvas.height = 540;

//-----------------------------------------------------------
// characters
//-----------------------------------------------------------
// player
const mario = {
	x: 100,
	y:350,
	width: 100,
	height: 100,
	speed: 6,
	move: 'stop',
	jumping: false,
	jumpPower: 30,
	gravity: 0,
	image: new Image()
};
// Enemy class
class Enemy {
	constructor(x, y, image, px, direction){
		this.initX = x;
		this.initY = y;
		this.baseX = x;
		this.baseY = y;
		this.curX = x;
		this.curX = y;
		this.offsetX = 0;
		this.offsetY = 0;
		this.speed = 0.5;
		this.direction = direction;
		this.image = image;
		this.width = px;
		this.height = px;
		this.moveWidth = 100;
	}
	draw(ctx){
		ctx.drawImage(this.image, this.curX, this.curY, this.width, this.height);
	}
	distanceFromPlayer(player){
		const dx = this.curX - player.x;
		const dy = this.curY - player.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	move(){
		this.baseX += this.speed * this.direction;
		if(this.baseX >= this.initX + this.moveWidth/2){
			this.direction = -1;
		} else if(this.baseX <= this.initX - this.moveWidth/2){
			this.direction = 1;
		}
		this.curX = this.baseX + this.offsetX;
		this.curY = this.baseY;
	}
}

const enemies = [];
for(let i=0; i<2; i++){
	const e = new Enemy(
		350*(i+1),
		390,
		new Image(),
		60,
		1
	);
	enemies.push(e);
}

//-----------------------------------------------------------
// functions
//-----------------------------------------------------------
// collision check
function checkCollisions(){
	for(let i=0; i<2; i++){
		const distance = enemies[i].distanceFromPlayer(mario);
		if(distance < enemies[i].width){
			gameReset();
		}
	}
}

function gameReset(){
	backgroundX = 0;
	enemies[0].offsetX = 0;
	enemies[0].baseX = enemies[0].initX;
	enemies[1].offsetX = 0;
	enemies[1].baseX = enemies[1].initX;
}

//-----------------------------------------------------------
// images
//-----------------------------------------------------------
// import background image
const backgroundImage = new Image();
backgroundImage.src = "images/background2.jpg";
backgroundImage.onload = () => {
	const pattern = backgroundContext.createPattern(backgroundImage, "repeat");
	backgroundContext.fillStyle = pattern;
	backgroundContext.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
};
// import mario image
mario.image.src = 'images/mario.png'
// import enemy image
enemies[0].image.src = 'images/enemy1.png'
enemies[1].image.src = 'images/enemy2.png'

//-----------------------------------------------------------
// key monitoring
//-----------------------------------------------------------
// keydown monitoring
document.addEventListener('keydown', function(event) {
	if(event.code === 'ArrowUp'){
		mario.jumping = true;
	}
	if(event.code === 'ArrowRight'){
		mario.move = 'right';
	}
	if(event.code === 'ArrowLeft'){
		mario.move = 'left';
	}
});
// keyup monitoring
document.addEventListener('keyup', function(event) {
	if(event.code === 'ArrowRight'){
		mario.move = 'stop';
	}
	if(event.code === 'ArrowLeft'){
		mario.move = 'stop';
	}
});

let backgroundX = 0;
const ctx = canvas.getContext('2d');
ctx.font = "32px Arial";
ctx.fillStyle = "white";
//-----------------------------------------------------------
// main game loop
//-----------------------------------------------------------
function gameLoop(){
	// clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// draw background
	context.drawImage(backgroundCanvas, backgroundX, 0, backgroundCanvas.width, backgroundCanvas.height);
	// draw mario
	context.drawImage(mario.image, mario.x, mario.y, mario.width, mario.height);
	// draw and move enemies
	for(let i=0; i<2; i++){
		enemies[i].draw(context);
		enemies[i].move();
	}

	// Collision check
	checkCollisions();

	// mario is jumping
	if(mario.jumping){
		mario.y = mario.y - mario.jumpPower + mario.gravity;
		mario.gravity += 2;
		if(mario.y > 420){
			mario.y = 420;
			mario.jumping = false;
			mario.gravity = 0;
		}
	}

	// move mario
	if(mario.move === 'right'){
		if(backgroundX === -650){
			mario.x += mario.speed;
		}
	} else if(mario.move === 'left'){
		if(backgroundX === -650 & mario.x >10){
			mario.x -= mario.speed;
		}
	}

	// mario's position limit
	if(mario.x > 450){
		mario.x = 450;
	}
	if(mario.x < 10){
		mario.x = 10;
	}
	if(mario.y > 350){
		mario.y = 350;
	}

	// move background
	if(mario.move === 'right'){
		// mario.x += mario.speed;
		if(backgroundX <= -650){
			backgroundX = -650;
		} else {
			backgroundX -= mario.speed;
			enemies[1].offsetX -= mario.speed;
			// enemies[1].baseX -= mario.speed;
			enemies[0].offsetX -= mario.speed;
			// enemies[0].baseX -= mario.speed;
		}
	}
	else if(mario.move === 'left'){
		// mario.x -= mario.speed;
		if(backgroundX >= 0){
			backgroundX = 0;
		} else if(backgroundX === -650 & mario.x > 10){
			backgroundX = -650;
		} else{
			backgroundX += mario.speed;
			enemies[1].offsetX += mario.speed;
			// enemies[1].baseX += mario.speed;
			enemies[0].offsetX += mario.speed;
			// enemies[0].baseX += mario.speed;
		}

	}

	//debag
	ctx.fillText(`Background X: ${backgroundX}, Mario X: ${mario.x}`, 10, 30);

	// request a next frame
	requestAnimationFrame(gameLoop);
}

// start the game loop
gameLoop();