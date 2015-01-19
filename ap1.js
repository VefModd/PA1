$(document).ready(function() {
  var canvas = document.getElementById('drawBoard');
  var context = canvas.getContext();

  var drawing = {
    shapes: [],
    nextObject: 'line',
    nextColor: 'black',
    nextLineWidth: 3,
    nextFont: 'Arial',
    nextTextSize: '18px',
    
    drawAll: function drawAll() {
      for(var i = 0; i < this.shapes.length; i++) {
        this.shapes[i].draw();
      }
    },

    clearBoard: function clearBoard() {
      this.shapes = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function Line(startPoint, endPoint, color, lineWidth) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.color = color;
    this.lineWidth = lineWidth;

    this.draw = function draw() {
      context.beginPath();
      context.moveTo(this.startPoint.x, this.startPoint.y);
      context.lineTo(this.endPoint.x, this.endPoint.y);
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.stroke();
    }
  }

  function Rect(point, width, height, color, lineWidth) {
    this.point = point;
    this.height = height;
    this.width = width;
    this.color = color;
    this.lineWidth = lineWidth;

    this.draw = function draw() {
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.strokeRect(this.point.x, this.point.y, this.width, this.height);
    }
  }

  function Circle(point, radius, color, lineWidth) {
    this.point = point;
    this.radius = radius;
    this.color = color;
    this.lineWidth = lineWidth;

    this.draw = function draw() {
      context.beginPath(); 
      context.arc(this.point.x, this.point.y, this.radius, 0, 2 * Math.PI, false);
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.stroke();
      context.closePath();
    }
  }

  function Text(point, color, textSize, textFont) {
    this.point = point;
    this.color = color;
    this.textSize = textSize;
    this.textFont = textFont;

    this.draw = function draw() {
      context.font = this.textSize + ' ' + this.textFont;
      context.fillStyle = this.color;
      context.fillText("fooo", this.point.x, this.point.y);
    }
  }

  context = canvas.getContext('2d');
  context.canvas.width = window.innerWidth - 20;
  context.canvas.height = window.innerHeight - 20;

  var isDrawing = false;
  var startPoint, endPoint;
  var xRect, yRect, width, height;
  var xCircle, yCircle, radius;
  var text;

  $('#drawBoard').mousedown(function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    if(drawing.nextObject === 'line' || drawing.nextObject === 'rect' || 
      drawing.nextObject === 'circle' || drawing.nextObject === 'text') {
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
        context.strokeStyle = drawing.nextColor;
        context.lineWidth = drawing.nextLineWidth;
        context.stroke();
      } else if(drawing.nextObject === 'rect') {
        width = Math.abs(x - startPoint.x);
        height = Math.abs(y - startPoint.y);
        xRect = Math.min(x, startPoint.x);
        yRect = Math.min(y, startPoint.y);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = drawing.nextColor;
        context.lineWidth = drawing.nextLineWidth;
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
        context.strokeStyle = drawing.nextColor;
        context.lineWidth = drawing.nextLineWidth;
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
      drawing.shapes.push(new Line(startPoint, endPoint, drawing.nextColor, drawing.nextLineWidth));
    } else if(drawing.nextObject === 'rect') {
      var point = new Point(xRect, yRect);
      drawing.shapes.push(new Rect(point, width, height, drawing.nextColor, drawing.nextLineWidth));
    } else if(drawing.nextObject === 'circle') {
      var point = new Point(xCircle, yCircle);
      drawing.shapes.push(new Circle(point, radius, drawing.nextColor, drawing.nextLineWidth));
    } else if(drawing.nextObject === 'text') {
      drawing.shapes.push(new Text(startPoint, drawing.nextColor, drawing.nextTextSize, drawing.nextFont));
    }
    
    drawing.drawAll();
    isDrawing = false;
  });

  $('#pen').click(function(e) {
    drawing.nextObject = 'pen';
  });

  $('#rect').click(function(e) {
    drawing.nextObject = 'rect';
  });

  $('#line').click(function(e) {
    drawing.nextObject = 'line';
  });

  $('#circle').click(function(e) {
    drawing.nextObject = 'circle';
  });

  $('#text').click(function(e) {
    drawing.nextObject = 'text';
  });

  $('#math').click(function(e) {
    drawing.nextObject = 'math';
  });

  $('#eraser').click(function(e) {
    drawing.nextObject = 'eraser';
  });

  $('#select').click(function(e) {
    drawing.nextObject = 'select';
  });

  $('#black').click(function(e) {
    drawing.nextColor = 'black';
  });

  $('#red').click(function(e) {
    drawing.nextColor = 'red';
  });

  $('#green').click(function(e) {
    drawing.nextColor = 'green';
  });

  $('#blue').click(function(e) {
    drawing.nextColor = 'blue';
  });

  $('#clearBoard').click(function(e) {
    drawing.clearBoard();
  });

  $('#extrasmall').click(function(e) {
    drawing.lineWidth = 1;
  });

  $('#small').click(function(e) {
    drawing.lineWidth = 3;
  });

  $('#medium').click(function(e) {
    drawing.lineWidth = 5;
  });

  $('#large').click(function(e) {
    drawing.lineWidth = 9;
  });

  $('#extralarge').click(function(e) {
    drawing.lineWidth = 12;
  });

  $('#8pt').click(function(e) {
    drawing.nextTextSize = '11px';
  });

  $('#10pt').click(function(e) {
    drawing.nextTextSize = '13px';
  });

  $('#12pt').click(function(e) {
    drawing.nextTextSize = '16px';
  });

  $('#14pt').click(function(e) {
    drawing.nextTextSize = '18px';
  });

  $('#16pt').click(function(e) {
    drawing.nextTextSize = '21px';
  });

  $('#18pt').click(function(e) {
    drawing.nextTextSize = '24px';
  });

  $('#20pt').click(function(e) {
    drawing.nextTextSize = '28px';
  });

  $('#arial').click(function(e) {
    drawing.nextFont = 'Arial';
  });

  $('#verdana').click(function(e) {
    drawing.nextFont = 'Verdana';
  });

  $('#times').click(function(e) {
    drawing.nextFont = 'Times New Roman';
  });

  $('#courier').click(function(e) {
    drawing.nextFont = 'Courier New';
  });

  $('#serif').click(function(e) {
    drawing.nextFont = 'serif';
  });








});