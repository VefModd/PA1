if(window.addEventListener) {
  window.addEventListener('load', function() {

    var canvas, canvasContext;

    var drawing = {
      //shapes: [],
      nextObject: 'pen',
      nextColor: 'black',

      /*
      drawAll: function drawAll() {
        for(int i = 0; i < shapes.length; i++) {
          shapes[i].draw();
        }
      }*/
    };

    function init() {
      canvas = document.getElementById('drawBoard');

      if(!canvas) {
        alert('The canvas element cannot be found!');
        return;
      } else if(!canvas.getContext) {
        alert('The context in the canvas element cannot be found!');
        return;
      }

      canvasContext = canvas.getContext('2d');
      canvasContext.canvas.width = window.innerWidth - 20;
      canvasContext.canvas.height = window.innerHeight - 20;

      if(!canvasContext) {
        alert('The canvas context cannot be reached!');
        return;
      }

      canvas.addEventListener('mousedown', ev_mousedown, false);
      canvas.addEventListener('mouseup', ev_mouseup, false);
    }

    function Pen() {
      this.draw = function draw(x, y) {
        //console.log(x, y);
        canvasContext.lineTo(x,y);
        canvasContext.stroke();
      }
    }

    function ev_mousedown(ev) {
      //console.log("mousedown");
      canvasContext.beginPath();
      canvasContext.moveTo(ev._x, ev._y);
      canvas.addEventListener('mousemove', ev_mousemove, false);
    }

    function ev_mouseup(ev) {
      //console.log("mouseup");
      canvas.removeEventListener('mousemove', ev_mousemove, false);
    }

    function ev_mousemove(ev) {
      //console.log("mousemove");
      var x, y;

      // get the mouse position relative to the canvas element
      if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
      }

      //console.log(drawing.nextObject);

      if(drawing.nextObject === 'pen') {
        var pen = new Pen();
        pen.draw(x, y);
      }
    }

    init();

  }, false);
}
