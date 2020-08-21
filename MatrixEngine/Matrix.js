// API

class MatrixEngine {  
    constructor() {
        let path = import.meta.url;
        this.path = path.replace("Matrix.js", "");   // "./matrixEngineJS"
    }    

    // DOM OPERATIONS: 
    readImage(link) {
        let promise;
        promise = new Promise((resolve) => {
            let canvas, img, ctx, image, data, r, g, b, a, index;
            img     = document.createElement("img");
            img.src = link;
            img.addEventListener("load", () => {
                canvas              = document.createElement("canvas");
                canvas.style.width  = img.naturalWidth;
                canvas.style.height = img.naturalHeight;
                canvas.width        = img.naturalWidth;
                canvas.height       = img.naturalHeight;
                ctx                 = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                image               = ctx.getImageData(0, 0, canvas.width, canvas.height);
                r = new MatrixStruc(image.height, image.width, (i, j) => {
                    index = (i * image.width + j) * 4;
                    return image.data[index+0];
                })

                g = new MatrixStruc(image.height, image.width, (i, j) => {
                    index = (i * image.width + j) * 4;
                    return image.data[index+1];
                })

                b = new MatrixStruc(image.height, image.width, (i, j) => {
                    index = (i * image.width + j) * 4;
                    return image.data[index+2];
                })

                a = new MatrixStruc(image.height, image.width, (i, j) => {
                    index = (i * image.width + j) * 4;
                    return image.data[index+3];
                })

                resolve([r, g, b, a]);
            })
        })  
        return promise;
    }

