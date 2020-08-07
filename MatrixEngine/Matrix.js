export default class MatrixEngine {  
    constructor() {
        let path = import.meta.url;
        this.path = path.replace("Matrix.js", "");   // "./matrixEngineJS"
    }

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

    filterGen(type = "average", size = 3, param = 0.2) {
        let h;
        if (size%2 === 1) {
            if (type === "average") {
                let aF     = size * size;
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
                    h = matrix([
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
                h = matrix([
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
            console.log("The size must be an odd integer")
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

    log() {
        return function(data) {
            console.log(data);
            return data;
        }
    }

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
    type() {
        return this.constructor.name;
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
    
    mArray() {
        let output = [];
        for (let i = 0; i < this.nR; i++) {
            output.push([]);
            for (let j = 0; j < this.nC; j++) {
                output[i].push( this.content[i][j] )
            }
        }  
        return output;
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
}

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

    round() {
        let output;
        for (let i = 0; i < this.dim; i++) {
            this[i] = Math.round(this[i]);
        }
        return output;
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
        let output;
        output = this.toMatrix().etimes( scalar );   
        array  = [];
        for (let i = 0; i < column.nR; i++) {
            array.push(column.content[i][0]);
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

    round() {
        let output;
        for (let i = 0; i < this.dim; i++) {
            this[i] = Math.round(this[i]);
        }
        return output;
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

class RealSet {
    constructor() {
        this.collection = [];
    }

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
                return true;
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

class ComplexSet {
    constructor() {
        this.collection = [];

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
        if ( element.im !== undefined ) {
            if ( !this.has(element) ) {
                this.collection.push(element);
                return true;
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
    };


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

class VectorSet {
    constructor() {
        this.collection = [];
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
            if ( !this.has(element) ) {
                this.collection.push(element);
                return true;
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
}

class PointSet {
    constructor() {
        this.collection = [];
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
            if ( !this.has(element) ) {
                this.collection.push(element);
                return true;
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
}