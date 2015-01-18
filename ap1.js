$(document).ready(function() {
  var canvas = document.getElementById('drawBoard');
  var context = canvas.getContext();

  var drawing = {
    shapes: [],
    nextObject: 'line',
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

  context = canvas.getContext('2d');
    context.canvas.width = window.innerWidth - 20;
    context.canvas.height = window.innerHeight - 20;

    var startX, startY;
    var isDrawing = false;
    var startPoint, endPoint;

  $('#drawBoard').mousedown(function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    startPoint = new Point(x, y);
    isDrawing = true;
  });

  $('#drawBoard').mousemove(function(e) {
    if(isDrawing) {
      var x = e.pageX - this.offsetLeft;
      var y = e.pageY - this.offsetTop;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.moveTo(startPoint.x, startPoint.y);
      context.lineTo(x, y);
      context.stroke();
      drawing.drawAll();
    }
  });

  $('#drawBoard').mouseup(function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    var endPoint = new Point(x, y);
    drawing.shapes.push(new Line(startPoint, endPoint));
    drawing.drawAll();
    isDrawing = false;
  });





});