    printToDOM(input, querySelector, alpha, css) {
        if ( Array.isArray(input) ) {
            return function (matrixArray) {
                let canvas, ctx, imageData, index, parent;
                canvas              = document.createElement("canvas");
                canvas.style.width  = matrixArray[input[0]].nC;
                canvas.style.height = matrixArray[input[0]].nR;
                canvas.width        = matrixArray[input[0]].nC;
                canvas.height       = matrixArray[input[0]].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData( matrixArray[input[0]].nC, matrixArray[input[0]].nR );

                if ( css !== undefined ) {
                    if ( typeof(css.id) === "string" ) {
                        canvas.id = css.id;
                    }
                    if ( typeof(css.class) === "string" ) {
                        canvas.classList.push(css.class);
                    }
                }

                for (let i = 0; i < matrixArray[input[0]].nR; i++) {
                    for (let j = 0; j < matrixArray[input[0]].nC; j++) {                        
                        index = (i * matrixArray[input[0]].nC + j) * 4;
                        for (let l = 0; l < 4; l++) {
                            if ( input.indexOf(l) !== -1 ) {
                                imageData.data[index+l] = matrixArray[l].content[i][j];
                            } else {
                                imageData.data[index+l] = 0;
                                if (l === 3 && alpha === true) {
                                    imageData.data[index+l] = 255;
                                }
                            }
                        }    
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                if (querySelector instanceof Element) {
                    parent = querySelector;
                } else if ( typeof(querySelector) === "string" ) {
                    parent = document.querySelector(querySelector);
                } else if ( querySelector === undefined ) {
                    parent = document.body;
                }
                parent.appendChild(canvas);
                let promise  = new Promise( ( resolve ) => {
                    resolve(matrixArray);
                })
                return promise;
            }
        } else if ( typeof(input) === "number" ) {
            return function (matrixArray) {
                let canvas, ctx, imageData, index, parent;
                canvas              = document.createElement("canvas");
                canvas.style.width  = matrixArray[input].nC;
                canvas.style.height = matrixArray[input].nR;
                canvas.width        = matrixArray[input].nC;
                canvas.height       = matrixArray[input].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData(matrixArray[0].nC, matrixArray[0].nR);

                if ( css !== undefined ) {
                    if ( typeof(css.id) === "string" ) {
                        canvas.id = css.id;
                    }
                    if ( typeof(css.class) === "string" ) {
                        canvas.classList.push(css.class);
                    }
                }

                for (let i = 0; i < matrixArray[input].nR; i++) {
                    for (let j = 0; j < matrixArray[input].nC; j++) {  
                        index = (i * matrixArray[input].nC + j) * 4;
                        for (let l = 0; l < 3; l++) {
                            imageData.data[index+l] = matrixArray[input].content[i][j];
                        }
                        imageData.data[index+3]     = 255;   
                    }
                }
                ctx.putImageData(imageData, 0, 0);

                if (querySelector instanceof Element) {
                    parent = querySelector;
                } else if ( typeof(querySelector) === "string" ) {
                    parent = document.querySelector(querySelector);
                } else if ( querySelector === undefined ) {
                    parent = document.body;
                }

                parent.appendChild(canvas);
                let promise  = new Promise( ( resolve ) => {
                    resolve(matrixArray);
                })

                return promise;
            }
        } else if ( input === undefined && querySelector === undefined ) {
            return this.printToDOM(0, document.body);
        } else if (typeof(input) === "string" && input === "grayScale") {
            return function (matrixArray) {
                let canvas, ctx, imageData, index, parent;
                canvas              = document.createElement("canvas");
                canvas.style.width  = matrixArray[0].nC;
                canvas.style.height = matrixArray[0].nR;
                canvas.width        = matrixArray[0].nC;
                canvas.height       = matrixArray[0].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData(matrixArray[0].nC, matrixArray[0].nR);

                if ( css !== undefined ) {
                    if ( typeof(css.id) === "string" ) {
                        canvas.id = css.id;
                    }
                    if ( typeof(css.class) === "string" ) {
                        canvas.classList.push(css.class);
                    }
                }

                for (let i = 0; i < matrixArray[0].nR; i++) {
                    for (let j = 0; j < matrixArray[0].nC; j++) {  
                        index = (i * matrixArray[0].nC + j) * 4;
                        for (let l = 0; l < 3; l++) {
                            imageData.data[index+l] = (matrixArray[0].content[i][j] + matrixArray[1].content[i][j] + matrixArray[2].content[i][j]) * (1/3) ;
                        }

                        imageData.data[index+3]     = 255;   
                    }
                }

                ctx.putImageData(imageData, 0, 0);

                if (querySelector instanceof Element) {
                    parent = querySelector;
                } else if ( typeof(querySelector) === "string" ) {
                    parent = document.querySelector(querySelector);
                } else if ( querySelector === undefined ) {
                    parent = document.body;
                }

                parent.appendChild(canvas);
                let promise  = new Promise( ( resolve ) => {
                    resolve(matrixArray);
                })

                return promise;
            }
        } else if (typeof(input) === "string" && input === "rgba") {
            return this.printToDOM([0, 1, 2, 3], querySelector, alpha, css)
        }
    } 

    updateCanvas(querySelector, input) {
        if ( Array.isArray(input) ) {
            return function (matrixArray) {
                let canvas, ctx, imageData, index;
                if (querySelector instanceof Element) {
                    canvas = querySelector;
                } else if ( typeof(querySelector) === "string" ) {
                    canvas = document.querySelector(querySelector);
                }
                canvas.style.width  = matrixArray[input[0]].nC;
                canvas.style.height = matrixArray[input[0]].nR;
                canvas.width        = matrixArray[input[0]].nC;
                canvas.height       = matrixArray[input[0]].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData( matrixArray[input[0]].nC, matrixArray[input[0]].nR );
                for (let i = 0; i < matrixArray[input[0]].nR; i++) {
                    for (let j = 0; j < matrixArray[input[0]].nC; j++) {                        
                        index = (i * matrixArray[input[0]].nC + j) * 4;
                        for (let l = 0; l < 4; l++) {
                            if ( input.indexOf(l) !== -1 ) {
                                imageData.data[index+l] = matrixArray[l].content[i][j];
                            } else {
                                imageData.data[index+l] = 0;
                                if (l === 3 && alpha === true) {
                                    imageData.data[index+l] = 255;
                                }
                            }
                        }    
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                let promise  = new Promise( ( resolve ) => {
                    resolve(matrixArray);
                })
                return promise;
            }
        } else if ( typeof(input) === "number" ) {
            return function (matrixArray) {
                let canvas, ctx, imageData, index;
                if (querySelector instanceof Element) {
                    canvas = querySelector;
                } else if ( typeof(querySelector) === "string" ) {
                    canvas = document.querySelector(querySelector);
                }
                canvas.style.width  = matrixArray[input].nC;
                canvas.style.height = matrixArray[input].nR;
                canvas.width        = matrixArray[input].nC;
                canvas.height       = matrixArray[input].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData(matrixArray[0].nC, matrixArray[0].nR);

                for (let i = 0; i < matrixArray[input].nR; i++) {
                    for (let j = 0; j < matrixArray[input].nC; j++) {  
                        index = (i * matrixArray[input].nC + j) * 4;
                        for (let l = 0; l < 3; l++) {
                            imageData.data[index+l] = matrixArray[input].content[i][j];
                        }
                        imageData.data[index+3]     = 255;   
                    }
                }
                ctx.putImageData(imageData, 0, 0);

                let promise  = new Promise( ( resolve ) => {
                    resolve(matrixArray);
                })

                return promise;
            }
        } else if ( input === undefined) {
            return function (matrixArray) {
                let canvas, ctx, imageData, index;
                if (querySelector instanceof Element) {
                    canvas = querySelector;
                } else if ( typeof(querySelector) === "string" ) {
                    canvas = document.querySelector(querySelector);
                }
                canvas.style.width  = matrixArray[0].nC;
                canvas.style.height = matrixArray[0].nR;
                canvas.width        = matrixArray[0].nC;
                canvas.height       = matrixArray[0].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData( matrixArray[0].nC, matrixArray[0].nR );
                for (let i = 0; i < matrixArray[0].nR; i++) {
                    for (let j = 0; j < matrixArray[0].nC; j++) {                        
                        index = (i * matrixArray[0].nC + j) * 4;
                        if ( matrixArray.length <= 4) {
                            for (let l = 0; l < matrixArray.length; l++) {
                                imageData.data[index+l] = matrixArray[l].content[i][j];
                            }
                        } else {
                            for (let l = 0; l < 4; l++) {
                                imageData.data[index+l] = matrixArray[l].content[i][j];
                            }
                        }    
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                let promise  = new Promise( ( resolve ) => {
                    resolve(matrixArray);
                })
                return promise;
            }
        } else if (typeof(input) === "string" && input === "grayScale") {
            return function (matrixArray) {
                let canvas, ctx, imageData, index;
                if (querySelector instanceof Element) {
                    canvas = querySelector;
                } else if ( typeof(querySelector) === "string" ) {
                    canvas = document.querySelector(querySelector);
                } else if ( querySelector === undefined ) {
                    canvas = document.body;
                }
                canvas.style.width  = matrixArray[0].nC;
                canvas.style.height = matrixArray[0].nR;
                canvas.width        = matrixArray[0].nC;
                canvas.height       = matrixArray[0].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData(matrixArray[0].nC, matrixArray[0].nR);
                if ( css !== undefined ) {
                    if ( typeof(css.id) === "string" ) {
                        canvas.id = css.id;
                    }
                    if ( typeof(css.class) === "string" ) {
                        canvas.classList.push(css.class);
                    }
                }
                for (let i = 0; i < matrixArray[0].nR; i++) {
                    for (let j = 0; j < matrixArray[0].nC; j++) {  
                        index = (i * matrixArray[0].nC + j) * 4;
                        for (let l = 0; l < 3; l++) {
                            imageData.data[index+l] = (matrixArray[0].content[i][j] + matrixArray[1].content[i][j] + matrixArray[2].content[i][j]) * (1/3) ;
                        }
                        imageData.data[index+3]     = 255;   
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                let promise  = new Promise( ( resolve ) => {
                    resolve(matrixArray);
                })

                return promise;
            }
        }  else if (typeof(input) === "string" && input === "rgba") {
            return function (matrixArray) {
                let canvas, ctx, imageData, index;
                if (querySelector instanceof Element) {
                    canvas = querySelector;
                } else if ( typeof(querySelector) === "string" ) {
                    canvas = document.querySelector(querySelector);
                } else if ( querySelector === undefined ) {
                    canvas = document.body;
                }
                canvas.style.width  = matrixArray[0].nC;
                canvas.style.height = matrixArray[0].nR;
                canvas.width        = matrixArray[0].nC;
                canvas.height       = matrixArray[0].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData(matrixArray[0].nC, matrixArray[0].nR);
                if ( css !== undefined ) {
                    if ( typeof(css.id) === "string" ) {
                        canvas.id = css.id;
                    }
                    if ( typeof(css.class) === "string" ) {
                        canvas.classList.push(css.class);
                    }
                }
                for (let i = 0; i < matrixArray[0].nR; i++) {
                    for (let j = 0; j < matrixArray[0].nC; j++) {  
                        index = (i * matrixArray[0].nC + j) * 4;
                        for (let l = 0; l < 4; l++) {
                            imageData.data[index+l] = matrixArray[l].content[i][j];
                        }
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                let promise  = new Promise( ( resolve ) => {
                    resolve(matrixArray);
                })

                return promise;
            }
        }
    } 

    downloadImage(input, alpha) {
        if ( Array.isArray(input) ) {
            return function (matrixArray) {
                let canvas, ctx, imageData, index, a;
                canvas              = document.createElement("canvas");
                canvas.style.width  = matrixArray[input[0]].nC;
                canvas.style.height = matrixArray[input[0]].nR;
                canvas.width        = matrixArray[input[0]].nC;
                canvas.height       = matrixArray[input[0]].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData( matrixArray[input[0]].nC, matrixArray[input[0]].nR );
                for (let i = 0; i < matrixArray[input[0]].nR; i++) {
                    for (let j = 0; j < matrixArray[input[0]].nC; j++) {                        
                        index = (i * matrixArray[input[0]].nC + j) * 4;
                        for (let l = 0; l < 4; l++) {
                            if ( input.indexOf(l) !== -1 ) {
                                imageData.data[index+l] = matrixArray[l].content[i][j];
                            } else {
                                imageData.data[index+l] = 0;
                                if ( l === 3 && alpha === true ) {
                                    imageData.data[index+l] = 255;
                                }
                            }
                        }    
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                let promise  = new Promise( ( resolve ) => {
                    a = document.createElement('a');
                    document.body.appendChild(a);
                    a.href = canvas.toDataURL("image/png");
                    a.download = "ProcessedImage.png";
                    a.click();
                    document.body.removeChild(a);
                    resolve(matrixArray);
                })
                return promise;
            }
        } else if ( typeof(input) === "number" ) {
            return function (matrixArray) {
                let canvas, ctx, imageData, index, a;
                canvas              = document.createElement("canvas");
                canvas.style.width  = matrixArray[input].nC;
                canvas.style.height = matrixArray[input].nR;
                canvas.width        = matrixArray[input].nC;
                canvas.height       = matrixArray[input].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData(matrixArray[0].nC, matrixArray[0].nR);
                for (let i = 0; i < matrixArray[input].nR; i++) {
                    for (let j = 0; j < matrixArray[input].nC; j++) {  
                        index = (i * matrixArray[input].nC + j) * 4;
                        for (let l = 0; l < 3; l++) {
                            imageData.data[index+l] = matrixArray[input].content[i][j];
                        }
                        imageData.data[index+3]     = 255;   
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                let promise  = new Promise( ( resolve ) => {
                    a = document.createElement('a');
                    document.body.appendChild(a);
                    a.href = canvas.toDataURL();
                    a.download = "ProcessedImage";
                    a.click();
                    document.body.removeChild(a);
                    resolve(matrixArray);
                })
                return promise;
            }
        } else if ( input === undefined ) {
            return this.downloadImage([0, 1, 2, 3]);
        } else if ( typeof(input) === "string" && input === "grayScale" ) {
            return function (matrixArray) {
                let canvas, ctx, imageData, index, a;
                canvas              = document.createElement("canvas");
                canvas.style.width  = matrixArray[0].nC;
                canvas.style.height = matrixArray[0].nR;
                canvas.width        = matrixArray[0].nC;
                canvas.height       = matrixArray[0].nR;
                ctx                 = canvas.getContext('2d');
                imageData           = new ImageData(matrixArray[0].nC, matrixArray[0].nR);
                for (let i = 0; i < matrixArray[0].nR; i++) {
                    for (let j = 0; j < matrixArray[0].nC; j++) {  
                        index = (i * matrixArray[0].nC + j) * 4;
                        for (let l = 0; l < 3; l++) {
                            imageData.data[index+l] = (matrixArray[0].content[i][j] + matrixArray[1].content[i][j] + matrixArray[2].content[i][j]) * (1/3);
                        }
                        imageData.data[index+3]     = 255;   
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                let promise  = new Promise( ( resolve ) => {
                    a = document.createElement('a');
                    document.body.appendChild(a);
                    a.href = canvas.toDataURL();
                    a.download = "ProcessedImage";
                    a.click();
                    document.body.removeChild(a);
                    resolve(matrixArray);
                })
                return promise;
            }
        }
    }

    log() {
        return function(data) {
            console.log(data);
            return data;
        }
    }

    sideToMain(name, index) {
        return function(data) {
            if (typeof(index) === "number" ) {
                if ( data[index][name] !== undefined ) {
                    if (Array.isArray(data[index][name])) {
                        return data[index][name];
                    } else {
                        return [data[index][name]]
                    }
                }
            } else if ( index === undefined ) {
                let output = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i][name] !== undefined) {
                        output.push( data[i][name] );
                    }
                }
                return output;
            } else if ( Array.isArray(index) ) {
                let output = [];
                for (let i = 0; i < data.length; i++) {
                    if (index.indexOf(i) !== -1) {
                        if (data[i][name] !== undefined) {
                            output.push( data[i][name] );
                        }
                    }
                }
                return output;
            }

        }
    }

    pushDownStream() {
        let args    = arguments;
        let promise = new Promise( (resolve) => {
            let Data = [];
            for (let i = 0; i < args.length; i++) {
                Data.push(args[i]);
            }
            resolve(Data);
        })
        return promise;
    }

    // Matrix Creation Methods:
    matrix(data, nR = 3, nC = 3) {
        if (isMatrixArray(data)) {    
            let nR = data.length;
            let nC = data[0].length;
            let m  = new MatrixStruc(nR, nC, (i, j) => {
                return data[i][j]
            });
            return m;
        } else if (isArrayOfNumbers(data)) {  
            let m  = new MatrixStruc(1, data.length, (i,j) => {
                return data[j];
            });
            return m;       
        } else if (typeof(data) === "number" || typeof(data) === "function" || data.constructor.name === "ComplexNumber") {
            let m  = new MatrixStruc(nR, nC, data);
            return m;
        } else { 
            let m  = new MatrixStruc(3, 3, 0);
            return m;
        }
    }

    zeros(nR, nC) {
        let m;
        if (arguments.length === 1) {
            m = new MatrixStruc(nR, nR, 0);
        } else {
            m = new MatrixStruc(nR, nC, 0);
        }
        return m;
    }
    
    ones(nR, nC) {
        let m;
        if (arguments.length === 1) {
            m = new MatrixStruc(nR, nR, 1);
        } else {
            m = new MatrixStruc(nR, nC, 1);
        }
        return m;
    }
    
    identity(n) {
        let m = new MatrixStruc(n, n, (i, j) => { 
            if (i === j) {
                return 1
            } else { 
                return 0
            }
        })
        return m;
    }

    filterGen(type = "average", size = 3, param = 0.2) {
        let h;
        if (size%2 === 1) {
            if (type === "average") {
                let aF      = size * size;
                    h       = new MatrixStruc(size, size, 1/aF);
            } else if (type === "gaussian") {
                let center = Math.floor(size/2);
                h      = new MatrixStruc(size, size, (i, j) => {
                    return Math.exp( - ( ( Math.pow(i-center, 2) + Math.pow(j-center, 2) ) ) / (2 * Math.pow(param, 2)) )
                })
                let sum   = h.sum().re;
                h = h.etimes(1/sum);
            } else if (type === "sobel") {
                h = this.matrix([
                    [ 1,  2,  1 ],
                    [ 0,  0,  0 ],
                    [-1, -2, -1 ]
                ])
            } else if (type === "laplacian") {
                if (param <= 1 && param >= 0) {
                    h = this.matrix([
                        [ (param/4)  ,  (1-param)/4,  (param/4)   ],
                        [ (1-param)/4,  -1         ,  (1-param)/4 ],
                        [ (param/4)  ,  (1-param)/4,  (param/4)   ]
                    ])
                }
                h = h.etimes( 4/(param+1));
            } else if (type === "log") {
                let center = Math.floor(size/2);
                let hg     = new MatrixStruc(size, size, (i, j) => { return Math.exp( - ( ( Math.pow(i-center, 2) + Math.pow(j-center, 2) ) ) / (2 * Math.pow(param, 2)) ); })
                let sum    = hg.sum().re * Math.pow(param, 4);
                h   = new MatrixStruc(size, size, (i, j) => {
                    return ( hg.data(i,j) / sum ) * ( Math.pow(i-center, 2) + Math.pow(j-center, 2) - 2 * Math.pow(param, 2) )
                })
            } else if (type === "prewitt") {
                h = this.matrix([
                    [ 1,  1,  1 ],
                    [ 0,  0,  0 ],
                    [-1, -1, -1 ]
                ])
            } else if (type === "disk") {
                let center = Math.floor( (2*size+1) / 2 );
                    h      = new MatrixStruc(2*size+1, 2*size+1, (i, j) => {
                    if ( Math.pow( (i-center) , 2 )  + Math.pow( (j-center) , 2 ) <= Math.pow(size, 2) ) {
                        return 1;
                    } else {
                        return 0;
                    };
                })
                let sum = h.sum().re;
                h = h.etimes(1/sum);
            } 
            return h.round(6);
        } else {
            return this.filterGen(type, size-1, param)
        }
    }

    pascalsCoef(n) {
        let m, coef, value, output;
        m = new MatrixStruc(n+1, n+1, (i, j) => {
            if (i===0 || j===0) {
                return 1;
            } else {
                return 0;
            }
        })

        coef = [];
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= n; j++) {
                if (i > 0 && j > 0) {
                    value = m.content[i][j-1] + m.content[i-1][j];
                    m.content[i][j] = value;
                    if ( (i+j) === n ) {
                        coef.push(value);
                    }
                } else {
                    if ( (i+j) === n ) {
                        coef.push(m.content[i][j])
                    }
                }
                
            }
        }
        
        output = this.matrix(coef);
        return output;
    }   
    // Other Data Types
    complex(re, im) {
        let output;
        if (arguments.length === 0) {
            output = new ComplexNumber(0, 0);
        } else if (arguments.length === 1) {
            if (typeof(re) === "number") {
                output = new ComplexNumber(re, 0);
            } else if (re.constructor.name === "ComplexNumber") {
                return re;
            }
        } else if (arguments.length === 2) {
            if ( typeof(re) === "number" && typeof(im) === "number" ) {
                output = new ComplexNumber(re, im);
            } else if (re.constructor.name === "ComplexNumber") {
                return re;
            }
        }
        return output;
    }

    point() {
        let output = new Point(...arguments);
        return output;
    }

    vector() {
        let output = new Vector(...arguments);
        return output;
    }

    realSet() {
        let set = new RealSet()
        return set;
    }

    complexSet() {
        let set = new ComplexSet()
        return set;
    }

    vectorSet() {
        let set = new VectorSet()
        return set;
    }

    pointSet() {
        let set = new PointSet()
        return set;
    }

    // Set Creation
    structuringElement() {
        let a, b, c, d, e, f, g, h, structure, point, R, Rx, Ry, center;
            a = arguments[0]; // type.
            b = arguments[1]; // size.
            c = arguments[2]; // size.
            d = arguments[3]; // 
            e = arguments[4]; // 
            f = arguments[5]; // 
            g = arguments[6]; // 
            h = arguments[7]; // 
        structure = new PointSet();
        switch (a) {
            case "cross":
                R      = Math.floor(b/2);
                center = new Point(R, R);
                for (let i = 0; i < b; i++) {
                    for (let j = 0; j < b; j++) {
                        if ( i === center[0] || j === center[1] ) {
                            point = new Point(i-center[0], j-center[1]);
                            structure.add(point);
                        }
                    }
                }
            break;
            case "disk":
                R      = Math.floor(b/2);
                center = new Point(R, R);
                for (let i = 0; i < b; i++) {
                    for (let j = 0; j < b; j++) {
                        if ( (Math.pow(i-R,2) + Math.pow(j-R,2)) <= Math.pow(R,2) ) {
                            point = new Point(i-R, j-R);
                            structure.add(point);
                        }
                    }
                }
            break;
            case "diamond":
                R      = Math.floor(b/2);
                center = new Point(R, R);
                for (let i = 0; i < b; i++) {
                    for (let j = 0; j < b; j++) {
                        if ( (Math.abs(i-R) + Math.abs(j-R)) <= Math.abs(R) ) {
                            point = new Point(i-R, j-R);
                            structure.add(point);
                        }
                    }
                }
            break;
            case "square":
                R      = Math.floor(b/2);
                center = new Point(R, R);
                for (let i = 0; i < b; i++) {
                    for (let j = 0; j < b; j++) {
                        point = new Point(i-R, j-R);
                        structure.add(point);
                    }
                }
            break;
            case "rectangle":
                Rx      = Math.floor(b/2);
                Ry      = Math.floor(c/2);
                center = new Point(Rx, Ry);
                for (let i = 0; i < b; i++) {
                    for (let j = 0; j < c; j++) {
                        point = new Point(i-Rx, j-Ry);
                        structure.add(point);
                    }
                }
            break;
        }

        return structure;
    }

    // Engine Methods:
    step({operation , args, components}) {
        let path    = this.path;
        let message = (args) ? { operation: operation , opArgs: args } : { operation: operation };
        if ( typeof(components) === "number" || Array.isArray(components) ) { message.components = components };
        return function (matrixData) {  
            let worker, promise, Mops;
            Mops         = new MatrixOperations();
            message.data = matrixData;
            worker       = new Worker( path + 'Engine.js'); 
            promise      = new Promise( ( resolve ) => {
                    worker.postMessage(message); 
                    worker.onmessage = function (ev) {
                        for (let i = 0; i < ev.data.length; i++) {
                            ev.data[i].__proto__ = Mops;
                        }
                        resolve(ev.data);
                        worker.terminate()
                    }
                }
            )
            return promise;
        }
    }

    run(ops) {
        let path = this.path;
        return function (data) { 
            let message, worker, promise, Mops;  
            message      = ( ops[0].args ) ? { operation: ops[0].operation, opArgs: ops[0].args } : { operation: ops[0].operation };
            if ( typeof(ops[0].components) === "number" || Array.isArray(ops[0].components) ) { message.components = ops[0].components };
            message.data = data;
            worker   = new Worker( path + 'Engine.js' ); 
            promise  = new Promise( ( resolve ) => {
                    worker.postMessage(message); 
                    worker.onmessage = function (ev) {
                        for (let i = 0; i < ev.data.length; i++) {
                            ev.data[i].__proto__ = Mops;
                        }
                        resolve(ev.data);
                        worker.terminate();
                     }
                }
            )
            for (let i = 1; i < ops.length; i++) { 
                promise = promise.then(
                    (data) => {
                        let message, worker, promise;
                        message         = ( ops[i].args ) ? { operation: ops[i].operation, opArgs: ops[i].args } : { operation: ops[i].operation };
                        if ( typeof(ops[i].components) === "number" || Array.isArray(ops[i].components) ) { message.components = ops[i].components };
                        message.data    = data;
                        worker          = new Worker( path + 'Engine.js' );
                        promise         = new Promise((resolve) => {
                            worker.postMessage( message );
                            worker.onmessage = function (ev) {
                                for (let i = 0; i < ev.data.length; i++) {
                                    ev.data[i].__proto__ = Mops;
                                }
                                resolve(ev.data);
                                worker.terminate();
                            }
                        })
                        return promise;
                    }
                )
            }
            return promise;
        }
    }  

    readImageGPU(link, compnts = "rgb") {
        let createShader = function(gl, type, source) {
            let shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
              return shader;
            }
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
        
        let createProgram = function(gl, vertexShader, fragmentShader) {
            let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            let success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {
              return program;
            }
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }

        let promise      = new Promise( (resolve) => {
            let image = new Image();
            image.src = link;
            image.onload = () => {
                resolve(image);      
            }
        } ); 

        let components = componentsCombination(compnts);
        
        promise = promise.then( (image) => {
            let canvas          = document.createElement("canvas");
            canvas.width        = image.width; 
            canvas.height       = image.height; 
            canvas.style.width  = image.width; 
            canvas.style.height = image.height; 
            let gl              = canvas.getContext("webgl");

            let vertexShaderText = `
                attribute vec4 a_xyPosition;
                attribute vec2 a_xyColor;
            
                // fragment shader varyings
                varying   vec2 v_xyColor;
    
                void main() {
                    gl_Position = a_xyPosition;
                    v_xyColor   = a_xyColor;
                }
            `
            let fragmentShaderText = `
                precision mediump float;
            
                // vertex shader varyings
                varying vec2 v_xyColor;
    
                // sampler2D uniform
                uniform sampler2D u_image;
        
                void main() {    
                    gl_FragColor = vec4(texture2D(u_image, v_xyColor).${components}, 1.0) ;
                }
            `

            let vertexShader   = createShader(gl, gl.VERTEX_SHADER,   vertexShaderText);
            let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
            let program        = createProgram(gl, vertexShader, fragmentShader);
                gl.useProgram(program);
            

            // triangles xy
            let corners        = [ -1, -1,       1, -1,      1, 1,       1,  1,      -1, 1,      -1, -1 ];
            let cornersBuffer  = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cornersBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
            // texture xy
            let pixels         = [ 0, 0,      1, 0,       1, 1,       1, 1,       0, 1,       0, 0 ];
            let pixelsBuffer   = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, pixelsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pixels), gl.STATIC_DRAW);
            // getting attributes locations and enabling them
            let a_xyPositionLocation = gl.getAttribLocation(program, "a_xyPosition");
            gl.enableVertexAttribArray(a_xyPositionLocation);
            let a_xyColorLocation = gl.getAttribLocation(program, "a_xyColor");
            gl.enableVertexAttribArray(a_xyColorLocation);
            // 2 components per iteration, the data is 32bit floats, don't normalize the data, 0 = move forward size * sizeof(type) each iteration to get the next position, start at the beginning of the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, cornersBuffer);
            gl.vertexAttribPointer( a_xyPositionLocation, 2, gl.FLOAT, false, 0, 0 )
            gl.bindBuffer(gl.ARRAY_BUFFER, pixelsBuffer);
            gl.vertexAttribPointer(a_xyColorLocation, 2, gl.FLOAT, false, 0, 0);
            // setting the webgl view port and clearing the canvas then using the created program
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            // creating a texture and loading the image
            let textureImage = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, textureImage);
            //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            // setting interpolation parameters
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            // primitive type, offset, count
            gl.drawArrays(gl.TRIANGLES, 0, corners.length/2);
            let imageDt = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
                gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, imageDt);
            
            let index;
            let r = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                index = (i * gl.drawingBufferWidth + j) * 4;
                return imageDt[index+0];
            })
            
            let g = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                index = (i * gl.drawingBufferWidth + j) * 4;
                return imageDt[index+1];
            })
            
            let b = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                index = (i * gl.drawingBufferWidth + j) * 4;
                return imageDt[index+2];
            })
            
            let a = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                index = (i * gl.drawingBufferWidth + j) * 4;
                return imageDt[index+3];
            })
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteProgram(program);
            return [r, g, b, a];

        } );

