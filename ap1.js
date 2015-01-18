if(window.addEventListener) {
  window.addEventListener('load', function() {

    var canvas, canvasContext;

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

      canvas.addEventListener('mousemove', ev_mousemove, false);
    }

    var started = false;

    function ev_mousemove(ev) {
      var x, y;

      // get the mouse position relative to the canvas element
      if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
      }

      if(!started) {
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        started = true;
      } else {
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
      }
    }

    init();

  }, false);
}
