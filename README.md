# What is MatrixEngine?

MatrixEngine is a rich yet simple javascript library for Data/Image Processing, MatrixEngine is declarative and asynchronous, and it uses web workers and the GPU to process data, so it doesn't block the main thread. 

# Browser Support: 

    | Chrome | Edge | Firefox | Internet Explore | Opera | Safari |
    ---------------------------------------------------------------
    | 64     | 79   | 62      | No Support       | 51    |  11.1  | 
    

# Installation

In order to clone the "MatrixEngine" project template onto your machine execute the following command: 

```

git clone https://github.com/OHELLEL/MatrixEngine.git

```

# Getting Started 

Once you install the project template, you need to import the library to your main javascript file "index.js" and initialize the Library as follows
```js

import MatrixEngine from "./MatrixEngine/Matrix.js"
const Engine = new MatrixEngine();

```

Next, you need to create an upload folder lets call it "uploads" and insert images there.

Now, in order to read an image, use the "Engine.readImage()" method, this method returns a promise that resolves with an array of matricies ([0]:Red, [1]:Green, [2]:Blue, [3]:Alpha): 

```js

Engine.readImage("./uploads/peppers_color.bmp")

```

In order to log the returned array use "Engine.log()" method as follows: 

```js

Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.log() )

```
The logged result is an array of matricies each one of them represent one of the tristimulus components + Alpha Component ([0]:Red, [1]:Green, [2]:Blue, [3]:Alpha)

![Engine log](./README/1.png?raw=true)

The "nR" property in each matrix represent the number of rows in that matrix (height), and the "nC" property represent the number of columns (width) and the "content" property represent the numerical data contained in the matrix (and it can be a number or a complex number).

Next, let say that you want to view the intensity of the first component ( [0]: RED ) alone in a new canvas, you can use "Engine.printToDOM()" method, this method receive two arguments. The first argument can be either a single index or an array of indicies that represent RGBA components to print, and the second argument is the DOM element to which we want to append the canvas:


```js

 Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.log() )
.then( Engine.printToDOM( 0 , document.body ) ) // prints the intensity of the red component across all channels: R.R.R.A
// Note: The second argument can be a query selector as follows " Engine.printToDOM(0 , "body") "
```

![RED across all channels + Alpha](./README/2.png?raw=true)

Another option is to specify the indicies that we want to print in an array:

```js

Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.log() )
.then( Engine.printToDOM( [0, 3] , "body" ) ) // prints the red component and alpha components and removes the other components: R._._.A

```

![RED/Alpha Channels Only](./README/3.png?raw=true)

Now, let says you want to download the processed image, you can use the "Engine.downloadImage()" method, which receive nothing if you want to print all the RGBA components or a number if you want to print one specific component across all channels or an array of indicies if you want to print specific components and cancel the others.

```js
 Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.log() )
.then( Engine.printToDOM( [0, 2, 3] , "body" ) ) // prints R._.B.A
.then( Engine.downloadImage([0, 2, 3]) ) // prints R._.B.A
```

!["---"](./README/4.png?raw=true)

Now let says you want to blur the image with an averaging filter, first you need to create this filter using the "Engine.filterGen()" Method, so you need to specify the type of the filter as "average" and it's size.

```js
let aFilter = Engine.filterGen("average", 7);
console.log( aFilter.print() );
```

!["---"](./README/5.png?raw=true)

Next you need to apply the filter using the "Engine.step()" method, this method receives a javascript object that specifies the name of the operation, in this case "filter2d" then an array of arguments in this case the arguments are the averaging filter and a string that tells the engine to return an output of the same size as the input, next we specify the components that we want to effect with this operation, in this case we will average each one of them except the alpha component so: [0, 1, 2]:

```js 
let aFilter = Engine.filterGen("average", 7);
let op      = { operation: "filter2d", args: [aFilter, "same"], components: [0, 1, 2]} 
Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.step(op) )                            // Average R.G.B
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) ) // Prints  R.G.B.A
```

!["---"](./README/6.png?raw=true)


!["---"](./README/7.png?raw=true)

Now let say that we want to calculate the gradient of the image using the "sobel" operator, we apply the same process but we use a "sobel" filter: 

```js 
let sobel = Engine.filterGen("sobel");
console.log(sobel.print());
```

