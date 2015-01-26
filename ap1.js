$(document).ready(function() {
  var canvas = document.getElementById('drawBoard');
  var context = canvas.getContext();

  var drawing = {
    shapes: [],
    nextObject: 'pen',
    nextColor: 'black',
    nextLineWidth: 3,
    nextFont: 'Arial',
    nextTextSize: '18px',
    undoShapes: [],
    
    drawAll: function drawAll() {
      for(var i = 0; i < this.shapes.length; i++) {
        this.shapes[i].draw();
      }
    },

    clearBoard: function clearBoard() {
      this.shapes = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
    },

    undo: function undo() {
      if(this.shapes.length > 0 && this.shapes != 'undefined') {
        this.undoShapes.push(this.shapes.pop());
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawing.drawAll();
      }
    },

    redo: function redo() {
      if(this.undoShapes.length > 0 && this.undoShapes != 'undefined') {
        this.shapes.push(this.undoShapes.pop());
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawing.drawAll();
      }
    }
  }

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function Line(x, y, color, lineWidth) {
    this.startPoint = new Point(x, y);
    this.color = color;
    this.lineWidth = lineWidth;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.endPoint = new Point(_x, _y);
    };

    this.draw = function draw() {
      context.beginPath();
      context.moveTo(this.startPoint.x, this.startPoint.y);
      context.lineTo(this.endPoint.x, this.endPoint.y);
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.stroke();
    };
  }

  function Rect(x, y, color, lineWidth) {
    this.startPoint = new Point(x, y);
    this.color = color;
    this.lineWidth = lineWidth;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.endPoint = new Point(_x, _y);
    };

    this.draw = function draw() {
      var width = Math.abs(this.endPoint.x - this.startPoint.x);
      var height = Math.abs(this.endPoint.y - this.startPoint.y);
      var xRect = Math.min(this.endPoint.x, this.startPoint.x);
      var yRect = Math.min(this.endPoint.y, this.startPoint.y);
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.strokeRect(xRect, yRect, width, height);
    };
  }

  function Circle(x, y, color, lineWidth) {
    this.startPoint = new Point(x, y);
    this.color = color;
    this.lineWidth = lineWidth;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.endPoint = new Point(_x, _y);
    }

    this.draw = function draw() {
      var xCircle = (this.endPoint.x + this.startPoint.x) / 2;
      var yCircle = (this.endPoint.y + this.startPoint.y) / 2;
      var radius = Math.max(
        Math.abs(this.endPoint.x - this.startPoint.x),
        Math.abs(this.endPoint.y - this.startPoint.y)) / 2;
      context.beginPath(); 
      context.arc(this.startPoint.x, this.startPoint.y, radius, 0, 2 * Math.PI, false);
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.stroke();
      context.closePath();
    }
  }

  

  function Pen(x, y, color, lineWidth) {
    this.points = [];
    this.points.push(new Point(x, y));
    this.color = color;
    this.lineWidth = lineWidth;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.points.push(new Point(_x, _y));
    }

    this.draw = function draw() {
      for(var i = 0; i < this.points.length; i++) {
        if(i === 0) {
          context.beginPath();
          context.moveTo(this.points[i].x, this.points[i].y);
        } else {
          context.lineWidth = this.lineWidth;
          context.strokeStyle = this.color;
          context.lineTo(this.points[i].x, this.points[i].y)
          context.stroke();
        }
      }
    }
  }

  
  function Text(x, y, text, color, font, size) {
    this.startPoint = new Point(x, y);
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.font = font;
    this.size = size;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.endPoint = new Point(_x, _y);
    }

    this.draw = function draw() {
      context.font = this.size + ' ' + this.font;
      context.fillStyle = this.color;
      context.fillText(this.text, this.x, this.y);
    }
  }

  /*
  function Text(text, point, color, textSize, textFont) {
    this.text = text;
    this.point = point;
    this.color = color;
    this.textSize = textSize;
    this.textFont = textFont;

    this.draw = function draw() {
      context.font = this.textSize + ' ' + this.textFont;
      context.fillStyle = this.color;
      context.fillText(text, this.point.x, this.point.y);
    }
  }
  */

  context = canvas.getContext('2d');
  context.canvas.width = window.innerWidth - 20;
  context.canvas.height = window.innerHeight - 20;

  var isDrawing = false;
  var startPoint, endPoint;
  var xRect, yRect, width, height;
  var xCircle, yCircle, radius;
  var text;
  var points = [];
  var currTextInput;

  $('#drawBoard').mousedown(function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    points = [];

    if(drawing.nextObject === 'line') {
      drawing.shapes.push(new Line(x, y, drawing.nextColor, drawing.nextLineWidth));
    } else if(drawing.nextObject === 'rect') {
      drawing.shapes.push(new Rect(x, y, drawing.nextColor, drawing.nextLineWidth));
    } else if(drawing.nextObject === 'circle') {
      drawing.shapes.push(new Circle(x, y, drawing.nextColor, drawing.nextLineWidth));
    } else if(drawing.nextObject === 'pen') {
      drawing.shapes.push(new Pen(x, y, drawing.nextColor, drawing.nextLineWidth));
    } //else if(drawing.nextObject === 'text') {
      //drawing.shapes.push(new Text(x, y));
    //} 

    
    if(drawing.nextObject === 'text') {
      startPoint = new Point(x, y);
    }
    

    isDrawing = true;
  });

  $('#drawBoard').mousemove(function(e) {
    if(isDrawing) {
      var x = e.pageX - this.offsetLeft;
      var y = e.pageY - this.offsetTop;

      if(drawing.nextObject !== 'text') {
      var shape = drawing.shapes[drawing.shapes.length - 1];
      shape.setEndPoint(x, y);
      context.clearRect(0, 0, canvas.width, canvas.height);
      }

      drawing.drawAll();
    }
  });

  $('#drawBoard').mouseup(function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    if(drawing.nextObject === 'text') {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if(currTextInput) {
        currTextInput.remove();
      }

      var x = e.pageX;
      var y = e.pageY;

      currTextInput = $('<input />');
      currTextInput.css('font-size', drawing.nextTextSize);
      currTextInput.css('color', drawing.nextColor);
      currTextInput.css('font-family', drawing.nextFont);
      currTextInput.css('position', 'fixed');
      currTextInput.css('top', y);
      currTextInput.css('left', x);

      $('#textInput').append(currTextInput);
      currTextInput.focus();
    }

    drawing.drawAll();
    isDrawing = false;
  });

  $(document).keypress(function(e) {
    if(e.which === 13) {
      if(currTextInput) {
        var inputBoxOffset = currTextInput.offset();
        drawing.shapes.push(new Text(startPoint.x, startPoint.y, currTextInput.val(), drawing.nextColor, drawing.nextFont, drawing.nextTextSize));
      
        currTextInput.remove();
      }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawing.drawAll();
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
    drawing.nextLineWidth = 1;
  });

  $('#small').click(function(e) {
    drawing.nextLineWidth = 3;
  });

  $('#medium').click(function(e) {
    drawing.nextLineWidth = 5;
  });

  $('#large').click(function(e) {
    drawing.nextLineWidth = 9;
  });

  $('#extralarge').click(function(e) {
    drawing.nextLineWidth = 12;
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

  $('#undo').click(function(e) {
    drawing.undo();
  });

  $('#redo').click(function(e) {
    drawing.redo();
  });

  var button = document.getElementById('btn-download');
  button.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL('image/png');
    button.href = dataURL;
  });


  /* load thingy
  function el(id){return document.getElementById(id);} // Get elem by ID
  function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           var img = new Image();
           img.onload = function() {
             context.drawImage(img, 0, 0);
           };
    img.src = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
    }
}

el("fileUpload").addEventListener("change", readImage, false);
*/

});