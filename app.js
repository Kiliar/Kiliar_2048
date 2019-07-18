// const http = require('http');
//
// const hostname = '127.0.0.1';
// const port = 3000;
//
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World\n');(
// });
//
// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });
"use strict";
let minArea = 4;
function Game(w = minArea, h = minArea) {
    const height = h >= minArea ? h : minArea;
    const width = w >= minArea ? w : minArea;
    let Points = {};
    let freeCells = () => {
        let array = [];
        for (let y = 0; y < width; y++) {
            for (let x = 0; x < height; x++) {
                if( !IsDefined([y,x]))
                array.push([y, x]);
            }
        }
        return array;
    };
    this.PointsList = Points;        // TODO: remove testing shit
    this.freeCels = freeCells;       // TODO: remove testing shit

    let RandomInt = (max) => Math.floor(Math.random() * max); // TODO: decrease random count
    let IsDefined = (pos) => typeof Points[CellName(pos)] != "undefined";
    let CellName = (pos) => pos[0]+"-"+pos[1];
    let CordsSum = (arr1, arr2) => [arr1[0]+arr2[0],arr1[1]+arr2[1]];
    let GetPoint = (pos) => {
        if (!IsDefined(pos)) return false;
        return [CellName(pos)];
    };
    function Point(pos, val) {
        this.pos = typeof pos == "string" ? [pos[0]*1, pos[2]*1] : pos;
        this.val = val;
        // this.marged = false;
    }
    function zeroArray(size = [height, width]) {
        let array = [];
        for (let i = 0; i < size[0]; i++) {
            array.push(size.length === 1 ? 0 : zeroArray(size.slice(1)));
        }
        return array;
    }

    function RandomPos() {
        let free = freeCells();
        if (free.length === 0) return false;
        let rnd = RandomInt(free.length);
        let y = free[rnd][0];
        let x = free[rnd][1];
        return [y, x];
    }

    function addPointRandom() {
        if (Object.keys(Points).length > width * height) return;
        let pos = RandomPos();
        let val = RandomInt(2) * 2 + 2;
        if (!pos) return; //TODO: Create Game Over
        Points[CellName(pos)] = new Point(pos, val);
    }
    this.RenderConsole = () => {
        // console.clear();
        let renderArea = zeroArray();
        for (let point in Points) renderArea[Points[point].pos[0]][Points[point].pos[1]] = [Points[point].val];
        let strArea = "";
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                strArea += " [" + renderArea[i][j] + "] ";
            }
            strArea += "\n";
        }
        console.log(strArea);
    };
    let getVector = [
        [-1,0],
        [0,1],
        [1,0],
        [0,-1]
    ];
    this.move = (direction = 0) => {
        let trace = createTrace(direction);
        let vector = getVector[direction];
        trace.y.forEach(function (y) {
            trace.x.forEach(function (x) {
                // console.log("y=>"+y+"||x=>"+x);
                if(!IsDefined([y,x])) return;
                let pos = [y,x];
                let nextPos = [y, x];
                while(!IsDefined(CordsSum(nextPos , vector)) && IsIsnRange(CordsSum(nextPos , vector))) {
                    nextPos = CordsSum(nextPos , vector);
                }
                Points[CellName[nextPos]] = new Point(nextPos, Points[CellName(pos)].val);
                delete Points[CellName(pos)];
            });
        });
        // addPointRandom();
    };
    let IsIsnRange = (pos) => pos[0] > 0 && pos[0] < height && pos[1] > 0 && pos[1] < width;
    let createTrace = (dir) => {
        let trace = {x:[],y:[]};
        for(let i = 0; i < height; i++) trace.y.push(i);
        for(let j=0; j < width; j++)  trace.x.push(j);
        if (getVector[dir][0] === 1) trace.y.reverse();
        if (getVector[dir][1] === 1) trace.x.reverse();
        return trace;
    };
    this.moveLeft = () => {
        let curRow = 0;
        for (curRow; curRow < height; curRow++) {
            let curCol = 1;
            for (curCol; curCol < width; curCol++) {
                if (!IsDefined(Points[CellName(curRow, curCol)])) continue;
                let nextPos = curCol;
                for (nextPos; nextPos > 0; nextPos--) if (IsDefined(Points[CellName(curRow, nextPos - 1)])) {
                    if (Points[CellName(curRow, nextPos - 1)].val == Points[CellName(curRow, curCol)].val) {
                        Points[CellName(curRow, nextPos - 1)].val += Points[CellName(curRow, curCol)].val;
                        delete Points[CellName(curRow, curCol)];
                        nextPos = curCol;
                    }
                    break;
                }
                if (curCol == nextPos) continue;
                Points[CellName(curRow, nextPos)] = new Point([curRow, nextPos], Points[CellName(curRow, curCol)].val);
                delete Points[CellName(curRow, curCol)];
            }
        }
        addPointRandom();
    };
    this.moveRight = () => {
        let curRow = 0;
        for (curRow; curRow < height; curRow++) {
            let curCol = width - 2;
            for (curCol; curCol >= 0; curCol--) {
                if (!IsDefined(Points[CellName(curRow, curCol)])) continue;
                let nextPos = curCol;
                for (nextPos; nextPos < width - 1; nextPos++) if (IsDefined(Points[CellName(curRow, nextPos + 1)])) {
                    if (Points[CellName(curRow, nextPos + 1)].val == Points[CellName(curRow, curCol)].val) {
                        Points[CellName(curRow, nextPos + 1)].val += Points[CellName(curRow, curCol)].val;
                        delete Points[CellName(curRow, curCol)];
                        nextPos = curCol;
                    }
                    break;
                }
                if (curCol === nextPos) continue;
                Points[CellName(curRow, nextPos)] = new Point([curRow, nextPos], Points[CellName(curRow, curCol)].val);
                delete Points[CellName(curRow, curCol)];
            }
        }
        addPointRandom();
    };
    this.moveUp = () => {
        let curCol = 0;
        for (curCol; curCol < width; curCol++) {
            let curRow = 1;
            for (curRow; curRow < height; curRow++) {
                if (!IsDefined(Points[CellName(curRow, curCol)])) continue;
                let nextPos = curRow;
                for (nextPos; nextPos > 0; nextPos--) if (IsDefined(Points[CellName(nextPos - 1, curCol)])){
                    if (Points[CellName(nextPos - 1, curCol)].val === Points[CellName(curRow, curCol)].val) {
                        Points[CellName(nextPos - 1, curCol)].val += Points[CellName(curRow, curCol)].val;
                        delete Points[CellName(curRow, curCol)];
                        nextPos = curRow;
                    }
                    break;
                };
                if (curRow === nextPos) continue;
                Points[CellName(nextPos, curCol)] = new Point([nextPos, curCol], Points[CellName(curRow, curCol)].val);
                delete Points[CellName(curRow, curCol)];
            }
        }
        addPointRandom();
    };
    this.moveDown = () => {
        let curCol = 0;
        for (curCol; curCol < width; curCol++) {
            let curRow = height - 2;
            for (curRow; curRow >= 0; curRow--) {
                if (!IsDefined(Points[CellName(curRow, curCol)])) continue;
                let nextPos = curRow;
                for (nextPos; nextPos < height - 1; nextPos++) if (IsDefined(Points[CellName(nextPos + 1, curCol)])) {
                    if (Points[CellName(nextPos + 1, curCol)].val === Points[CellName(curRow, curCol)].val) {
                        Points[CellName(nextPos + 1, curCol)].val += Points[CellName(curRow, curCol)].val;
                        delete Points[CellName(curRow, curCol)];
                        nextPos = curRow;
                    }
                    break;
                };
                if (curRow == nextPos) continue;
                Points[CellName(nextPos, curCol)] = new Point([nextPos, curCol], Points[CellName(curRow, curCol)].val);
                delete Points[CellName(curRow, curCol)];
            }
        }
        addPointRandom();
    };

    for (let i = 0; i < 5; i++) addPointRandom();
    // Points = JSON.parse(
    // '{"1-3":{"pos":[1,3],"val":2},"3-1":{"pos":[3,1],"val":4},"1-0":{"pos":[1,0],"val":2},"0-2":{"pos":[0,2],"val":4},"2-2":{"pos":[2,2],"val":2},"3-3":{"pos":[3,3],"val":4},"1-2":{"pos":[1,2],"val":4},"2-0":{"pos":[2,0],"val":2},"2-3":{"pos":[2,3],"val":2},"0-1":{"pos":[0,1],"val":2}}'
    //  );
}

console.clear();
let myGame = new Game();
// console.log(JSON.stringify(myGame.PointsList));
myGame.RenderConsole(); //TODO: Fix double marge
let a = JSON.stringify(myGame.PointsList);
myGame.move(0); //TODO: rewrite to byte operations;
let b = JSON.stringify(myGame.PointsList);
myGame.RenderConsole();
console.log(a);
console.log(b);