!["---"](./README/8.png?raw=true)

```js 
let sobel = Engine.filterGen("sobel");
let op    = { operation: "filter2d", args: [sobel, "same"], components: [0, 1, 2]}

Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.step(op) )
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
```

!["---"](./README/9.png?raw=true)

Next let say you want to apply the sobel filter then invert the intensity of each tristimulus component, so you need perform two operations one for filtering and the other for inverting the intensity, so you need to run the "Engine.step()" method two times:

```js 
let sobel = Engine.filterGen("sobel");
let op1      = { operation: "filter2d", args: [sobel, "same"],   components: [0, 1, 2]}
let op2      = { operation: "invert",                            components: [0, 1, 2]} // the invert process does'nt receive any arguments in this case

Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.step(op1) )
.then( Engine.step(op2) )
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
```

!["---"](./README/10.png?raw=true)

This solution is fine but it might be convenient if we we can stack all the operations together inside one array called "ops" and then apply all of them at once, and we can do that using the "Engine.run()" method: 

```js 
let sobel = Engine.filterGen("sobel");
let ops      = [
    { operation: "filter2d", args: [sobel, "same"],   components: [0, 1, 2]},
    { operation: "invert",                            components: [0, 1, 2]} // the invert process does'nt receive any arguments in this case
]

Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.run(ops) )                             // Filter and Invert
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
```

!["---"](./README/10.png?raw=true)

Next let's say you want to create your own filter, in order to do that you can use the "Engine.matrix()" method, this methods receives an array of numbers or an array of __arrays of numbers__: 

```js 
let myFilter = Engine.matrix([
    [5, 0, -2], 
    [0, 1,  0],
    [2, 0, -5]
]);

let ops      = [
    { operation: "filter2d", args: [myFilter, "same"], components: [0, 1, 2]},
]

Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.run(ops) )
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
```

!["---"](./README/11.png?raw=true)


There are two types of operations: Main Operations that produces an altered version of the input and passe it down or Side Operations that provides informations about each input: for example the histograme of each components

```js 
let ops      = [
    { operation: "hist", components: [0, 1, 2, 3]},
]
Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.run(ops) )
.then( Engine.log() )
```

!["---"](./README/12.png?raw=true)

Another side operation is the fft2d: 

```js
let ops      = [
    { operation: "fft2d", components: [0]},
]
Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.run(ops) )
.then( Engine.log() )
```

!["---"](./README/13.png?raw=true)

Notice how the fft2d property contains two matricies one for the amplitude and the other for the phase, let say we want to print the amplitude using "Engine.printToDOM()" method, we need first to extract the side information and push it to the main stream of data, and we do that using the "Engine.sideToMain()" method, this method receives the name of the side information and the index of the components it resides on.

```js
let ops      = [
    { operation: "fft2d", components: [0]},
]
Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.run(ops) )
.then( Engine.log() )
.then( Engine.sideToMain("fft2d", 0 ) )
.then( Engine.log() )
```

!["---"](./README/14.png?raw=true)


Since the fft values can be very small at heigh frequencies and very large at low frequencies we need to unit scale [0, 1] and amplify by a large factor and then visualize the result: 

```js
let ops      = [
    { operation: "fft2d", components: [0]},
]

let fftops   = [
    { operation: "unitScale", components: [0]},
    { operation: "etimes", args: [300000], components: [0]},
]

Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.run(ops) )
.then( Engine.sideToMain("fft2d", 0 ) )
.then( Engine.run(fftops) )
.then( Engine.printToDOM(0, document.body) )
```

!["---"](./README/15.png?raw=true)

As you can see using MatrixEngine is quite simple and straight forward, but we are barely scratching the surface, in the next section you will find a detailed guide about the available methods and operations.

# The Basics: 

## Main Thread Methods: 

MatrixEngine provies a number of usefull lightweight methods that runs on the main thread (the browser thread):

1. The "readImage( link )" Method: 

    This method fetch an image from a link that respect the same origin policy (same host, same protocol, same port) and returns a promise that resolves with an array of matricies: [0]:Red, [1]:Green, [2]:Blue, [3]:Alpha :

    ```js
        const link = "./uploads/peppers_color.bmp" ;
        Engine.readImage(link) ;
    ```

