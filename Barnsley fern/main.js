let current_koords=[];
var steps_per_frame = 1000;
/*Config Canvas*/
var width = window.innerWidth-5;
var height = window.innerHeight-5;

function setup(){
	/*Create Canvas*/
	canvas = document.createElement("canvas");
	canvas.className = "sequence_visual"
	canvas.width = width;
	canvas.height = height;

  /*Append canvas to body*/
  var body = document.getElementsByTagName("BODY")[0];
  body.appendChild(canvas);

  /*CTX config*/
  ctx = canvas.getContext("2d");
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'green';
  ctx.transform(0.5,0,0,-0.98,width/2,height); //Rotation,Translation and Scaling

  /*Starting point for drawing*/
	var start_koords = [
		[0],  //x_0
		[0],	//y_0
	];
	current_koords = start_koords;	
	draw();
}


function draw(){
	requestId = undefined;
	/*Pick a function random*/

	for (var i = 0; i < steps_per_frame; i++) {
		rng=math.random();
		if (rng<0.01) {		// 1% chance
			current_koords = f_1(current_koords);
		}
		else if (rng<(0.01+0.85)){ // 85% chance
			current_koords = f_2(current_koords);
		}
		else if (rng<(0.01+0.85+0.07)){ // 7% chance
			current_koords = f_3(current_koords);
		}
		else{	// 7% chance
			current_koords = f_4(current_koords);
		}


		/*Transform koords*/
			//x-Range: −2.1820 < x < 2.6558
			//y-Range: 0 ≤ y < 9.9983
		let x=width/2.6558*current_koords[0];
		let y=height/10*current_koords[1];

		/*Draw at koords*/
		ctx.fillRect( x,y, 1, 1 );
	}
	start_draw();
}

function stop_draw() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = undefined;
  }
}
function start_draw(){
  if (!requestId) {
   	requestId = window.requestAnimationFrame(draw);
  }	
}


function f_1(koord){
	let new_koord = math.multiply(matrix_1,koord);
	return new_koord;
}

function f_2(koord){
	let new_koord = math.add(math.multiply(matrix_2,koord),vektor_2);
	return new_koord;
}

function f_3(koord){
	let new_koord = math.add(math.multiply(matrix_3,koord),vektor_3);
	return new_koord;
}

function f_4(koord){
	let new_koord = math.add(math.multiply(matrix_4,koord),vektor_4);
	return new_koord;
}

setup();
