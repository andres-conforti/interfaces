//Pintar una región rectangular de un color utilizando la estructura de ImageData. 

let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(250, 200, 150, 100);
//ctx.fillRect(X, Y, width, height);

