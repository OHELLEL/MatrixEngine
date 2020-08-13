self.importScripts('Eutilities.js');
onmessage = function(received) {   
    let message, operation, opArgs, matrixData, m, result, output, response, tMatrix, Mops; 
    message      = received.data;
    operation    = message.operation;
    opArgs       = message.opArgs;
    matrixData   = message.data;
    Mops         = new MatrixOperations();
    response     = [];
    for (let i = 0; i < matrixData.length; i++) {
        // Check if the requested operation exist.
        tMatrix = new MatrixStruc(1, 1);
        if ( !tMatrix[operation] || inaccessibleOperations(operation) ) {
            console.log("The operation: '" + operation + "' doesn't exist, so it has been skipped..." )
            result = matrixData[i];
            response.push(result);
            continue;
        }    
        // Check if the current index i is in the specified set of components.
        if ( message.components ) {
            if ( Array.isArray( message.components ) ) { 
                if ( message.components.indexOf(i) === -1 ) {
                    result = matrixData[i];
                    response.push(result);
                    continue;
                }
            } else if ( typeof( message.components ) === "number" ) {
                if ( message.components !== i ) {
                    result = matrixData[i];
                    response.push(result);
                    continue;
                }
            }
        }
        // Data Extraction.
        height   = matrixData[i].nR;
        width    = matrixData[i].nC;
        data     = matrixData[i].content;
        // Matrix Creation
        m        = matrixData[i];
        m.__proto__ = Mops;
        // Processing the Matrix
        console.log( "The '" + operation + "' process has started for component: " + i +" ...")
        result = (opArgs) ? m[operation](...opArgs) : m[operation](); 
        if (sideOperations(operation) ) {
            output = {...matrixData[i]};
            output[operation] = result;
        } else {
            result = result;
            output = {...matrixData[i], ...result}
        }
        console.log( "The '" + operation + "' process has ended for component: " + i)
        // Result Collection.
        response.push(output);
    }

    // Sending Results;
    postMessage(response);
}

function sideOperations(operation) {
    let operations, output;
    operations = ["mArray", "print", "reduce", "determinant", "sum", 
    "sumCols", "sumRows", "minmax", "hist", "unique", "CDF", "median", "fft", "PMF",
    "frequencyFiltering", "frequencyWindowing", "ifft", "fft2d", "ifft2d", "imGradient", "cannyEdgeDetection"];
    output     = (operations.indexOf(operation) !== -1) ? true : false; 
    return output;
}

function inaccessibleOperations(operation) {
    let operations, output;
    operations = ["type", "rowSwapZeros", "colSwapZeros", "size", "data", "clone", "row", "column", "fftshuffle", "filterGen", "hfilterGen", "fft2dShift"];
    output     = (operations.indexOf(operation) !== -1) ? true : false; 
    return output;
}