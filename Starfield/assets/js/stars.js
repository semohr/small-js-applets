function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}


class Star {
  constructor(canvas,x, y) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;

    //Generate random positions if not defined by constructor
    if (x === undefined) {this.x = getRndInteger(0,this.canvas.width)};
    if (y === undefined) {this.y = getRndInteger(0,this.canvas.height)};

    this.init_velocity();

    //Generate size random
    this.radius = Math.random() * 1.2;

    //Get random color from colorrange
    this.hue = Star.colorrange[getRndInteger(0,Star.colorrange.length)];
    this.sat = getRndInteger(50,100+1);
    this.color ="hsl(" + this.hue + ", " + this.sat + "%, 88%)"

    //Helper property to schedule deletion
    this.to_delete = false;
  }

  /*
  // Utilities
  */
  static colorrange = [0,60,240];

  init_velocity(vx,vy){
    //Generate random velocities (very slow changes)
    //I want at max speed 12 minute to cross the screens width
    let min = -this.canvas.width/(60*6.5);
    let max = this.canvas.width/(60*6.5);
    if (vx === undefined){
      this.vx = getRandomFloat(min,max,6);
    } else {
      this.vx = vx;
    }
    if (vy === undefined){
      this.vy = getRandomFloat(min,max,6);
    } else {
      this.vy = vy;
    }
  }



  /*
  // Essentials 
  */
  draw(context){
    //Draw star
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 360);
    context.fillStyle = this.color;
    context.fill();
  }


  timestep(dt){
    //Move star dt in seconds expected
    //Also possibility to get bigger/smaller
    this.x = this.x + this.vx*dt;
    this.y = this.y + this.vy*dt; 


    //If the star leaves the starfield mark it for deletion
    if (this.x > this.canvas.width || this.y > this.canvas.height) {
      this.to_delete = true;
    }
  }
}


class ShootingStar extends Star {
  constructor(canvas, x, y){
    super(canvas,x,y);
    this.history = [];
  };

  static max_history_len = 20;

  init_velocity(){
    //We want relative fast shooting stars
    //i.e min 1.5s max 3s on screen.
    let v_total = getRandomFloat(this.canvas.width/10.5,this.canvas.width/30,3);
    let angle = getRandomFloat(0,2 * Math.PI,3);
    //To allow for negative values
    super.init_velocity(v_total*Math.cos(angle),v_total*Math.sin(angle));
  }

  draw(context){
    //Call draw function from star class
    super.draw(context);

    //Draw tail
    context.lineWidth = this.radius*2;
    for (var i = 0; i < this.history.length-1; i++) {
      context.beginPath();
      var opacity = 0.3;
      if (i < this.history.length/3) {
        opacity = 0.1;
      } else if (i < this.history.length*2/3) {
        opacity = 0.2;
      }
      context.strokeStyle = "hsla(" + this.hue + ", " + this.sat + "%, 88%,"+opacity+")";
      context.moveTo(this.history[i][0], this.history[i][1]);
      context.lineTo(this.history[i+1][0], this.history[i+1][1]);
      context.stroke();
    }
  };

  timestep(dt){
    //Push old position to history
    this.history.push([this.x,this.y]);

    //Remove from history if too many entries
    if (this.history.length > ShootingStar.max_history_len){
      this.history.splice(0, 1);
    }
    super.timestep(dt);

    if ((this.history[0][0] < this.canvas.width) && (this.history[0][1] < this.canvas.height)){
      this.to_delete = false;
    }
  }
}


class Constellation {
  constructor(stars, canvas) {
    this.stars = stars;
  }

  draw(){
    //Draws constellation on canvas
  }
}



function nthroot(x, n) {
  try {
    var negate = n % 2 == 1 && x < 0;
    if(negate)
      x = -x;
    var possible = Math.pow(x, 1 / n);
    n = Math.pow(possible, n);
    if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
      return negate ? -possible : possible;
  } catch(e){}
}