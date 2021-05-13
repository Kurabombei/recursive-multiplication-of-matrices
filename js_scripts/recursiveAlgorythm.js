
const prompt = require('promise-prompt');



function createMatrixA(matrixSize) {
    return new Promise(function(resolve, reject){

        let resultMatrixA = [];

        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {

                resultMatrixA[i][j] = 1;

            }
        }
        resolve(resultMatrixA);
    });
}
function createMatrixB(matrixSize) {
    return new Promise(function(resolve, reject){

        let resultMatrixA = [];

        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {

                resultMatrixA[i][j] = 0;

            }
        }
        resolve(resultMatrixA);
    });
}

function main() {

    let myStorage = {
        matrixSize : 1,
        matrixA: [[]],
        matrixB: [[]],
        resultMatrixY: [[]]
    };


    myStorage.matrixSize = prompt("What's the size of the matrices ?").then(size => {
        myStorage.matrixSize = size;
        console.log("size is " + size + "x" + myStorage.matrixSize);
        return myStorage;
    }).then(obj => {
        obj.matrixA = createMatrixA(obj.matrixSize); // TODO returns a promise, needs to return a matrix
        obj.matrixB = createMatrixB(obj.matrixSize);
        console.log("done");
        console.dir(obj);
    });

    let promise = createMatrixA(myStorage.matrixSize);
    promise.then(
        result => console.log(result),
        error => console.log(error)
    )

}
main()

