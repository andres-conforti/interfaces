
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let canvasWidth = canvas.width;
let lastClickedToken = null;
let isMouseDown = false;

//timer (cuantos minutos y segundos queres que tenga)
let minutos = 3;
let segundos = 0;

//declaro por cual jugada estamos.
let jugada = 0;

//si esta en juego o no.
let juego = false;

//asigno a una variable una instancia del Tablero y modifico la altura del canvas segun sus filas.
let tablero = new Tablero(context);
canvas.height = tablero.getFila() * 120;
let canvasHeight = canvas.height;

//guardo el la cantidad de casilleros en una variable para compararla luego.
let tamañoTablero = tablero.getSize();

//cargo las 5 imagenes a utilizar.
let imgBE = new Image();
imgBE.src = "./images/boardEmpty.png";
imgBE.onload = function(){
    
    let imgRT = new Image();
    imgRT.src = "./images/tokenRed.png";
    imgRT.onload = function(){
        
        let imgBT = new Image();
        imgBT.src = "./images/tokenBlue.png";
        imgBT.onload = function(){
            
            let imgBBT = new Image();
            imgBBT.src = "./images/boardBlue.png";
            imgBBT.onload = function(){
                
                let imgBRT = new Image();
                imgBRT.src = "./images/boardRed.png";
                imgBRT.onload = function(){
                    
                    //llena el canvas de imagenes de tablero vacio.
                    tablero.crearTablero(imgBE);
                    //debugger;
                    
                    
                    //Guardo un arreglo vacio.
                    let tokens = [];
                    //Sera usada para guardar el indice a buscar de la token.
                    let tokenSelect;
                    //guarda el color de la token.
                    let colorToken; 
                    //guarda el color del jugador, pero tambien se usa para determinar el fin del juego.
                    let jugador = "rojo";

                    //agrego las tokens de cada jugador a cada lado del tablero.
                    //la cantidad de tokens corresponde al total de casilleros vacios (fila*columnas)
                    addTokens();
                    
                    //si el tablero esta cargado, incia el timer.
                    if(tamañoTablero != 0){
                        startTimer();
                    }                    
                    
                    //mientras el juego no alla terminado, cambio de jugador por cada turno.
                    function cambiaJugador(){
                        if(jugador != "ultimo"){
                            if(jugador == "rojo"){
                                jugador = "azul";
                            }
                            else{
                                jugador = "rojo";
                            }
                        }
                    }
                    
                    //agrega al final del arreglo un token rojo en X,Y.
                    function addRedToken() {
                        //x:70 - 200 <-> y:600 - 730
                        let posX = 200;
                        let posY = 310; 
                        let color = "red";
                        let circle = new Token(posX, posY, 50, color, context, imgRT, "rojo");
                        tokens.push(circle);
                    }
                    
                    //agrega al final del arreglo un token azul en X,Y.
                    function addBlueToken() {
                        //x:70 - 200 <-> y:600 - 730
                        let valor = (((tablero.getColumna() - 1) * 100) + 400);
                        let posX = valor + 40;
                        let posY = 310;
                        let color = "blue";
                        let circle = new Token(posX, posY, 40, color, context, imgBT, "azul");
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
                        if(jugador == "rojo" || jugador == "azul"){
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
                            
                            context.font = "bold 30pt Arial";
                            if(jugador == "rojo")
                            context.fillStyle = "red";
                            else
                            context.fillStyle = "blue";
                            context.lineWidth = 2;
                            context.fillText(jugador.toUpperCase(), 100, 90);
                            context.strokeStyle = "black";
                            context.lineWidth = 2;
                            context.textAlign = "center"; 
                            context.strokeText(jugador.toUpperCase(), 100, 90);
                        }
                    }
                    
                    //limpia el canvas de alguna jugada anterior.
                    function clearCanvas() {
                        //color del canvas.
                        context.fillStyle = '#32cdab';

                        context.fillRect(0, 0, canvasWidth, canvasHeight);
                        tablero.mostrarTablero(imgBE,imgBBT,imgBRT);
                        
                    }
                    
                    //permite seleccionar el token en caso que sea el turno del jugador y su token correspondiente.
                    //ademas agrega un check para cambiar el texto del boton de iniciar juego a uno nuevo.
                    function findClickedToken(x, y){
                        juego = true;
                        
                        if(juego != false){
                            document.querySelector("#buttonIniciar").innerHTML = "NUEVO JUEGO";
                        }

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
                            //esta variable calcula el espacio desde donde al soltar el token se contaria como la siguiente columna.
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
                                    //utiliza la variable columnaJugada para saber la columna a que preguntarle
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
                        //asigna variable para guardar si la ficha debe seguir cayendo o no.
                        let continua = true;
                        //recorre el tablero 
                        for(let i = tablero.getFila() - 1; (i >= 0) && (continua == true); i--){
                            let cuadrado = tablero.getImage(columna,i);
                            //si no hay color en el casillero...
                            if(cuadrado.getColor() == null){
                                //agrega imagen roja al tablero.
                                if(colorToken == "rojo"){
                                    cuadrado.setImage(imgBRT);
                                    cuadrado.setColor("rojo");
                                }
                                //agrega imagen azul al tablero.
                                else{
                                    cuadrado.setImage(imgBBT);
                                    cuadrado.setColor("azul");
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

                        //console.log("ganador()JUGADOR: ",jugador);
                        switch (jugador) {
                            //segun el valor de jugador, muestra por pantalla un mensaje.
                            //y asigna jugador a "ultimo", para frenar el juego.
                            case "rojo":
                                context.fillStyle = "red";
                                context.fillText("GANASTE!", 650, 300);
                                context.strokeText("GANASTE!", 650, 300);
                                jugador = "ultimo";
                                break;
                              
                            case "azul":
                                context.fillStyle = "blue";
                                context.fillText("GANASTE!", 650, 300);
                                context.strokeText("GANASTE!", 650, 300);
                                jugador = "ultimo";
                                break;
                                                        
                            case "time":
                                context.fillStyle = "green";
                                context.fillText("TIEMPO!", 650, 300);
                                context.strokeText("TIEMPO!", 650, 300);
                                jugador = "ultimo";
                                break;
                            case "empate":
                                context.fillStyle = "yellow";
                                context.fillText("EMPATE!", 650, 300);
                                context.strokeText("EMPATE!", 650, 300);
                                jugador = "ultimo";
                                break;
                              
                          }
                    }
                    
                    //funcion recarga la pagina
                    function comenzar(){
                        location.reload();
                    }
                    
                    //funcion del timer.
                    function startTimer() {
                        let timeoutHandle;
                        
                        function countdown(minutos, segundos) {

                          function tick() {
                            let counter = document.getElementById("timer");
                            
                            
                            if (jugador!="ultimo"){
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
                    
                    document.querySelector("#buttonIniciar").addEventListener("click", comenzar);
                    
                }
            }
        }
    }
}

