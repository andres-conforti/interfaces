"use strict";

function cargarPagina(){

    let ctx = document.querySelector("#myCanvas").getContext("2d");    
    let rubberSize;
    let penSize;
    let imageOrigin = null;
    
    

    function paint(herramienta){
        
        let c = document.querySelector("#myCanvas");        
        let pintar = Boolean(false);
        let color_prim = document.querySelector("#colorSelector").value;
        
        let canvas = document.querySelector("#myCanvas");
        
        c.onmousedown = function (e){
            pintar = true;
            if(herramienta == "lapiz" ){
                penSize = document.querySelector("#selectLapiz").value;
                if(penSize == 0)
                    penSize = 0.5;
                ctx.lineCap = "round";
                ctx.moveTo(e.pageX - c.offsetLeft, e.pageY - c.offsetTop);
            }
        }   
    
        c.onmouseup = function(){
            pintar = false;
            ctx.beginPath();
        }
        
        c.onmousemove = function(e){
            if (pintar) {
                if (herramienta == "lapiz") {
                    ctx.lineTo(e.pageX - c.offsetLeft, e.pageY - c.offsetTop);
                    ctx.lineWidth = penSize;
                    ctx.strokeStyle = color_prim;
                    ctx.stroke();
                }
                else if(herramienta == "borrador"){
                    rubberSize = document.querySelector("#selectBorrador").value;
                    if(rubberSize == 0)
                        rubberSize = 0.5;
                    ctx.lineTo(e.pageX - c.offsetLeft, e.pageY - c.offsetTop);
                    ctx.lineWidth = rubberSize;
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.stroke();
                }
                imageOrigin = ctx.getImageData(0,0,canvas.width,canvas.height);
            }
        }
        
        c.onmouseout = function(){
            pintar = false;
        };
    }

    function cargaImagen(){
        let canvas = document.querySelector("#myCanvas");
        let input = document.querySelector("#importImage");

        let context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        input.onchange = e => {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = readerEvent => {
                let content = readerEvent.target.result;

                let image = new Image();
                image.src = content;

                image.onload = function(){
                    let imageScaledWidth = canvas.width;
                    let imageScaledHeight = canvas.height;
                
                    
                    let imageAspectRatio = (1.0 * this.height) / this.width;
                    if (this.width < this.height) {
                        imageAspectRatio = (1.0 * this.width) / this.height;
                        imageScaledWidth = canvas.height * imageAspectRatio;
                        imageScaledHeight = canvas.height;
                    }

                    context.drawImage(this, 0, 0, imageScaledWidth, imageScaledHeight);

                    let imageData = context.getImageData(0, 0, imageScaledWidth, imageScaledHeight);

                    imageOrigin = ctx.getImageData(0,0,canvas.width,canvas.height);
                    context.putImageData(imageData, 0, 0);
                }
            }
        }
    }

    function guardarCambios(){
        let link = document.querySelector("#descargar");
        let filename = prompt("SU IMAGEN SE GUARDARA COMO...", "INGRESE EL NOMBRE DE LA IMAGEN");
        if(filename=="INGRESE EL NOMBRE DE LA IMAGEN"){
            filename = "Dibujo";}
        filename = filename + ".jpg";
        link.href = document.querySelector("#myCanvas").toDataURL("image/jpg");
        link.download = filename;
    }

    function borrarImg(){
    let canvas = document.querySelector("#myCanvas");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function enBlanco(){
    let canvas = document.querySelector("#myCanvas");
    let context = canvas.getContext("2d");
    ctx.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function quitarFiltro(){
        ctx.putImageData(imageOrigin,0,0);
    }

    function agregarFiltro(){
        quitarFiltro();
        let opcion = document.querySelector("#selectFiltros").value;
        let canvas = document.querySelector("#myCanvas");
        let index;
        let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

        function getRed(imageData, x, y){
            let index = (x + y * imageData.width) * 4;
            return imageData.data[index+0];
        }

        function getGreen(imageData, x, y){
            let index = (x + y * imageData.width) * 4;
            return imageData.data[index+1];
        }

        function getBlue(imageData, x, y){
            let index = (x + y * imageData.width) * 4;
            return imageData.data[index+2];
        }
        
        if(opcion == "negativo"){
            for(let y = 0; y < canvas.height; y++){
                for(let x = 0; x < canvas.width; x++){
                    index = (x + y * imageData.width) * 4;
                    imageData.data[index+0] = 255 - imageData.data[index+0];
                    imageData.data[index+1] = 255 - imageData.data[index+1];
                    imageData.data[index+2] = 255 - imageData.data[index+2];      
                }
            }
            ctx.putImageData(imageData,0,0);
        }

        if(opcion == "sepia"){
            let red;
            let blue;
            let green;
            for(let y = 0; y < canvas.height; y++){
                for(let x = 0; x < canvas.width; x++){
                    index = (x + y * imageData.width) * 4;
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
            ctx.putImageData(imageData,0,0);
        }

        if(opcion == "binario"){
            let r;
            let b;
            let g;
            for(let y = 0; y < canvas.height; y++){
                for(let x = 0; x < canvas.width; x++){
                    index = (x + y * imageData.width) * 4;
                    
                    r = getRed(imageData,x,y);
                    g = getGreen(imageData,x,y);
                    b = getBlue(imageData,x,y);
                    
                    let promedio = (r+g+b)/3;

                    if(promedio > 127){
                        imageData.data[index+0] = 0;
                        imageData.data[index+1] = 0;
                        imageData.data[index+2] = 0;
                    }
                    else{
                        imageData.data[index+0] = 255;
                        imageData.data[index+1] = 255;
                        imageData.data[index+2] = 255;
                    }
                }
            }
            ctx.putImageData(imageData,0,0);              
        }

        if(opcion == "blur"){
            for (let x = 1; x < imageData.width-1; x++) {
                for (let y = 1; y < imageData.height-1; y++) {
                    promedioMatriz(x, y, imageData);
                }
            }

            function promedioMatriz(x, y, imageData){
                let r = 0;
                let b = 0;
                let g = 0;
                
                r = (getRed(imageData, x-1, y-1) + getRed(imageData, x, y-1) + getRed(imageData, x+1, y-1)
                + getRed(imageData, x-1, y) + getRed(imageData, x, y) + getRed(imageData, x+1, y)
                + getRed(imageData, x-1, y+1) + getRed(imageData, x, y+1) + getRed(imageData, x+1, y+1))/9;
    
                g = (getGreen(imageData, x-1, y-1) + getGreen(imageData, x, y-1)+ getGreen(imageData, x+1, y-1) 
                +   getGreen(imageData, x-1, y) + getGreen(imageData, x, y) + getGreen(imageData, x+1, y)
                +   getGreen(imageData, x-1, y+1) + getGreen(imageData, x, y+1) + getGreen(imageData, x+1, y+1))/9;
        
                b = (getBlue(imageData, x-1, y-1) + getBlue(imageData, x, y-1) + getBlue(imageData, x+1, y-1)  
                +   getBlue(imageData, x-1, y) + getBlue(imageData, x, y) + getBlue(imageData, x+1, y+1)  
                +   getBlue(imageData, x-1, y+1) + getBlue(imageData, x, y+1) + getBlue(imageData, x+1, y+1))/9;
        
                let index = (x + y * imageData.width) * 4;
                imageData.data[index + 0] = r;
                imageData.data[index + 1] = g;
                imageData.data[index + 2] = b;
            }
    
            ctx.putImageData(imageData, 0, 0);
        }

        if(opcion == "saturacion"){
            
            for (let x = 0; x < imageData.width; x++) {
                    for (let y = 0; y < imageData.height; y++) {
                        index = (x + y * imageData.width) * 4;
                        let r = getRed(imageData, x, y);
                        let g = getGreen(imageData, x, y);
                        let b = getBlue(imageData, x, y);
                        let a = rgbToHsl(r, g, b);
                        a[1] = 2;
                        let p = hslToRgb(a[0],a[1],a[2]);
                        imageData.data[index + 0] = p[0]; 
                        imageData.data[index + 1] = p[1]; 
                        imageData.data[index + 2] = p[2]; 
                    }
            }

            ctx.putImageData(imageData, 0, 0);

            function rgbToHsl(r, g, b) {
                r /= 255, g /= 255, b /= 255;
        
                let max = Math.max(r, g, b), min = Math.min(r, g, b);
                let h, s, l = (max + min) / 2;
        
                if (max == min) {
                        h = s = 0;
                } else {
                        let d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        switch (max) {
                                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                                case g: h = (b - r) / d + 2; break;
                                case b: h = (r - g) / d + 4; break;
                        }
                        h /= 6;
                }
                return [h, s, l];
            }

            function hslToRgb(h, s, l) {
                let r, g, b;
        
                if (s == 0) {
                        r = g = b = l;
                } else {
                        function hue2rgb(p, q, t) {
                                if (t < 0) t += 1;
                                if (t > 1) t -= 1;
                                if (t < 1 / 6) return p + (q - p) * 6 * t;
                                if (t < 1 / 2) return q;
                                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                                return p;
                        }
        
                        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                        let p = 2 * l - q;
        
                        r = hue2rgb(p, q, h + 1 / 3);
                        g = hue2rgb(p, q, h);
                        b = hue2rgb(p, q, h - 1 / 3);
                }
                return [r * 255, g * 255, b * 255];
            }
        }
    }


    
    let botonCargarImagen = document.querySelector("#loadImage");
    botonCargarImagen.addEventListener("click", function(e){document.querySelector("#importImage").click();
    cargaImagen();});

    let botonGuardar = document.querySelector("#saveImage");
    botonGuardar.addEventListener("click", guardarCambios);

    let botonBlanco = document.querySelector("#blankImage");
    botonBlanco.addEventListener("click", enBlanco);

    let botonDelete = document.querySelector("#deleteImage");
    botonDelete.addEventListener("click", borrarImg);

    let botonLapiz = document.querySelector("#btnLapiz");
    botonLapiz.addEventListener("click", function(e){paint("lapiz")});

    let botonBorrador = document.querySelector("#botonBorrador");
    botonBorrador.addEventListener("click", function(e){paint("borrador")});

    let botonQuitarFiltro = document.querySelector("#btnQuitarFiltro");
    botonQuitarFiltro.addEventListener("click", quitarFiltro);

    document.querySelector("#selectFiltros").addEventListener("change", agregarFiltro);
    
    document.querySelector("#inpBrillo").addEventListener("change", brillo);
    
}

document.addEventListener("DOMContentLoaded", cargarPagina);