2. The "printToDOM(indicies, DOMElement, alpha)" Method: 

    This method create a canvas element and prints the specified matricies into it and then appends the canvas to the specified DOM element.

    #### Parameters: 

    - indicies: an integer that represent the matrix to print: e.g: 1 this will print the second matrix across all channels and sets the fourth channel to 255 to make the result visible:

         Matrix[1]  => Red.

         Matrix[1]  => Green.

         Matrix[1]  => Blue.

        [...255...]  => Alpha
    
    ```js
        const link = "./uploads/peppers_color.bmp" ;
        Engine.readImage(link)
        .then( Engine.printToDOM(1, Document.body) )
    ```

    In the case of an array of indicies: [0, 1] this will print the first and the second matricies but this won't be visible (Transparent) because we didn't set the Alpha channel :

         Matrix[0]  => Red.

         Matrix[1]  => Green.

        [....0....]  => Blue.

        [....0....]  => Alpha

    
    ```js
        const link = "./uploads/peppers_color.bmp" ;
        Engine.readImage(link)
        .then( Engine.printToDOM([0, 1], Document.body) )
    ```

    This problem can be fixed by setting the third parameter alpha to true: printToDOM([0, 1], DOMElement, true)

    - DOMElement: a querySelector (CSS Selector) or a DOM Object.

    ```js
        const link = "./uploads/peppers_color.bmp" ;
        Engine.readImage(link)
        .then( Engine.printToDOM([0, 1], "body", true) )
    ```
3. The "updateCanvas(querySelector, indicies)" Method :

    This method update a canvas that is selected by a query selector or passed as a reference by the specified matricies in the indicies Array (indicies can be an integer if you want to print a single matrix);

4. The "downloadImage(indicies, alpha)" Method: 

    This method create a canvas element and prints the specified matricies into it and then download the resulting picture as a png file.

    #### Parameters: 

    __indicies__: an integer that represent the matrix to print: e.g: 1 this will print the second matrix across all channels and sets the fourth channel to 255 to make the result visible:

         Matrix[1]  for Red.
         Matrix[1]  for Green.
         Matrix[1]  for Blue.
        [...255...] for Alpha

    ```js
        const link = "./uploads/peppers_color.bmp" ;
        Engine.readImage(link)
        .then( Engine.downloadImage( 1 ) )
    ```  
    In the case of an array of indicies: [0, 1] this will print the first and the second matricies but this won't be visible(Transparent) because we didn't set the Alpha channel :

         Matrix[0]  for Red.
         Matrix[1]  for Green.
        [....0....] for Blue.
        [....0....] for Alpha

    This problem can be fixed by setting the second parameter alpha to true: printToDOM([0, 1], DOMElement, true)

    ```js
        const link = "./uploads/peppers_color.bmp" ;
        Engine.readImage(link)
        .then( Engine.downloadImage([0, 1], true) )
    ```

