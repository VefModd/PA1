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
      if(this.shapes.length > 0 && this.shapes !== 'undefined') {
        this.undoShapes.push(this.shapes.pop());
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawing.drawAll();
      }
    },

    redo: function redo() {
      if(this.undoShapes.length > 0 && this.undoShapes !== 'undefined') {
        this.shapes.push(this.undoShapes.pop());
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawing.drawAll();
      }
    },

    select: function select(x, y) {
      for(var i = this.shapes.length - 1; i >= 0; i--) {
        if(this.shapes[i].reachable) {
          if(this.shapes[i].reachable(x, y)) {
            return this.shapes[i];
          }
        }
      }
    }
  }

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function Picture(img, x, y){
    this.img = img;
    this.point = new Point(x, y);
    this.movingPoint;
    var x1, x2, y1, y2;

    this.reachable = function reachable(_x, _y) {
      x1 = this.point.x + this.img.width;
      y1 = this.point.y + this.img.height;

      if(this.point.x <= _x && _x <= x1 && this.point.y <= _y && _y <= y1) {
        console.log("inside pic true");
        return true;
      } else {
        console.log("inside pic false");
        return false;
      }
    }

    this.setMovingPoint = function setMovingPoint(_x, _y) {
      this.movingPoint = new Point(_x, _y);
    }

    this.move = function move(_x, _y) {
      _x = _x - this.movingPoint.x;
      _y = _y - this.movingPoint.y;
      this.point.x += _x;
      this.point.y += _y;
    }
    
    this.draw = function draw(){
      context.drawImage(img, this.point.x, this.point.y);
    };
  }

  function Line(x, y, color, lineWidth) {
    this.startPoint = new Point(x, y);
    this.color = color;
    this.lineWidth = lineWidth;
    this.endPoint = this.startPoint;
    this.movingPoint;
    var x1, x2, y1, y2;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.endPoint = new Point(_x, _y);
    };

    this.reachable = function reachable(_x, _y) {
      x1 = Math.min(this.startPoint.x, this.endPoint.x);
      x2 = Math.max(this.startPoint.x, this.endPoint.x);
      y1 = Math.min(this.startPoint.y, this.endPoint.y);
      y2 = Math.max(this.startPoint.y, this.endPoint.y);

      // !!
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y1);
      context.moveTo(x2, y1);
      context.lineTo(x2, y2);
      context.moveTo(x2, y2);
      context.lineTo(x1, y2);
      context.moveTo(x1, y2);
      context.lineTo(x1, y1);
      context.stroke();
      // !!

      if(x1 <= _x && _x <= x2 && y1 <= _y && _y <= y2) {
        console.log("true");
        return true;
      } else {
        console.log("false");
        return false;
      }
    };

    this.setMovingPoint = function setMovingPoint(_x, _y) {
      this.movingPoint = new Point(_x, _y);
    };

    this.move = function move(_x, _y) {
      _x = _x - this.movingPoint.x;
      _y = _y - this.movingPoint.y;
      this.startPoint.x += _x;
      this.startPoint.y +=  _y;
      this.endPoint.x +=  _x;
      this.endPoint.y +=  _y;
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
    this.endPoint = this.startPoint;
    this.movingPoint;
    var x1, x2, y1, y2;
    var width, height, xRect, yRect;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.endPoint = new Point(_x, _y);
    };

    this.reachable = function reachable(_x, _y) {
      x1 = Math.min(this.startPoint.x, this.endPoint.x);
      x2 = Math.max(this.startPoint.x, this.endPoint.x);
      y1 = Math.min(this.startPoint.y, this.endPoint.y);
      y2 = Math.max(this.startPoint.y, this.endPoint.y);

      if(x1 <= _x && _x <= x2 && y1 <= _y && _y <= y2) {
        console.log("true");
        return true;
      } else {
        console.log("false");
        return false;
      }
    };

    this.setMovingPoint = function setMovingPoint(_x, _y) {
      this.movingPoint = new Point(_x, _y);
    };

    this.move = function move(_x, _y) {
      _x = _x - this.movingPoint.x;
      _y = _y - this.movingPoint.y;
      this.startPoint.x += _x;
      this.startPoint.y += _y;
      this.endPoint.x += _x;
      this.endPoint.y += _y;
    };

    this.draw = function draw() {
      width = Math.abs(this.endPoint.x - this.startPoint.x);
      height = Math.abs(this.endPoint.y - this.startPoint.y);
      xRect = Math.min(this.endPoint.x, this.startPoint.x);
      yRect = Math.min(this.endPoint.y, this.startPoint.y);

      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.strokeRect(xRect, yRect, width, height);
    };
  }

  function Circle(x, y, color, lineWidth) {
    this.startPoint = new Point(x, y);
    this.color = color;
    this.lineWidth = lineWidth;
    this.radius;
    this.endPoint = this.startPoint;
    this.movingPoint;
    var x1, y1;
    var xCircle, yCircle;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.endPoint = new Point(_x, _y);
    };

    this.reachable = function reachable(_x, _y) {
      x1 = Math.min(this.startPoint.x, this.endPoint.x);
      y1 = Math.min(this.startPoint.y, this.endPoint.y);
      x1 = x1 - this.radius;
      y1 = y1 - this.radius;

      // !
      context.strokeRect(x1, y1, this.radius * 2, this.radius * 2);
      // !

      if((x1 <= _x) && (y1 <= _y) && _x <= (x1 + this.radius * 2) && (_y <= y1 + this.radius * 2)) {
        console.log("true");
        return true;
      } else {
        console.log("false");
        return false;
      }
    };

    this.setMovingPoint = function setMovingPoint(_x, _y) {
      this.movingPoint = new Point(_x, _y);
    };

    this.move = function move(_x, _y) {
      _x = _x - this.movingPoint.x;
      _y = _y - this.movingPoint.y;
      this.startPoint.x += _x;
      this.startPoint.y += _y;
      this.endPoint.x += _x;
      this.endPoint.y += _y;
    };

    this.draw = function draw() {
      xCircle = (this.endPoint.x + this.startPoint.x) / 2;
      yCircle = (this.endPoint.y + this.startPoint.y) / 2;
      this.radius = Math.max(
        Math.abs(this.endPoint.x - this.startPoint.x),
        Math.abs(this.endPoint.y - this.startPoint.y)) / 2;

      context.beginPath(); 
      context.arc(this.startPoint.x, this.startPoint.y, this.radius, 0, 2 * Math.PI, false);
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.stroke();
      context.closePath();
    };
  }

  function Pen(x, y, color, lineWidth) {
    this.points = [];
    this.points.push(new Point(x, y));
    this.color = color;
    this.lineWidth = lineWidth;
    this.movingPoint;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.points.push(new Point(_x, _y));
    };

    this.reachable = function reachable(_x, _y) {
      for(var i = 0; i < this.points.length; i++) {
        if(Math.abs(this.points[i].x - _x) <= 30 && Math.abs(this.points[i].y - _y) <= 30) {
          console.log("true");
          return true;
        }
      }
      console.log("false");
      return false;
    };

    this.setMovingPoint = function setMovingPoint(_x, _y) {
      this.movingPoint = new Point(_x, _y);
    };

    this.move = function move(_x, _y) {
      _x -= this.movingPoint.x;
      _y -= this.movingPoint.y;
      
      for(var i = 0; i < this.points.length; i++) {
        this.points[i].x += _x;
        this.points[i].y += _y;
      }
    };

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
    };
  }

  function Text(x, y, text, color, font, size) {
    this.textPoint = new Point(x, y);
    this.text = text;
    this.color = color;
    this.font = font;
    this.size = size;
    this.movingPoint;
    var x1, x2, y1, y1;

    this.reachable = function reachable(_x, _y) {
      x1 = this.textPoint.x;
      y1 = this.textPoint.y;
      x2 = x1 + context.measureText(this.text).width;
      y2 = y1 - 25;

      // !
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y1);
      context.moveTo(x2, y1);
      context.lineTo(x2, y2);
      context.moveTo(x2, y2);
      context.lineTo(x1, y2);
      context.moveTo(x1, y2);
      context.lineTo(x1, y1);
      context.stroke();
      // !

      if(x1 <= _x && _x <= x2 && y2 <= _y && _y <= y1) {
        console.log("true");
        return true;
      } else {
        console.log("false");
        return false;
      }
    };

    this.setMovingPoint = function setMovingPoint(_x, _y) {
      this.movingPoint = new Point(_x, _y);
    };

    this.move = function move(_x, _y) {
      _x = _x - this.movingPoint.x;
      _y = _y - this.movingPoint.y;
      this.textPoint.x = this.textPoint.x + _x;
      this.textPoint.y = this.textPoint.y + _y;
    };

    this.draw = function draw() {
      context.font = this.size + ' ' + this.font;
      context.fillStyle = this.color;
      context.fillText(this.text, this.textPoint.x, this.textPoint.y);
    };
  }

  function Eraser(x, y, lineWidth) {
    this.points = [];
    this.points.push(new Point(x, y));
    this.lineWidth = lineWidth;

    this.setEndPoint = function setEndPoint(_x, _y) {
      this.points.push(new Point(_x, _y));
    };

    this.draw = function draw() {
      for(var i = 0; i < this.points.length; i++) {
        if(i === 0) {
          context.beginPath();
          context.moveTo(this.points[i].x, this.points[i].y);
        } else {
          context.lineWidth = this.lineWidth;
          context.strokeStyle = '#FFFFFF';
          context.lineTo(this.points[i].x, this.points[i].y)
          context.stroke();
        }
      }
    };
  }

  context = canvas.getContext('2d');
  context.canvas.width = window.innerWidth - 20;
  context.canvas.height = window.innerHeight - 20;

  var global = {
    isDrawing : false,
    isMoving : false,
    textPoint : undefined,
    currTextInput : undefined,
    currShape : undefined
  };

  $('#drawBoard').mousedown(function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    if(drawing.nextObject === 'select') {
      global.currShape = drawing.select(x, y);
      console.log("select");
      if(global.currShape) {
        console.log("notcurrshape");
        global.currShape.setMovingPoint(x, y);
        global.isMoving = true;
      }
    } else {
      if(drawing.nextObject === 'line') {
        drawing.shapes.push(new Line(x, y, drawing.nextColor, drawing.nextLineWidth));
      } else if(drawing.nextObject === 'rect') {
        drawing.shapes.push(new Rect(x, y, drawing.nextColor, drawing.nextLineWidth));
      } else if(drawing.nextObject === 'circle') {
        drawing.shapes.push(new Circle(x, y, drawing.nextColor, drawing.nextLineWidth));
      } else if(drawing.nextObject === 'pen') {
        drawing.shapes.push(new Pen(x, y, drawing.nextColor, drawing.nextLineWidth));
      } else if(drawing.nextObject === 'eraser') {
        drawing.shapes.push(new Eraser(x, y, drawing.nextLineWidth));
      }

      global.isDrawing = true;
    }
  });

  $('#drawBoard').mousemove(function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    if(global.isDrawing) {
      if(drawing.nextObject !== 'text') {
        var shape = drawing.shapes[drawing.shapes.length - 1];
        shape.setEndPoint(x, y);
      }
    } else if(global.isMoving) {
      console.log("moveing!!");
      global.currShape.move(x, y);
      global.currShape.setMovingPoint(x, y);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawing.drawAll();
  });

  $('#drawBoard').mouseup(function(e) {
    if(drawing.nextObject === 'text') {
      if(global.currTextInput) {
        global.currTextInput.remove();
      }

      var x = e.pageX;
      var y = e.pageY;

      global.currTextInput = $('<input />');
      global.currTextInput.css('font-size', drawing.nextTextSize);
      global.currTextInput.css('color', drawing.nextColor);
      global.currTextInput.css('font-family', drawing.nextFont);
      global.currTextInput.css('position', 'fixed');
      global.currTextInput.css('top', y);
      global.currTextInput.css('left', x);

      $('#textInput').append(global.currTextInput);
      global.currTextInput.focus();
      global.textPoint = new Point(x - this.offsetLeft, y - this.offsetTop);
    }

    drawing.drawAll();
    global.isDrawing = false;
    global.isMoving = false;
  });

  $(document).keypress(function(e) {
    if(e.which === 13) {
      if(global.currTextInput) {
        drawing.shapes.push(new Text(global.textPoint.x, global.textPoint.y, global.currTextInput.val(), drawing.nextColor, drawing.nextFont, drawing.nextTextSize));
        global.currTextInput.remove();
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


  // load thingy
  function el(id){return document.getElementById(id);} // Get elem by ID
  function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           var img = new Image();
           img.onload = function() {
             context.drawImage(img, 0, 0);
             drawing.shapes.push(new Picture(img, 0, 0));
           };
    img.src = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
    }
  }

  el("fileUpload").addEventListener("change", readImage, false);

  });





