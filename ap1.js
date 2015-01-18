$(document).ready(function() {
  var canvas = document.getElementById('drawBoard');
  var context = canvas.getContext();

  var drawing = {
    shapes: [],
    nextObject: 'circle',
    nextColor: 'black',
    
    drawAll: function drawAll() {
      for(var i = 0; i < this.shapes.length; i++) {
        this.shapes[i].draw();
      }
    }
  }

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function Line(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    this.draw = function draw() {
      context.beginPath();
      context.moveTo(this.startPoint.x, this.startPoint.y);
      context.lineTo(this.endPoint.x, this.endPoint.y);
      context.stroke();
    }
  }

  function Rect(point, width, height) {
    this.point = point;
    this.height = height;
    this.width = width;

    this.draw = function draw() {
      context.strokeRect(this.point.x, this.point.y, this.width, this.height);
    }
  }

  function Circle(point, radius) {
    this.point = point;
    this.radius = radius;

    this.draw = function draw() {
      context.beginPath(); 
      context.arc(this.point.x, this.point.y, this.radius, 0, 2 * Math.PI, false);
      context.stroke();
      context.closePath();
    }
  }

  context = canvas.getContext('2d');
  context.canvas.width = window.innerWidth - 20;
  context.canvas.height = window.innerHeight - 20;

  var isDrawing = false;
  var startPoint, endPoint;
  var xRect, yRect, width, height;
  var xCircle, yCircle, radius;
  var kappa = .5522848, ellipsePoint, endPoint, middlePoint, controlPoint;

  $('#drawBoard').mousedown(function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    if(drawing.nextObject === 'line' || drawing.nextObject === 'rect' || 
      drawing.nextObject === 'circle' || drawing.nextObject === 'ellipse') {
      startPoint = new Point(x, y);
    }

    isDrawing = true;
  });

  $('#drawBoard').mousemove(function(e) {
    if(isDrawing) {
      var x = e.pageX - this.offsetLeft;
      var y = e.pageY - this.offsetTop;
      
      if(drawing.nextObject === 'line') {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(x, y);
        context.stroke();
      } else if(drawing.nextObject === 'rect') {
        width = Math.abs(x - startPoint.x);
        height = Math.abs(y - startPoint.y);
        xRect = Math.min(x, startPoint.x);
        yRect = Math.min(y, startPoint.y);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeRect(xRect, yRect, width, height);
      } else if(drawing.nextObject === 'circle') {
        xCircle = (x + startPoint.x) / 2;
        yCircle = (y + startPoint.y) / 2;
        radius = Math.max(
          Math.abs(x - startPoint.x),
          Math.abs(y - startPoint.y)) / 2;
        context.beginPath();
        context.arc(xCircle, yCircle, radius, 0, 2 * Math.PI, false);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.stroke();
        context.closePath();
      }

      drawing.drawAll();
    }
  });

  $('#drawBoard').mouseup(function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    if(drawing.nextObject === 'line') {
      var endPoint = new Point(x, y);
      drawing.shapes.push(new Line(startPoint, endPoint));
    } else if(drawing.nextObject === 'rect') {
      var point = new Point(xRect, yRect);
      drawing.shapes.push(new Rect(point, width, height));
    } else if(drawing.nextObject === 'circle') {
      var point = new Point(xCircle, yCircle);
      drawing.shapes.push(new Circle(point, radius));
    }
    
    drawing.drawAll();
    isDrawing = false;
  });





});