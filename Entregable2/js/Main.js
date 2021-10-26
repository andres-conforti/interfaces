'use strict';

let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let canvasWidth = canvas.width;
let reinicio = document.querySelector("#buttonReiniciar");

/*-------------MODAL------------*/
// Get the modal
let modal = document.getElementById("myModal");
// Get the button that opens the modal
let btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];


let iniciar = document.querySelector("#buttonIniciar");
iniciar.onclick = function() {
    modal.style.display = "none";
    comenzar();}
// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";}}
/*-------------MODAL------------*/



//cargo las 5 imagenes a utilizar.
function comenzar(){
    

let lastClickedToken = null;
let isMouseDown = false;

//timer (cuantos minutos y segundos queres que tenga)
let minutos = 3;
let segundos = 0;

//declaro por cual jugada estamos.
let jugada = 0;

//si esta en juego o no.
let juego = false;
let restart = false;

//asigno a una letiable una instancia del Tablero y modifico la altura del canvas segun sus filas.
let tablero = new Tablero(context);
canvas.height = tablero.getFila() * 120;
let canvasHeight = canvas.height;

//guardo el la cantidad de casilleros en una letiable para compararla luego.
let tamañoTablero = tablero.getSize();
    //cargo las imagenes a utilizar.
        
    let imgTableroVacio = new Image();
    imgTableroVacio.src = "./images/boardEmpty.png";
    
    let imgJugador1 = new Image();
    let imgJugador1Tablero = new Image();
    let imgJugador2 = new Image();
    let imgJugador2Tablero = new Image();
    
    //letiables colores test
    //let colorJ1 = "rojo";
    //let colorJ2 = "azul";

    let colorJ1 = document.querySelector("#colorJ1").value;
    let colorJ2 = document.querySelector("#colorJ2").value;
    let nombre1 = "blank1";
    let nombre2 = "blank2";

    switch (colorJ1) {
        case "red":
            imgJugador1.src = "./images/tokenRed.png";
            imgJugador1Tablero.src = "./images/boardRed.png";
            nombre1 = "ROJO";
            break;
        case "orange":
            imgJugador1.src = "./images/tokenOrange.png";
            imgJugador1Tablero.src = "./images/boardOrange.png";
            nombre1 = "NARANJA";
            break;
        case "yellow":
            imgJugador1.src = "./images/tokenYellow.png";
            imgJugador1Tablero.src = "./images/boardYellow.png";
            nombre1 = "AMARILLO";
            break;
      }
    
      switch (colorJ2) {
        case "blue":
            imgJugador2.src = "./images/tokenBlue.png";
            imgJugador2Tablero.src = "./images/boardBlue.png";
            nombre2 = "AZUL";
            break;
        case "green":
            imgJugador2.src = "./images/tokenGreen.png";
            imgJugador2Tablero.src = "./images/boardGreen.png";
            nombre2 = "VERDE";
            break;
        case "cyan":
            imgJugador2.src = "./images/tokenCyan.png";
            imgJugador2Tablero.src = "./images/boardCyan.png";
            nombre2 = "CYAN";
            break;
      }
                    
                    //llena el canvas de imagenes de tablero vacio.
                    tablero.crearTablero(imgTableroVacio);
                    
                    //debugger;
                    
                    
                    //Guardo un arreglo vacio.
                    let tokens = [];
                    //Sera usada para guardar el indice a buscar de la token.
                    let tokenSelect;
                    //guarda el color de la token.
                    let colorToken; 
                    //guarda el color del jugador, pero tambien se usa para determinar el fin del juego.
                    let jugador = "jug1";

                    //agrego las tokens de cada jugador a cada lado del tablero.
                    //la cantidad de tokens corresponde al total de casilleros vacios (fila*columnas)
                    addTokens();
                    
                    
                    //si el tablero esta cargado, incia el timer.
                    if(tamañoTablero != 0){
                         startTimer();
                         let cambio = true;
                         
                        if(juego==false){
                        console.log("juego:",juego)
                        reinicio.disabled = false;
                        reinicio.onclick = function() {
                            restart=true;
                            comenzar();
                        }
                    } 
                    if(cambio == true){
                        let boton = document.querySelector("#myBtn");
                        boton.className="boton2"
                        boton.innerHTML = "NUEVO JUEGO";
                        boton.onclick = function(){
                            location.reload();
                        } 
                            
                        
                        

                    }

                         
                    }
                    


                    if (juego == true)
                    console.log("juego:",juego)
                        //btn.onclick = location.reload();

                    
                    
                    //mientras el juego no alla terminado, cambio de jugador por cada turno.
                    function cambiaJugador(){
                        if(jugador != "ultimo"){
                            if(jugador == "jug1"){
                                jugador = "jug2";
                            }
                            else{
                                jugador = "jug1";
                            }
                        }
                    }
                    
                    //agrega al final del arreglo un token jug1 en X,Y.
                    function addRedToken() {
                        //x:70 - 200 <-> y:600 - 730
                        let posX = 200;
                        let posY = 310; 
                        let color = colorJ1;
                        let circle = new Token(posX, posY, 50, color, context, imgJugador1, "jug1");
                        tokens.push(circle);
                    }
                    
                    //agrega al final del arreglo un token jug2 en X,Y.
                    function addBlueToken() {
                        //x:70 - 200 <-> y:600 - 730
                        let valor = (((tablero.getColumna() - 1) * 100) + 400);
                        let posX = valor + 40;
                        let posY = 310;
                        let color = colorJ2;
                        let circle = new Token(posX, posY, 40, color, context, imgJugador2, "jug2");
                        tokens.push(circle);
                    }
                    
                    //funcion que llama a las anteriores para agregar la cantidad necesaria de tokens al tablero.
                    //Asigna un token de cada color a cada equipo y lo controla comparando los tokens dados con el tamaño del tablero.
                    function addTokens() {
                        let i = 0;
                        while(i < tamañoTablero){
                            addRedToken();
                            i++;
                            if(i < tamañoTablero){
                                addBlueToken();
                                i++
                            }
                        }
                        
                        //los dibuja en el canvas.
                        drawTokens();
                        
                        //asigno un eventlistener a cada accion del mouse.
                        canvas.addEventListener("mousedown", onMouseDown, false);
                        canvas.addEventListener("mouseup", onMouseUp, false);
                        canvas.addEventListener("mousemove", onMouseMoved, false);
                    }
                    
                    
                    //Dibuja los tokens en el canvas.
                    //controlo primero que sea el turno de algun jugador,
                    // en caso contrario no permite dibujar mas (en caso de haber teminado el juego.)
                    function drawTokens(){
                        
                        if(jugador == "jug1" || jugador == "jug2"){
                            clearCanvas();
                            for (let i = 0; i < tokens.length; i++) {
                                if(tokens[i] != lastClickedToken) {
                                    tokens[i].draw();
                                }
                            }
                            if(lastClickedToken != null) {
                                lastClickedToken.draw();
                            }
                            
                            //muestro en pantalla un mensaje con el turno de cada jugador, con su respectivo color en el nombre.
                            context.font = "bold 25pt Arial";
                            context.strokeStyle = "black";
                            context.lineWidth = 5;
                            context.textAlign = "center"; 
                            context.strokeText("JUGADOR", 100, 50);
                            context.fillStyle = "white";
                            context.fillText("JUGADOR", 100, 50);
                            

                            
                            if(jugador == "jug1"){
                                context.strokeStyle = "black";
                                context.lineWidth = 5;
                                context.textAlign = "center"; 
                                context.strokeText(nombre1, 100, 90);
                                context.fillStyle = colorJ1;
                                context.fillText(nombre1, 100, 90);




                            }
                            else if(jugador == "jug2"){
                            context.strokeStyle = "black";
                            context.lineWidth = 5;
                            context.textAlign = "center"; 
                            context.strokeText(nombre2, 100, 90);
                            context.fillStyle = colorJ2;
                            context.fillText(nombre2, 100, 90);}
                        }
                    }
                    
                    //limpia el canvas de alguna jugada anterior.
                    function clearCanvas() {
                        //color del canvas.
                        context.fillStyle = '#32cdab';
                        context.fillRect(0, 0, canvasWidth, canvasHeight);
                        tablero.mostrarTablero(imgTableroVacio,imgJugador2Tablero,imgJugador1Tablero);
                        
                    }
                    
                    //permite seleccionar el token en caso que sea el turno del jugador y su token correspondiente.
                    //ademas agrega un check para cambiar el texto del boton de iniciar juego a uno nuevo.
                    function findClickedToken(x, y){
                        juego = true;
                        
                        

                        //recorre los tokens y comprueba que el color de la token sea el mismo que el jugador.
                        for(let i = 0; i < tokens.length; i++){
                            const element = tokens[i];
                            if(element.isPointInside(x, y)){
                                tokenSelect = i;
                                colorToken = element.getColor();
                                if(colorToken == jugador)
                                return element;
                                else
                                return null;
                            }
                        }
                    }
                    
                    //cuando se presiona el mouse...
                    //se encarga de seleccionar la posicion de la token que vamos a mover,
                    //mientras que se respete la funcion anterior.
                    function onMouseDown(e){
                        isMouseDown = true;
                        
                        if(lastClickedToken != null){
                            lastClickedToken = null;
                        }
                        
                        let clickedToken = findClickedToken(e.layerX, e.layerY);
                        if(clickedToken != null){
                            lastClickedToken = clickedToken;
                        }
                        
                        drawTokens();
                    }
                    
                    //guardo la nueva posicion y la dibujo.
                    function onMouseMoved(e){
                        if(isMouseDown && lastClickedToken != null){
                            lastClickedToken.setPosition(e.layerX, e.layerY);
                            drawTokens();
                        }
                    }
                    
                    //al soltar el mouse...
                    //suelto la token entre los espacios indicados, sobre el tablero.
                    //
                    function onMouseUp(e){
                        isMouseDown = false;

                        if(lastClickedToken != null){
                            //esta letiable calcula el espacio desde donde al soltar el token se contaria como la siguiente columna.
                            let finalColumna = ((tablero.getColumna() - 1) * 100) + 350;
                            //mientras que los valores del evento entren en los valores indicados, ingresa al if.
                            //se calculo un punto en concreto para que los tokens no queden del todo en la siguiente columna,
                            //ya que nosotros buscamos que el mouse sea el punto a seguir, y no la imagen de la ficha.
                            if((e.layerY > 0) && (e.layerY < 90) && (e.layerX > 280) && (e.layerX < finalColumna + 20)){
                                //en caso de que entre ahora le fijo una posicion fija al drop de la ficha.
                                //y comparo con el final de la columna para revisar que no me alla pasado.
                                    let columnaJugada = 0;
                                    let posMouse = 350;
                                    while ((posMouse < finalColumna) && (posMouse < e.layerX)){
                                        //si me paso sumo 100 al X y elijo la siguiente columna.
                                        columnaJugada++;
                                        posMouse += 100;
                                    }
                                    //utiliza la letiable columnaJugada para saber la columna a que preguntarle
                                    //si el color es null en su primer indice
                                    //(la matriz del tablero en el indice X=columnajugada, Y=0)
                                    if(tablero.getImage(columnaJugada,0).getColor() == null){
                                        //en caso de ser null, se da cuenta que no hay ficha en ese casillero (esta vacio)

                                        //revisa la jugada para agregar la columna indicada.
                                        chequearJugada(columnaJugada);
                                        //le toca al otro jugador.
                                        cambiaJugador();
                                    }
                                
                            }
                            else{
                                //en caso de no ser una posicion valida, devuelvo el token a su lugar original.
                                lastClickedToken.posOriginal();
                            }
                            //dibujo los tokens denuevo.
                            drawTokens();
                        }

                    }
                    

                    //funcion que revisa, si la jugada es valida.
                    function chequearJugada(columna){
                        //asigna letiable para guardar si la ficha debe seguir cayendo o no.
                        let continua = true;
                        //recorre el tablero 
                        for(let i = tablero.getFila() - 1; (i >= 0) && (continua == true); i--){
                            let cuadrado = tablero.getImage(columna,i);
                            //si no hay color en el casillero...
                            if(cuadrado.getColor() == null){
                                //agrega imagen roja al tablero.
                                if(colorToken == "jug1"){
                                    cuadrado.setImage(imgJugador1Tablero);
                                    cuadrado.setColor("jug1");
                                }
                                //agrega imagen jug2 al tablero.
                                else{
                                    cuadrado.setImage(imgJugador2Tablero);
                                    cuadrado.setColor("jug2");
                                }
                                //corta el for.
                                continua = false;
                                //saca el token elegido.
                                tokens.splice(tokenSelect,1); 

                                //remueve el ultimo token elegido para no utilizarlo en la funcion findClickedToken
                                lastClickedToken = null;

                                //revisa si gano...
                                chequeaGanador(i,columna,colorToken);
                            }
                        }
                    }
                    
                    //la funcion se encarga de revisar todas las maneras posibles de ganar.
                    //revisa para horizontalmente, verticalmente, y en diagonal. desde un punto en especifico (token X).
                    //ademas de revisar que si encuentra 4 tokens en alguna direccion, revisa que sean del mismo color.
                    function chequeaGanador(fila,columna,colorToken){
                        let total = -1;
                        let f = fila;
                        let c = columna;

                        //DERECHA
                        while((c < tablero.getColumna()) && (tablero.getImage(c,f).getColor() == colorToken)){
                            total++;
                            c++;
                        }
                        //IZQUIERDA
                        f = fila;
                        c = columna;
                        while((c >= 0) && (tablero.getImage(c,f).getColor() == colorToken)){
                            total++;
                            c--;
                        }
                        if(total >= 4){
                            ganador();
                        }
                        //ABAJO
                        total = 0;
                        f = fila;
                        c = columna;
                        while((f < tablero.getFila()) && (tablero.getImage(c,f).getColor() == colorToken)){
                            total++;
                            f++;
                        }
                        if(total >= 4){
                            ganador();
                        }
                        //IZQ ABAJO
                        total = -1;
                        f = fila;
                        c = columna;
                        while((f < tablero.getFila()) && (c >= 0) && (tablero.getImage(c,f).getColor() == colorToken)){
                            total++;
                            f++;
                            c--;
                        }
                        //DER ARRIBA
                        f = fila;
                        c = columna;
                        while((c < tablero.getColumna()) && (f >= 0) && (tablero.getImage(c,f).getColor() == colorToken)){
                            total++;
                            c++;
                            f--;
                        }
                        if(total >= 4){
                            ganador();
                        }
                        //IZQ ARRIBA
                        total = -1;
                        f = fila;
                        c = columna;
                        while((f >= 0) && (c >= 0) && (tablero.getImage(c,f).getColor() == colorToken)){
                            total++;
                            f--;
                            c--;
                        }
                        //DER ABAJO
                        f = fila;
                        c = columna;
                        while((c < tablero.getColumna()) && (f < tablero.getFila()) && (tablero.getImage(c,f).getColor() == colorToken)){
                            total++;
                            c++;
                            f++;
                        }
                        if(total >= 4){ //cuantas partidas para ganar debug
                            ganador();
                        }
                        jugada++;
                        
                        //controla empate
                        if (jugada == tamañoTablero){
                            jugador = "empate";
                            ganador();
                        }
                        
                    

                }
                    
                //funcion encargada de mostrar por pantalla el resultado.
                //tener en cuenta que tambien revisa si hay empate o limite de tiempo.
                    function ganador(){
                        context.font = "bold 100px Arial";
                        context.strokeStyle = "black";
                        context.lineWidth = 5;

                        switch (jugador) {
                            //segun el valor de jugador, muestra por pantalla un mensaje.
                            //y asigna jugador a "ultimo", para frenar el juego.
                            case "jug1":
                                context.fillStyle = colorJ1;
                                context.fillText("GANASTE!", 650, 300);
                                context.strokeText("GANASTE!", 650, 300);
                                jugador = "ultimo";
                                break;
                              
                            case "jug2":
                                context.fillStyle = colorJ2;
                                context.fillText("GANASTE!", 650, 300);
                                context.strokeText("GANASTE!", 650, 300);
                                jugador = "ultimo";
                                break;
                                                        
                            case "time":
                                context.fillStyle = "white";
                                context.fillText("TIEMPO!", 650, 300);
                                context.strokeText("TIEMPO!", 650, 300);
                                jugador = "ultimo";
                                break;
                            case "empate":
                                context.fillStyle = "white";
                                context.fillText("EMPATE!", 650, 300);
                                context.strokeText("EMPATE!", 650, 300);
                                jugador = "ultimo";
                                break;
                              
                          }
                    }
                    

                    
                    //funcion del timer.
                    function startTimer() {
                        let timeoutHandle;
                        
                        function countdown(minutos, segundos) {

                          function tick() {
                            let counter = document.getElementById("timer");
                            
                            
                            if (jugador!="ultimo" && restart==false){
                            counter.innerHTML = minutos.toString()+":"+(segundos < 10 ? "0" : "") +String(segundos);
                            segundos--;
                                                      
                            if (segundos >= 0) {
                              timeoutHandle = setTimeout(tick, 1000);
                            } else {
                              if (minutos >= 1) {
                                setTimeout(function () {
                                  countdown(minutos - 1, 59);}, 1000);
                              }
                            }
                        }
                            //cuando termina el tiempo muetra donde se veia el timer.
                            if ((minutos == 0) && (segundos == -1)){
                                counter.innerHTML = "SE ACABO EL TIEMPO!";
                                jugador = "time";
                                ganador();
                            }
                          }
                            tick();                   
                        }
                        countdown(minutos, segundos);
                        
                        
                      }
                    
                    
                    
                }