5. The "matrix()" Method: 
    This method create a matrix of height: nR and width: nC, with a value equal to: DataValue.

    #### Parameters:
    #### Option 1: "matrix(DataValue, nR, nC)"
      - DataValue: this can be a realNumber ( e.g: 5 ) or a complexNumber (e.g: {re: 3, im: -6}) or a call back that receives the current indicies (i, j) and returns a real or complex Number ( e.g: (i, j) => { return i*j } ).
      - nR: Number of rows.
      - nC: Number of Columns.

    Example 1:
    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix(3, 15, 15);
        console.log(m);
     ```

    !["---"](./README/16.png?raw=true)

    Example 2:
    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix( Engine.complex(2, 1) , 5, 5);
        console.log(m);
     ```

    !["---"](./README/17.png?raw=true)

    #### Option 2: "matrix(Array)"
      - Array: an array of numbers 
                e.g: [2, 2, 3, 4, 5].
    Example 1:
    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix([2, 2, 3, 4, 5]);
        console.log(m);
     ```

    !["---"](./README/18.png?raw=true)

    #### Option 2: "matrix(Array of arrays of real numbers)"
       - NestedArrays: Nested array of number of the same size.
        e.g: [
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5],
        ].
    Example 1:
    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix([
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5],
        ]);
        console.log(m);
     ```

    !["---"](./README/19.png?raw=true)

    ## Matrix Methods that runs on the main thread:
    - _data(i, j, v)_ : This method can be used to get the value of a specific element in the matrix or it can be used to mutate its value:

    Example 1: getting element value

    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix([
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5],
        ]);

        console.log(m);
        console.log("Element of index: 1, 3 has the value : "  + m.data(1, 3));
    ```

    !["---"](./README/20.png?raw=true)


    Example 2: mutating the element value (setting)

    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix([
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5]
        ]);

        m.data(1, 3, 5555);
        console.log(m);
    ```

    !["---"](./README/21.png?raw=true)


    - _print()_ : This method prints the matrix content as a string in a form of a multidimentional array 

    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix( Engine.complex(2, 1) , 5, 5);
        console.log(m.print());
    ```

    !["---"](./README/22.png?raw=true)


    - _mArray()_ : This method converts the matrix content to a multidimentional array

    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix( Engine.complex(2, 1) , 5, 5);
        console.log(m.mArray());
    ```

    !["---"](./README/23.png?raw=true)

    - _clone(i, j, nRCloned = 1, nCCloned)_ : this method can be used to clone the entire matrix or a section of the matrix:

    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix([
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5],
        ]);
        console.log(m.print());
        console.log(m.clone().print());
        console.log(m.clone(1, 1, 2, 2).print());
    ```

    !["---"](./README/24.png?raw=true)


    - _serialize()_ : serialize the content of matrix and returns a matrix of size 1 x (nR*nC)

    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix([
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5],
        ]);
        console.log(m);
        console.log(m.serialize());
    ```
    !["---"](./README/25.png?raw=true)

    - _row(i)_ : returns the row of index i

    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix([
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5],
        ]);
        console.log(m.print());
        console.log(m.row(2).print());
        console.log(m.row(0).print());
    ```
    !["---"](./README/26.png?raw=true)

    - _column(j)_ : returns the column of index j

    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix([
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5],
        ]);
        console.log(m.print());
        console.log(m.column(0).print());
        console.log(m.column(3).print());
    ```
    !["---"](./README/27.png?raw=true)

    _removeRow(i)_ : removes the row of index i and returns a new matrix

    ```js
        const Engine = new MatrixEngine();
        let m = Engine.matrix([
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5],
        ]);
        console.log(m.print());
        console.log(m.removeRow(0).print());
        console.log(m.removeRow(0).removeRow(1).print());
    ```
    !["---"](./README/28.png?raw=true)

   -  _removeColumn(j)_ : removes the column of index j and returns a new matrix

   -  _replaceColumn(j, column)_ : replaces the column of index j, with the specified column


    ```js
        let col = Engine.matrix([
            [99],
            [99],
            [99],
        ])

        let m = Engine.matrix([
            [7, 2, 1, 4],
            [5, 9, 7, 8],
            [9, 0, 1, 5],
        ]);
        console.log(m.print());
        console.log(m.replaceColumn(2, col).print());
    ```

    !["---"](./README/29.png?raw=true)


    - _replaceRow(i, row)_ : replaces the row of index i, with the specified row

    - _swapRow(k, l)_ : swaps the two rows k and l;

    - _swapCol(k, l)_ : swaps the two columns k and l;

    - _transpose()_ : transpose the matrix.

    - _etimes(m)_ : if the input argument is a number or a complex number, the "etimes()" method multiplies all element with the input value, if the input value is a matrix then the "etimes()" methods performs element per element multiplication given that the two matricies have the same size.

    - _plus(m)_ : if the input argument is a number or a complex number, the "plus()" method increments all element by the input value m, if the input argument is a matrix, the "plus()" methods performs element per element addition given that the two matricies have the same size.

    - _minus(m)_ : if the input argument is a number or a complex number, the minus method decrement all element by the input value m, if the input argument is a matrix, the "minus()" methods performs element per element addition given that the two matricies have the same size.

    - _normalize(factor)_ : if you don't provide a factor this method normalize each row by its corresponding diaganole value, if you provide the factor value its uses that value to normalize all the matrix.

    - _update(input, i, j, nRUpdated, nCUpdated)_ : updates a section of the matrix, with constant value or a matrix at position i,j.

    - _augmentBy(m)_ : augment the matrix by the input matrix.

    - _round(precision)_ : round the input according to the required precision.

    - _sum()_ : returns the sums of all matrix values.

    - _sumCols()_ : returns a row matrix that holds the sum of each column.

    - _sumRows()_ : returns a colum matrix that holds the sum of each row.

    - _amplitude(precis = 10)_ : returns a matrix of the amplitudes of each element in the matrix.

    - _real()_ :  returns a matrix of the real part of each element in the matrix.

    - _imaginary()_ : returns a matrix of the imaginary part of each element in the matrix.

    - _phase(unit = "rad", precis = 10)_ : returns a matrix of the phases of each element in the matrix.

    - _conjugate()_ : returns a matrix of the conjugate of each element in the matrix.

    - _transpose()_ : returns the transpose of the current matrix.

    - _times(m)_ : returns the result of the matrix product of the current matrix and the input matrix: m.

    - _mArray()_: returns a multidimentional array version of the matrix.

    - _forEach(callback, thisArg)_ : calls a provided callback function once for each element in the current matrix starting from the top left to the bottom right. 'callback' is invoked with three arguments: the value of the element, the indicies: {i: i, j: j} of the element, the matrix object being traversed, If a 'thisArg' parameter is provided to forEach(), it will be used as callback's **this** value.

    - _printToDOM(querySelector, css)_ : creates a canvas and prints the current matrix into it (grayScale) and appends the canvas to the specified parent, the parent can be specified using a querySelector or a refrence variable. optional: the css parameter is an object that holds the string value of the id and class of the created canvas: {id: id, class: class}.

    - _updateCanvas(querySelector)_: updates the selected canvas by the content of the current matrix.

    - _evalp(x, output = "array", input = "real")_: this method considers the rows coefficients of the current matrix as single variable polynomials coefficients and returns the value of each polynomial at value 'x'. output: specifies the output type: "array" or "matrix", input: specifies the nature of the coefficients and the input ("complex" or "real")

    - _evalp2(x, y, output = "array", input = "real")_: this method considers the rows coefficients of the current matrix as two variable polynomials  coefficients and returns the value of each polynomial at value 'x'. output: specifies the output type: "array" or "matrix", input: specifies the nature of the coefficients and the input ("complex" or "real")

    - _evalpM(matrix, output = "array", input = "real", k = 0)_: evaluates the current polynomial for each value in the provided 'matrix'