        return promise;
    }

    filter2dGPU(filter, compnts = "rgb") {
        let createShader = function(gl, type, source) {
            let shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
              return shader;
            }
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
        
        let createProgram = function(gl, vertexShader, fragmentShader) {
            let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            let success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {
              return program;
            }
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }

        let kernel        = filter.transpose().serialize().mArray();
        let kernelcenteri = Math.floor(filter.nR/2);
        let kernelcenterj = Math.floor(filter.nC/2);
        let kernelsize   = kernel.length;

        let Li, Ui, Lj, Uj;
        if (filter.nR > 1) {
            if (filter.nR%2 === 1) {
                Li =  -kernelcenteri;
                Ui =   kernelcenteri;
            } else {
                Li = -(kernelcenteri - 1);
                Ui =   kernelcenteri;
            }
        } else {
            Li = 0;
            Ui = 0;
        }
        
        if(filter.nC > 1) {
            if (filter.nC%2 === 1) {
                Lj = -kernelcenterj;
                Uj =  kernelcenterj;
            } else {
                Lj = -(kernelcenterj - 1);
                Uj = kernelcenterj;
            }
        } else {
            Lj = 0; 
            Uj = 0;
        }

        return function(matrixArray) {
            let promise      = new Promise( (resolve) => {
                let index;
                let image = new ImageData( matrixArray[0].nC, matrixArray[0].nR );
                for (let i = 0; i < matrixArray[0].nR; i++) {
                    for (let j = 0; j < matrixArray[0].nC; j++) {                        
                        index = (i * matrixArray[0].nC + j) * 4;
                        for (let l = 0; l < 4; l++) {
                            image.data[index+l] = matrixArray[l].content[i][j];
                        }    
                    }
                }
                resolve(image);
            });   
            let components = componentsCombination(compnts);
            promise = promise.then( (image) => {
                console.log( "The '" + "filter2dGPU" + "' process has started ...")
                let canvas          = document.createElement("canvas");
                canvas.width        = image.width; 
                canvas.height       = image.height; 
                canvas.style.width  = image.width; 
                canvas.style.height = image.height; 
                let gl              = canvas.getContext("webgl");

                let vertexShaderText = `
                    attribute vec4 a_xyPosition;
                    attribute vec2 a_xyColor;
                    // fragment shader varyings
                    varying   vec2 v_xyColor;
                    void main() {
                        gl_Position = a_xyPosition;
                        v_xyColor   = a_xyColor;
                    }
                `  

                let fragmentShaderText = `
                    precision mediump float;
                    // vertex shader varyings
                    varying vec2 v_xyColor;
                    // sampler2D uniform
                    uniform sampler2D u_image;
                    // uniforms
                    uniform vec2      u_dimentions;
                    uniform float     u_kernel[${kernelsize}];
                    // internal variables
                    vec2 onePixel; 
                    vec4 colorSum; 
                    void main() {
                        onePixel = vec2(1.0, 1.0) / u_dimentions;
                        colorSum = vec4(0, 0, 0, 0);
                        for(int i=${Li}; i<=${Ui}; ++i) {
                            for(int j=${Lj}; j<=${Uj}; j++){
                                colorSum = colorSum + texture2D(u_image, v_xyColor + onePixel * vec2(i, j)) * u_kernel[ (i+1) * 3 + (j+1) ];
                            }
                        }
                        gl_FragColor = vec4(colorSum.${components}, 1.0);
                    }
                `

                let vertexShader   = createShader(gl, gl.VERTEX_SHADER,   vertexShaderText);
                let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
                let program        = createProgram(gl, vertexShader, fragmentShader);
                    gl.useProgram(program);
                // triangles xy
                let corners        = [ -1, -1,       1, -1,      1, 1,       1,  1,      -1, 1,      -1, -1 ];
                let cornersBuffer  = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cornersBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
                // texture xy
                let pixels         = [ 0, 0,      1, 0,       1, 1,       1, 1,       0, 1,       0, 0 ];
                let pixelsBuffer   = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, pixelsBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pixels), gl.STATIC_DRAW);
                // getting attributes locations and enabling them
                let a_xyPositionLocation = gl.getAttribLocation(program, "a_xyPosition");
                gl.enableVertexAttribArray(a_xyPositionLocation);
                let a_xyColorLocation = gl.getAttribLocation(program, "a_xyColor");
                gl.enableVertexAttribArray(a_xyColorLocation);
                // 2 components per iteration, the data is 32bit floats, don't normalize the data, 0 = move forward size * sizeof(type) each iteration to get the next position, start at the beginning of the buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, cornersBuffer);
                gl.vertexAttribPointer( a_xyPositionLocation, 2, gl.FLOAT, false, 0, 0 )
                gl.bindBuffer(gl.ARRAY_BUFFER, pixelsBuffer);
                gl.vertexAttribPointer(a_xyColorLocation, 2, gl.FLOAT, false, 0, 0);
                // getting uniforms locations
                let u_kernelLocation          = gl.getUniformLocation(program, "u_kernel[0]");
                let u_imageDimentionsLocation = gl.getUniformLocation(program, "u_dimentions");
                // uniform charging
                gl.uniform1fv(u_kernelLocation, kernel);
                gl.uniform2f(u_imageDimentionsLocation, image.width-1, image.height-1);
                // setting the webgl view port and clearing the canvas then using the created program
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                // creating a texture and loading the image
                let textureImage = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, textureImage);
                //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                // setting interpolation parameters
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                // primitive type, offset, count
                gl.drawArrays(gl.TRIANGLES, 0, corners.length/2);
                
                let imageDt = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
                    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, imageDt);
                
                let index;
                let r = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+0];
                })
                
                let g = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+1];
                })
                
                let b = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+2];
                })
                
                let a = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+3];
                })
    
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                gl.deleteProgram(program);
                console.log( "The '" + "filter2dGPU" + "' process has ended")
                return [r, g, b, a];
            })
            return promise;
        }
    }

    medFilter2dGPU(compnts = "rgb") {

        let createShader = function(gl, type, source) {
            let shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
              return shader;
            }
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
        
        let createProgram = function(gl, vertexShader, fragmentShader) {
            let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            let success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {
              return program;
            }
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }

        return function(matrixArray) {
            let promise, components;
            promise      = new Promise( (resolve) => {
                let index;
                let image = new ImageData( matrixArray[0].nC, matrixArray[0].nR );
                for (let i = 0; i < matrixArray[0].nR; i++) {
                    for (let j = 0; j < matrixArray[0].nC; j++) {                        
                        index = (i * matrixArray[0].nC + j) * 4;
                        for (let l = 0; l < 4; l++) {
                            image.data[index+l] = matrixArray[l].content[i][j];
                        }    
                    }
                }
                resolve(image);
            });  
            components = componentsCombination(compnts);
            promise = promise.then( (image) => {
                console.log( "The '" + "medFilter2dGPU" + "' process has started ...")
                let canvas          = document.createElement("canvas");
                canvas.width        = image.width; 
                canvas.height       = image.height; 
                canvas.style.width  = image.width; 
                canvas.style.height = image.height; 
                let gl              = canvas.getContext("webgl");
                let vertexShaderText = `
                    attribute vec4 a_xyPosition;
                    attribute vec2 a_xyColor;
                
                    // fragment shader varyings
                    varying   vec2 v_xyColor;
        
                    void main() {
                        gl_Position = a_xyPosition;
                        v_xyColor   = a_xyColor;
                    }
                `    
                let fragmentShaderText = `
                    precision mediump float;
                    // vertex shader varyings
                    varying vec2 v_xyColor;
                    // sampler2D 
                    uniform sampler2D u_image;
                    uniform vec2  u_dimentions;
                    // internal variables
                    vec2 onePixel; 
                    int  index;
            
                    vec4 median(vec4 c1, vec4 c2, vec4 c3) { 
                        vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
                        for (int k = 0; k < 3; k++) {
                            if (c1[k] >= c2[k] && c1[k] >= c3[k]) {
                                if (c2[k] >= c3[k]) {
                                    color[k] = c2[k];
                                } else {
                                    color[k] = c3[k];
                                }
                            } else if (c2[k] >= c1[k] && c2[k] >= c3[k]) {
                                if (c1[k] >= c3[k]) {
                                    color[k] = c1[k];
                                } else {
                                    color[k] = c3[k];
                                }
                            } else if (c3[k] >= c1[k] && c3[k] >= c2[k]) {
                                if (c1[k] >= c2[k]) {
                                    color[k] = c1[k];
                                } else {
                                    color[k] = c2[k];
                                }
                            }                          
                        };
                        return color;
                    }

                    vec4 c1;
                    vec4 c2;
                    vec4 c3;
                    vec4 med0;
                    vec4 med1;
                    vec4 med2;
                    vec4 med;
                    void main() {    
                        onePixel = vec2(1.0, 1.0) / u_dimentions;
                        c1 = texture2D(u_image, v_xyColor + onePixel * vec2(-1, -1));
                        c2 = texture2D(u_image, v_xyColor + onePixel * vec2( 0, -1));
                        c3 = texture2D(u_image, v_xyColor + onePixel * vec2(+1, -1));
                        med0 = median(c1, c2, c3);
                        c1 = texture2D(u_image, v_xyColor + onePixel * vec2(-1,  0));
                        c2 = texture2D(u_image, v_xyColor + onePixel * vec2( 0,  0));
                        c3 = texture2D(u_image, v_xyColor + onePixel * vec2(+1,  0));
                        med1 = median(c1, c2, c3);
                        c1 = texture2D(u_image, v_xyColor + onePixel * vec2(-1,  1));
                        c2 = texture2D(u_image, v_xyColor + onePixel * vec2( 0,  1));
                        c3 = texture2D(u_image, v_xyColor + onePixel * vec2(+1,  1));
                        med2 = median(c1, c2, c3);

                        gl_FragColor = median(med0, med1, med2).${components}a;
                    }
                `
                let vertexShader   = createShader(gl, gl.VERTEX_SHADER,   vertexShaderText);
                let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
                let program        = createProgram(gl, vertexShader, fragmentShader);
                    gl.useProgram(program);
                // triangles xy
                let corners        = [ -1, -1,       1, -1,      1, 1,       1,  1,      -1, 1,      -1, -1 ];
                let cornersBuffer  = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cornersBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
                // texture xy
                let pixels         = [ 0, 0,      1, 0,       1, 1,       1, 1,       0, 1,       0, 0 ];
                let pixelsBuffer   = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, pixelsBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pixels), gl.STATIC_DRAW);
                // getting attributes locations and enabling them
                let a_xyPositionLocation = gl.getAttribLocation(program, "a_xyPosition");
                gl.enableVertexAttribArray(a_xyPositionLocation);
                let a_xyColorLocation = gl.getAttribLocation(program, "a_xyColor");
                gl.enableVertexAttribArray(a_xyColorLocation);
                // 2 components per iteration, the data is 32bit floats, don't normalize the data, 0 = move forward size * sizeof(type) each iteration to get the next position, start at the beginning of the buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, cornersBuffer);
                gl.vertexAttribPointer( a_xyPositionLocation, 2, gl.FLOAT, false, 0, 0 )
                gl.bindBuffer(gl.ARRAY_BUFFER, pixelsBuffer);
                gl.vertexAttribPointer(a_xyColorLocation, 2, gl.FLOAT, false, 0, 0);
                // getting uniforms locations
                let u_imageDimentionsLocation = gl.getUniformLocation(program, "u_dimentions");
                // uniform charging
                gl.uniform2f(u_imageDimentionsLocation, image.width-1, image.height-1);
                // setting the webgl view port and clearing the canvas then using the created program
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                // creating a texture and loading the image
                let textureImage = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, textureImage);
                //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                // setting interpolation parameters
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                // primitive type, offset, count
                gl.drawArrays(gl.TRIANGLES, 0, corners.length/2);
                
                let imageDt = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
                    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, imageDt);
                
                let index;
                let r = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+0];
                })
                
                let g = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+1];
                })
                
                let b = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+2];
                })
                
                let a = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+3];
                })
    
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                gl.deleteProgram(program);
                console.log( "The '" + "medFilter2dGPU" + "' process has ended")
                return [r, g, b, a];
            })
            return promise;
        }
    }

    gammaCorrectionGPU(y = {r: 1, g: 1, b: 1}, compnts = "rgb") {
        let createShader = function(gl, type, source) {
            let shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
              return shader;
            }
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
        
        let createProgram = function(gl, vertexShader, fragmentShader) {
            let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            let success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {
              return program;
            }
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }

        let gamma;
        if (y !== undefined) {
            if (typeof(y) === "object") {
                gamma = {r: 1, g: 1, b: 1};
                if (y.r !== undefined) {
                    gamma.r = y.r;
                } else {
                    gamma.r = 1;
                }
                if (y.g !== undefined) {
                    gamma.g = y.g;
                } else {
                    gamma.g = 1;
                }
                if (y.b !== undefined) {
                    gamma.b = y.b;
                } else {
                    gamma.b = 1;
                }
            } else if (typeof(y) === "number") {
                gamma = {r: y, g: y, b: y};
            }
        } else {
            gamma = {r: 1, g: 1, b: 1};
        }

    

        return function(matrixArray) {
            let promise, components;
            promise      = new Promise( (resolve) => {
                let index;
                let image = new ImageData( matrixArray[0].nC, matrixArray[0].nR );
                for (let i = 0; i < matrixArray[0].nR; i++) {
                    for (let j = 0; j < matrixArray[0].nC; j++) {                        
                        index = (i * matrixArray[0].nC + j) * 4;
                        for (let l = 0; l < 4; l++) {
                            image.data[index+l] = matrixArray[l].content[i][j];
                        }    
                    }
                }
                resolve(image);
            });  
            components = componentsCombination(compnts);
            promise = promise.then( (image) => {
                console.log( "The '" + "medFilter2dGPU" + "' process has started ...")
                let canvas          = document.createElement("canvas");
                canvas.width        = image.width; 
                canvas.height       = image.height; 
                canvas.style.width  = image.width; 
                canvas.style.height = image.height; 
                let gl              = canvas.getContext("webgl");
                let vertexShaderText = `
                    attribute vec4 a_xyPosition;
                    attribute vec2 a_xyColor;
                
                    // fragment shader varyings
                    varying   vec2 v_xyColor;
        
                    void main() {
                        gl_Position = a_xyPosition;
                        v_xyColor   = a_xyColor;
                    }
                `    
                let fragmentShaderText = `
                    precision mediump float;
                    // vertex shader varyings
                    varying vec2 v_xyColor;
                    // sampler2D 
                    uniform sampler2D u_image;
                    uniform float gammaR;
                    uniform float gammaG;
                    uniform float gammaB;
                    // internals
                    vec4 color;
                    void main() {    
                        color        = texture2D(u_image, v_xyColor);
                        color[0]     = pow( color[0] , gammaR);
                        color[1]     = pow( color[1] , gammaG);
                        color[2]     = pow( color[2] , gammaB);
                        gl_FragColor = color.${components}a;
                    }
                `
                
                let vertexShader   = createShader(gl, gl.VERTEX_SHADER,   vertexShaderText);
                let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
                let program        = createProgram(gl, vertexShader, fragmentShader);
                gl.useProgram(program);

                // triangles xy
                let corners        = [ -1, -1,       1, -1,      1, 1,       1,  1,      -1, 1,      -1, -1 ];
                let cornersBuffer  = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cornersBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
                // texture xy
                let pixels         = [ 0, 0,      1, 0,       1, 1,       1, 1,       0, 1,       0, 0 ];
                let pixelsBuffer   = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, pixelsBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pixels), gl.STATIC_DRAW);
                // getting attributes locations and enabling them
                let a_xyPositionLocation = gl.getAttribLocation(program, "a_xyPosition");
                gl.enableVertexAttribArray(a_xyPositionLocation);
                let a_xyColorLocation = gl.getAttribLocation(program, "a_xyColor");
                gl.enableVertexAttribArray(a_xyColorLocation);
                
                // 2 components per iteration, the data is 32bit floats, don't normalize the data, 0 = move forward size * sizeof(type) each iteration to get the next position, start at the beginning of the buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, cornersBuffer);
                gl.vertexAttribPointer( a_xyPositionLocation, 2, gl.FLOAT, false, 0, 0 )
                gl.bindBuffer(gl.ARRAY_BUFFER, pixelsBuffer);
                gl.vertexAttribPointer(a_xyColorLocation, 2, gl.FLOAT, false, 0, 0);

                // getting uniforms locations
                let u_gammaRLocation = gl.getUniformLocation(program, "gammaR");
                gl.uniform1f(u_gammaRLocation, gamma.r);
                let u_gammaGLocation = gl.getUniformLocation(program, "gammaG");
                gl.uniform1f(u_gammaGLocation, gamma.g);
                let u_gammaBLocation = gl.getUniformLocation(program, "gammaB");
                gl.uniform1f(u_gammaBLocation, gamma.b);
                
                
                // setting the webgl view port and clearing the canvas then using the created program
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                
                // creating a texture and loading the image
                let textureImage = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, textureImage);
                //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                // setting interpolation parameters
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                // primitive type, offset, count
                gl.drawArrays(gl.TRIANGLES, 0, corners.length/2);
                
                let imageDt = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
                    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, imageDt);
                
                let index;
                let r = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+0];
                })
                
                let g = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+1];
                })
                
                let b = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+2];
                })
                
                let a = new MatrixStruc( gl.drawingBufferHeight, gl.drawingBufferWidth, (i, j) => {
                    index = (i * gl.drawingBufferWidth + j) * 4;
                    return imageDt[index+3];
                })
    
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                gl.deleteProgram(program);
                console.log( "The '" + "medFilter2dGPU" + "' process has ended")
                return [r, g, b, a];
            })
            return promise;
        }
    }
}

