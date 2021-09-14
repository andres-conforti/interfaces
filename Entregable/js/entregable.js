"use strict";

//Función para cargar la pagina.
function cargarPagina(){
    //Variables del canvas.
    let ctx = document.querySelector("#myCanvas").getContext("2d"); 
    let imageOrigin = null;   
    //Se declaran las variables del tamaño del lapiz y borrador.
    let penSize;
    let rubberSize;
        
    //Funcion para utilizar la borrador y lapiz sobre el canvas.
    function paint(herramienta){
        
        //la variable "c" es el canvas.
        let c = document.querySelector("#myCanvas");
        //declaro una variable booleana (pintar) como falsa.     
        let pintar = Boolean(false);
        //declaro la variable "color_prim" como el color a utilizar.
        let color_prim = document.querySelector("#colorSelector").value;
        //declaro la variable canvas para utilizarla de base para cuando la modifique. (no confundir con la variable c)
        let canvas = document.querySelector("#myCanvas");
        
        //ejecuta la funcion cuando mantengo el mouse presionado en el canvas.
        c.onmousedown = function (e){
            //seteo pintar como true, como verificador que el mouse esta en funcionamiento.
            pintar = true;
            //checkeo si estoy utilizando el lapiz o la goma, en este caso el lapiz.
            if(herramienta == "lapiz" ){
                //tomo el valor del grosor del lapiz.
                penSize = document.querySelector("#selectLapiz").value;
                //si estubiera seteado en 0, le asigno un minimo de 0.5 para evitar que no se vea el trazo.
                if(penSize == 0)
                    penSize = 0.5;
                //declaro que el trazo va a ser circular y su posicion.
                ctx.lineCap = "round";
                ctx.moveTo(e.pageX - c.offsetLeft, e.pageY - c.offsetTop);
            }
        }   
        //Seteo pintar como false, como verificador que el mouse dejo de usarse en el canvas, e iniciar un nuevo path en el ctx.
        c.onmouseup = function(){
            pintar = false;
            ctx.beginPath();
        }
        
        //Se ejecuta cuando muevo el mouse mientras lo mantengo presionado sobre el canvas.
        c.onmousemove = function(e){
            //Si la variable booleana pintar esta en true...
            if (pintar) {
                //Checkea que este utilizando el lapiz o el borrador.
                //1 - En este caso es el lapiz.
                if (herramienta == "lapiz") {
                    //comienza a dibujar desde la posicion anterior a la siguiente.
                    ctx.lineTo(e.pageX - c.offsetLeft, e.pageY - c.offsetTop);
                    //asigno el tamaño del trazado a el que tenia guardado cuando presione el mouse en la funcion anterior (c.onmousedown).
                    ctx.lineWidth = penSize;
                    //asigno el color del trazo.
                    ctx.strokeStyle = color_prim;
                    ctx.stroke();
                }
                //2 - En este caso es el borrador.
                else if(herramienta == "borrador"){
                    //tomo el tamaño del borrador elegido.
                    rubberSize = document.querySelector("#selectBorrador").value;
                    //hago el mismo checkeo que se hizo con el lapiz, para evitar tener un valor a 0 de tamaño
                    if(rubberSize == 0)
                        rubberSize = 0.5;
                    //misma comportamiento que dibujar, solo que en este caso se aplica el color blanco.
                    ctx.lineTo(e.pageX - c.offsetLeft, e.pageY - c.offsetTop);
                    ctx.lineWidth = rubberSize;
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.stroke();
                }
                //Obtengo la informacion de la imagen que esta en el contexto.
                imageOrigin = ctx.getImageData(0,0,canvas.width,canvas.height);
            }
        }
        
        //funcion a ejecutar cuando salgo del canvas con el mouse
        //en este caso dejo de pintar.
        c.onmouseout = function(){
            pintar = false;
        };
    }

    //Funcion que carga una imagen al canvas.
    function cargaImagen(){
        //declaro las variables canvas e input con los documentos seleccionados.
        let canvas = document.querySelector("#myCanvas");
        let input = document.querySelector("#importImage");
        //declaro el contexto donde voy a trabajar.
        let context = canvas.getContext("2d");
        //relleno la imagen de blanco.
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        //Cuando el input cambie de valor...
        input.onchange = e => {
            //Declaro la direccion de la imagen con la del evento.
            let file = e.target.files[0];
            let reader = new FileReader();
            //Se lee los datos como la URL de la imagen.
            reader.readAsDataURL(file);

            //Cuando se cargue el reader.
            reader.onload = readerEvent => {
                //Asigno content como el target del origen de la imagen.
                let content = readerEvent.target.result;

                //Creo una nueva imagen con la URL como titulo
                //Se crea una imagen, y le asigno el valor de content como su origen.
                let image = new Image();
                image.src = content;

                //cuando carga la imagen...
                image.onload = function(){
                    //Asigno el ancho y alto de la imagen, para que entre en el canvas.
                    let imageScaledWidth = canvas.width;
                    let imageScaledHeight = canvas.height;
                
                    //Se adapta la imagen lo mejor posible al canvas.
                    let imageAspectRatio = (1.0 * this.height) / this.width;
                    if (this.width < this.height) {
                        imageAspectRatio = (1.0 * this.width) / this.height;
                        imageScaledWidth = canvas.height * imageAspectRatio;
                        imageScaledHeight = canvas.height;
                    }

                    //Se dibuja la imagen en el contexto.
                    context.drawImage(this, 0, 0, imageScaledWidth, imageScaledHeight);

                    //Guardo en la variable imageData la informacion de la imagen.
                    let imageData = context.getImageData(0, 0, imageScaledWidth, imageScaledHeight);

                    //guardo la imagen en una variable para utilizar filtros.
                    imageOrigin = ctx.getImageData(0,0,canvas.width,canvas.height);

                    //Se muestra la imagen en el contexto.
                    context.putImageData(imageData, 0, 0);
                }
            }
        }
    }

    //funcion para descargar la imagen.
    function guardarCambios(){
        //declaro la variable link, toma el <a id="descargar">Descargar</a>
        let link = document.querySelector("#descargar");
        //Declaro la variable link como un popup con titulo y texto por defecto.
        //Este texto por defecto lo utilizo como instruccion de debe ingresar el nombre
        let filename = prompt("SU IMAGEN SE GUARDARA COMO...", "INGRESE EL NOMBRE DE LA IMAGEN");
        //Checkeo que se haya ingresado un nombre, de lo contrario se le asigna a la imagen el nombre "Dibujo"
        if(filename=="INGRESE EL NOMBRE DE LA IMAGEN"){
            filename = "Dibujo";}
        //Le agrego la extension .jpg a la imagen.
        filename = filename + ".jpg";
        //Pasa los datos del canvas que hicimos y los transforma en una imagen y descarga.
        link.href = document.querySelector("#myCanvas").toDataURL("image/jpg");
        link.download = filename;
    }

    //Funcion para borrar la imagen.
    //Borra el canvas (SIN COLOR, NO EN BLANCO)
    function borrarImg(){
    let canvas = document.querySelector("#myCanvas");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    }

    //Funcion para iniciar desde un lienzo en blanco.
    //Pone el canvas en blanco (COLOR BLANCO, NO SIN COLOR)
    function enBlanco(){
    let canvas = document.querySelector("#myCanvas");
    let context = canvas.getContext("2d");
    ctx.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    }

    //Funcion para agregar un filtro.
    function agregarFiltro(){
        //Limpia el canvas por si habia un filtro cargado.
        quitarFiltro();

        //Declara la variable opcion como el filtro que seleccione.
        let opcion = document.querySelector("#selectFiltros").value;

        //Declaro las variables del canvas que voy a utilizar.
        let canvas = document.querySelector("#myCanvas");
        let index;
        let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

        //Asigno las funciones para cada valor de los colores RGB
        //ROJO
        function getRed(imageData, x, y){
            let index = (x + y * imageData.width) * 4;
            return imageData.data[index+0];
        }
        //VERDE
        function getGreen(imageData, x, y){
            let index = (x + y * imageData.width) * 4;
            return imageData.data[index+1];
        }
        //AZUL
        function getBlue(imageData, x, y){
            let index = (x + y * imageData.width) * 4;
            return imageData.data[index+2];
        }
        
        //Si la opcion es...

        //saco los filtros
        if(opcion == "ninguno"){
            quitarFiltro();
            }
        
        //Aplico el negativo
        if(opcion == "negativo"){
            //Recorro la imagen (matriz) y seteo los pixeles a los indicados.
            for(let y = 0; y < canvas.height; y++){
                for(let x = 0; x < canvas.width; x++){
                    index = (x + y * imageData.width) * 4;
                    imageData.data[index+0] = 255 - imageData.data[index+0];
                    imageData.data[index+1] = 255 - imageData.data[index+1];
                    imageData.data[index+2] = 255 - imageData.data[index+2];      
                }
            }
            //Muestra la imagen con el filtro aplicado.
            ctx.putImageData(imageData,0,0);
        }

        //Aplico el sepia
        if(opcion == "sepia"){
            //declaro 3 variables para utilizar con los valores RGB.
            let red;
            let blue;
            let green;
            //Recorro la imagen (matriz) y seteo los pixeles a los indicados.
            for(let y = 0; y < canvas.height; y++){
                for(let x = 0; x < canvas.width; x++){
                    index = (x + y * imageData.width) * 4;
                    //tambien checkeo que no rebazen los limites de los 3 valores.
                    red = 0.393 * imageData.data[index+0] + 0.769 * imageData.data[index+1] + 0.189 * imageData.data[index+2];
                    if(red > 255)
                        red = 255;
                    green = 0.349 * imageData.data[index+0] + 0.686 * imageData.data[index+1] + 0.168 * imageData.data[index+2];
                    if(green > 255)
                        green = 255;
                    blue = 0.272 * imageData.data[index+0] + 0.534 * imageData.data[index+1] + 0.131 * imageData.data[index+2];
                    if(blue > 255)
                        blue = 255;
                    imageData.data[index+0] = red;
                    imageData.data[index+1] = green;
                    imageData.data[index+2] = blue;      
                }
            }
            //Muestra la imagen con el filtro aplicado.
            ctx.putImageData(imageData,0,0);
        }

        //Aplico la binarizacion
        if(opcion == "binario"){
            //declaro 3 variables para utilizar con los valores RGB.
            let r;
            let b;
            let g;
            //Recorro la imagen (matriz) y seteo los pixeles a los indicados.
            for(let y = 0; y < canvas.height; y++){
                for(let x = 0; x < canvas.width; x++){
                    index = (x + y * imageData.width) * 4;
                    //Utilizo las funciones anteriores para conseguir el valor de cual sera indice.
                    r = getRed(imageData,x,y);
                    g = getGreen(imageData,x,y);
                    b = getBlue(imageData,x,y);
                    //consigo el promedio, dividiendolo en 3.
                    let promedio = (r+g+b)/3;

                    //Si el promedio es mayor a 127 asigna el color negro
                    if(promedio > 127){
                        imageData.data[index+0] = 0;
                        imageData.data[index+1] = 0;
                        imageData.data[index+2] = 0;
                    }
                    //En cambio si es menor, lo asigna como blanco.
                    else{
                        imageData.data[index+0] = 255;
                        imageData.data[index+1] = 255;
                        imageData.data[index+2] = 255;
                    }
                }
            }
            //Muestra la imagen con el filtro aplicado.
            ctx.putImageData(imageData,0,0);              
        }

        //Aplico el blur
        if(opcion == "blur"){
            //Recorro la imagen (matriz) y seteo los pixeles a los indicados.
            for (let x = 1; x < imageData.width-1; x++) {
                for (let y = 1; y < imageData.height-1; y++) {
                    //Por cada pixel entra a la siguiente funcion:
                    promedioMatriz(x, y, imageData);
                }
            }
            //Esta se encarga de promediar los valores de RGB por cada recorrido,
            // y asignar los resultados de cada RGB al indice indicado.
            function promedioMatriz(x, y, imageData){
                //declaro en 0 cada valor RGB
                let r = 0;
                let b = 0;
                let g = 0;
                
                //Promedio las 9 combinaciones de ejes X e Y por cada pixel.
                r = (getRed(imageData, x-1, y-1) + getRed(imageData, x, y-1) + getRed(imageData, x+1, y-1)
                + getRed(imageData, x-1, y) + getRed(imageData, x, y) + getRed(imageData, x+1, y)
                + getRed(imageData, x-1, y+1) + getRed(imageData, x, y+1) + getRed(imageData, x+1, y+1))/9;
    
                g = (getGreen(imageData, x-1, y-1) + getGreen(imageData, x, y-1)+ getGreen(imageData, x+1, y-1) 
                +   getGreen(imageData, x-1, y) + getGreen(imageData, x, y) + getGreen(imageData, x+1, y)
                +   getGreen(imageData, x-1, y+1) + getGreen(imageData, x, y+1) + getGreen(imageData, x+1, y+1))/9;
        
                b = (getBlue(imageData, x-1, y-1) + getBlue(imageData, x, y-1) + getBlue(imageData, x+1, y-1)  
                +   getBlue(imageData, x-1, y) + getBlue(imageData, x, y) + getBlue(imageData, x+1, y+1)  
                +   getBlue(imageData, x-1, y+1) + getBlue(imageData, x, y+1) + getBlue(imageData, x+1, y+1))/9;
                
                //los asigno y salgo de la funcion para volver al recorrio de la matriz.
                let index = (x + y * imageData.width) * 4;
                imageData.data[index + 0] = r;
                imageData.data[index + 1] = g;
                imageData.data[index + 2] = b;
            }
            //Muestra la imagen con el filtro aplicado.
            ctx.putImageData(imageData, 0, 0);
        }
    }
    
    //Funcion para quitar los filtros.
    function quitarFiltro(){
        ctx.putImageData(imageOrigin,0,0);
    }

    //Funcion para cambiar el brillo de la imagen.
    //Solo se consigue aplicarlo si no hay algun filtro.
    function cambiarBrillo(){
        ctx.putImageData(imageOrigin,0,0);
        let densidad;
        let index;
        let canvas = document.querySelector("#myCanvas");
        let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

        //recorro la imagen y seteo los pixeles
        for(let y = 0; y < canvas.height; y++){
            for(let x = 0; x < canvas.width; x++){
                index = (x + y * imageData.width) * 4;
                densidad =  (document.querySelector("#brillo").value)/0.5;
                //llamo a la funcion getBrillo por cada indice de color
                //con el valor de indice que trabajo sumado a la densidad del brillo elegida.
                imageData.data[index+0] = getBrillo(imageData.data[index+0] + densidad);
                imageData.data[index+1] = getBrillo(imageData.data[index+1] + densidad);
                imageData.data[index+2] = getBrillo(imageData.data[index+2] + densidad);      
            }
        }
        

        //Retorno el valor del brillo.
        function getBrillo(valor){
            if(valor<0)
                return 0;
            if(valor>255)
                return 255;
            else
                return valor;
        }
        //Muestra la imagen con el filtro aplicado.
        ctx.putImageData(imageData,0,0);
    }
    

    //Carga una imagen.
    let botonCargarImagen = document.querySelector("#loadImage");
    botonCargarImagen.addEventListener("click", function(e){document.querySelector("#importImage").click();
    cargaImagen();});

    //El lapiz y el borrador.
    let botonLapiz = document.querySelector("#btnLapiz");
    botonLapiz.addEventListener("click", function(e){paint("lapiz")});
    let botonBorrador = document.querySelector("#botonBorrador");
    botonBorrador.addEventListener("click", function(e){paint("borrador")});

    //Descarga una imagen.
    let botonGuardar = document.querySelector("#saveImage");
    botonGuardar.addEventListener("click", guardarCambios);

    //Pone el canvas en blanco (COLOR BLANCO, NO SIN COLOR)
    let botonBlanco = document.querySelector("#blankImage");
    botonBlanco.addEventListener("click", enBlanco);

    //Borra el canvas (SIN COLOR, NO EN BLANCO)
    let botonDelete = document.querySelector("#deleteImage");
    botonDelete.addEventListener("click", borrarImg);

    //ESTAN ATENTOS A QUE SE CAMBIE EL FILTRO Y EL BRILLO
    document.querySelector("#selectFiltros").addEventListener("change", agregarFiltro);
    document.querySelector("#brillo").addEventListener("change", cambiarBrillo);
    
    

}
//Carga el DOM para recien ahi cargar la pagina.
document.addEventListener("DOMContentLoaded", cargarPagina);