/*Pendulum Configs*/
var r1 = 200;
var r2 = 200;
var m1 = 20; //Mass 1
var m2 = 20; //Mass 2
var a1 = Math.PI / 2; //Angle 1
var a2 = Math.PI / 2; //Angle 2
var a1_velocity = 0;
var a2_velocity = 0;
const g = 1;

/*Canvas*/
var width = 800;
var height = 600;


function setup() {
    center_x = width / 2;
    center_y = 100;

    /*Create and configure canvas for the pendulum*/
    canvas = document.createElement("canvas"); //global
    canvas.id = "Pendulum";
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = "1px solid";



    /*Create and configure canvas for background*/
    background = document.createElement("canvas"); //global
    background.id = "Background";
    background.width = width;
    background.height = height;


    /*Append canvas to body*/
    var body = document.getElementById("pendulum_swing");
    body.appendChild(canvas);


    /*Create a context for each canvas*/
    ctx = canvas.getContext("2d"); //global
    ctx.translate(center_x, center_y);
    ctx_background = background.getContext("2d");
    ctx_background.translate(center_x, center_y);
    ctx_background.globalAlpha = 0.1;
    ctx_background.lineWidth = 2;
}

function draw() {
	requestId = undefined;
    /*Calculate Acceleration*/ //yay Physics
    let num1 = -g * (2 * m1 + m2) * Math.sin(a1);
    let num2 = -m2 * g * Math.sin(a1 - 2 * a2);
    let num3 = -2 * Math.sin(a1 - a2) * m2 * (Math.pow(a2_velocity, 2) * r2 + Math.pow(a1_velocity, 2) * r1 * Math.cos(a1 - a2));
    let den = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    var a1_acceleration = (num1 + num2 + num3) / den;
    num1 = 2 * Math.sin(a1 - a2) * (Math.pow(a1_velocity, 2) * r1 * (m1 + m2) + g * (m1 + m2) * Math.cos(a1) + Math.pow(a2_velocity, 2) * r2 * m2 * Math.cos(a1 - a2));
    den = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    var a2_acceleration = num1 / den;

    /*Background*/
    ctx.fillStyle = "white";
	ctx.fillRect(-center_x, -center_y, canvas.width, canvas.height);
	ctx.drawImage(background,-center_x,-center_y);

    /*Draw first Pendulum*/
    var x1 = r1 * Math.sin(a1);
    var y1 = r1 * Math.cos(a1);
    draw_line(0, 0, x1, y1);
    draw_ellipse(x1, y1, m1, m1, "red");

    /*Draw second Pendulum with offset from first pendulum*/
    var x2 = x1 + r2 * Math.sin(a2);
    var y2 = y1 + r2 * Math.cos(a2);
    draw_line(x1, y1, x2, y2);
    draw_ellipse(x2, y2, m2, m2, "blue");

    /*Set angle and velocity with time interval equal to one frame*/
    //a1_velocity*=0.99;
    //a2_velocity*=0.99;
    a1_velocity += a1_acceleration;
    a2_velocity += a2_acceleration;
    a1 += a1_velocity;
    a2 += a2_velocity;

    draw_background(x1, y1, x2, y2);
    start();
}

function draw_background(x1, y1, x2, y2) {

	draw_background_lines(koords_1,"red");
	draw_background_lines(koords_2,"blue");

    //draw_background_lines(array);
    koords_1.push([x1,y1]);
    if (koords_1.length>50) {
    	koords_1.splice(0, 1);
    }

    koords_2.push([x2,y2]);
    if (koords_2.length>150) {
    	koords_2.splice(0, 1);
    }    
}

function draw_background_lines(array,color){
    ctx_background.fillStyle = "white";
	ctx_background.fillRect(-center_x, -center_y, canvas.width, canvas.height);	
	for (var i = 0; i < array.length-1; i++) {
		if (array[i][0]!=0 && array[i][1]!=0) {
			ctx_background.beginPath()
	        ctx_background.strokeStyle = color;
	        ctx_background.moveTo(array[i][0], array[i][1]);
	        ctx_background.lineTo(array[i+1][0], array[i+1][1]);
	        ctx_background.stroke();
        }
	}
}

function draw_line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function draw_ellipse(x, y, radiusX, radiusY, fillColor) {
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.ellipse(x, y, radiusX / 2, radiusY / 2, 0, 0, 2 * Math.PI); //Divided by two because of dia to radius

    ctx.fill();
}

function stop() {
    if (requestId) {
       window.cancelAnimationFrame(requestId);
       requestId = undefined;
    }
}

function start(){
  	if (!requestId) {
   		requestId = window.requestAnimationFrame(draw);
   	}	
}

var requestId;
var koords_1 = [];
koords_1[0]=[0,0];
var koords_2 = [];
koords_2[0]=[0,0];

setup();
draw();