class ComplexOperations {
    isNull() {
        let output = false;
        if (this.re === 0 && this.im === 0) {
            output = true;
        }
        return output;
    }

    equals(nbr) {
        let output = false;
        if (typeof(nbr) === "number" && this.im === 0) {
            output = (this.re === nbr) ? true : false ;
        } else if ( nbr.re !== undefined && nbr.im !== undefined && this.re === nbr.re && this.im === nbr.im ) {
            output = true ;
        }
        return output;
    }

    isReal() {
        if (this.im === 0) {
            return true;
        }
    }

    isImaginary() {
        if (this.re === 0 && this.im !== 0) {
            return true;
        }
    }

    round(precis = 4) {
        let precision = Math.pow(10, Math.round(precis));
        let output    = complex(this.re, this.im);
        output.re = Math.round(output.re * precision) / precision;
        output.im = Math.round(output.im * precision) / precision;
        return output;   
    }

    plus(nbr) {
        let output = new ComplexNumber();
        if ( typeof(nbr) === "number" ) {
            output.re = this.re + nbr;
        } else if ( (nbr.re !== undefined && nbr.im !== undefined) ) {
            output.re = this.re + nbr.re;
            output.im = this.im + nbr.im;
        }
        return output;
    }

    minus(nbr) {
        let output = new ComplexNumber();
        if (typeof(nbr) === "number") {
            output.re = this.re - nbr;
        } else if (nbr.re !== undefined && nbr.im !== undefined) {
            output.re = this.re - nbr.re;
            output.im = this.im - nbr.im;
        }
        return output;
    }

    times(nbr, precis = 10) {
        let precision = Math.pow(10, Math.round(precis));
        let output = new ComplexNumber();
        if (typeof(nbr) === "number") {
            output.re = nbr * this.re;
            output.im = nbr * this.im;
        } else if (nbr.re !== undefined && nbr.im !== undefined) {
            output.re = this.re * nbr.re - this.im * nbr.im;
            output.im = this.re * nbr.im + this.im * nbr.re;
        }
        output.re = Math.round(output.re * precision) / precision;
        output.im = Math.round(output.im * precision) / precision;
        return output;
    }

    pow(exponent, precis = 10) {
        let precision = Math.pow(10, Math.round(precis));
        let output = new ComplexNumber(1, 0);
        if (exponent > 0) {
            let j = 1;
            while (j <= exponent) {
                output = output.times(this);
                j++;
            }
            output;
        } else if (exponent === 0) {
            output;
        }
        output.re = Math.round(output.re * precision) / precision;
        output.im = Math.round(output.im * precision) / precision;
        return output;
    }

    invert(precis = 10) {
        let precision = Math.pow(10, Math.round(precis));;
        let output = new ComplexNumber();
        if ( this.re !== 0 && this.im !== 0 ) {
            output.re =   ( this.re / (Math.pow(this.re, 2) + Math.pow(this.im, 2)) );
            output.im = - ( this.im / (Math.pow(this.re, 2) + Math.pow(this.im, 2)) );
            output.re = Math.round(output.re * precision) / precision;
            output.im = Math.round(output.im * precision) / precision;
            return output;
        } else {
            return undefined;
        }
    }

    conjugate() {
        let output = new ComplexNumber(0, 0);
        output.re =  this.re;
        output.im = -this.im;
        return output;
    }
    
    over(nbr, precis = 10) {
        let precision = Math.pow(10, Math.round(precis));
        let output = new ComplexNumber(0, 0);
        if (typeof(nbr) === "number") {
            if (nbr !== 0) {
                output.re = this.re / nbr;
                output.im = this.im / nbr;
            }
        } else if (nbr.re !== undefined && nbr.im !== undefined) {
            if (!nbr.isNull()) {
                output = this.times(nbr.conjugate()).times(complex(1/(Math.pow(nbr.re, 2)+Math.pow(nbr.im, 2))));
            }
        }
        output.re = Math.round(output.re * precision) / precision;
        output.im = Math.round(output.im * precision) / precision;
        return output;
    }

    amplitude(precis = 10) {
        let precision; let output;
        precision = Math.pow(10, Math.round(precis));
        output    = Math.sqrt( Math.pow(this.re, 2) + Math.pow(this.im, 2) );
        output    = Math.round(output * precision) / precision;
        return output;
    }

    phase(unit = "rad", precis = 10) {
        let precision; let output;
        precision = Math.pow(10, Math.round(precis));
        if (this.re !== 0) {
            if (unit === "rad") {
                output = Math.atan(this.im/this.re)
            } else if (unit === "deg") {
                output = radToDeg(Math.atan(this.im/this.re));
            }
        } else if (this.re === 0) {
            if (unit === "rad") {
                output = (this.im > 0) ? Math.PI/2 : -(Math.PI/2);
            } else if (unit === "deg") {
                output = (this.im > 0) ? Math.PI/2 : -(Math.PI/2);
                output = radToDeg(output);
            }
        } else if (this.re === 0 && this.im === 0) {
            output = 0;
        }

        output    = Math.round(output * precision) / precision;
        return output;
    }

    roots(n = 2, precis = 10) {
        if (typeof(n) === "number" && typeof(precis) === "number" && (n > 1) && ((n - Math.floor(n)) === 0)) {
            let re; let im; let root;
            let precision = Math.pow(10, Math.round(precis));
            let roots = new MatrixStruc(n, 1, 0);
            let rn = Math.pow(this.amplitude() , 1 / n );
            let x  = this.phase();
            for (let k = 0; k < n; k++) {
                re       = rn * Math.cos( (x+2*Math.PI*k)/n );
                im       = rn * Math.sin( (x+2*Math.PI*k)/n );
                root     = complex( (Math.round(re*precision)/precision) , (Math.round(im*precision)/precision));
                roots.data(k, 0, root);
            }
            return roots;
        }
    }

    print() {
        let re = this.re;
        let im = this.im;
        let output;
        if (re !== 0 && im !== 0) {
            if (im === 1) {
                output = re.toString() + "+i";
            } else if (im === -1) {
                output = re.toString() + "-i";
            } else {
                if (im > 0 && im !== 1) {
                    output = re.toString() + "+" + im.toString() + "i" + "";
                } else if (im < 0 && im !== -1) {
                    output = re.toString() + "-" + -im.toString() + "i" + "";
                }
            }
        } else if (re !== 0 && im === 0) {
            output = re.toString();
        } else if (re === 0 && im !== 0) {
            if (im === 1) {
                output = "i";
            } else {
                if (im > 0) {
                    output = im.toString() + "i";
                } else if (im < 0) {
                    output = "-" + -im.toString() + "" + "i";
                }
                
            }
        } else if (re === 0 && im === 0) {
            output = "0";
        }
        return output;
    }
}

class MatrixOperations {  
    // *
    forEach( callback, thisArg ) {
        let value, position, matrix;
        for (let i = 0; i < this.nR; i++) {
            for (let j = 0; j < this.nC; j++) {
                value = this.content[i][j];
                position = {i, j};
                matrix = this;
                callback.apply( thisArg, [value, position, matrix])
            }
        }
        return this;
    }

    mArray() {
        let output = [];
        if (this.nR === 1) {
            for (let j = 0; j < this.nC; j++) {
                output.push( this.content[0][j] )
            }
        } else if ( this.nR > 1 ) {
            for (let i = 0; i < this.nR; i++) {
                output.push([]);
                for (let j = 0; j < this.nC; j++) {
                    output[i].push( this.content[i][j] )
                }
            } 
        }

        return output;
    }

