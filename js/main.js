var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

//in pixel
var gridCellSize = 10;

//mesh points.
var borderPoints = [];
var innerPoints = [];

var x = "black",
    y = 2;

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    fullCanvas();
    w = canvas.width;
    h = canvas.height;
    console.log("init", w, h);

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e);
        closeSketch();
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

function fullCanvas() {
    var width  = window.innerWidth;//canvas.clientWidth * window.devicePixelRatio | 0;
    var height = window.innerHeight;//canvas.clientHeight * window.devicePixelRatio | 0;
    console.log(width, height);
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

function draw() {
    /*
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
    */

    checkGrid(prevX, prevY, currX, currY);
}

//check if newly drawn segment intersects uniform grid
function checkGrid(pX, pY, cX, cY) {
    //console.log(pX, pY, cX, cY);
    var maxX = ((pX>cX)?pX:cX);
    var minX = ((pX<cX)?pX:cX);
    var maxY = ((pY>cY)?pY:cY);
    var minY = ((pY<cY)?pY:cY);

    var sX = Math.floor(minX/gridCellSize);
    var eX = Math.floor(maxX/gridCellSize);
    var sY = Math.floor(minY/gridCellSize);
    var eY = Math.floor(maxY/gridCellSize);

    //console.log(maxX, eX, minX, sX);

    var iX = (sX==eX)?0:eX-sX;
    if(iX > 0) console.log(iX);
    for (var i = 0; i < iX; i++) {
        drawPoint(intersectX(pX, cX, pY, cY, (sX+1+i)*gridCellSize));
        borderPoints.push(intersectX(minX, maxX, minY, maxY, (sX+1+i)*gridCellSize));
    };

    var iY = (sY==eY)?0:eY-sY;
    if(iY > 0) console.log(iY);
    for (var i = 0; i < iY; i++) {
        drawPoint(intersectY(pX, cX, pY, cY, (sY+1+i)*gridCellSize));
        borderPoints.push(intersectY(minX, maxX, minY, maxY, (sY+1+i)*gridCellSize));
    };
    //console.log(maxX, minX, maxY, minY);
    console.log(borderPoints);
}

function intersectX(aX, bX, aY, bY, n) {
    console.log("pts: (",aX,aY,"), (",bX,bY,"); \n at x =",n);
    var rY;
    if(bX!=aX) {
        rY = aY + ((bY-aY)/(bX-aX))*(n-aX);
    } else {
        rY = (aY+bY)/2;
    }
    console.log(n, rY);
    return [n, rY];
}

function intersectY(aX, bX, aY, bY, n) {console.log("pts: (",aX,aY,"), (",bX,bY,"); \n at y =",n);
    var rX;
    if(bY!=aY) {
        rX = aX + ((bX-aX)/(bY-aY))*(n-aY);
    } else {
        rX = (aX+bX)/2;
    }
    console.log(rX, n);

    return [rX, n];
}

function drawPoint(point) {
    var style = ctx.fillStyle;
    ctx.fillStyle = "#02E020"; 
    ctx.beginPath();
    ctx.arc(point[0],point[1],5,0,2*Math.PI);
    ctx.fill();
    ctx.fillStyle = style;
}

function erase() {
    ctx.clearRect(0, 0, w, h);
    document.getElementById("canvasimg").style.display = "none";
}

function save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            /*
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            */
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}