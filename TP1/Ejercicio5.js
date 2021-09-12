//Pintar un rectángulo en pantalla, utilizando tres colores en un gradiente:
//De negro a amarillo en la primera mitad del ancho del rectángulo, y de amarillo a rojo, en la segunda mitad.
//Por otro lado, en Y el degradé se mantiene constante. 

// width="800" height="500"

let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

// Create gradient
let grd = ctx.createLinearGradient(0,0,410,0); 
// createLinearGradient(x,y,x1,y1) - creates a linear gradient
grd.addColorStop(0,"black");
grd.addColorStop(0.5,"yellow");
grd.addColorStop(1,"red");

// The addColorStop() method specifies the color stops,
// and its position along the gradient.
// Gradient positions can be anywhere between 0 to 1.

// Fill with gradient
ctx.fillStyle = grd;
ctx.fillRect(10,10,400,300); //ctx.fillRect(X, Y, width, height);