import MatrixEngine from "./MatrixEngine/Matrix.js"
const Engine = new MatrixEngine();
let aFilter = Engine.filterGen("laplacian", 3);
let op      = { operation: "filter2d", args: [aFilter, "same"], components: [0]} 



Engine.readImage("./uploads/peppers_color.bmp")
.then( Engine.printToDOM( [0, 1, 2, 3] , "body" ) )
.then( Engine.step(op) )                            // Average R.G.B
.then( Engine.printToDOM( 0 , "body" ) ) // Prints  R.G.B.A