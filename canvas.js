var scale= 1;
//Get elements from HTML and assign to variable
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var img = document.getElementById("artwork");
var container = document.getElementById("container");
var canvasHeight = container.offsetHeight;
//Finding the image natural height and widhth to be drawn on the canvas
var imageRatio = canvasHeight/img.naturalHeight;
var imageHeight = canvasHeight;
var imageWidth = img.naturalWidth * imageRatio;
var canvasWidth = imageWidth;
var currImage = {x:0, y:0, w:imageWidth, h:imageHeight, img:img,isDragging:false};
var mouseonleftArrow = false;
var mouseonrightArrow = false;
var leftArrow = {top: (canvasHeight*0.45), left: (canvasWidth*0.05), bottom: (canvasHeight*0.55), right: (canvasWidth*0.1)};
var rightArrow = {top: (canvasHeight*0.45), left: (canvasWidth*0.9), bottom: (canvasHeight*0.55), right: (canvasWidth*0.95)};
var circleArray =  new Array();



var viewsHorizontal = ["media/images/Two-Figures-front.jpg","media/images/Two-Figures-left.jpg","media/images/Two-Figures-back.jpg", "media/images/Two-Figures-right.jpg"];
var side = 0; 


//window.onload = function() {
	ctx.canvas.height = canvasHeight;
	ctx.canvas.width = canvasWidth;
	imageRatio = canvasHeight/img.naturalHeight;;
	imageHeight = canvasHeight;
	imageWidth = img.naturalWidth * imageRatio;

	//Javascript is expecting an image object from HTML to re draw the image in canvas
	scale= 1;
	setImage(0);
	draw();
	//calculateHotspots(imageWidth, imageHeight);
	//Disabling the button from the start so the picture won't get any smaller than set
	document.getElementById("zoomOut").disabled = true;	
	



//};
//Event listner
canvas.addEventListener('click', (e) => {
    var rect = canvas.getBoundingClientRect();
    var mousePoint = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top 
  };
 	for(i = 0; i < circleArray.length; i++) {
    if(isIntersect(mousePoint, circleArray[i])){
        circleArray[i].onClick = openModal(circleArray[i].modalID)
    }
    //left arrow and right arrow on the canvas image, change the view point depending on which arrow is clicked
    //left arrow
    if(isOnArrow(mousePoint, leftArrow)){
    	changeView(1);
    }
    //right arrows
    if(isOnArrow(mousePoint, rightArrow)){
    	changeView( -1);
    }
}});
canvas.addEventListener('mousemove', (e) => {
    var rect = canvas.getBoundingClientRect();
    var mousePoint = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
 	//If the mouse is hover through the hotspot draw the hotspot
 	for (i = 0; i < circleArray.length; i++) {
	    if(isIntersect(mousePoint, circleArray[i])){
	     	ctx.beginPath();
	        ctx.arc(circleArray[i].x, circleArray[i].y, circle.radius, 0, 2 * Math.PI);
	        ctx.strokeStyle="#E43012";
	        ctx.stroke();
	        circleArray[i].mouseinCircle = true;
	    }
	    //if the mouse is not hover through the hotspot disable the hotspot drawing
	    else if(circleArray[i].mouseinCircle) {
			draw();
			circleArray[i].mouseinCircle = false;
	    }
	}
	// if mouse is hover throught left arrow draw the left arrow
    if(isOnArrow(mousePoint, leftArrow)){
      	
		drawArrow("left");
		mouseonleftArrow = true;
	}
	else if(mouseonleftArrow) {
		draw();
		mouseonleftArrow = false;
	}	
	//if mouse is hover throught right arrow draw right arrow
	if(isOnArrow(mousePoint, rightArrow)){

		drawArrow("right");
		mouseonrightArrow = true;
	}
	else if(mouseonrightArrow) {
		draw();
		mouseonrightArrow = false;
	}	

});