    print(type = "javascript") {
        let output;
        if (type === "javascript") {
            output = "[\n";
            for (let i = 0; i < this.nR; i++) {
                output = output + "[ ";
                for (let j = 0; j < this.nC; j++) {
                    if ( j < this.nC - 1) {
                        if ( typeof(this.content[i][j]) === "number" ) {
                            output =  output + this.content[i][j].toString()  + ", "  ;
                        } else if ( this.content[i][j].re !== undefined && this.content[i][j].im !== undefined ) {
                            output =  output + "'" + this.content[i][j].print() + "'"  + ", " ;
                        }
                    } else {
                        if ( typeof(this.content[i][j]) === "number" ) {
                            output =  output + this.content[i][j].toString()  ;
                        } else if ( this.content[i][j].re !== undefined && this.content[i][j].im !== undefined ) {
                            output =  output + "'" + this.content[i][j].print() + "'" ;
                        }
                    }
                }
                output = output + " ],\n";
            }  
            output = output + "]"
        } else if (type === "matlab") {
            output = "[\n";
            for (let i = 0; i < this.nR; i++) {
                for (let j = 0; j < this.nC; j++) {
                    if ( typeof(this.content[i][j]) === "number" ) {
                        output =  output + " " + this.content[i][j].toString();
                    } else if ( this.content[i][j].re !== undefined && this.content[i][j].im !== undefined ) {
                        output =  output + " " + this.content[i][j].print();
                    }
                }
                output = output + ";\n";
            }   
            output = output + "]"
        }
        return output;
    }

    size() {
        return {nR: this.nR, nC: this.nC};
    }
    
    data(i, j, v) {
        if (arguments.length === 0) {
            let dClone  = {};
            for (let i = 0; i < this.nR; i++) {
                dClone[i] = {};
                for (let j = 0; j < this.nC; j++) {
                    dClone[i][j] = this.content[i][j];
                }
            }
            return dClone;
        } else if (arguments.length === 2) {  
            if (typeof(i) === "number" && typeof(j) === "number") {
                if (i < this.nR && j < this.nC && i >= 0 && j >= 0) {
                    return this.content[i][j];
                } else {
                    console.log("index i or j is out of range: i = " + i + " j = " + j)
                }
            }
        } else if (arguments.length === 3) {
            if (typeof(i) === "number" && typeof(j) === "number") {
                if (i < this.nR && j < this.nC && i >= 0 && j >= 0) {
                    if (typeof(v) === "number") {
                        this.content[i][j] = v;
                    } else if (v.re !== undefined && v.im !== undefined) {
                        v = new ComplexNumber(v.re, v.im);
                        if (v.isReal()) {
                            this.content[i][j] = v.re;
                        } else {
                            this.content[i][j] = v;
                        }
                    } else if (typeof(v) === "function") {
                        this.content[i][j] = v(i,j);
                    }
                } else {
                    console.log("index i or j is out of range: i = " + i + " j = " + j);
                }
            }
        }
    }
       
    clone(i = 0, j = 0, sizeX = 1, sizeY = 1) {
        if (arguments.length === 4) {
            if (typeof(i) === "number" && typeof(j) === "number" && typeof(sizeX) === "number" && typeof(sizeY) === "number" ) {
                if (i < 0) { sizeX = ((sizeX+i) > 0 ? (sizeX+i) : 1); i = 0; };
                if (j < 0) { sizeY = ((sizeY+j) > 0 ? (sizeY+j) : 1); j = 0; };
                if ( i < this.nR && j < this.nC ) {
                    let X      = ( (this.nR - i) < sizeX ) ? (this.nR - i) : sizeX;
                    let Y      = ( (this.nC - j) < sizeY ) ? (this.nC - j) : sizeY;
                    let output = new MatrixStruc(X, Y);
                    for (let l = 0; l < X; l++) {
                        for (let k = 0; k < Y; k++) {
                            output.data(l, k, this.data(i+l, j+k));
                        }
                    }
                    return output;
                }
            }
        } else if (arguments.length === 2) {
            let sizeX  = this.nR - i;
            let sizeY  = this.nC - j;
            let output = new MatrixStruc(sizeX, sizeY);
            for (let l = 0; l < sizeX; l++) {
                for (let k = 0; k < sizeY; k++) {
                    output.data(l, k, this.data(i+l, j+k));
                }
            }
            return output;
        } else {
            let i = 0;
            let j = 0;
            let sizeX = this.nR;
            let sizeY = this.nC;
            let output = new MatrixStruc(sizeX, sizeY);
            for (let l = 0; l < sizeX; l++) {
                for (let k = 0; k < sizeY; k++) {
                    output.data(l, k, this.data(i+l, j+k));
                }
            }
            return output;
        }
    }

    serialize() {
        let nR   = this.nR;
        let nC   = this.nC;
        let size = nR * nC;
        let output = new MatrixStruc(1, size, (i,j) => {
            let n = Math.floor(j/nC);
            let k = j%nC;
            return this.data(n, k);
        });
        return output;
    }

    update(input, i = 0, j = 0, sizeX = 1, sizeY = 1) {
        let output = this.clone();       
        if (typeof(input) === "number" || (input.re !== undefined && input.im !== undefined) ) {
            if ( i < output.nR && j < output.nC ) {
                for (let l = i; l < i + sizeX; l++) {
                    for (let k = j; k < j + sizeY; k++) {
                        if ( l >= output.nR || l < 0 || k >= output.nC || k < 0 ) {
                            continue;
                        } else {
                            output.data(l, k, input);
                        }
                    }
                }
            }
        } else if (typeof(input) === "function") {
            if ( i < output.nR && j < output.nC ) {
                for (let l = i; l < i + sizeX; l++) {
                    for (let k = j; k < j + sizeY; k++) {
                        if ( l >= output.nR || l < 0 || k >= output.nC || k < 0 ) {
                            continue;
                        } else {
                            output.data(l, k, input(l, k));
                        }
                    }
                }
            }
        } else if (input.nR) {
            let sizeX = input.nR;
            let sizeY = input.nC;
            input = new MatrixStruc(input.nR, input.nC, (k, l) => {
                return input.content[k][l];
            });
            if ( i < output.nR && j < output.nC ) {
                for (let l = i; l < i + sizeX; l++) {
                    for (let k = j; k < j + sizeY; k++) {
                        if ( l >= output.nR || l < 0 || k >= output.nC || k < 0 ) {
                            continue;
                        } else {
                            output.data(l , k, input.data(l-i, k-j));
                        }
                    }
                }
            }
        }

        return output;
        
    }

    row(i) {
        if (typeof(i) === "number" && (i < this.nR && i >= 0)) {
            let row;
            row = new MatrixStruc(1, this.nC);
            for (let j = 0; j < this.nC; j++) {
                row.data(0,j, this.data(i, j));
            }
            return row;
        }
    }
    
    column(j) {
        if (typeof(j) === "number" && (j < this.nC && j >= 0) ) {
            let column;
            column = new MatrixStruc(this.nR, 1);
            for (let i = 0; i < column.nR; i++) {
                column.data(i, 0, this.data(i, j));
            }
            return column;
        }
    }

    removeRow(i) {
        if (typeof(i) === "number" && (i < this.nR && i >= 0)) {
            let output = new MatrixStruc(this.nR-1, this.nC);
            for (let l = 0; l < this.nR; l++) {
                if (l !== i) {
                    for (let k = 0; k < this.nC; k++) {
                        if (l < i) {
                            output.data(l, k, this.data(l,k));
                        } else {
                            output.data(l-1, k, this.data(l,k));
                        }
                    }
                } else {
                    continue;
                }
            }
            return output;
        }
    }
    
    removeColumn(j) {
        if (typeof(j) === "number" && (j < this.nC && j >= 0)) {
            let output = new MatrixStruc(this.nR, this.nC-1);
            for (let l = 0; l < this.nC; l++) {
                if (l !== j) {
                    for (let k = 0; k < this.nR; k++) {
                        if (l < j) {
                            output.data(k, l, this.data(k, l));
                        } else {
                            output.data(k ,l-1, this.data(k, l));
                        }
                    }
                } else {
                    continue;
                }
            }
            return output;
        }
    }
    
    replaceColumn(j, column) {
        let nR, output;
        if ( column.nC === 1 ) {
            column = new MatrixStruc(column.nR, column.nC, (k, l) => {
                return column.content[k][l];
            })
            nR     = ( this.nR <= column.nR ) ? this.nR : column.nR;
            output = this.clone();
            for (let i = 0; i < nR; i++) {
                output.data(i, j, column.data(i, 0));
            }
        }
        return output;
    }
    
    replaceRow(i, row) {
        let output;
        if ( row.nR === 1 ) {
            row = new MatrixStruc(row.nR, row.nC, (k, l) => {
                return row.content[k][l];
            })
            nC = (this.nC < row.nC ) ? this.nC : row.nC;
            output = this.clone();
            for (let j = 0; j < nC; j++) {
                output.data(i, j, row.data(0, j));
            }
        }
        return output;
    }
    
    transpose() {
        let nR = this.nC;
        let nC = this.nR;
        let output = new MatrixStruc(nR, nC);
        for (let i = 0; i < nR; i++) {
            for (let j = 0; j < nC; j++) {
                output.data(i, j, this.data(j, i));
            }
        }
        return output;
    }
    
    times(m) {
        m = new MatrixStruc(m.nR, m.nC, (k, l) => {
            return m.content[k][l];
        });
        let mdotProduct = function (row, column) {
            let a; let b;
            let value = complex(0, 0);
            let nC = row.nC;
            let nR = column.nR;
            if (nR === nC) {
                for (let i = 0; i < nC; i++) {
                    a = complex(row.data(0, i));
                    b = complex(column.data(i, 0)).conjugate();
                    value = a.times(b).plus(value)
                }
            }
            return value;
        }
        if (this.nC === m.nR) {
            let value;
            let nR     = this.nR;
            let nC     = m.nC;
            let output = new MatrixStruc(nR, nC);
            for (let i = 0; i < nR; i++) {
                for (let j = 0; j < nC; j++) {
                    value = mdotProduct( this.row(i), m.column(j));
                    output.data(i, j, value);
                }
            }
            return output;
        }
    }

    etimes(m) {
        if (m.nR) {
            m = new MatrixStruc(m.nR, m.nC, (k, l) => {
                return m.content[k][l];
            });
            if (this.nR === m.nR && this.nC === m.nC) {
                let value; let a; let b;
                let nR = this.nR;
                let nC = this.nC;
                let output = new MatrixStruc(nR, nC);
                for (let i = 0; i < nR; i++) {
                    for (let j = 0; j < nC; j++) {
                        a = complex(this.data(i, j));
                        b = complex(m.data(i, j));
                        value = a.times(b);
                        output.data(i, j, value);
                    }
                }
                return output;
            }
        } else if ( (typeof(m) === "number" || (m.re !== undefined && m.im !== undefined) ) ) {
            let nR, nC, output, value; let a; let b;
            nR     = this.nR;
            nC     = this.nC;
            output = new MatrixStruc(nR, nC);
            b      = complex(m);
            
            for (let i = 0; i < nR; i++) {
                for (let j = 0; j < nC; j++) {
                    a     = complex( this.data(i, j) );
                    value = a.times(b);
                    output.data(i, j, value);
                }
            }
            return output;
        }
    } 
    
    plus(m) {
        if (m.nR) {
            m = new MatrixStruc(m.nR, m.nC, (k, l) => {
                return m.content[k][l];
            });

            if (this.nR === m.nR && this.nC === m.nC) {
                let value; let a; let b;
                let nR = this.nR;
                let nC = this.nC;
                let output = new MatrixStruc(nR, nC);
                for (let i = 0; i < nR; i++) {
                    for (let j = 0; j < nC; j++) {
                        a = complex(this.data(i, j));
                        b = complex(m.data(i, j));
                        value = a.plus(b);
                        output.data(i, j, value);
                    }
                }
                return output;
            }
        } else if ( (typeof(m) === "number" || (m.re !== undefined && m.im !== undefined) ) ) {
            let value; let a; let b;
            let nR     = this.nR;
            let nC     = this.nC;
            let output = new MatrixStruc(nR, nC);
            for (let i = 0; i < nR; i++) {
                for (let j = 0; j < nC; j++) {
                    a = complex(this.data(i, j));
                    b = complex(m);
                    value = a.plus(b);
                    output.data(i, j, value);
                }
            }
            return output;
        }
    } 

    minus(m) {
        if (m.nR) {
            m = new MatrixStruc(m.nR, m.nC, (k, l) => {
                return m.content[k][l];
            });
            if (this.nR === m.nR && this.nC === m.nC) {
                let value; let a; let b;
                let nR = this.nR;
                let nC = this.nC;
                let output = new MatrixStruc(nR, nC);
                for (let i = 0; i < nR; i++) {
                    for (let j = 0; j < nC; j++) {
                        a = complex(this.data(i, j));
                        b = complex(m.data(i, j));
                        value = a.minus(b);
                        output.data(i, j, value);
                    }
                }
                return output;
            }
        } else if (typeof(m) === "number" || (m.re !== undefined && m.im !== undefined) ) {
            let value, a, b, nR, nC, output;
            nR     = this.nR;
            nC     = this.nC;
            output = new MatrixStruc(nR, nC);
            b      = complex(m);
            for (let i = 0; i < nR; i++) {
                for (let j = 0; j < nC; j++) {
                    a = complex(this.data(i, j));
                    value = a.minus(b);
                    output.data(i, j, value);
                }
            }
            return output;
        }
    } 

    swapCol(k, l) {
        let output = this.clone();
        if ( k !== l ) {
            if (k >= 0 && l >= 0 && k < this.nC && l < this.nC) {
                for (let j = 0; j < this.nC; j++) {
                    if (j === k) {  
                        for (let i = 0; i < this.nR; i++) {
                            output.data(i, k, this.data(i,l));
                        };
                    } else if (j === l) {
                        for  (let i = 0; i < this.nR; i++) {
                            output.data(i,l, this.data(i,k));
                        }; 
                    } else {
                        continue;
                    }
                }
                return output;
            }
        } else {
            return output;
        }
    }

    colSwapZeros() {
        let notFound; let output; let count; let j; let swaps; let maxI;
        output = this.clone();
        count = 0;
        swaps = 0;
        maxI  = (output.nR > output.nC) ? output.nC : output.nR;
        for (let i = 0; i < maxI; i++) {
            if ( complex(output.data(i, i)).isNull() ) {
                j = 0;
                notFound = true;
                count++; 
                while (j < output.nC && notFound) {
                    if ( !complex(output.data(i, j)).isNull() ) {
                        output = output.swapCol(i, j);
                        notFound = false;
                        count--;
                        swaps++;
                    } else {
                        j++;
                    }
                }   
            } else {
                continue;
            }
        }
        return {output: output, zeros: count, swaps: swaps};
    }

    swapRow(k, l) {
        let output = this.clone();
        if ( k !== l ) {
            if (k >= 0 && l >= 0 && k < output.nR && l < output.nR) {
                for (let i = 0; i < output.nR; i++) {
                    if ( i === k ) {
                        for (let j = 0; j < output.nC; j++) {
                            output.data(k,j, this.data(l, j));
                        }
                    } else if (i === l) {
                        for (let j = 0; j < output.nC; j++) {
                            output.data(l,j, this.data(k, j));
                        }
                    } else {
                        continue;
                    }
                }
                return output;
            }
        } else {
            return output;
        }
    }

