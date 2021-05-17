// Import for getting input more easily from console
const prompt = require('promise-prompt');

// Function that gets min and max number values, and returns a random integer in the range [min, max], with border values included.
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Variable to count the operations made by program
let counterForOperations = 0;

// Function that gets number value of matrix size and returns a promise with matrix matrixA.
function createMatrixA(matrixSize) {
    return new Promise(function(resolve, reject){

        let resultMatrixA = Array(matrixSize).fill(0).map(()=>Array(matrixSize).fill(0));

        console.log("Matrix A:");

        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                if((j > i-1 && j < matrixSize - i) || (i + j >= matrixSize - 1 && j <= i)){
                    resultMatrixA[i][j] = 1;
                }

                // Commented line is for testing where are indexes of matrix elements for modification of matrix.
                // process.stdout.write("" + i + j + ", ");
                process.stdout.write(resultMatrixA[i][j] + ",\t");
            }
            console.log(" ");
        }
        // Succesful resolving of a promise with a ready for use matrix matrixA
        resolve(resultMatrixA);
    });
}

// Function that gets number value of matrix size and returns a promise with matrix matrixB.
function createMatrixB(matrixSize){
    return new Promise(function(resolve, reject){

        let resultMatrixB = Array(matrixSize).fill(0).map(()=>Array(matrixSize).fill(0));
        console.log("Matrix matrixB:");

        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {

                if(i >= j){
                    resultMatrixB[i][j] = getRandomNumber(i, matrixSize * j+5);
                }
                process.stdout.write(resultMatrixB[i][j] + ",\t");

            }
            console.log(" ");
        }
        resolve(resultMatrixB);
    });
}

// TODO get storage inside by using call/apply and "this" inside

// Gets a storage, with matrixA and matrixB as arguments, outputs a storage with result matrix and counters inside
function multiplyMatricesNormal(storage){
    let resultMatrix = [];

    console.log("Result matrix Y:")


    for (let i = 0; i < storage.matrixA.length; i++) {
        resultMatrix[i] = [];
        storage.counterNormal++;

        for (let j = 0; j < storage.matrixB[0].length; j++) {
            let sum = 0;
            storage.counterNormal++;

            for (let columnIndexMatrixA = 0; columnIndexMatrixA < storage.matrixA[0].length; columnIndexMatrixA++) {
                sum += storage.matrixA[i][columnIndexMatrixA] * storage.matrixB[columnIndexMatrixA][j];
                storage.counterNormal++;
            }

            resultMatrix[i][j] = sum;
            process.stdout.write(resultMatrix[i][j] + ",\t");
            storage.counterNormal++;
        }
        console.log(" ");
    }
    storage.resultMatrixY = resultMatrix;
    return storage;
}

let i = 0, j = 0, columnIndexMatrixA = 0;

function multiplyMatricesRecursive(rowQuantityMatrixA, colQuantityMatrixA, matrixA, rowQuantityMatrixB,colQuantityMatrixB , matrixB, C)
{
    // ### Base "stop recursive calls" cases ###

    // If all rows traversed
    if (i >= rowQuantityMatrixA)
        return;

    // ### Recursive calls with different index changes ###

    // If i < rowQuantityMatrixA
    if (j < colQuantityMatrixB)
    {
        if (columnIndexMatrixA < colQuantityMatrixA)
        {
            C[i][j] += matrixA[i][columnIndexMatrixA] * matrixB[columnIndexMatrixA][j];
            columnIndexMatrixA++;

            multiplyMatricesRecursive(rowQuantityMatrixA, colQuantityMatrixA, matrixA, rowQuantityMatrixB, colQuantityMatrixB, matrixB, C);
        }
        // Next column
        columnIndexMatrixA = 0;
        j++;
        multiplyMatricesRecursive(rowQuantityMatrixA, colQuantityMatrixA, matrixA, rowQuantityMatrixB, colQuantityMatrixB, matrixB, C);
    }
    // Next row
    j = 0;
    i++;
    multiplyMatricesRecursive(rowQuantityMatrixA, colQuantityMatrixA, matrixA, rowQuantityMatrixB, colQuantityMatrixB, matrixB, C);
}

// Function to multiply two matrices matrixA[][] and matrixB[][]
function multiplyMatrix(rowQuantityMatrixA, colQuantityMatrixA, rowQuantityMatrixB, colQuantityMatrixB, storage)
{

    let C = Array(rowQuantityMatrixA).fill(0).map(()=>Array(rowQuantityMatrixB).fill(0));

    multiplyMatricesRecursive(storage.matrixA.length, storage.matrixA.length, storage.matrixA, storage.matrixB.length, storage.matrixB.length, storage.matrixB, C);
    console.log("Result matrix Y recursively:");


    for (let i = 0; i < storage.matrixA.length; i++) {
        for (let j = 0; j < storage.matrixB[0].length; j++) {

            process.stdout.write(C[i][j] + ",\t");
            storage.counterNormal++;
        }
        console.log(" ");
    }
}

// Main function, all executions start here, and all matrices are saved in locally made object "myStorage"
async function main() {

    let counter = 0;

    let myStorage = {
        matrixSize: 1,
        matrixA: [[]],
        matrixB: [[]],
        resultMatrixY: [[]],
        resultMatrixYRecursive: [[]],
        counterNormal: 0,
        counterRecursive: 0
    };


    await prompt("What's the size of the matrices ?").then(size => {

        myStorage.matrixSize = size;
        console.log("size is " + size + "x" + myStorage.matrixSize);
        return myStorage;

    }).then(storage => {
        let promiseMatrixA = createMatrixA.call( myStorage, Number(storage.matrixSize));
        let promiseMatrixB = createMatrixB.call( myStorage, Number(storage.matrixSize));

        promiseMatrixA.then(
            result => storage.matrixA = result,
            error => console.log(error)
        );
        promiseMatrixB.then(
            result => storage.matrixB = result,
            error => console.log(error)
        );
    });
    console.log(counter);

    myStorage = await multiplyMatricesNormal(myStorage, myStorage.matrixA, myStorage.matrixB);
    multiplyMatrix(myStorage.matrixA.length, myStorage.matrixA.length, myStorage.matrixB.length, myStorage.matrixB.length, myStorage);

}
main()

