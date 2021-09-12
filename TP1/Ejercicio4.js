//Especificar la función para pintar un cuadrado utilizando un gradiente de arriba hacia abajo (desde RGB 0,0,0)

let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

// Create gradient
let grd = ctx.createLinearGradient(0,0,0,160); 
// createLinearGradient(x,y,x1,y1) - creates a linear gradient
grd.addColorStop(0,"black");
grd.addColorStop(1,"white");
// The addColorStop() method specifies the color stops,
// and its position along the gradient.
// Gradient positions can be anywhere between 0 to 1.


// Fill with gradient
ctx.fillStyle = grd;
ctx.fillRect(10,10,150,150); //ctx.fillRect(X, Y, width, height);

//fillStyle or strokeStyle property to the gradient, then draw the shape (rectangle, text, or a line).