    rowSwapZeros() {
        let notFound; let output; let count; let i; let swaps; let maxJ;
        output = this.clone();
        count  = 0;
        swaps  = 0;
        maxJ   = (output.nR > output.nC) ? output.nC : output.nR; 
        for (let j = 0; j < maxJ; j++) {  
            if (complex(output.data(j, j)).isNull()) {
                i = 0;
                notFound = true;
                count++;
                while (i < output.nR && notFound) {  
                    if ( !complex(output.data(i, j)).isNull() ) {
                        output = output.swapRow(i, j);
                        notFound = false;
                        count--;
                        swaps++;
                    } else {
                        i++;
                    }
                }
            } else {
                continue;
            }
        }
        return {output: output, zeros: count, swaps: swaps};
    }

    normalize(factor) {
        let value;
        let output = this.clone();
        if (!factor) {
            let factor;
            for (let i = 0; i < output.nR; i++) {
                factor = complex(output.data(i, i));
                if (!factor.isNull()) {
                    for (let j = 0; j < output.nC; j++) {
                        value = complex(output.data(i, j)).over(factor);
                        output.data(i, j, value);
                    }
                }
            }
        } else {
            for (let i = 0; i < output.nR; i++) {
                if ( typeof(factor) === "number" || (factor.re !== undefined && factor.im !== undefined) ) {
                    factor = complex(factor);
                    if (!factor.isNull()) {
                        for (let j = 0; j < output.nC; j++) {
                            value = complex(output.data(i, j)).over(factor);
                            output.data(i, j, value);
                        }
                    }
                }
            }
        }
        return output;
    }
    
    augmentBy(m) {
        if ( m.nR ) {
            m = new MatrixStruc(m.nR, m.nC, (k, l) => {
                return m.content[k][l];
            });
            if (this.nR === m.nR) {
                let output = new MatrixStruc(this.nR, this.nC+m.nC);
                    output = output.update(this, 0, 0);
                    output = output.update(m,   0, this.nC)
                return output;
            }
        }
    }

    reduce(type = "upper", precis = 10) { 
        let precision = Math.pow(10, Math.round(precis));
        if (type === "upper") {
            let value; let a; let b; let pivot; let coef; let interObj;
            let swapCount = 0;
            let output    = this.clone();
            for (let i = 0; i < output.nR-1; i++) {
                if ( complex(output.data(i, i)).isNull() ) {  
                    interObj  = output.colSwapZeros();
                    swapCount = swapCount + interObj.swaps;
                    if (interObj.zeros !== 0) {
                        interObj  = interObj.output.rowSwapZeros();
                        swapCount = swapCount + interObj.swaps;
                        if (output.zeros === 0) {
                            output = interObj.output;
                        }
                    }
                }
                pivot = complex(output.data(i, i));
                for (let k = i+1; k < output.nR; k++) {
                    coef = complex(output.data(k, i));
                    for (let j = 0; j < output.nC; j++) {
                        a     = complex(output.data(k, j));
                        b     = complex(output.data(i, j));
                        value = a.minus( coef.over(pivot).times(b) );
                        value.re = Math.round(value.re * precision) / precision;
                        value.im = Math.round(value.im * precision) / precision;
                        output.data(k, j, value);
                    }
                }
            }
            return {output, swapCount};
        } else if (type === "lower") {
            let value; let a; let b; let pivot; let coef; let interObj;
            let swapCount = 0;
            let output = this.clone()
            for (let i = output.nR - 1; i > 0; i--) {            
                if ( complex(output.data(i, i)).isNull() ) {  
                    interObj  = output.colSwapZeros();
                    swapCount = swapCount + interObj.swaps;
                    if (interObj.zeros !== 0) {
                        interObj  = interObj.output.rowSwapZeros();
                        swapCount = swapCount + interObj.swaps;
                        if (interObj.zeros === 0) {
                            output = interObj.output;
                        }
                    }
                }
                pivot = complex(output.data(i, i));
                for (let k = i-1; k >= 0; k--) {
                    coef = complex(output.data(k, i));
                    for (let j = 0; j < output.nC; j++) {
                        a = complex(output.data(k, j));
                        b = complex(output.data(i, j));
                        value = a.minus( coef.over(pivot).times(b) )
                        value.re = Math.round(value.re * precision) / precision;
                        value.im = Math.round(value.im * precision) / precision;
                        output.data(k, j, value);
                    }
                }
            }
            return {output, swapCount};
        }
    }

    determinant(technique = "GE") {
        if (this.nR === this.nC) {
            let det; let coef;
            if (technique === "Laplace") {
                if (this.nR > 2) {
                    det = complex(0, 0);
                    for (let i = 0; i < this.nR; i++) {
                        if ( complex(this.data(0, i)).isNull() ) {
                            continue;
                        } else {
                            coef = complex(Math.pow(-1, i));
                            det  = det.plus( coef.times(complex(this.data(0, i))).times( this.removeColumn(i).removeRow(0).determinant() ));
                        }
                    }
                    return det;
                } else if (this.nR === 2) {
                    det = complex(0, 0).plus( complex(this.data(0, 0)).times(complex(this.data(1, 1))) ).minus( complex(this.data(1, 0)).times(complex(this.data(0, 1))) );
                    return det;
                } else if (this.nR === 1) {
                    let det = complex(this.data(0, 0));
                    return det;
                }
            } else if (technique === "GE") {
                let det; let Oaug; let output; let swaps; let rem; let sign;
                det    = complex(1, 0);
                Oaug   = this.reduce();
                output = Oaug.output;
                swaps  = Oaug.swapCount;
                rem    = swaps%2;          
                if (rem === 0) {
                    sign = 1;
                } else {
                    sign = -1;
                }

                for (let i = 0; i < this.nR; i++) {
                    det = det.times(complex(output.data(i, i)))
                }
                
                det = complex(det);

                if ( isNaN(det) || (!det.im) ) {
                    det    = complex(1, 0);
                    Oaug   = this.reduce("lower");
                    output = Oaug.output;
                    swaps  = Oaug.swapCount;
                    rem    = swaps%2;   
                    if (rem === 0) {
                        sign = 1;
                    } else {
                        sign = -1;
                    }
                    
                    for (let i = 0; i < this.nR; i++) {
                        det = det.times( complex(output.data(i, i)) )
                    }
                }
                det = det.times(complex(sign));
                return det;
            }
        } else {
            console.log("This is not a square matrix");
        }
    }

    invert() {
        if (this.nR === this.nC) {
            let I; let aug; let Oaug; let output; let solution;
            I        = identity(this.nR);
            aug      = this.augmentBy(I);
            aug      = aug.reduce("upper").output;
            aug      = aug.reduce("lower").output;
            output   = aug.normalize();
            solution = output.clone(0, this.nC, this.nR, this.nR);
            return solution;
        } else {
            console.log("input matrix must be a square matrix");
        }
    }

    sum() {
        let output = complex(0, 0);
        for (let i = 0; i < this.nR; i++) {
            for (let j = 0; j < this.nC; j++) {
                output = output.plus(  complex(this.data(i, j))  )
            }
        }
        return output;
    }

    sumCols() {
        let output; let sum;
        output  = new MatrixStruc(1, this.nC);
        for (let j = 0; j < this.nC; j++) {
            sum = complex(0, 0);
            for (let i = 0; i < this.nR; i++) {
                sum = sum.plus(  complex(this.data(i, j))  )
            }
            output.data(0, j, sum);
        }
        return output;
    }

    sumRows() {
        let output; let sum;
        output  = new MatrixStruc(this.nR, 1);
        for (let i = 0; i < this.nR; i++) {
            sum = complex(0, 0);
            for (let j = 0; j < this.nC; j++) {
                sum = sum.plus(  complex(this.data(i, j))  )
            }
            output.data(i, 0, sum);
        }
        return output;
    }

    solve(y) {
        if (this.nR === y.nR) {
            let aug; let output; let solution;
            aug      = this.augmentBy(y); 
            aug      = aug.reduce("upper").output;
            aug      = aug.reduce("lower").output; 
            output   = aug.normalize();
            solution = output.clone(0, this.nC , y.nR, y.nC )
            return solution;
        }
    }

    amplitude(precis = 10) {
        let output; let amplitude;
        output = new MatrixStruc(this.nR, this.nC); 
        for (let i = 0; i < this.nR; i++) {
            for (let j = 0; j < this.nC; j++) {
                amplitude = complex( this.data(i, j) ).amplitude(precis);
                output.data( i, j, amplitude );
            }
        }
        return output;
    }

    real() {
        let output; let real;
        output = new MatrixStruc(this.nR, this.nC); 
        for (let i = 0; i < this.nR; i++) {
            for (let j = 0; j < this.nC; j++) {
                real = complex(this.data(i, j)).re;
                output.data( i, j, real );
            }
        }
        return output;
    }

    imaginary() {
        let output; let imaginary;
        output = new MatrixStruc(this.nR, this.nC); 
        for (let i = 0; i < this.nR; i++) {
            for (let j = 0; j < this.nC; j++) {
                imaginary = complex(this.data(i, j)).im;
                output.data( i, j, imaginary );
            }
        }
        return output;
    }

    phase(unit = "rad", precis = 10) {
        let output; let angle;
        output = new MatrixStruc(this.nR, this.nC); 
        for (let i = 0; i < this.nR; i++) {
            for (let j = 0; j < this.nC; j++) {
                angle = complex( this.data(i, j) ).phase( unit, precis );
                output.data( i, j, angle );
            }
        }
        return output;
    }

    conjugate() {
        let output;
        output = new MatrixStruc(this.nR, this.nC, (i, j) => {
            return complex(this.data(i, j)).conjugate();
        })
        return output;
    }

    round(precis = 0) {
        let value; let precision; let output;
        if (precis >= 0) {
            precision = Math.pow(10, Math.round(precis));
        }
        output = new MatrixStruc(this.nR, this.nC);
        for (let i = 0; i < this.nR; i++) {
            for (let j = 0; j < this.nC; j++) {
                value = complex(this.data(i, j));
                value.re = Math.round(value.re * precision) / precision;
                value.im = Math.round(value.im * precision) / precision;
                output.data(i, j, value);
            }
        }
        return output;
    }

    minmax(data = "real") {
        let min; let max; let intermediate;   
        if (data === "amplitude") {
            intermediate = this.amplitude();
        } else if (data === "phase") {
            intermediate = this.phase();
        } else if (data === "real") {
            intermediate = this.real();
        } else if (data === "imaginary") {
            intermediate = this.imaginary();
        }

        min = intermediate.data(0, 0);
        max = intermediate.data(0, 0)
        
        for (let i = 0; i < intermediate.nR; i++) {
            for (let j = 0; j < intermediate.nC; j++) {
                min = (min <= intermediate.data(i, j)) ? min : intermediate.data(i,j);
                max = (max >= intermediate.data(i, j)) ? max : intermediate.data(i, j);
            }
        }
        return {min, max};
    }

    hist( data = "real" ) {
        let intermediate, voutput, coutput, output, exist;
            voutput = []; coutput = [];
        if (data === "amplitude") {
            intermediate = this.amplitude();
        } else if (data === "phase") {
            intermediate = this.phase();
        } else if (data === "real") {
            intermediate = this.real();
        } else if (data === "imaginary") {
            intermediate = this.imaginary();
        }

        for (let i = 0; i < intermediate.nR; i++) {
            for (let j = 0; j < intermediate.nC; j++) {
                if (voutput.length > 0) {
                    exist = false;
                    for ( let k = 0; k < voutput.length; k++ ) {
                        if ( intermediate.data(i, j) === voutput[k] ) {
                            coutput[k] = coutput[k] + 1;
                            exist      = true;
                            break
                        }
                    }
                    if (!exist) {
                        voutput.push(intermediate.data(i, j));
                        coutput.push(1);
                    }
                } else {
                    voutput.push(intermediate.data(i, j));
                    coutput.push(1);
                }
            }
        }
        
        output = matrix([
            voutput, 
            coutput
        ]);

        output = output.sortBy(0, "row");
        return output;

    }

    PMF( data = "real" ) {
        let hist  = this.hist(data);
        let count = 0; 
        
        for (let j = 0; j < hist.nC; j++) {
            count = hist.content[1][j] + count;
        }

        let PMF = new MatrixStruc(hist.nR, hist.nC, (i, j) => {
            if (i === 0) {
                return hist.content[0][j];
            } else if ( i === 1) {
                return hist.content[1][j]/count;
            }
        })

        return PMF;
    }

    unique(data = "real") {
        let output = this.hist(data).row(0) ;
        return output;
    }

    CDF( data = "real", precis = 5 ) {
        let total, histo, value, output, precision;
        precision = Math.pow(10, Math.round(precis));
        histo  = this.hist(data);
        total  = histo.row(1).sumRows().data(0, 0);
        output = histo.clone();
        value  = 0;
        for (let q = 0; q < histo.nC; q++) {
            value  = value +  ( histo.data(1, q)/total );
            value  = Math.round(value * precision) / precision;
            output.data(1, q, value);
        }
        return output;
    }

    median() {
        let intermediate, index, uppermedian, lowermedian;
        intermediate = this.serialize();
        intermediate = intermediate.sortBy(0, "row");
        index        = (intermediate.nC-1) / 2;
        uppermedian  = intermediate.data(0, Math.ceil(index));
        lowermedian  = intermediate.data(0, Math.floor(index));
        return ( (uppermedian+lowermedian)/2 )
    }