6. The "filterGen(type, size, parameter)" Method:
    This method generates the kernel of famous image Processing filters such as the "Gaussian" filter.

    ### Paramters: 

   - type: a string that specifies the type of filter we are about to generate.
   - size: the size of the generated filter, and this is not necessary for all types of filter some filters have a fixed size (e.g: "sobel").
   - parameter: this parameter differ from filter to another.

            |   Filter Type   |   Filter Size    |       parameter        |
            ---------------------------------------------------------------
            |    "average"    | Odd Integer >= 1 |                        |
            |   "gaussian"    | Odd Integer >= 1 |   Standard deviation   |
            |     "sobel"     |   Fixed size:3   |                        |
            |   "laplacian"   |   Fixed size:3   | Shape of the Laplacian |
            |      "log"      | Odd Integer >= 1 |   Standard deviation   |
            |    "prewitt"    |   Fixed size:3   |                        |
            |      "disk"     | Odd Integer >= 1 |                        |


7. The "zeros(nR, nC)" Method:

    returns a matrix of zeros of size: nR x nC.

8. The "ones(nR, nC)" Method:

    returns a matrix of one of size: nR x nC.

9.  The "identity(n)" Method:

    returns an identity matrix of size: n x n.

10. The "complex(re, im)" Method: 

    returns a complex number type, re: real part, im: imaginary part.

11. The "point(x1, x2, x3, ..... xn)" Method:

    returns a coordinate (a point) in the R<sup>n</sup> vector space.

12. The "vector(x1, x2, x3, ..... xn)" Method:

    returns a vector in the R<sup>n</sup> vector space.

13. The "realSet()" Method:

    returns an empty set for real numbers.

14. The "complexSet()" Method:

    returns an empty set for complex numbers.

