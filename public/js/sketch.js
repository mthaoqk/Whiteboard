// global variables

	var socket;
	var canvas;

	var c, r, g, b, sliderVal;
	var sliderPos = 26;

// setup for page start
function setup() {
	canvas = createCanvas(windowWidth - 15, windowHeight - 15);
	// pixelDensity(1);

	//canvas positioned on content div
		canvas.position(0,0);
		canvas.style("z-index", "-1");
		canvas.parent("contentDiv");

	// socket connection
	socket = io();

	// var getImg = get();
	// console.log(getImg);

	// set color to black on load
		c = color(0);
		r = 0; g = 0; b = 0;

	// load the dummy image to the page
		// img = loadImage("./images/canvasTest.png");

	// download button
		var button = $("#btn-download");
		button.on("click", function(e){
			e.preventDefault();
			download();
		});

	// check current url and switch to that room if exists
		var currentUrl = $(location).attr('href');
	var currentRoomName = currentUrl.replace("https://whiteboardstudio.herokuapp.com/", "");
		if(currentRoomName === ""){
			switchRoom("default");
		}
		else{
			switchRoom(currentRoomName);
		}
		// console.log("currentRoomName: ",currentRoomName);

	// socket connection for "mouse"
		socket.on("mouse", newDrawing);

	function switchRoom(room) {
		socket.emit('switchRoom', room);
		// console.log("room: ",room);
	}

	// color buttons
		var red = select("#cred")
		red.mousePressed(function () {		
			c = color(255,0,0);
			r = 255; g = 0; b = 0;
		});

		var green = select("#cgreen")
		green.mousePressed(function () {
			c = color(14, 126, 18);
			r = 14; g = 126; b = 18;			
		});

		var blue = select("#cblue")
		blue.mousePressed(function () {
			c = color(0, 0, 255);
			r = 0; g = 0; b = 255;			
		});

		var black = select("#cblack")
		black.mousePressed(function () {
			c = color(0, 0, 0);
			r = 0; g = 0; b = 0;		
		});
		var white = select("#cwhite")
		white.mousePressed(function () {
			c = color(255, 255, 255);
			r = 255; g = 255; b = 255;			
		});

//end of setup for page
}

// resize canvas on window resize
	function windowResized() {
		resizeCanvas(windowWidth - 15, windowHeight - 15);
	}

//download function
	function download() {
		saveCanvas(canvas, "canvas.png");
	}

// new drawing function triggers by socket mouse data received
	function newDrawing(data){

		socket.on("color", function(data){
				c = color(data.r, data.g,data.b);
			});
		
			fill(c);
			stroke(c);
			strokeWeight(data.s);
			line(data.px, data.py, data.x, data.y);
	}

//mouse dragged triggers socket emit
function mouseDragged(){
	// console.log(mouseX, mouseY);

	var data = {
		px: pmouseX,
		py: pmouseY,
		x: mouseX,
		y: mouseY,
		s: sliderPos,
	}

	if (mouseX < windowWidth && mouseX > 0 && mouseY < windowHeight && mouseY > 0){
		socket.emit("mouse", data);
	}
}

// mouse pressed triggers socket emit
function mousePressed(){

	var data = {
		px: pmouseX,
		py: pmouseY,
		x: mouseX,
		y: mouseY,
		s: sliderPos,
	}
	var colorData = {
		r: r,
		g: g,
		b: b,
	}
	
	socket.emit('color',colorData);
	socket.emit("mouse", data);

	// console.log(mouseX, mouseY);
}

// drawing section constantly redraws to canvas
function draw() {

	if (mouseIsPressed) {
		stroke(c);
		strokeWeight(sliderPos);
		line(pmouseX, pmouseY, mouseX, mouseY);
	}
} 

// button pressed to change colors/slider values
function keyPressed() {
	// console.log("keypress func")
	// console.log(keyCode);

	if (keyCode == 49) {
		// console.log("Red") // 3 = red
		c = color(255, 0, 0);
		r = 255; g = 0; b = 0;

	} else if (keyCode == 50) {

		// console.log("Green") // 4 = green
		c = color(14, 126, 18);
		r = 14; g = 126; b = 18;


	} else if (keyCode == 51) {

		// console.log("Blue") // 5 = blue
		c = color(0, 0, 255);
		r = 0; g = 0; b = 255;


	} else if (keyCode == 52) {
		// console.log("key/black"); //1 = black
		c = color(0, 0, 0);
		r = 0; g = 0; b = 0;

	} else if (keyCode == 53) {
		// console.log("white"); // 2 = white
		c = color(255, 255, 255);
		r = 255; g = 255; b = 255;

	} else if (keyCode == 54) {

		// console.log("Cyan"); // 7 = cyan
		c = color(0, 255, 255);
		r = 0; g = 255; b = 255;

	} else if (keyCode == 55) {

		// console.log("Magenta"); // 8 = magenta
		c = color(255, 0, 255);
		r = 255; g = 0; b = 255;

	} else if (keyCode == 56) {

		// console.log("Yellow"); // 6 = yellow
		c = color(255, 255, 0);
		r = 255; g = 255; b = 0;

	} else if (keyCode == 57) {
		// console.log("Purple"); // 9 = purple
		c = color(128, 0, 128);
		r = 128; g = 0; b = 128;

	} else if (keyCode == 48) {
		// console.log("Orange"); // 0 = orange
		c = color(255, 165, 0);
		r = 255; g = 165; b = 0;

	} else if (keyCode == 38 || keyCode == 39) {
		// console.log("up");
		if (sliderPos !== 51) {
			// console.log("sliderPos: ", sliderPos);
			sliderPos += 5;
		}

	} else if (keyCode == 37 || keyCode == 40) {
		// console.log("down");
		if (sliderPos !== 1) {
			// console.log("sliderPos: ", sliderPos);
			sliderPos -= 5;
		}
	}
}