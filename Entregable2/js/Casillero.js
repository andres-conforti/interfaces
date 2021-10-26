'use strict';//Creo la clase Casillero y su constructor correspondiente
//se le envia el context (canvas.getContext("2d")), y 2 posiciones. Ademas se declara la variable color como nula para usar luego.
class Casillero {
  constructor(context, posX, posY) {
    this.context = context;
    this.posX = posX;
    this.posY = posY;
    this.color = null;
  }

  //dibuja el casillero en las x1,y1 dadas hasta x2=100 y2=100
  draw() {
    this.context.beginPath();
    this.context.rect(this.posX, this.posY, 100, 100);
    this.context.stroke();
  }

  //devuelve el color del casillero pedido.
  getColor() {
    return this.color;
  }

  //agrega la imagen en la posicion indicada
  addImage(posX, posY, img) {
    context.drawImage(img, posX, posY);
  }

  //trae el X de la instancia.
  getPosX() {
    return this.posX;
  }

  //trae el y de la instancia.
  getPosY() {
    return this.posY;
  }

  //agrega la imagen instanciada.
  setImage(img) {
    context.drawImage(img, this.getPosX(), this.getPosY());
  }

  //setea un color.
  setColor(color) {
    this.color = color;
  }
}
