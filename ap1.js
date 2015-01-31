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

  var Shape = Base.extend({
    constructor: function(x, y, color, lineWidth) {
      this.startPoint = new Point(x, y);
      this.color = color;
      this.lineWidth = lineWidth;
      this.endPoint = this.startPoint;
      this.movingPoint;
    }, 

    setEndPoint : function(x, y) {
      this.endPoint = new Point(x, y);
    },

    setMovingPoint : function(x, y) {
      this.movingPoint = new Point(x, y);
    },

    reachable : function(x, y) {
      var x1 = Math.min(this.startPoint.x, this.endPoint.x);
      var x2 = Math.max(this.startPoint.x, this.endPoint.x);
      var y1 = Math.min(this.startPoint.y, this.endPoint.y);
      var y2 = Math.max(this.startPoint.y, this.endPoint.y);

      if(x1 <= x && x <= x2 && y1 <= y && y <= y2) {
        console.log("true");
        return true;
      } else {
        console.log("false");
        return false;
      }
    },

    move : function(x, y) {
      x = x - this.movingPoint.x;
      y = y - this.movingPoint.y;
      this.startPoint.x += x;
      this.startPoint.y += y;
      this.endPoint.x += x;
      this.endPoint.y += y;
    },

    draw : function () {
      context.beginPath();
      context.moveTo(this.startPoint.x, this.startPoint.y);
      context.lineTo(this.endPoint.x, this.endPoint.y);
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.stroke();
    }

  });

  var Point = Shape.extend({
    constructor: function(x, y) {
      this.x = x;
      this.y = y;
    }
  });

  var Line = Shape.extend({
  });

  var Rect = Shape.extend({
    draw : function() {
      var width = Math.abs(this.endPoint.x - this.startPoint.x);
      var height = Math.abs(this.endPoint.y - this.startPoint.y);
      var xRect = Math.min(this.endPoint.x, this.startPoint.x);
      var yRect = Math.min(this.endPoint.y, this.startPoint.y);

      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.strokeRect(xRect, yRect, width, height);
    }
  });

  var Circle = Shape.extend({
    radius : undefined,

    reachable : function(x, y) {
      var x1 = Math.min(this.startPoint.x, this.endPoint.x);
      var y1 = Math.min(this.startPoint.y, this.endPoint.y);
      var x1 = x1 - this.radius;
      var y1 = y1 - this.radius;

      if((x1 <= x) && (y1 <= y) && x <= (x1 + this.radius * 2) && (y <= y1 + this.radius * 2)) {
        console.log("true");
        return true;
      } else {
        console.log("false");
        return false;
      }
    },

    draw : function () {
      var xCircle = (this.endPoint.x + this.startPoint.x) / 2;
      var yCircle = (this.endPoint.y + this.startPoint.y) / 2;
      this.radius = Math.max(
        Math.abs(this.endPoint.x - this.startPoint.x),
        Math.abs(this.endPoint.y - this.startPoint.y)) / 2;

      context.beginPath(); 
      context.arc(this.startPoint.x, this.startPoint.y, this.radius, 0, 2 * Math.PI, false);
      context.strokeStyle = this.color;
      context.lineWidth = this.lineWidth;
      context.stroke();
      context.closePath();
    }

  });

  var Text = Shape.extend({
    constructor: function(x, y, text, color, font, size) {
      this.textPoint = new Point(x, y);
      this.text = text;
      this.color = color;
      this.font = font;
      this.size = size;
      this.movingPoint;
    },

    reachable : function(x, y) {
      var x1 = this.textPoint.x;
      var y1 = this.textPoint.y;
      var x2 = x1 + context.measureText(this.text).width;
      var y2 = y2 = y1 - 25;

      if(x1 <= x && x <= x2 && y2 <= y && y <= y1) {
        console.log("true");
        return true;
      } else {
        console.log("false");
        return false;
      }
    },

    move : function(x, y) {
      x = x - this.movingPoint.x;
      y = y - this.movingPoint.y;
      this.textPoint.x = this.textPoint.x + x;
      this.textPoint.y = this.textPoint.y + y;
    },

    draw : function () {
      context.font = this.size + ' ' + this.font;
      context.fillStyle = this.color;
      context.fillText(this.text, this.textPoint.x, this.textPoint.y);
    }
  });

  var Pen = Shape.extend({
    setPoints : function(x, y) {
      this.points = [];
      this.points.push(new Point(x, y));
    },

    setEndPoint : function(x, y) {
      this.points.push(new Point(x, y));
    },

    reachable : function(x, y) {
      for(var i = 0; i < this.points.length; i++) {
        if(Math.abs(this.points[i].x - x) <= 30 && Math.abs(this.points[i].y - y) <= 30) {
          console.log("true");
          return true;
        }
      }
      console.log("false");
      return false;
    },

    move : function(x, y) {
      x -= this.movingPoint.x;
      y -= this.movingPoint.y;
      
      for(var i = 0; i < this.points.length; i++) {
        this.points[i].x += x;
        this.points[i].y += y;
      }
    },

    draw : function () {
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
  });

  var Eraser = Pen.extend({
    setWhiteColor : function() {
      this.color = "#FFFFFF";
    },

    reachable : function() { },
    
    move : function() { }
  });

  var Picture = Shape.extend({
    constructor : function(img, x, y) {
      this.img = img;
      this.startPoint = new Point(x, y);
      this.movingPoint;
    }, 

    reachable : function(x, y) {
      var x1 = this.startPoint.x + this.img.width;
      var y1 = this.startPoint.y + this.img.height;

      if(this.startPoint.x <= x && x <= x1 && this.startPoint.y <= y && y <= y1) {
        console.log("inside pic true");
        return true;
      } else {
        console.log("inside pic false");
        return false;
      }
    },

    move : function(x, y) {
      x = x - this.movingPoint.x;
      y = y - this.movingPoint.y;
      this.startPoint.x += x;
      this.startPoint.y += y;
    },

    draw : function (){
      context.drawImage(this.img, this.startPoint.x, this.startPoint.y);
    }
  });

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
        shape = drawing.shapes[drawing.shapes.length - 1];
        shape.setPoints(x, y);
      } else if(drawing.nextObject === 'eraser') {
        drawing.shapes.push(new Eraser(x, y, drawing.nextLineWidth));
        shape = drawing.shapes[drawing.shapes.length - 1];
        shape.setPoints(x, y);
        shape.setWhiteColor();
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

  $('#btn-submit').click(function(e) {
    var userField = document.getElementById('getUsername');
    var titleField = document.getElementById('getTitle');
    var username = userField.value;
    var title = titleField.value;
    var stringifiedArray = JSON.stringify(drawing.shapes);
    
    var param = {
      "user": username,
      "name": title,
      "content": stringifiedArray,
      "template": false
    };

    console.log("yes");
    console.log(username);
    console.log(title);
    console.log(stringifiedArray);
    console.log(param);
    
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "http://whiteboard.apphb.com/Home/Save",
      data: param,
      dataType: "jsonp",
      crossDomain: true,
      success: function (data) {
      // The save was successful...
      },
      error: function (xhr, err) {
      // Something went wrong...
      }
    });
  });

  var button = document.getElementById('btn-download');
  button.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL('image/png');
    button.href = dataURL;
  });

  // load thingy
  function el(id){return document.getElementById(id);} // Get elem by ID
  function readImage() {
    if(this.files && this.files[0] ) {
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
