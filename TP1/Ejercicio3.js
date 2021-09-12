//Pintar una región rectangular de un color utilizando el contexto de HTML5. 

let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let imgData = ctx.createImageData(100, 100); // ctx.createImageData(width,height);

let i;
for (i = 0; i < imgData.data.length; i += 4) {
  imgData.data[i+0] = 255;
  imgData.data[i+1] = 0;
  imgData.data[i+2] = 0;
  imgData.data[i+3] = 255;
}

ctx.putImageData(imgData, 10, 10); // context.putImageData(imgData,x,y);

/*
  imgData.data[i+0] = 255;
  imgData.data[i+1] = 0;
  imgData.data[i+2] = 0;
  imgData.data[i+3] = 255;

  i = COLOR
  0 = RED (from 0-255)
  1 = GREEN (from 0-255)
  2 = BLUE (from 0-255)
  3 = ALPHA (from 0-255; 0 is transparent and 255 is fully visible)
*/

