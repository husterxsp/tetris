var row = 20;
var column = 10;

var documentHeight;
var documentWidth;
var nWidth;
var	canvasHeight;
var	canvasWidth;

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var upCount = 0;		//取值0，1，2，3用来进行四种形状切换
var arrCanvas = [];		//画布对应的数组

var square1 = [[0,0,0,1,1,1,2,1],[1,0,1,1,1,2,0,2],[0,0,1,0,2,0,2,1],[0,0,1,0,0,1,0,2]];
var square2 = [[2,0,2,1,1,1,0,1],[0,0,1,0,1,1,1,2],[0,0,1,0,2,0,0,1],[0,0,0,1,0,2,1,2]];
var square3 = [[0,0,1,0,1,1,2,1],[0,1,0,2,1,0,1,1],[0,0,1,0,1,1,2,1],[0,1,0,2,1,0,1,1]];
var square4 = [[0,1,1,0,1,1,2,0],[0,0,0,1,1,1,1,2],[0,1,1,0,1,1,2,0],[0,0,0,1,1,1,1,2]];
var square5 = [[0,0,0,1,1,0,1,1],[0,0,0,1,1,0,1,1],[0,0,0,1,1,0,1,1],[0,0,0,1,1,0,1,1]];
var square6 = [[0,1,1,0,1,1,2,1],[0,1,1,0,1,1,1,2],[0,0,1,0,2,0,1,1],[0,0,0,1,0,2,1,1]];
var square7 = [[0,0,1,0,2,0,3,0],[0,0,0,1,0,2,0,3],[0,0,1,0,2,0,3,0],[0,0,0,1,0,2,0,3]];
var squares = [square1,square2,square3,square4,square5,square6,square7];
var arrX = [];		//length为4，对应每个具体的形状的内部四个小方块的额x坐标集合
var arrY = [];		//length为4，对应每个具体的形状的内部四个小方块的额y坐标集合
var arrXMax = 0;	//arrX中的最大值
var arrYMax = 0;	//arrY中的最大值
var score = 0;		
var difficulty = 300;	//难度，仅设置了100，300两个值

var CreateTetris = function() {
	this.x = 5;
	this.y = 0;
	this.square = squares[ Math.floor(Math.random()*7) ];
}
var tetris = new CreateTetris();
var timer;

function init(){
	forMobile();
	if(timer){
		clearInterval(timer);
	}
	for(var i=0;i<row;i++){
		arrCanvas[i] = [];
		for(var j=0;j<column;j++){
			arrCanvas[i].push(0);
		}
	}
	timer = setInterval(animation,difficulty);
}

function forMobile(){
	documentHeight = window.innerHeight;
	documentWidth = window.innerWidth;
	if(documentWidth > 400){
		nWidth = 27;
	}else{
		nWidth = 0.06*documentWidth;
		document.getElementById('control').style.display = "block";
	}
	canvasHeight = row*nWidth;
	canvasWidth  = column*nWidth;
	canvas.setAttribute("height",canvasHeight);			
	canvas.setAttribute("width",canvasWidth);		
}

function animation(){
	context.clearRect(0,0,canvasWidth,canvasHeight);
	drawSquare(tetris.square[upCount]);
	drawCanvas();
	clearRow();
	if(canMoveDown()){
		tetris.y++; 
	}else{
		addTetris();
	}
	if(gameOver()){
		saveScore();
		if(confirm("游戏结束，是否继续新游戏？")){
			context.clearRect(0,0,canvasWidth,canvasHeight);
			init();
		}else{
			open('http://www.baidu.com', '_self').close();
	      	window.close();
	    }	    
	}
}

function saveScore(){
	var scores = JSON.parse( window.localStorage.getItem("scores") ) || null;
	if (scores) {
		scores.arrScore.push(score);
		scores.arrScore.sort(function(a,b){return b-a});
		scores.arrScore.splice(5);
		window.localStorage.setItem("scores",JSON.stringify({"arrScore": scores.arrScore}));
	}else {
		window.localStorage.setItem("scores",JSON.stringify({"arrScore":[score]}));
	}
	score = 0;
}

function showScore(){
	var scoreList = document.querySelector("#highScore ol");
		scoreList.innerHTML = "";
	var scores = JSON.parse( window.localStorage.getItem("scores") ) || null;
	if (scores) {
		var arrScore = scores.arrScore;
		for(var i=0;i<5;i++){
			var newNode = document.createElement("li"); 
			newNode.innerHTML = arrScore[i]; 
			scoreList.appendChild(newNode);
			if(arrScore[i]==0){
				break;
			}
		}
	}else {
		document.querySelector("#highScore ol").innerHTML="你还没有成绩哦~";
	}		
}

function gameOver(){
	var arrX = tetris.square[upCount].filter(function(item,index){return index%2==0});
	var arrY = tetris.square[upCount].filter(function(item,index){return index%2!=0});
	for(var i=0;i<4;i++){
		var cX = tetris.x+arrX[i];
		var cY = tetris.y+arrY[i];
		if(arrCanvas[cY][cX] == 1){
			return true;
		}

	}
	return false;
}

//将停止下降的方块对应的位置画到画布上，及将对应位置的arrCanvas置1
function addTetris(){
	for(var i=0;i<4;i++){
		var cX = tetris.x+arrX[i];
		var cY = tetris.y+arrY[i];
		arrCanvas[cY][cX] = 1;
	}
	tetris = new CreateTetris();
}

document.onkeydown = function(e){
	switch(e.keyCode){
		case 37:
			if(canMoveLeft()){
				tetris.x--;
			}
			break;
		case 38:
			if(canSwitch()){
				upCount = (++upCount%4);
			}
			break;
		case 39:
			if(canMoveRight()){
				tetris.x ++;
			}
			break;
		case 40:
			if(canMoveDown()){
				tetris.y++;
			}
			break;
	}
}