    sortBy( n = 0, mode = "row" ) {
        let nstages, step, output, result, start, mid, end, L, R, iL, j, k, Lsize, Rsize, index;

        if ( mode === "row" ) {
            if ( typeof(n) === "number" && n < this.nR ) {
                output  = new MatrixStruc(2, this.nC, 0);
                
                for ( let q = 0; q < this.nC ; q++ ) {
                    output.data( 0 , q , q );
                    output.data( 1 , q , this.data( n , q ) );
                }

                nstages = Math.ceil( Math.log2( output.nC ) );
                
                for ( let i = 0; i < nstages; i++) {
                    step = Math.pow( 2 , (i+1) );
                    for ( let m = 0; m < output.nC; m = m + step ) {
                        L     = null; 
                        R     = null;
                        start = m;
                        mid   = (  m + (step/2) );
                        end   = ( (mid+(step/2) ) < output.nC ) ? ( mid + step / 2 ) : output.nC;
                        Lsize = step / 2;
                        Rsize = end - mid;
                        L     = matrix(0, 2, Lsize);

                        for ( let j = m ; j < mid; j++ ) {
                            for ( let o = 0 ; o < output.nR; o++ ) {
                                if ( (j) < output.nC ) {
                                    L.data( o, j-m, output.data( o , j ));
                                }
                            }
                        }

                        if (Rsize > 0) {
                            R = matrix( 0 , 2, Rsize )
                            for ( let j = mid; j < end; j++) {
                                for (let o = 0; o < output.nR; o++) {
                                    if ( j < output.nC ) {
                                        R.data(o, j-mid, output.data(o, j) );
                                    }
                                }
                            }
                        } else {
                            continue;
                        }
                        
                        iL = j = k = 0;
                        while ( iL < L.nC && j < R.nC ) {     
                            if ( L.data(1, iL) < R.data(1, j) ) {
                                for ( let o = 0 ; o < output.nR ; o++ ) {
                                    if ( (m+k) < output.nC ) {
                                        output.data(o, (m+k), L.data(o, iL));
                                    }
                                }
                                iL++;
                            } else {
                                for ( let o = 0 ; o < output.nR ; o++ ) {
                                    if ( (m+k) < output.nC ) {
                                        output.data(o, (m+k), R.data(o, j));
                                    }
                                }
                                j++;
                            }
                            k++;
                        }
                        
                        while ( iL < L.nC ) {
                            for (let o = 0; o < output.nR; o++) {
                                if ( (m+k) < output.nC ) {
                                    output.data(o, m+k, L.data(o, iL));
                                }
                            }
                            iL++;
                            k++;
                        }
                        
                        while ( j < R.nC ) {
                            for (let o = 0; o < output.nR; o++) {
                                if ( (m+k) < output.nC ) {
                                    output.data(o, m+k, R.data(o, j));
                                }
                            }
                            j++;
                            k++;
                        }
                    
                    }
                }
    
                
                result     = new MatrixStruc(this.nR, this.nC);
                for (let q = 0; q < this.nC; q++) {
                    index  = output.data(0, q);
                    result = result.replaceColumn( q,  this.column(index) );
                }
                
                return result;
            }
        }
        if (mode === "col") {
            if ( typeof(n) === "number" && n < this.nR ) {
                output  = this.transpose();
                result  = output.sortBy(n, "row").transpose();
                return result;
            }
        }
    }
    
    printToDOM(querySelector, css) {
        let canvas, ctx, imageData, index, parent;
        canvas              = document.createElement("canvas");
        canvas.style.width  = this.nC;
        canvas.style.height = this.nR;
        canvas.width        = this.nC;
        canvas.height       = this.nR;
        ctx                 = canvas.getContext('2d');
        imageData           = new ImageData(this.nC, this.nR);

        if ( css !== undefined ) {
            if ( typeof(css.id) === "string" ) {
                canvas.id = css.id;
            }
            if ( typeof(css.class) === "string" ) {
                canvas.classList.push(css.class);
            }
        }

        if (querySelector instanceof Element) {
            parent = querySelector;
        } else if ( typeof(querySelector) === "string" ) {
            parent = document.querySelector(querySelector);
        } else if ( querySelector === undefined ) {
            parent = document.body;
        }

        for (let i = 0; i < this.nR; i++) {
            for (let j = 0; j < this.nC; j++) {                        
                index = (i * this.nC + j) * 4;
                for (let l = 0; l < 4; l++) {
                    if (l === 3) {
                        imageData.data[index+l] = 255;
                    } else {
                        imageData.data[index+l] = this.content[i][j];
                    }
                }    
            }
        }

        ctx.putImageData(imageData, 0, 0);
        parent.appendChild(canvas);

        return this;
    } 