//zoomin function
function zoomin() {
	//When user clicks the + button it zooms in by the scale of 0.1
	scale= scale+0.1;
	//ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	if (scale > 1){
		document.getElementById("zoomOut").disabled = false;
		
	}
	//redrawing the image after zoomed in

	//draw();
	//ctx.drawImage(img, 0, 0, imageWidth*scale, imageHeight*scale );
	//fcalculateHotspots(imageWidth, imageHeight);
	draw();
}

//Zoomout Function
function zoomout() {
	//When user clicks the - button it zooms out by the scale of 0.1
	scale= scale-0.1;
	//ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	//If the user tries to zoom out from the image natrual size the button is disabled
	if (scale<=1){
		document.getElementById("zoomOut").disabled= true;
	}
	currImage.x = Math.round(currImage.x/scale);
	currImage.y = Math.round(currImage.y/scale);
	//draw();
	//ctx.drawImage(img, 0, 0, imageWidth*scale, imageHeight*scale );
	//calculateHotspots(imageWidth, imageHeight);
	draw();
}

//drawing the circles in array so its easier to add new hotspots
function calculateHotspots(imageWidth, imageHeight){
	circleArray = new Array();
	circle = {x: (200 * scale + currImage.x) , y:(65 * scale + currImage.y), radius: 35, mouseinCircle: false, modalID: "myModal"};
	circleArray.push(circle);
	circle2 = {x: (125 * scale + currImage.x) , y:(225 * scale + currImage.y) , radius: 35, mouseinCircle: false, modalID: "myModal2"};
	circleArray.push(circle2);
	circle3 = {x: (275 * scale + currImage.x) , y:(200 * scale + currImage.y) , radius: 35, mouseinCircle: false, modalID: "myModal3"};
	circleArray.push(circle3)
}


function isIntersect(point, circle) {
  return Math.sqrt((point.x-circle.x) * (point.x - circle.x) + (point.y - circle.y) * (point.y - circle.y)) < circle.radius;
}

function drawArrow(direction) {
	var lineWidth= ctx.lineWidth;
	//drawing left arrow
	if(direction == "left"){	
		ctx.beginPath(); 
		ctx.strokeStyle = "#E43012";
		ctx.lineWidth = 5;
		ctx.moveTo(canvasWidth*0.1, canvasHeight*0.45);
		ctx.lineTo(canvasWidth*0.05, canvasHeight*0.5);
		ctx.stroke();
		ctx.lineTo(canvasWidth*0.1, canvasHeight*0.55);
		ctx.stroke();
		ctx.lineWidth = lineWidth
		ctx.closePath();
		}

		//drawing right arrows
		else if(direction == "right"){
		ctx.beginPath();
		ctx.strokeStyle = "#E43012";
		ctx.lineWidth = 5;
		ctx.moveTo(canvasWidth*0.9, canvasHeight*0.45);
		ctx.lineTo(canvasWidth*0.95, canvasHeight*0.5);
		ctx.stroke();
		ctx.lineTo(canvasWidth*0.9, canvasHeight*0.55);
		ctx.stroke();
		ctx.lineWidth = lineWidth
		ctx.closePath();
	}
}

function isOnArrow(point, arrow) {

	return Math.sqrt(((point.x>arrow.left) && (point.x < arrow.right)) && ((point.y>arrow.top) && (point.y<arrow.bottom))); 
}






var info = canvas.getBoundingClientRect();
var zRegion = new ZingTouch.Region(canvas);

var offsetX = info.left;
var offsetY = info.top;
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var dragOk = false;
var startX = 0;
var startY = 0;

canvas.onmousedown = mDown;
canvas.onmouseup = mUp;
canvas.onmousemove = mMove;

canvas.ontouchstart = tDown;
canvas.ontouchend = mUp;
canvas.ontouchmove = tMove;

//img.onload = function(){
//	setImage(side)	
//	draw();
//}	

function draw(){
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	calculateHotspots(imageWidth, imageHeight);
	ctx.drawImage(currImage.img, currImage.x, currImage.y, imageWidth * scale, imageHeight * scale);
	console.log(currImage.x + " " + currImage.y)
}