document.onclick = function(e){
	var e = e || window.event;
	if(e.target.className == "back"){
		clearInterval(timer);
		document.getElementById('page').myAnimate({"top": 0},1000);
	}

	var targetId = e.target.id;
	switch(targetId){
		case "left":
			if(canMoveLeft()){
				tetris.x--;
			}
			break;
		case "switch":
			if(canSwitch()){
				upCount = (++upCount%4);
			}
			break;
		case "right":
			if(canMoveRight()){
				tetris.x ++;
			}
			break;
		case "down":
			if(canMoveDown()){
				tetris.y++;
			}
			break;
		case "startGame":
			document.getElementById('page').myAnimate({"top": -window.innerHeight},1000,init);
			console.log(window.innerHeight);
			break;
		case "degree":
			if(difficulty == 300){
				difficulty = 100;
				e.target.innerHTML = "挑战模式";
			}else{
				difficulty = 300;
				e.target.innerHTML = "简单模式";
			}
			break;
		case "seeScore":
			document.getElementById('page').myAnimate({"top": -2*window.innerHeight},1000,	showScore());
			break;
		case "exit":
			open('http://www.baidu.com', '_self').close();
			window.close();
			break;
		default:
			break;
	}
}

function canMoveDown(){
	for(var i=0;i<4;i++){
		var cX = tetris.x+arrX[i];
		var cY = tetris.y+arrY[i];
		if( (tetris.y+arrY[i]) == (row-1) || arrCanvas[cY+1][cX] == 1 ){
			return false;
		}
	}
	return true;
}

function canMoveLeft(){
	for(var i=0;i<4;i++){
		var cX = tetris.x+arrX[i];
		var cY = tetris.y+arrY[i];
		if( (tetris.x+arrX[i]) == 0 || arrCanvas[cY][cX-1] == 1 ){
			return false;
		}
	}
	return true;
}

function canMoveRight(){
	for(var i=0;i<4;i++){
		var cX = tetris.x+arrX[i];
		var cY = tetris.y+arrY[i];
		if( (tetris.x+arrX[i]) == (column-1) || arrCanvas[cY][cX+1] == 1 ){
			return false;
		}
	}
	return true;
}

function canSwitch(){
	var tmpCount = 	upCount;
		tmpCount = (++tmpCount%4);
	var tmpSquare = tetris.square[tmpCount];
	var arrX = tmpSquare.filter(function(item,index){return index%2==0});
	var arrY = tmpSquare.filter(function(item,index){return index%2!=0});
	for(var i=0;i<4;i++){
		var cX = tetris.x+arrX[i];
		var cY = tetris.y+arrY[i];
		if(arrCanvas[cY][cX] == 1){
			return false;
		}
		if(tetris.x+arrX[i]>=column){
			return false;
		}
		if(tetris.y+arrY[i]>=row){
			return false;
		}
	}
	return true;
}

//绘制方块
function drawSquare(s){
	arrX = s.filter(function(item,index){return index%2==0});
	arrY = s.filter(function(item,index){return index%2!=0});
	arrXMax = Math.max.apply(this,arrX);
	arrYMax = Math.max.apply(this,arrY);
	var i=4;
	while(i--){
		drawSquareSmall(arrX[i],arrY[i]);
	}
}

//绘制画布
function drawCanvas(){
	var i=row, j=column;
	for(var i=0;i<row;i++){
		for(var j=0;j<column;j++){
			context.strokeRect(j*nWidth,i*nWidth,nWidth,nWidth);
			context.strokeStyle = "rgb(155,0,0)";				
			if(arrCanvas[i][j] == 1){
				context.fillRect(j*nWidth,i*nWidth,nWidth,nWidth);
				context.strokeRect(j*nWidth,i*nWidth,nWidth,nWidth);
			}		
		}
	}
}

//绘制方块内部的小方块
function drawSquareSmall(x,y){
	context.fillRect((tetris.x+x)*nWidth,(tetris.y+y)*nWidth,nWidth,nWidth);
	context.strokeRect((tetris.x+x)*nWidth,(tetris.y+y)*nWidth,nWidth,nWidth);
}

//清除满格行，并计分
function clearRow(){
	for(var i=0;i<row;i++){
		if( arrCanvas[i].every(function(item){return item == 1}) ){
			arrCanvas.splice(i,1);
			var arr = [];
			while(arr.length<column){
				arr.push(0);
			}
			arrCanvas.unshift(arr);
			if(difficulty == 300){
				score += 10;
			}else {
				score += 30;
			}
		}
	}
	document.getElementById('score').innerHTML = "score: "+score;
}

Object.prototype.myAnimate = function(attribute, duration, func) {
	var requestAnimationFrame = window.requestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.msRequestAnimationFrame;
	var that = this;
	show(duration);
	function show(duration){
		var start = new Date();
		var process;
		var tmpAttr;
		var flag=0;
		(function play(){
			process = (new Date() - start)/duration;
			if(process>1) process = 1;
			for(var attr in attribute){
				if(!attribute.hasOwnProperty(attr)){
					continue;
				}
				if(that.style[attr]){
					if(!flag){
						tmpAttr = parseInt(window.getComputedStyle(that)[attr] );
						flag = 1;					
					}
				}else {
					tmpAttr = 0;
				}
				that.style[attr] = tmpAttr+(attribute[attr]-tmpAttr)*process+"px";
			}
			if(process< 1){
				requestAnimationFrame(play);
			}
			if(process>=1){
				if(func){
					func();	
				}
			}
		}());
	}
};