15. The "pointSet()" Method:

    returns an empty set for coordinates in R<sup>n</sup>.

16. The "vectorSet()" Method:

    returns an empty set for vector in R<sup>n</sup>.

17. The "log( )" Method: 

    logs the resolved value of a promise in the console and push the same value for further processing.

18. The "structuringElement( ElementType , ElementParam1 , ElementParam2 )": 

        returns a set of 2d coordinates that can be used as structuring element in the morphological operations: dilate, erode, open, close.

        #### Parameters:

        |   Element Type   |         ElementParam1            |       ElementParam2    |
        --------------------------------------------------------------------------------
        |     "cross"      |  Height or Width of the cross    |                        |
        |     "disk"       |       radius of the disk         |                        |
        |    "diamond"     | Height or Width of the diamond   |                        |
        |    "square"      |    side length of the square     |                        |
        |   "rectangle"    |     Height of the rectangle      | Width of the rectangle |
        

19. The "sideToMain(propertyName, indicies)" Method:

    takes a property of one of the channels and push it as main information the stream of processing.

    #### Parameters: 

    - propertyName: the name of the property that we want to extract (e.g: fft2d or hist).
    - indicies: index or indicies of the targeted matricies (integer or an array of integers).

20. The "pushDownStream()" Method:

    takes any number of values (matricies) and push them down stream for further processing using the step() or run() methods or displaying using the "printToDOM()" method. 


21. The "pascalsCoef(n)" Method: 
    
    this methods returns a row matrix containing the pascals coefficients for a polynomial of order n.


22. 
## Set Methods (applies to: realSet, complexSet, pointSet, vectorSet): 

    - has(element): checks if the current set has the provided element.

    - values(): returns all the values of the set.

    - add(element): adds an element to the set.

    - remove(element): removes a certain element from the set if it alrealdy exists.

    - size(): returns the number of elements in the set.

    - union(otherSet): returns a new set that contains all the element of the current set plus the elements of the other set.

    - intersection(otherSet): returns a new set that contains only the common elements between the two sets.

    - difference(otherSet): returns a new set of elements that belongs to the current set but not the other set. 

    - subSet(otherSet): returns a boolean value: true if the other set is a subset of the current set, false otherwise.

    - toMatrix(): returns a matrix with the vectors (points) coordinates as columns, this is valid for: vectorSet and pointSet.

## Complex Numbers Methods: 

    - isNull()
    - equals(number)
    - isReal()
    - isImaginary()
    - round(precision)
    - plus(number)
    - minus(number)
    - times(number, precision)
    - pow(exponent, precision)
    - invert(precision)
    - conjugate()
    - over(nbr, precision)
    - amplitude(precision)
    - phase(unit = "rad", precision)
    - roots(n = 2, precision)
    - print()

## Points Methods: 

    - equals(point)
    - toMatrix()
    - print()
    - minus(point)
    - plus(point)
    - times(scalar)
    - distanceFrom(point)
    - round()

## Vectors Methods: 
    - equals(point)
    - toMatrix()
    - print()
    - plus(PointOrVector)
    - minus(PointOrVector)
    - times(PointOrVector)
    - magnitude()
    - round()
    - angle(Vector, unit = "rad" )

## GPU Methods: 

1. readImageGPU(imageLink, components): the link image to read, the compoents to read (e.g: "rgb", "rrr", "rrg", "r" = "rrr")
2. filter2dGPU(filter, components).
3. medFilter2dGPU(components);
4. gammaCorrectionGPU(gamma = {r: 1, g: 1, b: 1}, components);

## Worker Thread Methods: 

