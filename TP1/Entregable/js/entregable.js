"use strict";

function cargarPagina(){

    let ctx = document.querySelector("#myCanvas").getContext("2d");    
    let rubberSize;
    let penSize;
    let imageOrigin = null;
 
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