    updateCanvas(querySelector) {
        let canvas, ctx, imageData, index;
        if (querySelector instanceof Element) {
            canvas = querySelector;
        } else if ( typeof(querySelector) === "string" ) {
            canvas = document.querySelector(querySelector);
        }

        canvas.style.width  = this.nC;
        canvas.style.height = this.nR;
        canvas.width        = this.nC;
        canvas.height       = this.nR;
        
        ctx                 = canvas.getContext('2d');
        imageData           = new ImageData( this.nC, this.nR );
        for (let i = 0; i < this.nR; i++) {
            for (let j = 0; j < this.nC; j++) {                        
                index = (i * this.nC + j) * 4;
                for (let l = 0; l < 4; l++) {
                    if (l === 3) {
                        imageData.data[index+l] = 255;
                    } else {
                        imageData.data[index+l] = this.content[i][j];
                    }
                }    
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return this;
    }

    evalp(x, output = "array", input = "real") {
        let nR, nC, result, a, b, c, k;
        if (input === "complex") {
            nR     = this.nR;
            nC     = this.nC;
            result = new MatrixStruc(nR, 1);
            for (let i = 0; i < this.nR; i++) {
                k = nC-1;
                b = complex(x);
                a = complex(this.content[i][k]);
                for (let j = 0; j < this.nC-1; j++) {
                    c = complex(this.content[i][k-1]);
                    a = a.times(b).plus(c);
                    k--;
                }
                if (a.isReal()) {
                    result.content[i][0] = a.re;
                } else {
                    result.content[i][0] = a;
                }
            }
        } else if ( input === "real" ) {
            nR     = this.nR;
            nC     = this.nC;
            result = new MatrixStruc(nR, 1);
            for (let i = 0; i < this.nR; i++) {
                k = nC-1;
                b = x;
                a = this.content[i][k];
                for (let j = 0; j < this.nC-1; j++) {
                    c = this.content[i][k-1];
                    a = a * b + c;
                    k--;
                }
                result.content[i][0] = a;
            }
        }
        if (output === "matrix") {
            return result;
        } else if ( output === "array" ) {
            return result.transpose().mArray();
        }
    }

    evalp2(x, y, output = "array", input = "real") {
        let nR, nC, result, a, b, c, k;
        if (input === "complex") {
            nR     = this.nR;
            nC     = this.nC;
            result = new MatrixStruc(nR, 1);
            for (let i = 0; i < this.nR; i++) {
                k = nC-1;
                b = complex(x);
                a = complex(this.content[i][k]);
                for (let j = 0; j < this.nC-1; j++) {
                    c = complex(this.content[i][k-1]).times( complex(y).pow(j+1) );
                    a = a.times(b).plus(c);
                    k--;
                }
                if (a.isReal()) {
                    result.content[i][0] = a.re;
                } else {
                    result.content[i][0] = a;
                }
            }
        } else if ( input === "real" ) {
            nR     = this.nR;
            nC     = this.nC;
            result = new MatrixStruc(nR, 1);
            for (let i = 0; i < this.nR; i++) {
                k = nC-1;
                b = x;
                a = this.content[i][k];
                for (let j = 0; j < this.nC-1; j++) {
                    c = this.content[i][k-1] * Math.pow(y, j+1);
                    a = c + a * b;
                    k--;
                }
                result.content[i][0] = a;
            }
        }

        if (output === "matrix") {
            return result;
        } else if ( output === "array" ) {
            return result.transpose().mArray();
        }
    }

    evalpM(matrix, output = "array", input = "real", k = 0) {
        let result = new MatrixStruc(matrix.nR, matrix.nC);
        if ( matrix.nR !== undefined ) {
            for (let i = 0; i < matrix.nR; i++) {
                for (let j = 0; j < matrix.nC; j++) {
                    result.content[i][j] = this.evalp(matrix.content[i][j], "array", input)[k]
                }
            }
        }
        if (output === "matrix") {
            return result;
        } else if ( output === "array" ) {
            return result.transpose().mArray();
        }
    }
}

class VectorOperations {
    equals(vector) {
        if (this.type === vector.type) {
            let equal = true;
            for (let i = 0; i < this.dim; i++) {
                if (this[i] !== vector[i]) {
                    equal = false;
                    break;
                }
            }
            return equal;
        } else {
            return false;
        }
    }

    toMatrix() {
        let output;
        output = new MatrixStruc(this.dim, 1, (i, j) => { return this[i] });
        return output;
    }

    transformBy(T) {
        if (T.nR !== undefined) {
            let p, pT, nP;
            p = this.toMatrix();
            if (T.nC === p.nR) {
                pT = T.times(p);
                nP = new Vector(...pT.transpose().mArray())
                return nP;
            }
        }
    }

    print() {
        return this.toMatrix().print();
    }

    plus(obj) {
        let column, array, output;
        column = this.toMatrix().plus( obj.toMatrix() );
        array  = [];
        for (let i = 0; i < column.nR; i++) {
            array.push(column.content[i][0]);
        }
        if ( obj.constructor.name === "Vector" ) {
            output = new Vector(...array);
        } else if ( obj.constructor.name === "Point" ) {
            output = new Point(...array);
        }
        return output;
    }

    minus(obj) {
        let column, array, output;
        column = this.toMatrix().minus( obj.toMatrix() );
        array  = [];
        for (let i = 0; i < column.nR; i++) {
            array.push(column.content[i][0]);
        }
        if ( obj.constructor.name === "Point" ) {
            output = new Vector(...array);
        } else if ( obj.constructor.name === "Vector" ) {
            output = new Point(...array);
        }
        return output;
    }

    times(obj) {
        if ( typeof(obj) === "number" ) {
            let column, output, array;
            column = this.toMatrix().etimes( obj );   
            array  = [];
            for (let i = 0; i < column.nR; i++) {
                array.push(column.content[i][0]);
            } 
            output = new Vector(...array);
            return output;
        } else if ( obj.constructor.name === "Vector" ) {
            let column, sum;
            column = this.toMatrix().etimes( obj.toMatrix() );
            sum = column.sum();
            return sum.re;
        }
    }

    magnitude() {
        let output;
        output = this.times(this);
        output = Math.sqrt(output);
        return output;
    }

    round(precis) {
        let precision = Math.pow(10, Math.round(precis));
        for (let i = 0; i < this.dim; i++) {
            this[i] = Math.round(this[i] * precision) / precision;
        }
        return this;
    }

    angle(vector, unit = "rad" ) {
        if (vector.constructor.name === "Vector") {
            let angle;
            angle = this.times(vector) / ( this.magnitude() * vector.magnitude() );
            angle = Math.acos(angle);
            if ( unit === "rad") {
                return angle;
            } else if (unit === "deg") {
                return radToDeg(angle);
            }
        }
    }
}

class PointOperations {
    equals(point) {
        if (this.type === point.type) {
            let equal = true;
            for (let i = 0; i < this.dim; i++) {
                if (this[i] !== point[i]) {
                    equal = false;
                    break;
                }
            }
            return equal;
        } else {
            return false;
        }
    }

    toMatrix() {
        let output;
        output = new MatrixStruc(this.dim, 1, (i, j) => { return this[i] });
        return output;
    }

    transformBy(T, augMatrix) {
        if (T.nR !== undefined) {
            let p, pT, nP, aug;

            if (augMatrix === undefined) {
                aug = new MatrixStruc(1, 1, 1);
                p = this.toMatrix().transpose().augmentBy(aug).transpose();
            } else {
                aug = augMatrix; 
                p = this.toMatrix().transpose().augmentBy(aug).transpose();
            }

            if (T.nC === p.nR) {
                pT = T.times(p).removeRow( p.nR-1 );
                nP = new Point(...pT.transpose().mArray())
                return nP;
            }
        }
    }

    print() {
        return this.toMatrix().print();
    }

    minus(obj) {
        let column, array, output;
        column = this.toMatrix().minus( obj.toMatrix() );
        array  = [];
        for (let i = 0; i < column.nR; i++) {
            array.push(column.content[i][0]);
        }
        if ( obj.constructor.name === "Point" ) {
            output = new Vector(...array);
        } else if ( obj.constructor.name === "Vector" ) {
            output = new Point(...array);
        }
        return output;
    }

    plus(obj) {
        let column, array, output;
        column = this.toMatrix().plus( obj.toMatrix() );
        array  = [];
        for (let i = 0; i < column.nR; i++) {
            array.push(column.content[i][0]);
        }
        if ( obj.constructor.name === "Point" ) {
            output = new Vector(...array);
        } else if ( obj.constructor.name === "Vector" ) {
            output = new Point(...array);
        }
        return output;
    }

    times(scalar) {
        let output, array;
        output = this.toMatrix().etimes( scalar );   
        array  = [];
        for (let i = 0; i < output.nR; i++) {
            array.push(output.content[i][0]);
        } 
        output = new Point(...array);
        return output;
    }

    distanceFrom(point) {
        let vector, sum;
        vector = this.minus(point);
        sum    = 0;
        for (let i = 0; i < vector.dim; i++) {
            sum = sum + Math.pow(vector[i], 2);
        }

        sum = Math.sqrt(sum);
        return sum;
    }

    round(precis) {
        let precision = Math.pow(10, Math.round(precis));
        for (let i = 0; i < this.dim; i++) {
            this[i] = Math.round(this[i] * precision) / precision;
        }
        return this;
    }
}

class RealSetOperations {
    has(element) {
        return (this.collection.indexOf(element) !== -1);
    }

    values() {
        return this.collection;
    }

    add(element) {
        if ( typeof(element) === "number" ) {
            if ( !this.has(element) ) {
                this.collection.push(element);
                return this;
            }
            return false;
        }
    }

    remove(element) {
        if (this.has(element)) {
            index = collection.indexOf(element);
            this.collection.splice(index, 1);
            return true;
        }
    }

    size() {
        return this.collection.length;
    }

    union(otherSet) {
        let unionSet = new RealSet();
        let firstSet = this.values();
        let secondSet = otherSet.values();
        firstSet.forEach( (e)  => {
            unionSet.add(e);
        });
        secondSet.forEach( (e) => {
            unionSet.add(e);
        })
        return unionSet;
    };

    intersection(otherSet) {
        let intersectionSet = new RealSet();
        let firstSet = this.values();
        firstSet.forEach( (e) => {
            if (otherSet.has(e)) {
                intersectionSet.add(e);
            }
        })
        return intersectionSet;
    }

    difference(otherSet) {
        let differenceSet = new RealSet();
        let firstSet = this.values();
        firstSet.forEach( (e) => {
            if ( !otherSet.has(e) ) {
                differenceSet.add(e);
            }
        })
        return differenceSet;
    }

    subSet(otherSet) {
        let firstSet = this.values();
        return firstSet.every( (value) => {
            return otherSet.has(value);
        })
    }

}

class ComplexSetOperations {
    has(element) {
        let hasE = false;
        for (let i = 0; i < this.size(); i++) {
            if ( this.collection[i].equals(element) ) {
                hasE = true;
                break;
            }
        }
        return hasE;
    }

    values() {
        return this.collection;
    }

    add(element) {
        if ( element.im !== undefined ) {
            if ( !this.has(element) ) {
                this.collection.push(element);
                return this;
            }
            return false;
        }
    }

    remove(element) {
        if (this.has(element)) {
            index = collection.indexOf(element);
            this.collection.splice(index, 1);
            return true;
        }
    }

    size() {
        return this.collection.length;
    }

    union(otherSet) {
        let unionSet = new ComplexSet();
        let firstSet = this.values();
        let secondSet = otherSet.values();
        firstSet.forEach( (e)  => {
            unionSet.add(e);
        });
        secondSet.forEach( (e) => {
            unionSet.add(e);
        })
        return unionSet;
    }

    intersection(otherSet) {
        let intersectionSet = new ComplexSet();
        let firstSet = this.values();
        firstSet.forEach( (e) => {
            if (otherSet.has(e)) {
                intersectionSet.add(e);
            }
        })
        return intersectionSet;
    }

    difference(otherSet) {
        let differenceSet = new ComplexSet();
        let firstSet = this.values();
        firstSet.forEach( (e) => {
            if ( !otherSet.has(e) ) {
                differenceSet.add(e);
            }
        })
        return differenceSet;
    }

    subSet(otherSet) {
        let firstSet = this.values();
        return firstSet.every( (value) => {
            return otherSet.has(value);
        })
    }
}

class PointSetOperations {
    times(scalar) {
        for (let i = 0; i < this.size(); i++) {
            this.collection[i] = this.collection[i].times(scalar);
        }

        return this;
    }

    subDim(k) {
        let output = new MatrixStruc(1, this.size(), (i, j) => {
            return this.collection[j][k];
        })
        return output;
    }

    has(element) {
        let hasE = false;
        for (let i = 0; i < this.size(); i++) {
            if ( this.collection[i].equals(element) ) {
                hasE = true;
                break;
            }
        }
        return hasE;
    }

    values() {
        return this.collection;
    }

    add(element) {
        if ( element.type === "Point" ) {
            if ( this.collection.length === 0) {
                this.dim = element.dim;
                this.collection.push(element);
                return this;
            } else if ( this.dim === element.dim && !this.has(element) ) {
                this.collection.push(element);
                return this;
            }
            return false;
        }
    }

    remove(element) {
        if (this.has(element)) {
            let index;
            for (let i = 0; i < this.size(); i++) {
                if ( this.collection[i].equals(element) ) {
                    index = i;
                    break;
                }
            }
            this.collection.splice(index, 1);
            return true;
        }
    }

    size() {
        return this.collection.length;
    }

    union(otherSet) {
        let unionSet  = new PointSet();
        let firstSet  = this.values();
        let secondSet = otherSet.values();
        firstSet.forEach( (e)  => {
            unionSet.add(e);
        });
        secondSet.forEach( (e) => {
            unionSet.add(e);
        })
        return unionSet;
    }

    intersection(otherSet) {
        let intersectionSet = new PointSet();
        let firstSet        = this.values();
        firstSet.forEach( (e) => {
            if (otherSet.has(e)) {
                intersectionSet.add(e);
            }
        })
        return intersectionSet;
    }

    difference(otherSet) {
        let differenceSet = new PointSet();
        let firstSet      = this.values();
        firstSet.forEach( (e) => {
            if ( !otherSet.has(e) ) {
                differenceSet.add(e);
            }
        })
        return differenceSet;
    }

    subSet(otherSet) {
        let firstSet = this.values();
        return firstSet.every( (value) => {
            return otherSet.has(value);
        })
    }

    toMatrix() {
        let nC = this.size();
        let nR = this.collection[0].dim;
        let output = new MatrixStruc(nR, nC);
        
        for (let j = 0; j < nC; j++) {
            output = output.replaceColumn(j, this.collection[j].toMatrix());
        }

        return output

    }

    round() {
        for (let i = 0; this.collection.length; i++) {
            this.collection[i].round();
        }
        return this;
    }

    transformBy(T) {
        for (let i = 0; i < this.size(); i++) {
            this.collection[i] = this.collection[i].transformBy(T);
        }
        return this;
    }

    centroid () {
        let center = [];
        for (let k = 0; k < this.dim; k++) {
            center.push(this.subDim(k).sum().re/this.size());
        }
        return center;
    }

    distanceFrom(point) {
        let distance = [];
        for (let i = 0; i < this.size(); i++) {
            distance.push( this.collection[i].distanceFrom(point) );
        }
        return distance;
    }
}

class VectorSetOperations {
    times(scalar) {
        for (let i = 0; i < this.size(); i++) {
            this.collection[i] = this.collection[i].times(scalar);
        }
    }

    subDim(k) {
        let output = new MatrixStruc(1, this.size(), (i, j) => {
            return this.collection[j][k];
        })
        return output;
    }

    has(element) {
        let hasE = false;
        for (let i = 0; i < this.size(); i++) {
            if ( this.collection[i].equals(element) ) {
                hasE = true;
                break;
            }
        }
        return hasE;
    }

    values() {
        return this.collection;
    }

    add(element) {
        if ( element.type === "Vector" ) {
            if ( this.collection.length === 0) {
                this.dim = element.dim;
                this.collection.push(element);
                return this
            } else if ( this.dim === element.dim && !this.has(element) ) {
                this.collection.push(element);
                return this;
            }
            return false;
        }
    }

    remove(element) {
        if (this.has(element)) {
            let index;
            for (let i = 0; i < this.size(); i++) {
                if ( this.collection[i].equals(element) ) {
                    index = i;
                    break;
                }
            }
            this.collection.splice(index, 1);
            return true;
        }
    }

    size() {
        return this.collection.length;
    }

    union(otherSet) {
        let unionSet  = new VectorSet();
        let firstSet  = this.values();
        let secondSet = otherSet.values();
        firstSet.forEach( (e)  => {
            unionSet.add(e);
        });
        secondSet.forEach( (e) => {
            unionSet.add(e);
        })
        return unionSet;
    }

    intersection(otherSet) {
        let intersectionSet = new VectorSet();
        let firstSet        = this.values();
        firstSet.forEach( (e) => {
            if (otherSet.has(e)) {
                intersectionSet.add(e);
            }
        })
        return intersectionSet;
    }

    difference(otherSet) {
        let differenceSet = new VectorSet();
        let firstSet      = this.values();
        firstSet.forEach( (e) => {
            if ( !otherSet.has(e) ) {
                differenceSet.add(e);
            }
        })
        return differenceSet;
    }

    subSet(otherSet) {
        let firstSet = this.values();
        return firstSet.every( (value) => {
            return otherSet.has(value);
        })
    }

    toMatrix() {
        let nC = this.size();
        let nR = this.collection[0].dim;
        let output = new MatrixStruc(nR, nC);
        
        for (let j = 0; j < nC; j++) {
            output = output.replaceColumn(j, this.collection[j].toMatrix());
        }
        
        return output
    }

    round() {
        for (let i = 0; this.collection.length; i++) {
            this.collection[i].round();
        }

        return this;
    }

    transformBy(T) {
        for (let i = 0; i < this.size(); i++) {
            this.collection[i].transformBy(T);
        }
    }
}

// Classes:

class ComplexNumber extends ComplexOperations {
    constructor(re, im) {
        super();
        if (arguments.length == 0) {
            this.re = 0;
            this.im = 0;
        } else if (arguments.length === 1) {
            this.re = re;
            this.im = 0;
        } else if (arguments.length === 2) {
            this.re = re;
            this.im = im;
        }
        Object.seal(this);
    }
}

class MatrixStruc extends MatrixOperations {
    constructor(nR, nC, v = 0) {
        super();
        this.nR      = nR;
        this.nC      = nC;
        this.content = {};   
        if(arguments.length >= 2) {
            if (typeof(nR) === "number" && typeof(nC) === "number") {
                if (typeof(v) === "number") {
                    for (let i = 0; i < nR; i++) {
                        this.content[i] = {};
                        for (let j = 0; j < nC; j++) {
                            this.content[i][j] = v;
                        }
                        Object.seal(this.content[i]);
                    }
                } else if ( (v.re !== undefined && v.im !== undefined) ) {
                    v = new ComplexNumber(v.re, v.im);
                    if (v.isReal()) {
                        for (let i = 0; i < nR; i++) {
                            this.content[i] = {};
                            for (let j = 0; j < nC; j++) {
                                this.content[i][j] = v.re;
                            }
                            Object.seal(this.content[i]);
                        }
                    } else {
                        for (let i = 0; i < nR; i++) {
                            this.content[i] = {};
                            for (let j = 0; j < nC; j++) {
                                this.content[i][j] = v;
                            }
                            Object.seal(this.content[i]);
                        }
                    }
                } else if (typeof(v) === "function") {
                    for (let i = 0; i < nR; i++) {
                        this.content[i] = {};
                        for (let j = 0; j < nC; j++) {
                            this.content[i][j] = v(i,j);
                        }
                        Object.seal(this.content[i]);
                    }
                }
            }
        }
        
        Object.seal(this.content);
    }
}

class Point extends PointOperations {
    constructor() {
        super();
        for (let i = 0; i < arguments.length; i++) {
            this[i] = arguments[i];
        }
        this.dim = arguments.length;
        this.type = "Point";
    }
}

class Vector extends VectorOperations {
    constructor() {
        super();
        for (let i = 0; i < arguments.length; i++) {
            this[i] = arguments[i];
        }
        this.dim = arguments.length;
        this.type = "Vector";
    }
}

class RealSet extends RealSetOperations {
    constructor() {
        super();
        this.collection = [];
        this.type       = "RealSet"
    }
}

class ComplexSet extends ComplexSetOperations {
    constructor() {
        super();
        this.collection = [];
        this.type       = "ComplexSet"
    }
}

class VectorSet extends VectorSetOperations {
    constructor() {
        super();
        this.collection = [];
        this.type       = "VectorSet";
        this.dim        = 0;
    }
}

class PointSet extends PointSetOperations{
    constructor() {
        super();
        this.collection = [];
        this.type       = "PointSet";
        this.dim        = 0;
    }
}

// Utility Functions: 
function componentsCombination(combs) {
    let components;
    let combinations1 = ["rrr", "grr", "brr", "rgr", "ggr", "bgr", "rbr","gbr", "bbr", "rrg", "grg", "brg", "rgg", "ggg", "bgg", "rbg", "gbg", "bbg", "rrb", "grb", "brb", "rgb", "ggb", "bgb", "rbb", "gbb", "bbb"];
    let combinations2 = ["rr", "rg", "rb", "gr", "gg", "gb", "br", "bg", "bb"];
    let combinations3 = ["r", "g", "b"];

    if ( combinations1.indexOf(combs) !== -1) {
        components = combs;
    } else if ( combinations2.indexOf(combs) !== -1 ) {
        components = combs.split("");
        components.push(components[components.length-1]);
        components = components.join("");
    } else if  ( combinations3.indexOf(combs) !== -1 ) {
        components = combs.split("");
        components.push(components[components.length-1]);
        components.push(components[components.length-1]);
        components = components.join("");
    } else {
        components = "rgb";
    }
    return components;
}

function radToDeg(rads) {
    if (rads.constructor.name === "MatrixStruc") {
        let output = new MatrixStruc(rads.nR, rads.nC);
        for (let i = 0; i < rads.nR; i++) {
            for (let j = 0; j < rads.nC; j++) {
                output.data( i, j, (rads.data(i, j) * (Math.PI / 180)) );
            }
        }
        return output;
    } else if (typeof(rads) === "number") {
        let output = rads / (Math.PI / 180);
        return output;
    }
}

function complex(re, im) {
    let output;
    if (arguments.length === 0) {
        output = new ComplexNumber(0, 0);
    } else if (arguments.length === 1) {
        if (typeof(re) === "number") {
            output = new ComplexNumber(re, 0);
        } else if ( (re.re !== undefined) && (re.im !== undefined)) {
            output = new ComplexNumber(re.re, re.im);
            return output;
        }
    } else if (arguments.length === 2) {
        if  ( (re !== undefined && typeof(re) === "number" ) || (im !== undefined  && typeof(im) === "number" ) ) {
            output = new ComplexNumber(re, im);
            return output;
        }
    }
    return output;
}

function isArrayOfNumbers(data) {
    if (Array.isArray(data)) {
        let isIt = true;
        for (let i = 0; i < data.length; i++) {
            if (typeof(data[i]) !== "number" && (data[i].re !== undefined && data[i].im !== undefined)) {
                isIt = false;
                break;
            }
        }
        return isIt;
    } else {
        let isIt = false;
        return isIt;
    }
}

function isArrayOfArrays(data) {
    if(Array.isArray(data)) {
        let isIt = true;
        for (let i = 0; i < data.length; i++) {
            if ( Array.isArray(data[i]) ) {
                continue;
            } else {
                isIt = false;
                break;
            }
        }
        return isIt;
    }
}

function isMatrixArray(data) {
    if (isArrayOfArrays(data)) {
        let isIt = true;
        let L = data[0].length;
        for (let i = 0; i < data.length; i++) {
            if (!isArrayOfNumbers(data[i])) {
                isIt = false;
                break;
            } else {
                if (L !== data[i].length) {
                    isIt = false;
                    break;
                }
            }
        }
        return isIt;
    } else {
        let isIt = false;
        return isIt;
    }    
}

function matrix(data, nR = 3, nC = 3) {
    if (isMatrixArray(data)) {    
        let nR = data.length;
        let nC = data[0].length;
        let m  = new MatrixStruc(nR, nC, (i, j) => {
            return data[i][j]
        });
        return m;
    } else if (isArrayOfNumbers(data)) {  
        let m  = new MatrixStruc(1, data.length, (i,j) => {
            return data[j];
        });
        return m;       
    } else if (typeof(data) === "number" || typeof(data) === "function" || data.constructor.name === "ComplexNumber") {
        let m  = new MatrixStruc(nR, nC, data);
        return m;
    } else { 
        let m  = new MatrixStruc(3, 3, 0);
        return m;
    }
}

// Exports: 

export default MatrixEngine;