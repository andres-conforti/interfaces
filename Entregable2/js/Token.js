//Se crea la clase Figura con su constructor.
class Token {
  constructor(posX, posY, radius, fill, context, img, color) {
    this.posX = posX;
    this.posY = posY;
    this.fill = fill;
    this.radius = radius;
    this.context = context;
    this.color = color;
    this.img = img;
  }

  //setea la posicion de la instancia.
  setPosition(x, y) {
    this.posX = x;
    this.posY = y;
  }

  //devuelve el color de la figura.
  getColor() {
    return this.color;
  }

  //devuelve la posicion de la instancia (sus ejes X e Y)
  getPosition() {
    return {
      x: this.getPosX(),
      y: this.getPosY(),
    };
  }

  //devuelve la posicion X
  getPosX() {
    return this.posX;
  }

  //devuelve la posicion Y
  getPosY() {
    return this.posY;
  }

  //get y set para fill.
  getFill() {
    return this.fill;
  }

  setFill(fill) {
    this.fill = fill;
  }

  //se agrega la figura en la posicion indicada con sus respectivas imagenes.
  draw() {
    this.context.fillStyle = this.fill;
    let imgSize = 90;
    this.context.drawImage(
      this.img,
      this.posX - imgSize / 2,
      this.posY - imgSize / 2,
      imgSize,
      imgSize
    );
    this.radius = imgSize / 2;
    this.context.closePath();
  }

  //devuelve el radio.
  getRadius() {
    return this.radius;
  }

  //
  isPointInside(x, y) {
    let _x = this.posX - x;
    let _y = this.posY - y;
    return Math.sqrt(_x * _x + _y * _y) < this.radius;
  }

  //devuelve el token mal soltado a su posicion original.
  posOriginal() {
    //dependiendo si es la roja o la azul la devuelve a su montoncito correcto.
    if (this.color == "rojo") {
      let posX = 200;
      let posY = 310;
      this.setPosition(posX, posY);
    } else {
      let valor = (tablero.getColumna() - 1) * 100 + 400;
      let posX = valor + 40;
      let posY = 310;
      this.setPosition(posX, posY);
    }
  }
}