1. The "step( {operation, args, components} )" Method: 

    This method runs a specific operation: operation: string, given an array of arguments: args: array, on specific components: integer/array (specified by an integer or an array of integers) for more information check [Getting Started](#getting-started)

2. The "run(ops)" Method: 

    This method runs multiple operations at once:
    ```js 
    
    import MatrixEngine from "./MatrixEngine/Matrix.js"
    const Engine = new MatrixEngine();
    
    const ops = [
        {"operation1", args: [arg1, arg2], components: [0, 1, 2]},
        {"operation2", args: [arg1],       components:  0       },
        {"operation3",                     components: [0, 1, 2]}
    ]

    const link = "./uploads/peppers_color.bmp" ;
    Engine.readImage(link).
    then( Engine.run(ops) )

    ```

3. The set of operations that we can perform on the worker thread:

    there are two type of operations: side operations and main operations.
        Main operations returns an altered version of the input matrix.
        Side operations returns a side information about the input matrix as a new property of that matrix, e.g: hist for the histogramme.

## The List of All Worker thread Operations: 

    - {operation: "print",        components: indicies}

    ```js
        const ops    = {operation: "print",        components: [0]};
        Engine.readImage("./uploads/peppers_color.bmp")
        .then( Engine.step(ops) )
        .then( Engine.log() )
    ```

    - {operation: "mArray",       components: indicies}

    ```js
        const ops    = {operation: "mArray",        components: [0]};
        Engine.readImage("./uploads/peppers_color.bmp")
        .then( Engine.step(ops) )
        .then( Engine.log() )
    ```

    - {operation: "serialize",    components: indicies}

    ```js
        const ops    = {operation: "serialize",        components: [0]};
        Engine.readImage("./uploads/peppers_color.bmp")
        .then( Engine.step(ops) )
        .then( Engine.log() )
    ```

    - {operation: "transpose",    components: indicies}

    ```js
        const ops    = {operation: "transpose",        components: [0]};
        Engine.readImage("./uploads/peppers_color.bmp")
        .then( Engine.step(ops) )
        .then( Engine.log() )
    ```

    - {operation: "sum",          components: indicies}
    - {operation: "sumCols",      components: indicies}
    - {operation: "sumRows",      components: indicies}
    - {operation: "invert",       components: indicies}
    - {operation: "conjugate",    components: indicies}
    - {operation: "median",       components: indicies}
    - {operation: "real",         components: indicies}
    - {operation: "imaginary",    components: indicies}


    - {operation: "amplitude",    args: [precision], components: indicies}


    ```js
        const ops    = {operation: "amplitude",    args: [3], components: [0]};
        Engine.readImage("./uploads/peppers_color.bmp")
        .then( Engine.step(ops) )
        .then( Engine.log() )
    ```

    - {operation: "phase",        args: [unit,precision], components: indicies}

    ```js
        const ops    = {operation: "phase",        args: ["deg" , 3], components: [0]}
        Engine.readImage("./uploads/peppers_color.bmp")
        .then( Engine.step(ops) )
        .then( Engine.log() )
    ```

    - {operation: "round",               args: [precision], components: indicies}

    ```js
        const ops    = {operation: "round",               args: [3], components: [0]}
        Engine.readImage("./uploads/peppers_color.bmp")
        .then( Engine.step(ops) )
        .then( Engine.log() )
    ```

    - {operation: "removeRow",           args: [i], components: indicies}

    ```js
        const ops    = {operation: "removeRow",           args: [5], components: [0, 1, 2, 3]}
        Engine.readImage("./uploads/peppers_color.bmp")
        .then( Engine.step(ops) )
        .then( Engine.log() )
    ```

    - {operation: "removeColumn",        args: [j], components: indicies}
    - {operation: "replaceColumn",       args: [j,column], components: indicies}
    - {operation: "replaceRow",          args: [i,row], components: indicies}
    - {operation: "swapCol",             args: [k,l], components: indicies}
    - {operation: "swapRow",             args: [k,l], components: indicies}
    - {operation: "update",              args: [matrix,i,j,sizeX,sizeY], components: indicies}
    - {operation: "augmentBy",           args: [matrix], components: indicies}
    - {operation: "sortBy",              args: [index,mode], components: indicies}

    - {operation: "times",               args: [matrix], components: indicies}
    - {operation: "etimes",              args: [matrixOrscalar], components: indicies}
    - {operation: "plus",                args: [matrixOrscalar], components: indicies}
    - {operation: "minus",               args: [matrixOrscalar], components: indicies}

    - {operation: "normalize",           args: [factor], components: indicies}
    - {operation: "reduce",              args: [type,precision], components: indicies}
    - {operation: "determinant",         args: [technique], components: indicies}
    - {operation: "solve",               args: [Y], components: indicies}


    - {operation: "minmax",              args: [data], components: indicies} : data: "AmplitudePhase", "RealImaginary" , "raw"
    - {operation: "hist",                args: [data], components: indicies}
    - {operation: "PMF",                 args: [data], components: indicies}
    - {operation: "unique",              args: [data], components: indicies}
    - {operation: "CDF",                 args: [data,precision], components: indicies}

    - {operation: "medFilter2d",         args: [size], components: indicies} : size: window size.
    - 
    - {operation: "filter2d",            args: [kernel,outputSize], components: indicies} : outputsize: "same", "full"
    - {operation: "conv2d",              args: [kernel,outputSize], components: indicies} : outputsize: "same", "full"

    - {operation: "fft",                 args: [type,data], components: indicies} : type: "col", "row".

    - {operation: "ifft",                args: [type,data], components: indicies} : type: "col", "row".
    - {operation: "fft2d",               args: [data], components: indicies}
    - {operation: "ifft2d",              args: [data], components: indicies}
    - {operation: "fftShift",            args: [type], components: indicies}
    - {operation: "unitScale",           args: [data], components: indicies}
    - {operation: "stretchContrast",     args: [min,max,data], components: indicies}
    - {operation: "equalize",            args: [data], components: indicies}
    - {operation: "gammaCorrection",     args: [gamma,data], components: indicies}

    - {operation: "shift",               args: [i0,j0,data,background], components: indicies} : background: 0-255
    - {operation: "pad",                 args: [{snR,snC},data,padding], components: indicies} : padding: 0-255
    - {operation: "scale",               args: [{snR,snC},interpolation,data,background], components: indicies} 
    - {operation: "rotate",              args: [theta,interpolation,centerI,centerJ,background,unit,data] : interpolation: "nearest" , "bilinear", "bicubic".
    - {operation: "reflect",             args: [type,data],components: indicies} : type: "hor" , "ver".
    - {operation: "invert",              args: [max,data], components: indicies} : max: number

    - {operation: "scaleMatrix",         args: [{snR,snC},interpolation,data,background], components: indicies} : {snR: number, snC: number}
    - {operation: "rotateMatrix",        args: [theta,interpolation,background,unit,data], components: indicies}

    - {operation: "imGradient",          args: [data,filter,unit], components: indicies} : data: "MagnitudeAngle", "DXDY"; filter: {type: "laplacian", size:5, parameter: 0.7}: unit: "deg".
    - {operation: "cannyEdgeDetection",  args: [thresholds,Gausian,edgeDetector,unit], components: indicies} : thresholds = {tL: 50, tH: 200}, Gausian = {size: 3, sigma: 0.6} , edgeDetector = {type: "sobel", size: 3, parameter: 0.7}, unit = "deg" 
    - {operation: "threshold",           args: [T,min,max,data], components: indicies}
    - {operation: "OTSUThreshold",       args: [data], components: indicies}
    - {operation: "erode",               args: [structuringElement,T], components: indicies}
    - {operation: "erode",               args: [structuringElement,T], components: indicies}

    ```js
    const Engine = new MatrixEngine();
    const StrcEl = Engine.structuringElement("cross", 10);
    const ops    = {operation: "erode", args:[StrcEl, 100], components: [0]};
    Engine.readImage("./uploads/peppers_color.bmp")
    .then( Engine.step(ops) )
    .then( Engine.log() )
    .then( Engine.printToDOM(0, document.body) );
    ```
!["---"](./README/30.png?raw=true)

    - {operation: "dilate",              args: [structuringElement,T], components: indicies}

    ```js
    const Engine = new MatrixEngine();
    const StrcEl1 = Engine.structuringElement("disk", 10);
    const StrcEl2 = Engine.structuringElement("disk", 7);
    const StrcEl  = StrcEl1.difference(StrcEl2); // This will produce a structuring element of type "circle" of radius 9 and thickness 3

    const ops    = {operation: "erode", args:[StrcEl, 100], components: [0]};
    Engine.readImage("./uploads/peppers_color.bmp")
    .then( Engine.step(ops) )
    .then( Engine.log() )
    .then( Engine.printToDOM(0, document.body) );
    ```

!["---"](./README/31.png?raw=true)

    - {operation: "open",                args: [structuringElement,T], components: indicies}
    - {operation: "close",               args: [structuringElement,T], components: indicies}
