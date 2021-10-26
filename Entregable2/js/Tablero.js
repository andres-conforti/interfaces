'use strict';//se crea la clase Tablero con su constructor, se le pasa el context.
//ademas se declaran los valores i y j como los valores de las filas y columnas respectivamente.
//se declara un arreglo vacio.
class Tablero {
  constructor(context) {
    this.i = document.querySelector("#idFila").value;
    this.j = document.querySelector("#idColumna").value;
    this.context = context;
    this.board = [];
  }

  //se llena la matriz board con posiciones para cada casillero y su respectiva imagen (tablero vacio)
  //esta funcion es utilizada cuando carga el juego por primera vez para cargar el tablero.
  crearTablero(img) {
    for (let x = 0; x < this.j; x++) {
      this.board[x] = [];
      for (let y = 0; y < this.i; y++) {
        let posX = x * 100 + 270;
        let posY = y * 100 + 90;
        let space = new Casillero(this.context, posX, posY);
        space.addImage(posX, posY, img);
        this.board[x][y] = space;
      }
    }
  }

 //al igual que arriba, se muestra el tablero.
 //pero se recorre tablero por cada posicion y agrega la imagen correspondiente del token en el tablero ya tirado.
 //imgBE = tableroVacio
 //imgBBT = tableroBlueToken
 //imgBRT = tableroRedToken
  mostrarTablero(imgBE,imgBBT,imgBRT) {
    for (let x = 0; x < this.j; x++) {
      for (let y = 0; y < this.i; y++) {
        let posX = x * 100 + 270;
        let posY = y * 100 + 90;
        let space = new Casillero(this.context, posX, posY);
        let color = this.board[x][y];
        if (color.getColor() == null) space.addImage(posX, posY, imgBE);
        if (color.getColor() == "jug1") space.addImage(posX, posY, imgBRT);
        if (color.getColor() == "jug2") space.addImage(posX, posY, imgBBT);
      }
    }
  }

  //retorna la imagen correspondiente al casillero, por ejemplo:
  // que devuelva una imagen de un casillero ocupado x un token azul.
  getImage(x, y) {
    return this.board[x][y];
  }

  //multiplica los tamaños de filas y columnas para devolver el tamaño total de casilleros.
  getSize() {
    return this.i * this.j;
  }

  //devuelve la cantidad de filas
  getFila() {
    return this.i;
  }

  //devuelve la cantidad de columnas
  getColumna() {
    return this.j;
  }
}
