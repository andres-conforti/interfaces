let mat = [];
let arrayAvg = [];
let maxNum = 0;
let maxPar = 0;
let minImpar = Number.POSITIVE_INFINITY;
let total = 0;

for(i=0;i<10;i++){// i = filas
    mat[i]=[];
    arrayAvg[i]=[];

    for(j=0;j<10;j++){ // j = columnas
        mat[i][j]=Math.floor(Math.random()*100);

        if(maxNum<mat[i][j]){//numero maximo de la matriz
            maxNum=mat[i][j];
        }

        if(i%2==0 && maxPar<mat[i][j]){//si la fila es par
            maxPar = Math.max(mat[i][j])
            //console.log("MaxPar de fila "+i+" : "+maxPar);
        }

        if(i%2!=0 && minImpar>mat[i][j]){//si la fila es impar
            minImpar = mat[i][j]
            //console.log("minImpar de fila "+i+" : "+minImpar);
        }
//3-Calcular el valor promedio de cada fila y guardarlos en un arreglo. 
        total += mat[i][j];
    }
    arrayAvg[i]=total/j;
}

console.log(mat);
console.log("Max: "+maxNum);
console.log("MaxPar: "+maxPar);
console.log("minImpar: "+minImpar);
console.log("Arreglo con promedios: "+arrayAvg);//en consola no dice que es array, pero hay que borrarle el texto nomas.

/*
Repaso Javascript: Definir una matriz de 100 elementos x 100 elementos
y completarla con valores enteros random, y resuelva los siguientes incisos: 

1-Escribir una función que retorne el valor máximo de toda la matriz.
2-Escribir una función que retorne el valor máximo contenido en las filas pares y el valor mínimo en las filas impares.
3-Calcular el valor promedio de cada fila y guardarlos en un arreglo. 
*/