// Super Classes

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
        } else if ( (nbr.re || nbr.im) && this.re === nbr.re && this.im === nbr.im ) {
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
    // Mathematics
    type() {
        return this.constructor.name;
    }
    
    size() {
        return {nR: this.nR, nC: this.nC};
    }
    
    data (i, j, v) {
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
                            output =  output + this.content[i][j].toString()  + " ,"  ;
                        } else if ( this.content[i][j].re !== undefined && this.content[i][j].im !== undefined ) {
                            output =  output + this.content[i][j].print()  + " ," ;
                        }
                    } else {
                        if ( typeof(this.content[i][j]) === "number" ) {
                            output =  output + this.content[i][j].toString()  ;
                        } else if ( this.content[i][j].re !== undefined && this.content[i][j].im !== undefined ) {
                            output =  output + this.content[i][j].print() ;
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
        } else if (input.nR !== undefined) {
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

    // Image Processing
    OTSUThreshold( data = "real" ) {
        let PMF, mG, vG, seperability, output, m1, v1, m2, v2, vO, p1, p2;
        
        PMF = this.PMF(data);
        
        mG  = 0;
        for (let i = 0; i < PMF.nC; i++) {
            mG  = mG + PMF.content[0][i] * PMF.content[1][i];
        }
        
        vG  = 0;
        for (let i = 0; i < PMF.nC; i++) {
            vG  = vG + Math.pow( (PMF.content[0][i] - mG) , 2 ) * PMF.content[1][i];
        }

        seperability = {k: 0, vO: Number.NEGATIVE_INFINITY};
        for (let k = 0; k < PMF.nC; k++) {
            p1 = 0;
            m1 = 0;
            for (let i = 0; i <= k; i++) {
                m1  = m1 + PMF.content[0][i] * PMF.content[1][i];
                p1  = p1 + PMF.content[1][i];
            }

            v1  = 0;
            for (let i = 0; i <= k; i++) {
                v1  = v1 + Math.pow( (PMF.content[0][i] - m1) , 2 ) * PMF.content[1][i];
            }

            p2 = 1 - p1;
            m2 = 0;
            for (let i = k+1; i < PMF.nC; i++) {
                m2  = m2 + PMF.content[0][i] * PMF.content[1][i];
            }

            v2  = 0;
            for (let i = k+1; i < PMF.nC; i++) {
                v2  = v2 + Math.pow( (PMF.content[0][i] - m2) , 2 ) * PMF.content[1][i];
            }

            vO = p1 * Math.pow( (m1-mG), 2 ) + p2 * Math.pow( (m2-mG), 2 );
            if (vO > seperability.vO) {
                seperability = {k: k, vO: vO};
            }
        }

        output = this.threshold(seperability.k);
        output.threshold = seperability.k;
        return output;

    }

    medFilter2d( size = 3 ) {
        if ( typeof( size ) === "number" ) {
            let block;
            let s = ( (Math.floor(size))%2 === 1 ) ? Math.floor(size) : Math.floor(size+1);
            let c = Math.floor(s/2);
            let output = new MatrixStruc(this.nR, this.nC, (i,j) => {
                block = new MatrixStruc(size, size, 0);
                for (let n = i-c; n < i+c+1; n++) {
                    for (let k = j-c; k < j+c+1; k++) {
                        if (n >= 0 && n < this.nR && k >= 0 && k < this.nC ) {
                            block.data(n-(i-c), k-(j-c), this.data(n, k) );
                        }
                    }
                }   
                return block.median();
            })
            return output;
        } else if ( typeof( size ) === "object" ) {
            let block;
            let si = ( (Math.floor(size.nR))%2 === 1 ) ? Math.floor(size.nR) : Math.floor(size.nR+1);
            let sj = ( (Math.floor(size.nC))%2 === 1 ) ? Math.floor(size.nC) : Math.floor(size.nC+1);
            let ci = Math.floor(si/2);
            let cj = Math.floor(sj/2);
            let output = new MatrixStruc(this.nR, this.nC, (i,j) => {
                block = new MatrixStruc(si, sj, 0);
                for (let n = i-ci; n < i+ci+1; n++) {
                    for (let k = j-cj; k < j+cj+1; k++) {
                        if (n >= 0 && n < this.nR && k >= 0 && k < this.nC ) {
                            block.data(n-(i-ci), k-(j-cj), this.data(n, k) );
                        }
                    }
                }
                return block.median();
            })
            return output;

        }
    }

    filter2d(h, size = "same") {
        let pixel, inR, inC, onR, onC, output, lcenter, kcenter;
        h = new MatrixStruc(h.nR, h.nC, (k, l) => {
            return h.content[k][l];
        });
        inR = this.nR;
        inC = this.nC;
        if (size === "full") {
            onR = this.nR + h.nR - 1;
            onC = this.nC + h.nC - 1;
            output = new MatrixStruc(onR, onC, 0);
        } else if ( size === "same" ) {
            onR = this.nR;
            onC = this.nC;
            output = new MatrixStruc(onR, onC, 0);
        }
        lcenter = Math.floor(h.nR/2);
        kcenter = Math.floor(h.nC/2);
        for (let i = 0; i < onR; i++) {
            for (let j = 0; j < onC; j++) {
                pixel = complex(0, 0);
                for (let l = 0 ; l < h.nR; l++) {
                    for (let k = 0; k < h.nC; k++) {
                        if ((i+l-lcenter) >= 0 && (j+k-kcenter) >= 0 && (i-lcenter+l) < inR && (j-kcenter+k) < inC) {
                            pixel = pixel.plus( complex( this.data( i-lcenter+l,j-kcenter+k ) ).times( complex( h.data(l, k)) ) )
                        }
                    }
                }
                output.data(i, j, pixel);
            }
        }
        return output;
    }

    conv2d(h, size = "same", boundries = "zeros") {
        if (h.constructor.name === "MatrixStruc") {
            h = new MatrixStruc(h.nR, h.nC, (k, l) => {
                return h.content[k][l];
            });
            let pixel, inR, inC, hnR, hnC, onR, onC, output, lcenter, kcenter;
            inR = this.nR;
            inC = this.nC;
            hnR = h.nR;
            hnC = h.nC;
            onR    = this.nR + h.nR - 1;
            onC    = this.nC + h.nC - 1;
            output = new MatrixStruc(onR, onC, 0);
            lcenter = Math.floor(h.nR/2);
            kcenter = Math.floor(h.nC/2);
            for (let m = 0; m < onR; m++) {
                for (let n = 0; n < onC; n++) {
                    pixel = complex(0, 0);
                    for (let i = m; i > (m - hnR) ; i--) {
                        for (let j = n ; j > (n - hnC) ; j--) {
                            if (i >= 0 && i < inR && j >= 0 && j < inC) {
                                pixel = pixel.plus( complex( this.data( i , j ) ).times(complex( h.data( m - i , n - j ) )) ) ;
                            } else {                                
                                if ( boundries === "duplicate" ) {
                                    if (i < 0 && j < 0) {
                                        pixel = pixel.plus( complex( this.data( 0 , 0 ) ).times(complex( h.data( m - i , n - j ) )) ) ;
                                    } else if ( i < 0 && j > inC) {
                                        pixel = pixel.plus( complex( this.data( 0 , inC-1 ) ).times(complex( h.data( m - i , n - j ) )) ) ;
                                    } else if ( i > inR && j < 0) {
                                        pixel = pixel.plus( complex( this.data( inR-1 , 0 ) ).times(complex( h.data( m - i , n - j ) )) ) ;
                                    } else if ( i > inR && j > inC ) {
                                        pixel = pixel.plus( complex( this.data( inR-1 , inC-1 ) ).times(complex( h.data( m - i , n - j ) )) ) ;
                                    } else if ( i < 0   && j >= 0 && j < inC ) {
                                        pixel = pixel.plus( complex( this.data( 0 , j ) ).times(complex( h.data( m - i , n - j ) )) ) ;
                                    } else if ( i > inR && j >= 0 && j < inC ) {
                                        pixel = pixel.plus( complex( this.data( inR-1 , j ) ).times(complex( h.data( m - i , n - j ) )) ) ;
                                    } else if ( i >= 0 && i < inR && j < 0   ) {
                                        pixel = pixel.plus( complex( this.data( i , 0 ) ).times(complex( h.data( m - i , n - j ) )) ) ;
                                    } else if ( i >= 0 && i < inR && j > inC ) {
                                        pixel = pixel.plus( complex( this.data( i , inC-1 ) ).times(complex( h.data( m - i , n - j ) )) ) ;
                                    }
                                } else if ( boundries === "zeros" ) {
                                    pixel = pixel.plus( complex( 0 , 0 ).times(complex( h.data( m-i , n-j ) )) );
                                }
                                
                            }
                        }
                    }
                    output.data(m, n, pixel);
                }
            }
            if (size === "full") {
                return output;
            } else if ( size === "same" ) {
                return output.clone(lcenter, kcenter, onR-2*lcenter, onC-2*kcenter);
            }
            return output;
        }
    }

    fftShift( type = "col" ) {
        if (type  === "col" ) {
            let output = new MatrixStruc(this.nR, this.nC, (i, j) => {
                if ( i < this.nR/2 ) {
                    return this.content[i + this.nR * 0.5][j]
                } else {
                    return this.content[i - this.nR * 0.5][j]
                }
            })
            return output;
        } else if ( type === "row" ) {
            let output = new MatrixStruc(this.nR, this.nC, (i, j) => {
                if ( j < this.nC/2 ) {
                    return this.content[i][j + this.nC * 0.5]
                } else {
                    return this.content[i][j - this.nC * 0.5]
                }
            })
            return output;
        }
    }
    
    fft2dShift() {
        return this.fftShift("col").fftShift("row");
    }

    fftshuffle() {
        let nStages, N, nps, nbs, output, temp, p, index;
        nStages = Math.ceil( Math.log2( this.size().nR ) );
        N       = Math.pow(  2, nStages );
        output  = matrix((i, j) => {
            if (i < this.size().nR && j < this.size().nC) { 
                return this.data(i, j);
            } else { 
                return 0;
            };
        }, N, this.size().nC );
        for (let j = 0; j < this.size().nC; j++) {
            for (let s = 0; s < nStages; s++) {
                temp = output.column(j);
                nbs  = Math.pow(2, s);
                nps  = N / nbs;
                p    = 0;
                for (let b = 0; b < nbs; b++) {
                    for (let n = p; n < p+(nps/2); n++) {
                        index = n+b*(nps/2);
                        output.data(index,           j, temp.data(2*n   ,0) );
                        output.data((index+(nps/2)), j, temp.data(2*n+1 ,0) );
                    }
                    p = p + (nps/2);
                }
            }
        }
        return output;
    }

    fft( type = "col",  data = "AmplitudePhase") {
        /**
         * nStages: Number of stages;
         * N: Number of Points in the sequence (power of 2);
         * nps: Number of points in one stage;
         * nbs: Number of blocks per stage;
         * output: output of the fft process;
        **/
        let nStages; let N; let W; let nps; let nbs; let even; let odd; let output; let p;
        if ( type === "col" ) {
            nStages = Math.ceil(Math.log2(this.size().nR));
            N       = Math.pow(2, nStages);
            W       = Moivre(1, -2*Math.PI/N);
            output  = matrix((i, j) => {
                if (i < this.size().nR && j < this.size().nC) { 
                    return complex( this.data(i, j) )
                } else { 
                    return complex(0, 0)
                };
            }, N, this.size().nC );
            for (let j = 0; j < this.size().nC; j++) {
                for (let s = 0; s < nStages; s++) {
                    nbs  = Math.pow(2, s);
                    nps  = N / nbs;
                    p    = 0;
                    for (let b = 0; b < nbs; b++) {
                        for (let n = p; n < p+(nps/2); n++) {
                            even = complex( output.data(n, j) ).plus(  complex(output.data(n+(nps/2),j)) );
                            odd  = complex( output.data(n, j) ).minus( complex(output.data(n+(nps/2),j)) ).times( W.pow( (n*nbs)%N ) );
                            output.data(n         , j, even);
                            output.data(n+(nps/2) , j, odd);
                        }
                        p = p + nps;
                    }
                }
            }
            output = output.fftshuffle();
            if ( data === "RealImaginary" ) {
                return [output.real(), output.imaginary()];
            } else if ( data === "AmplitudePhase" ) {
                return [output.amplitude(), output.phase()];
            } else if ( data === "raw") {
                return (output);
            }
        } else if (type === "row") {
            output = this.transpose();
            output = output.fft("col", "raw").transpose();
            if ( data === "RealImaginary" ) {
                return [output.real(),      output.imaginary()];
            } else if ( data === "AmplitudePhase" ) {
                return [output.amplitude(), output.phase()];
            } else if ( data === "raw") {
                return output
            }
        }
    }

    ifft(type = "col", data = "AmplitudePhase") {
        let input, output, factor;
        
        input = matrix((i, j) => {
            if ( i < this.size().nR && j < this.size().nC ) { 
                return complex( this.data(i, j) ).conjugate();
            } else { 
                return complex(0, 0); 
            }
        }, this.size().nR, this.size().nC );

        output = input.fft(type, "raw").conjugate();
        
        if ( type === "col" ) {
            factor = output.nR;
        } else if ( type === "row" ) {
            factor = output.nC;
        }
        output = output.etimes( 1 / factor );

        if ( data === "RealImaginary" ) {
            return [output.real(), output.imaginary()];
        } else if ( data === "AmplitudePhase" ) {
            return [output.amplitude(), output.phase()];
        } else if ( data === "raw") {
            return output;
        }
    }

    fft2d(data = "AmplitudePhase") {
        let output;
        output = this.fft("col", "raw").fft("row", "raw").fft2dShift();
        if ( data === "RealImaginary" ) {
            return [output.real(), output.imaginary()];
        } else if ( data === "AmplitudePhase" ) {
            return [output.amplitude(), output.phase()];
        } else if ( data === "raw") {
            return output;
        }
    }

    frequencyFiltering(h, data = "RealImaginary") {
        let NM = {};
            NM.nR = this.nR + h.nR - 1;
            NM.nC = this.nC + h.nC - 1;

        let N  = {};
            N.nR = Math.pow(2, Math.ceil( Math.log2(NM.nR) ) );
            N.nC = Math.pow(2, Math.ceil( Math.log2(NM.nC) ) );
            h = new MatrixStruc(N.nR, N.nC, (k, l) => {
            if (k < h.nR && l < h.nC) {
                return h.content[k][l];
            } else {
                return 0;
            }
        });

        let m = new MatrixStruc(N.nR, N.nC, (k, l) => {
            if (k < this.nR && l < this.nC) {
                return this.content[k][l];
            } else {
                return 0;
            }
        });
        
        let M = m.fft2d("raw");
        let H = h.fft2d("raw");
        let output = M.etimes(H).ifft2d(data);

        return output;
    }

    ifft2d( data = "AmplitudePhase" ) {
        let output;
        output = this.ifft("row", "raw").ifft("col", "raw");

        if ( data === "RealImaginary" ) {
            return [output.real(), output.imaginary()];
        } else if ( data === "AmplitudePhase" ) {
            return [output.amplitude(), output.phase()];
        } else if ( data === "raw") {
            return output;
        }
    }

    unitScale(data = "real") {
        let nR, nC, output, current, value, mimx, intermediate; 
        if (data === "amplitude") {
            intermediate = this.amplitude();
        } else if (data === "phase") {
            intermediate = this.phase();
        } else if (data === "real") {
            intermediate = this.real();
        } else if (data === "imaginary") {
            intermediate = this.imaginary();
        }

        mimx   = intermediate.minmax();
        output = new MatrixStruc( this.nR, this.nC , 0); 
        nR     = intermediate.nR; 
        nC     = intermediate.nC;

        for (let i = 0; i < nR; i++) {
            for (let j = 0; j < nC; j++) {
                value   = intermediate.data(i, j);        
                current = ( (value-mimx.min) ) / (mimx.max-mimx.min)  ;
                output.data(i,j, current);
            }
        }

        return output;

    }

    stretchContrast(min = 0, max = 255, data = "real") {
        let nR, nC, output, current, value, mimx, intermediate; 
        if (data === "amplitude") {
            intermediate = this.amplitude();
        } else if (data === "phase") {
            intermediate = this.phase();
        } else if (data === "real") {
            intermediate = this.real();
        } else if (data === "imaginary") {
            intermediate = this.imaginary();
        }         
        mimx = intermediate.minmax();
        if ( max < min ) {
            console.log("The second argument must be a number greater than the first argument. max > min");
            return this.clone();
        }
        if ( min > mimx.min && max < mimx.max ) {
            console.log( "The min value must be less than: " + mimx.min + ", and the max value must be greater than: " + mimx.max + ", for contrast stretching operation");
            return this.clone();
        }
        output = new MatrixStruc( this.nR, this.nC , 0); 
        nR     = output.nR; 
        nC     = output.nC;
        for (let i = 0; i < nR; i++) {
            for (let j = 0; j < nC; j++) {
                value   = intermediate.data(i, j);        
                current = ( ( (value-mimx.min) / (mimx.max-mimx.min) ) * (max-min) ) + min ;
                output.data(i,j, current);
            }
        }
        return output;
    }

    equalize( data = "real" ) {
        let F, C, CDF, nR, nC, output, intermediate, mimx;  
        
        if (data === "amplitude") {
            intermediate = this.amplitude();
        } else if (data === "phase") {
            intermediate = this.phase();
        } else if (data === "real") {
            intermediate = this.real();
        } else if (data === "imaginary") {
            intermediate = this.imaginary();
        }

        C = function(value, DF) {
            for ( let q = 0; q < DF.nC; q++ ) {
                if ( DF.data(0, q) === value ) {
                    return DF.data(1, q);
                }
            }
        }
        
        mimx         = intermediate.minmax();
        intermediate = intermediate.minus(mimx.min);
        nR           = intermediate.nR;
        nC           = intermediate.nC;
        CDF          = intermediate.CDF();
        output       = intermediate.clone();
        
        for (let i = 0; i < nR; i++) {
            for (let j = 0; j < nC; j++) {
                F = C(intermediate.data(i, j), CDF);
                output.data(i, j, F);
            }
        }
        output = output.stretchContrast(0, (mimx.max-mimx.min) ).plus(mimx.min, "matrix");
        return output;
    }

    gammaCorrection(gamma = 1, data = "real") {
        if (gamma >= 0 ) {
            let current, mimx, min, max, nR, nC, intermediate, output;
            if (data === "amplitude") {
                intermediate = this.amplitude();
            } else if (data === "phase") {
                intermediate = this.phase();
            } else if (data === "real") {
                intermediate = this.real();
            } else if (data === "imaginary") {
                intermediate = this.imaginary();
            }
            mimx   = intermediate.minmax(data);
            min    = mimx.min;
            max    = mimx.max;
            nR     = intermediate.nR;
            nC     = intermediate.nC;
            output = new MatrixStruc(nR, nC);
            for (let i = 0; i < nR; i++) {
                for (let j = 0; j < nC; j++) {
                    if ( gamma === Number.POSITIVE_INFINITY ) {
                        output.data(i, j, 15);
                    } else {
                        current = (intermediate.data(i, j) - min) / (max-min);
                        current = (Math.pow(current, gamma) * (max-min))
                        current = current + min;
                        output.data(i, j, current)
                    }
                }
            }
            return output;
        } else {
            console.log("The gamma value (the first argument) can not be a negative value")
            return this.clone();
        }
    }

    shift(i0 = 0, j0 = 0, data = "real", background = 0) {
        let nR, nC, v, u, intermediate, output;
            if (data === "amplitude") {
                intermediate = this.amplitude();
            } else if (data === "phase") {
                intermediate = this.phase();
            } else if (data === "real") {
                intermediate = this.real();
            } else if (data === "imaginary") {
                intermediate = this.imaginary();
            }

           nR     = intermediate.nR;
           nC     = intermediate.nC;
           output = new MatrixStruc(nR, nC, background);   
           for (let i = 0; i < nR; i++) {
               for (let j = 0; j < nC; j++) {
                   u = i - i0;
                   v = j - j0;
                   if ( u >= 0 && u < nR && v >= 0 && v < nC ) {
                       output.data(i, j, intermediate.data(u, v));
                   }
               }
           }
           
           return output;
    }

    pad( {sX = 1, sY}, data = "real", padding = 0) {
        let nR, nC, intermediate, output;
        if (!sY) { 
            var sY = sX;
        }
        if (data === "amplitude") {
            intermediate = this.amplitude();
        } else if (data === "phase") {
            intermediate = this.phase();
        } else if (data === "real") {
            intermediate = this.real();
        } else if (data === "imaginary") {
            intermediate = this.imaginary();
        }   
        nR = Math.floor(sX * intermediate.nR);
        nC = Math.floor(sY * intermediate.nC);
        output  = new MatrixStruc(nR, nC, (i, j) => {
            if (i < intermediate.nR && j < intermediate.nC ) {
                return intermediate.data(i, j)
            } else {
                return padding;
            }
        })
        return output;
    }

    scale({sX = 1, sY}, interpolation = "nearest", data = "real", background = 255) {
        if (typeof(sX) === "number" && typeof(background) === "number" ) {
            let nR, nC, u, v, current, intermediate, output;            
            if (data === "amplitude") {
                intermediate = this.amplitude();
            } else if (data === "phase") {
                intermediate = this.phase();
            } else if (data === "real") {
                intermediate = this.real();
            } else if (data === "imaginary") {
                intermediate = this.imaginary();
            }
            if (!sY) { 
                var sY = sX;
            }
            nR     = intermediate.nR;
            nC     = intermediate.nC;
            output = new MatrixStruc(nR, nC, background);
            for (let i = 0; i < nR; i++) {
                for (let j = 0; j < nC; j++) {
                    u = i / sX;
                    v = j / sY;
                    if ( interpolation === "nearest" ) {                
                        if (u >= 0 &&  Math.ceil(u) < nR && v >= 0 && Math.ceil(v) < nC) {
                            current = nearestneighborInterpolation(intermediate, u, v);
                            output.data(i, j, current);
                        }
                    } else if ( interpolation === "bilinear" ) {
                        if (u >= 0 &&  Math.ceil(u) < nR && v >= 0 && Math.ceil(v) < nC) {
                            current = bilinearInterpolation(intermediate, u, v)
                            output.data(i, j, current);
                        }
                    } else if ( interpolation === "bicubic") {
                        if ( u-1 >= 0 &&  Math.ceil(u+1) < nR && v-1 >= 0 && Math.ceil(v+1) < nC ) {
                            current = bicubicIterpolation(intermediate, u, v);
                            output.data(i, j, current);
                        } else if ( u >= 0 &&  Math.ceil(u) < nR && v >= 0 && Math.ceil(v) < nC ) {    
                            current = bilinearInterpolation(intermediate, u, v);
                            output.data(i, j, current);
                        }
                    }
                }
            }
            return output;
        }
    }

    scaleMatrix({sX = 1, sY}, interpolation = "nearest", data = "real", background = 0) {
        let output
            output = this.pad( {sX, sY}, data).scale({sX, sY}, interpolation, data, background);
        return output;
    }

    rotate(theta, interpolation = "nearest", centerI = 0, centerJ = 0, background = 0, unit = "deg", data = "real") {
        if (typeof(theta) === "number" ) {
            let u, v, angle, current, nR, nC, intermediate, output;
            if (data === "amplitude") {
                intermediate = this.amplitude();
            } else if (data === "phase") {
                intermediate = this.phase();
            } else if (data === "real") {
                intermediate = this.real();
            } else if (data === "imaginary") {
                intermediate = this.imaginary();
            }
            nR = intermediate.nR;
            nC = intermediate.nC;
            output = new MatrixStruc(nR, nC, background);             
            if (unit === "deg") { 
                angle = degToRad(-theta);
            } else if (unit === "rad") {
                 angle = -theta;
            }    
            for (let i = 0; i < nR; i++) {
                for (let j = 0; j < nC; j++) {
                    u =   Math.cos(angle) * (i-centerI) + Math.sin(angle) * (j-centerJ)  + centerI;
                    v = - Math.sin(angle) * (i-centerI) + Math.cos(angle) * (j-centerJ)  + centerJ;
                    if ( interpolation === "nearest" ) {                
                        if (u >= 0 &&  Math.ceil(u) < nR && v >= 0 && Math.ceil(v) < nC) {
                            current = nearestneighborInterpolation(intermediate, u, v);
                            output.data(i, j, current);
                        }
                    } else if ( interpolation === "bilinear" ) {
                        if (u >= 0 &&  Math.ceil(u) < nR && v >= 0 && Math.ceil(v) < nC) {
                            current = bilinearInterpolation(intermediate, u, v)
                            output.data(i, j, current);
                        }
                    } else if ( interpolation === "bicubic") {
                        if ( u-1 >= 0 &&  Math.ceil(u+1) < nR && v-1 >= 0 && Math.ceil(v+1) < nC ) {
                            current = bicubicIterpolation(intermediate, u, v);
                            output.data(i, j, current);
                        } else if ( u >= 0 &&  Math.ceil(u) < nR && v >= 0 && Math.ceil(v) < nC ) {    
                            current = bilinearInterpolation(intermediate, u, v);
                            output.data(i, j, current);
                        }
                    }
                }
            }
            return output;
        }
    }

    rotateMatrix(theta, interpolation = "bilinear", background = 0, unit = "deg", data = "real") {
        let intermediate, inR, inC, hypotenuse, i0, j0, centerI, centerJ, output;
        intermediate = this.clone();
        inR   = intermediate.nR;
        inC   = intermediate.nC;
        hypotenuse = Math.sqrt(Math.pow(inR, 2) + Math.pow(inC, 2));
        hypotenuse = Math.floor(hypotenuse);
        i0 = Math.floor((hypotenuse - inR) / 2);
        j0 = Math.floor((hypotenuse - inC) / 2);
        output  = matrix(background, hypotenuse, hypotenuse).update(intermediate);
        centerI = Math.floor(output.nR/2);
        centerJ = Math.floor(output.nC/2);
        output  = output.shift(i0, j0, data, background).rotate(theta, interpolation, centerI, centerJ, background, unit, data);
        return output;
    }

    reflect(type = "hor", data = "real") {
        let nR, nC, intermediate, output;
        if (data === "amplitude") {
            intermediate = this.amplitude();
        } else if (data === "phase") {
            intermediate = this.phase();
        } else if (data === "real") {
            intermediate = this.real();
        } else if (data === "imaginary") {
            intermediate = this.imaginary();
        }
        nR     = intermediate.nR;
        nC     = intermediate.nC;
        output = new MatrixStruc(nR, nC, 0);
        if (type === "hor") {
            for (let i = 0; i < nR; i++) {
                for (let j = nC-1; j >= 0; j--) {
                    output.data( i, j, intermediate.data(i    , nC-j-1) );
                }
            }
        } else if (type === "ver") {
            for (let i = nR-1; i >= 0; i--) {
                for (let j = 0; j < nC; j++) {
                    output.data( i, j, intermediate.data(nR-i-1,      j) );
                }
            }
        }
        return output;
    }

    invert(max = 255, data = "real") {
        let nR, nC, intermediate, output, value;
        if (data === "amplitude") {
            intermediate = this.amplitude();
        } else if (data === "phase") {
            intermediate = this.phase();
        } else if (data === "real") {
            intermediate = this.real();
        } else if (data === "imaginary") {
            intermediate = this.imaginary();
        }
        nR     = intermediate.nR;
        nC     = intermediate.nC;
        output = new MatrixStruc(nR, nC);
        for (let i = 0; i < nR; i++) {
            for (let j = 0; j < nC; j++) {
                value = max - intermediate.data(i, j);
                output.data(i, j, value)
            }
        }
        return output;
    }

    threshold(T, min = 0, max = 255, data = "real") {
        let nR, nC, intermediate, output, value;
        if (data === "amplitude") {
            intermediate = this.amplitude();
        } else if (data === "phase") {
            intermediate = this.phase();
        } else if (data === "real") {
            intermediate = this.real();
        } else if (data === "imaginary") {
            intermediate = this.imaginary();
        }
        nR     = intermediate.nR;
        nC     = intermediate.nC;
        output = new MatrixStruc(nR, nC); 
        for (let i = 0; i < nR; i++) {
            for (let j = 0; j < nC; j++) {
                if (intermediate.data(i, j) >= T) {
                    value = max;
                } else {
                    value = min;
                }
                output.data(i, j, value)
            }
        }
        return output;
    }

    filterGen(type = "average", size = 3, param = 0.4) {
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
            } else if (type === "disk") {
                let center = Math.floor( (2*size+1) / 2 );
                    h      = new MatrixStruc(2*size+1, 2*size+1, (i, j) => {
                    if ( Math.pow( (i-center) , 2 )  + Math.pow( (j-center) , 2 ) <= Math.pow(size, 2) ) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                let sum = h.sum().re;
                h = h.etimes(1/sum);
            } else if (type === "sobel") {
                h = matrix([
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
            } else if (type === "LoG") {
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
            } 
            return h.round(6);
        } else {
            console.log("The size must be an odd integer")
        }
    }

    hfilterGen(type = "sobel", size = 3, param = 0.4) {
        let h;
        if (size%2 === 1) {

            if (type === "sobel") {
                h = this.filterGen(type = "sobel", size, param);
            } else if (type === "laplacian") {
                h = this.filterGen(type = "laplacian", size, param);
            } else if (type === "log") {
                h = this.filterGen(type = "LoG", size, param);
            } else if (type === "prewitt") {
                h = this.filterGen(type = "prewitt", size, param);
            } else {
                h = this.filterGen(type = "sobel", size, param);
                console.log("The Name Provided is not a valid filter type");
            }
            return h.round(6);
        } else {
            console.log("The size must be an odd integer")
        }
    }

    imGradient(outType = "MagnitudeAngle", filter = {type: "laplacian", size:5, parameter: 0.7} , unit = "deg") {
        let filterN, filterT, outputX, outputY, alpha;        
        if ( Array.isArray(filter) ) {
            filterN = matrix(filter);
        } else if ( filter.nR === undefined ) {
            filterN = this.hfilterGen(filter.type, filter.size, filter.parameter);
        } else {
            filterN = new MatrixStruc(filter.nR, filter.nC, (k, l) => {
                return filter.content[k][l];
            })
        }
        filterT = filterN.transpose();
        outputX = this.filter2d(filterN, "same");
        outputY = this.filter2d(filterT, "same");
        if (outType === "DXDY") {
            return [outputX, outputY];
        } else if ( outType === "MagnitudeAngle") {
            let Magnitude, Angle;
            
            Magnitude = new MatrixStruc(outputX.nR, outputX.nC, (i, j) => {
                return Math.sqrt( Math.pow(outputX.content[i][j], 2) + Math.pow(outputY.content[i][j], 2) );
            });

            Angle     = new MatrixStruc(outputX.nR, outputX.nC, (i, j) => {   
            
                if ( outputX.content[i][j] !== 0 ) {
                    alpha = Math.atan( outputY.content[i][j] / outputX.content[i][j] );
                } else {
                    if ( outputY.content[i][j] > 0) {
                        alpha = Math.PI/2;
                    } else if ( outputY.content[i][j] < 0) {
                        alpha = -Math.PI/2;
                    } else if ( outputY.content[i][j] === 0) {
                        alpha = 0;
                    }
                }

                if (unit === "deg") {
                    alpha = radToDeg(alpha);
                } else if ( unit === "rad" ) {
                    alpha = alpha;
                }

                return alpha;

            });  

            return [Magnitude, Angle];
        }
    }

    cannyEdgeDetection(thresholds = {tL: 50, tH: 200}, Gausian = {size: 3, sigma: 0.6} , edgeDetector = {type: "sobel", size: 3, parameter: 0.7}, unit = "deg" ) {
        let BinGenerator, gFilter, input, MA, M, A, intermediate, tH, tL, gH, gL, canny, bin, pixel, pixelU, pixelD, candidate;
        
        BinGenerator = function(alpha) {
            let angle, bin;
            angle = alpha%360;
            if (angle < 0) {
                angle = 360 - angle;
            }
            if (          (angle >= 237.5 || angle < 22.5)   || (angle >= 157.5 && angle < 202.5) ) {
                bin = [ 
                    {i0: 0 ,j0:+1}, 
                    {i0: 0 ,j0:-1} 
                ];
            } else if (   (angle >= 22.50 && angle < 67.5)   || (angle >= 202.5 && angle < 247.5)  ) {
                bin = [ 
                    {i0:-1 ,j0:+1}, 
                    {i0:+1 ,j0:-1} 
                ];
            } else if (   (angle >= 67.50 && angle < 112.5)  || (angle >= 247.5 && angle < 292.5) ) {
                bin = [ 
                    {i0:-1 ,j0: 0}, 
                    {i0:+1 ,j0: 0} 
                ];
            } else if (   (angle >= 112.50 && angle < 157.5) || (angle >= 292.5 && angle < 337.5) ) {
                bin = [ 
                    {i0:-1 ,j0:-1}, 
                    {i0:+1 ,j0:+1} 
                ];
            } 
            return bin;
        }
        
        gFilter   = this.filterGen("gaussian", Gausian.size, Gausian.sigma);
        input     = this.filter2d(gFilter, "same");
        MA        = input.imGradient("MagnitudeAngle", edgeDetector, "rad");
        M         = MA[0];
        A         = new MatrixStruc(MA[1].nR, MA[1].nC, (i, j) => {
            return radToDeg( MA[1].content[i][j] );
        });
        
        intermediate = new MatrixStruc(M.nR, M.nC, (i, j) => {
            bin   = BinGenerator( A.content[i][j] );
            pixel = M.content[i][j];
            if ( ( (i+bin[0].i0 < M.nR) && (i+bin[0].i0 >= 0) ) && ( (j+bin[0].j0 < M.nC) && (j+bin[0].j0 >= 0 ) ) ) {
                pixelU = M.content[i+bin[0].i0][j+bin[0].j0] ;
            } else {
                pixelU = Number.NEGATIVE_INFINITY;
            }
            if ( ( (i+bin[1].i0 < M.nR) && (i+bin[1].i0 >= 0) ) && ( (j+bin[1].j0 < M.nC) && (j+bin[1].j0 >= 0 ) ) ) {
                pixelD = M.content[i+bin[1].i0][j+bin[1].j0] ;
            } else {
                pixelD = Number.NEGATIVE_INFINITY;
            }
            if ( pixel > pixelU && pixel > pixelD ) {                
                return pixel;
            } else {
                return 0;
            }
        })

        tH = (thresholds.tH >= thresholds.tL) ? thresholds.tH : thresholds.tL;
        tL = (thresholds.tL <= thresholds.tH) ? thresholds.tL : thresholds.tH;
        gH = intermediate.threshold(tH);
        gL = intermediate.threshold(tL);

        canny = new MatrixStruc(intermediate.nR, intermediate.nC, (i, j) => {
            if (gH.content[i][j] !== 0) {
                return gH.content[i][j];
            } else {
                candidate = gL.content[i][j];
                if ( (i-1) >= 0 && (j-1) >= 0 && gH.content[i-1][j-1] !== 0 ) {
                    return candidate;
                }
                if ( (i-1) >= 0 && gH.content[i-1][j] !== 0 ) {
                    return candidate;
                }
                if ( (i-1) >= 0 && (j+1) < intermediate.nC && gH.content[i-1][j+1] !== 0 ) {
                    return candidate;
                }
                if ( (j-1) >= 0 && gH.content[i][j-1] !== 0 ) {
                    return candidate;
                }
                if ( (j+1) < intermediate.nC && gH.content[i][j+1] !== 0 ) {
                    return candidate;
                }
                if ( (i+1) < intermediate.nR && (j-1) >= 0 && gH.content[i+1][j-1] !== 0 ) {
                    return candidate;
                }
                if ( (i+1) < intermediate.nR && gH.content[i+1][j] !== 0 ) {
                    return candidate;
                }
                if ( (i+1) < intermediate.nR && (j+1) < intermediate.nC && gH.content[i+1][j+1] !== 0 ) {
                    return candidate;
                }
                return 0;
            }
        })

        if (unit === "deg") {
            return [ canny, A     ];
        } else if (unit === "rad") {
            return [ canny, MA[1] ];
        }
    }

    erode(structureSet, T) {
        let structure, BW, indexI, indexJ, output, include;    
        structure = structureSet.collection;
        if (T === undefined) {
            BW = this.OTSUThreshold();
        } else if ( typeof(T) === "string" && T === "binary" ) {
            BW = this;
        } else if ( typeof(T) === "number" ) {
            BW = this.threshold(T);
        }

        output    = new MatrixStruc(BW.nR, BW.nC, 0);

        for (let i = 0; i < BW.nR; i++) {
            for (let j = 0; j < BW.nC; j++) {
                include = true;
                for (let k = 0; k < structure.length; k++) {
                    indexI = i + structure[k][0];
                    indexJ = j + structure[k][1];
                    if ( indexI >= 0 && indexJ >= 0 && indexI < BW.nR && indexJ < BW.nC ) {
                        if ( BW.content[indexI][indexJ] === 0) {
                            include = false;
                            break;
                        } else {
                            continue;
                        }
                    }
                }
                if (include) { output.content[i][j] = 255 };
            }
        }

        return output;

    }

    dilate(structureSet, T) {
        let structure, BW, indexI, indexJ, output, include;    
        structure = structureSet.collection;    
        if (T === undefined) {
            BW = this.OTSUThreshold();
        } else if ( typeof(T) === "string" && T === "binary" ) {
            BW = this;
        } else if ( typeof(T) === "number" ) {
            BW = this.threshold(T);
        }

        output = new MatrixStruc(BW.nR, BW.nC, 0);

        for (let i = 0; i < BW.nR; i++) {
            for (let j = 0; j < BW.nC; j++) {
                include = false;
                for (let k = 0; k < structure.length; k++) {
                    indexI = i + structure[k][0];
                    indexJ = j + structure[k][1];
                    if ( indexI >= 0 && indexJ >= 0 && indexI < BW.nR && indexJ < BW.nC ) {
                        if ( BW.content[indexI][indexJ] !== 0) {
                            include = true;
                            break;
                        } else {
                            continue;
                        }
                    }
                }
                if (include) { output.content[i][j] = 255 };
            }
        }

        return output;

    }

    open(structureSet, T) {
        let output;
        if ( T === undefined ) {
            output = this.erode(structureSet).dilate(structureSet, "binary");
        } else {
            output = this.erode(structureSet, T).dilate(structureSet, "binary");
        }

        return output;

    }

    close(structureSet, T) {
        let output;
        if ( T === undefined ) {
            output = this.dilate(structureSet).erode(structureSet, "binary");
        } else {
            output = this.dilate(structureSet, T).erode(structureSet, "binary");
        }

        return output;
        
    }
}

// Classes

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

// Utility Functions 

function degToRad(degrees) {
    if (degrees.constructor.name === "MatrixStruc") {
        let output = new MatrixStruc(degrees.nR, degrees.nC);
        for (let i = 0; i < degrees.nR; i++) {
            for (let j = 0; j < degrees.nC; j++) {
                output.data(i, j, ( degrees.data(i, j) * (Math.PI / 180) ));
            }
        }
        return output;
    } else if (typeof(degrees) === "number") {
        let output = degrees * (Math.PI / 180);
        return output;
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

function nearestneighborInterpolation(m, u, v) {
    let uu      = Math.floor(u);
    let vv      = Math.floor(v);
    let current = m.data(uu,vv);
    return current;
}

function bilinearInterpolation(m, u, v) {
    let alpha   = u - Math.floor(u); 
    let beta    = v - Math.floor(v);     
    let p00 = m.data( Math.floor(u),  Math.floor(v) );
    let p01 = m.data( Math.floor(u),  Math.ceil(v)  );
    let p10 = m.data( Math.ceil (u),  Math.floor(v) );
    let p11 = m.data( Math.ceil (u),  Math.ceil(v) );
    let current = ( (1-alpha) * p00 + alpha * p10 ) * (1-beta) + ( (1-alpha) * p01 + alpha * p11 ) * beta;
        current = Math.round(current);
    return current;
}

function bicubicIterpolation(m, u, v) {
    let u0 = Math.floor(u);
    let v0 = Math.floor(v);
    let uu = u - Math.floor(u);
    let vv = v - Math.floor(v);

    let B = matrix([
        [ 1, 0,  0,  0],
        [ 0, 0,  1,  0],
        [-3, 3, -2, -1],
        [ 2,-2,  1,  1],
    ]);
    
    let Bt = B.transpose();

    let F  = new MatrixStruc(4, 4);
    F.data(0, 0, m.data(u0  , v0  ));
    F.data(1, 0, m.data(u0+1, v0  ));
    F.data(0, 1, m.data(u0  , v0+1));
    F.data(1, 1, m.data(u0+1, v0+1));

    F.data(2, 0, ( ( m.data(u0,   v0+1) - m.data(u0,   v0-1) ) / 2 ) );
    F.data(2, 1, ( ( m.data(u0,   v0+2) - m.data(u0,   v0  ) ) / 2 ) );
    F.data(3, 0, ( ( m.data(u0+1, v0+1) - m.data(u0+1, v0-1) ) / 2 ) );
    F.data(3, 1, ( ( m.data(u0+1, v0+2) - m.data(u0+1, v0  ) ) / 2 ) );

    F.data(0, 2, ( ( m.data(u0+1, v0  ) - m.data(u0-1,   v0) ) / 2 ));
    F.data(0, 3, ( ( m.data(u0+1, v0+1) - m.data(u0-1, v0+1) ) / 2 ));
    F.data(1, 2, ( ( m.data(u0+2, v0  ) - m.data(u0,     v0) ) / 2 ));
    F.data(1, 3, ( ( m.data(u0+2, v0+1) - m.data(u0,   v0+1) ) / 2 ));

    F.data(2, 2, ( ( ( m.data(u0-1, v0-1) + m.data(u0+1, v0+1) ) - (( m.data(u0+1, v0-1) + m.data(u0-1, v0+1)) )) / 4 ) );
    F.data(2, 3, ( ( ( m.data(u0-1, v0  ) + m.data(u0+1, v0+2) ) - (( m.data(u0+1, v0  ) + m.data(u0-1, v0+2)) )) / 4 ) );
    F.data(3, 2, ( ( ( m.data(u0  , v0-1) + m.data(u0+2, v0+1) ) - (( m.data(u0+2, v0-1) + m.data(u0  , v0+1)) )) / 4 ) );
    F.data(3, 3, ( ( ( m.data(u0  , v0  ) + m.data(u0+2, v0+2) ) - (( m.data(u0+2, v0  ) + m.data(u0  , v0+2)) )) / 4 ) );

    let alpha = B.times(F);
        alpha = alpha.times(Bt);

    let x = new MatrixStruc(1, 4, 0);
    let y = new MatrixStruc(4, 1, 0);

    for (let k = 0; k < 4; k++) {
        x.data(0, k, Math.pow(uu, k));
        y.data(k, 0, Math.pow(vv, k));
    }

    let p = x.times(alpha);
        p = p.times(y);

    return p.data(0, 0);
}

function cis(angle) {
    let output;
    output = new ComplexNumber(0, 0);
    if (typeof(angle) === "number") {
        output.re = Math.cos(angle);
        output.im = Math.sin(angle);
        return output;
    }
}

function nthroots(N, precis = 10) {
    let output; let angle; let base;
    angle   = -((2*Math.PI)/N);
    base    = cis(angle);
    output  = base.roots(N, precis);
    return output;
}

function Moivre(x, n) {
    if (typeof(x) === "number"&& typeof(n) === "number") {
        let output;
        output = cis(n*x);
        return output;
    }
}

function sqrt(nbr) {
    if (typeof(nbr) === "number" || (nbr.re || nbr.im) ) {
        let output;
        if (nbr >= 0) {
            output = Math.sqrt(nbr);
        } else if (nbr < 0) {
            output = new ComplexNumber(0, Math.sqrt(Math.abs(nbr)));
        } else if ( (nbr.re || nbr.im) ) {
            output = nbr.roots(2, 6);
        }
        return output;
    }
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
        let m  = new MatrixStruc(nR, nC);
        for (let i = 0; i < nR; i++) {
            for (let j = 0; j < nC; j++) {
                m.data(i, j, data[i][j]);
            }
        }
        return m;
    } else if (isArrayOfNumbers(data)) {  
        let m  = new MatrixStruc(1, data.length, (i,j) => {
            return data[j];
        });
        return m;       
    } else if (typeof(data) === "number" || typeof(data) === "function" || (data.re !== undefined && data.im !== undefined) ) {
        let m  = new MatrixStruc(nR, nC, data);
        return m;
    } else { 
        let m  = new MatrixStruc(3, 3, 0);
        return m;
    }
}

function zeros(nR, nC) {
    let m;
    if (arguments.length === 1) {
        m = new MatrixStruc(nR, nR, 0);
    } else {
        m = new MatrixStruc(nR, nC, 0);
    }
    return m;
}

function ones(nR, nC) {
    let m;
    if (arguments.length === 1) {
        m = new MatrixStruc(nR, nR, 1);
    } else {
        m = new MatrixStruc(nR, nC, 1);
    }
    return m;
}

function identity(n) {
    let m = new MatrixStruc(n, n, (i, j) => { 
        if (i === j) {
            return 1
        } else { 
            return 0
        }
    })
    return m;
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