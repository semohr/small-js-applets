function Circle(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r || 1;
    this.growing = true;
    this.color = color || "black";

    this.show = function(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.ellipse(this.x, this.y, this.r, this.r, 0, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        // ctx.stroke();
    }

    this.grow = function() {
        if (this.growing) {
            let r = this.r;
            this.r = r + growrate;
        }
    }

    this.edges = function() {
        let x = this.x;
        let y = this.y;
        let r = this.r;
        return (x + r > canvas.width || x - r < 0 || y + r > canvas.height || y - r < 0);
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function setup() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    newImg = new Image;
    newImg.src  = url + '?' + new Date().getTime();
		newImg.setAttribute('crossOrigin', '');

    newImg.onload = function() {
        canvas.crossOrigin = "anonymous";
        canvas.height = newImg.height;
        canvas.width = newImg.width;
        pixelData = getImgData(newImg);
        var index_R;
        var index_G;
        var index_B;
        var index_A;
        var R, G, B, A;
        var brightness;

        for (var x = 0; x < newImg.width; x++) {
            for (var y = 0; y < newImg.height; y++) {
                // R,G,B,A,
                index_R = (x + y * newImg.width) * 4;
                index_G = index_R + 1;
                index_B = index_R + 2;
                index_A = index_R + 3;
                R = pixelData.data[index_R];
                G = pixelData.data[index_G];
                B = pixelData.data[index_B];
                A = pixelData.data[index_A];
                brightness = (0.2126 * R + 0.7152 * G + 0.0722 * B);
                if (brightness > 0.5) {
                    spots.push([x, y, R, G, B, A]);
                }

            }
        }
        canvas.innerHTML = "Only works on firefox somehow...";
        draw();
    }
}

var spots = [];
var newImg;
var pixelData;

function getImgData(my_Image) {
    ctx.drawImage(my_Image, 0, 0);
    return (ctx.getImageData(0, 0, my_Image.width, my_Image.height));
}


function draw() {
    /*Background*/
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundcolor;
    ctx.fill();

    var count = 0;
    var total = new_circles_per_frame;
    var attempts = 0;
    var new_c;
    while (count < total) {
        new_c = newCircle();
        if (new_c != null) {
            circles.push(new_c);
            count++;
        }
        attempts++;
    }

    for (var i = 0; i < circles.length; i++) {
        if (circles[i].growing) {
            if (circles[i].edges()) {
                circles[i].growing = false;
            } else {
                for (var j = 0; j < circles.length; j++) {
                    if (circles[i] != circles[j]) {
                        var d = dist(circles[i].x, circles[i].y, circles[j].x, circles[j].y);
                        if (d - 3 < circles[i].r + circles[j].r) {
                            circles[i].growing = false;
                            break;
                        }
                    }
                }
            }
        }
        circles[i].show(ctx);
        circles[i].grow();

    }

    if (attempts < 1000) {
        requestAnimationFrame(draw);
    } else {
        for (var i = 0; i < circles.length; i++) {
            circles[i].show(ctx);
        }
        console.log("Finshed");
        window.location = canvas.toDataURL("image/png");
    		//document.write('<img src="'+img+'"/>');
    }
}

function newCircle() {
    var rand = getRndInteger(0, spots.length);
    var x = spots[rand][0];
    var y = spots[rand][1];
    var valid = true;
    for (var i = 0; i < circles.length; i++) {
        var d = dist(x, y, circles[i].x, circles[i].y);
        if (d - 3 < circles[i].r) {
            valid = false;
            break;
        }
    }
    var color = 'rgb(' + spots[rand][2] + ', ' + spots[rand][3] + ', ' + spots[rand][4] + ', ' + spots[rand][5] + ')';
    if (valid) {
        return new Circle(x, y, 1, color);
    } else {
        return null;
    }
}

function dist(x1, y1, x2, y2) {
    return (Math.hypot(x2 - x1, y2 - y1));
};


var circles = [];
setup();