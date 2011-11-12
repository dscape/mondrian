$(document).ready(function() {
  var canvas    = document.getElementById('canvas')
    , ctx       = canvas.getContext("2d")
    , socket    = io.connect('http://localhost:4000')
    , i         = 1
    , q         = [
      { x1: 0
      , y1: 0
      , x2: document.width
      , y2: document.height
      , dx: document.width
      , dy: document.height
      }
     ]
    , rect
    ;

  ctx.canvas.width  = document.width;
  ctx.canvas.height = document.height;

  function opacity(r) { return Math.round(i) + "." +Math.round(r*10); }

  function draw(parent, pitch, fenv, dist) {
    parent.quadrant = (parent.quadrant % 4) || 0;
    var sw
      , half_width = parent.dx / 2
      , half_height = parent.dy / 2
      , x1 = parent.x1 + Math.ceil(half_width*Math.random()*0.01)
      , y1 = parent.y1 + Math.ceil(half_height*Math.random()*0.01)
      , x2 = parent.x2 - half_width - Math.ceil(half_width*Math.random()*0.01)
      , y2 = parent.y2 - half_height - Math.ceil(half_height*Math.random()*0.01)
      ;

    switch(parent.quadrant) {
      case 1:
        x1 += half_width;
        x2 += half_width;
        break;
      case 2:
        y1 += half_height;
        y2 += half_height;
        break;
      case 3:
        x1 += half_width;
        x2 += half_width;
        y1 += half_height;
        y2 += half_height;
        break;
    }
    var trans_x = Math.round(half_width / 5) * dist;
    x1 += trans_x;
    x2 += trans_x;
    var trans_y = Math.round(half_height / 5) * dist;
    y1 += trans_y;
    y2 += trans_y;
    
    if (Math.random() > 0.25) { return; }
    
    parent.quadrant ++; 

    if(x1<x2) { sw = x1; x1 = x2; x2 = sw; }
    if(y1<y2) { sw = y1; y1 = y2; y2 = sw; }

    var dx = x2-x1
      , dy = y2-y1
      ;
    
    q.push({x1: x1, y1: y1, x2: x2, y2: y2, dx: dx, dy: dy});

    ctx.lineWidth   = Math.ceil(10*dist*i);
    ctx.strokeStyle = "black";
    ctx.fillStyle   =
        fenv < 0.70
      ?  "rgba(255,255,255," + opacity(pitch) + ")"
      : fenv > 0.90
        ? "rgba(255,255,0," + opacity(fenv) + ")"
        : fenv < 0.8
        ? "rgba(0,0,255," + opacity(pitch) + ")"
        : "rgba(255,0,0," + opacity(fenv) + ")";

    if (Math.random() > 0.5) {
      ctx.fillRect  (x1,y1,dy,dx);
      ctx.strokeRect(x1,y1,dy,dx);
    } else {
      ctx.fillRect  (x1,y1,dx,dy);
      ctx.strokeRect(x1,y1,dx,dy);
    }

    i /= 1.11;
  }

  socket.on('draw', function(data) {
    rect = q.shift();
    for(var c=0;c<=7;c++) {
      draw(rect, data.pitch, data.fenv, data.dist);
    }
  });
});
/*
escolher nr quadrados de 1 a 5
pintar
inferior ao minino do rectangulo pai usa minimo*/