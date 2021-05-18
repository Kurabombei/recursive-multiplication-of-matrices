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
                process.stdout.write(resultMatrixA[i][j] + ",  ");
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
    storage.counterNormal++;
    let resultMatrix = [];
    let timeStart = process.hrtime();

    console.log("Result matrix Y:");


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
    let timeEnd = process.hrtime(timeStart);
    storage.timeIterative = timeEnd;


    storage.counterNormal++;
    storage.resultMatrixY = resultMatrix;


    return storage;
}

let i = 0, j = 0, columnIndexMatrixA = 0;

// call stack problem with size > 100, process.nextTick() and setTimeout() didnt help as expected
function multiplyMatricesRecursive(rowQuantityMatrixA, colQuantityMatrixA, rowQuantityMatrixB,colQuantityMatrixB, C, storage)
{
    // ### Base "stop recursive calls" cases ###

    // If all rows traversed
    if (i >= rowQuantityMatrixA)
        return;

    // ### Recursive calls with different index changes ###

    // If i < rowQuantityMatrixA
    if (j < colQuantityMatrixB) {
        storage.counterRecursive++;
        if (columnIndexMatrixA < colQuantityMatrixA) {

            // RECURSION HERE CAUSED NODE JS MAXIMUM CALL STACK ERROR, changed calculating element to a cycle for possible calculation with matrixSize > 20

            // storage.counterRecursive++;
            // C[i][j] += storage.matrixA[i][columnIndexMatrixA] * storage.matrixB[columnIndexMatrixA][j];
            // columnIndexMatrixA++;
            // return multiplyMatricesRecursive(rowQuantityMatrixA, colQuantityMatrixA, rowQuantityMatrixB, colQuantityMatrixB, C, storage);

            for(columnIndexMatrixA; columnIndexMatrixA < colQuantityMatrixA; columnIndexMatrixA++){
                storage.counterRecursive++;
                C[i][j] += storage.matrixA[i][columnIndexMatrixA] * storage.matrixB[columnIndexMatrixA][j];
            }

        }
        // Next column
        storage.counterRecursive++;
        columnIndexMatrixA = 0;
        j++;
        return multiplyMatricesRecursive(rowQuantityMatrixA, colQuantityMatrixA, rowQuantityMatrixB, colQuantityMatrixB, C, storage);
    }
    // Next row
    storage.counterRecursive += 2;
    j = 0;
    i++;

    return multiplyMatricesRecursive(rowQuantityMatrixA, colQuantityMatrixA, rowQuantityMatrixB, colQuantityMatrixB, C, storage);
}

// Function to multiply two matrices matrixA[][] and matrixB[][]
function multiplyMatrixWrapper(rowQuantityMatrixA, colQuantityMatrixA, rowQuantityMatrixB, colQuantityMatrixB, storage)
{

    storage.counterRecursive += 1 + (storage.matrixA.length ** 2) * 2;
    let C = Array(storage.matrixA.length).fill(0).map(()=>Array(storage.matrixA.length).fill(0));

    let timeStart = process.hrtime();
    multiplyMatricesRecursive(storage.matrixA.length, storage.matrixA.length, storage.matrixB.length, storage.matrixB.length, C, storage);
    let timeEnd = process.hrtime(timeStart);
    storage.timeRecursive = timeEnd;
    storage.counterRecursive++;
    console.log("Result matrix Y recursively:");


    for (let i = 0; i < storage.matrixA.length; i++) {
        for (let j = 0; j < storage.matrixB[0].length; j++) {

            process.stdout.write(C[i][j] + ",\t");
            storage.counterRecursive++;
        }
        console.log(" ");
    }
    return storage;
}

// Main function, all executions start here, and all matrices are saved in locally made object "myStorage"
async function main() {


    let myStorage = {
        matrixSize: 1,
        matrixA: [[]],
        matrixB: [[]],
        resultMatrixY: [[]],
        resultMatrixYRecursive: [[]],
        counterNormal: 0,
        counterRecursive: 0,
        timeIterative: 0,
        timeRecursive: 0
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

    myStorage = await multiplyMatricesNormal(myStorage, myStorage.matrixA, myStorage.matrixB);
    multiplyMatrixWrapper(myStorage.matrixA.length, myStorage.matrixA.length, myStorage.matrixB.length, myStorage.matrixB.length, myStorage);

    // Printing analysis:
    console.log("Iterative function operations counter: " + myStorage.counterNormal + " actions.");
    console.log("Recursive function operations counter: " + myStorage.counterRecursive + " actions.");
    console.log("Iterative function execution time: " + myStorage.timeIterative[0] + " s and " + myStorage.timeIterative[1]/1000000 + "ms.");
    console.log("Recursive function execution time: " + myStorage.timeRecursive[0] + " s and " + myStorage.timeRecursive[1]/1000000 + "ms.");
}

main()