function setImage(side){
	img.src = viewsHorizontal[side];
	imageRatio = canvasHeight/img.naturalHeight;
	imageHeight = canvasHeight;
	imageWidth = img.naturalWidth * imageRatio;
	canvasWidth = imageWidth;
	currImage.w = imageWidth;
	currImage.h = imageHeight;
	currImage.img = img,
	currImage.isDragging = false;
}

function mDown(e) {
	e.preventDefault();
	e.stopPropagation();
	
	var mx = parseInt(e.clientX - offsetX);
	var my = parseInt(e.clientY - offsetY);
	
	dragOk = false;
	//shape = currImage;
	if(mx > currImage.x && mx < currImage.x + currImage.w * scale && my > currImage.y && my < currImage.y + currImage.h * scale){
		dragOk = true;
		currImage.isDragging = true;
	}
	startX = mx;
	startY = my;
}

function mMove(e) {
	if(dragOk) {
		e.preventDefault();
		e.stopPropagation();
		
		var mx = parseInt(e.clientX - offsetX);
		var my = parseInt(e.clientY - offsetY);
		
		var dx = mx - startX;
		var dy = my - startY;
		
		if(currImage.isDragging){
			if(currImage.x + dx >= 0 - (currImage.w * scale - width) && currImage.x + dx <= 0) {
				currImage.x = currImage.x + dx;
			}
			if(currImage.y + dy >= 0 - (currImage.h * scale - height) && currImage.y + dy <= 0) {
				currImage.y = currImage.y + dy;
			}
		}
		
		draw();
		
		startX=mx;
		startY=my;
	}
}

function mUp(e) {
	e.preventDefault();
	e.stopPropagation();
	
	dragOk = false;
	currImage.isDragging = false;
	

	draw();

}

function tDown(e) {
	if(e.targetTouches.length > 1) {
		e.preventDefault();
		e.stopPropagation();
		
		var mx = parseInt(e.targetTouches[0].clientX - offsetX);
		var my = parseInt(e.targetTouches[0].clientY - offsetY);
		
		dragOk = false;
		//var shape = currImage;
		if(mx > currImage.x && mx < currImage.x + currImage.w && my > currImage.y && my < currImage.y + currImage.h){
			dragOk = true;
			currImage.isDragging = true;
		}

		startX = mx;
		startY = my;
	}
	else{
		 for(i = 0; i < circleArray.length; i++) {
		 //console.log("tdown" , e.targetTouches[0].clientX, " ", e.targetTouches[0].clientY , " " , circleArray[i]);
    		if(isIntersect(e.targetTouches[0], circleArray[i])){

       			circleArray[i].onClick = openModal(circleArray[i].modalID)
    		}
		}
	}
}

function tMove(e) {
	if(e.targetTouches.length > 1) {
		if(dragOk) {
			e.preventDefault();
			
			var mx = parseInt(e.targetTouches[0].clientX - offsetX);
			var my = parseInt(e.targetTouches[0].clientY - offsetY);
			
			var dx = mx - startX;
			var dy = my - startY;
			
			//var shape = currImage;
			if(currImage.isDragging){
				if(currImage.x + dx >= 0 - (currImage.w - width) && currImage.x + dx <= 0) {
					currImage.x = currImage.x + dx;
				}
				if(currImage.y + dy >= 0 - (currImage.h - height) && currImage.y + dy <= 0) {
					currImage.y = currImage.y + dy;
				}
			}
			
			draw();
			
			startX=mx;
			startY=my;
		}
	}
}

function changeView(dir) {
	if(dir == -1){
		if(side > 0){
			side--;
		}
		else{
			side = viewsHorizontal.length - 1;
		}
	}
	else if(dir == 1){
		if(side < viewsHorizontal.length - 1){
			side++;
		}
		else{
			side = 0;
		}
	}
	setImage(side);
	draw();
}	

zRegion.bind(canvas, "swipe", function(e) {
	var angle = e.detail.data[0].currentDirection;
	var right = 1;
	var left = -1;
	
	if((angle >= 315 && angle <= 360) || (angle <= 45 && angle >= 0)) {
		changeView(right);
	}
	else if (angle >= 135 && angle <= 225) {
		changeView(left);
	}
});












