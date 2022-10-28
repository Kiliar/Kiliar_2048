import * as readline from 'readline';
import Point from "./point";
import {getFilledArray, RandomInt} from "../helpers";
import {DEFAULT_SIZE, EDirections} from "../helpers/constants";
import Console from "../console";


const getInitialValue = () => RandomInt(1) * 2 + 2;



class Game {
    private readonly areaWidth: number;
    private readonly areaHeight: number;
    private readonly area: Point[][];
    private isGameOver: boolean = false;
    private Renderer: Console;
    constructor(w = DEFAULT_SIZE, h = DEFAULT_SIZE) {
        this.areaWidth = w;
        this.areaHeight = h;
        this.area = getFilledArray<Point[]>(h, () => getFilledArray<Point>(w, Point.create))
        this.Renderer = new Console(h);
    }
    renderConsole(clear = false) {
        this.Renderer.render(this.area, clear);
    };

    addRandomPoint ():boolean {
        const blankMap = this.area.flat().filter((point) => !point.value);
        if (blankMap.length === 0) {
            return false;
        }
        const targetIndex = RandomInt(blankMap.length - 1);
        const target = blankMap[targetIndex];
        target.setVal(getInitialValue());
        return true;
    }

    makeNewBlankCells = (size:number) => getFilledArray(size, Point.create);

    moveInRow(rowIndex:number, reverse: boolean) {
        const row = this.area[rowIndex];

        this.area[rowIndex] = this.moveInArray(row, reverse);
    }

    selectCol = (colIndex:number) => this.area.map((row, cord) => this.area[cord][colIndex]);

    moveInCol(colIndex:number, reverse:boolean) {
        const col = this.selectCol(colIndex);

        const result = this.moveInArray(col, reverse);

        result.forEach((point, cord) => {
            this.area[cord][colIndex] = point;
        });

    }

    moveInArray(source:Point[], reverse:boolean) {
        const filtered = source.filter(({value}) => value);

        if (reverse) {
            filtered.reverse();
        }


        if(!filtered.length) {
            return source;
        }

        //merge in filtered
        for (let cord = 0; cord < filtered.length; cord++) {
            const current = filtered[cord];
            const next = filtered[cord + 1];

            if(!next) {
                continue;
            }

            if(next.value !== current.value) {
                continue;
            }

            current.setVal(current.value * 2);
            filtered.splice(cord + 1, 1);
        }

        if (reverse) {
            filtered.reverse();
        }

        return reverse
            ? [...this.makeNewBlankCells(source.length - filtered.length), ...filtered]
            : [...filtered, ...this.makeNewBlankCells(source.length - filtered.length)];


    }

    move(direction = EDirections.Up) {
        if(direction === EDirections.Left || direction === EDirections.Right) {
            for (let y = 0; y < this.areaHeight; y++ ) {
                this.moveInRow(y, direction === EDirections.Right);
            }
        } else {
            for(let x = 0; x < this.areaWidth; x++) {
                this.moveInCol(x, direction === EDirections.Down);
            }
        }
    }

    checkNeighbors(list: Point[]):boolean {
        return list.slice(0,-1).some((target, index) => target.value === list[index + 1].value )
    }

    checkInCol = (index: number):boolean => this.checkNeighbors(this.selectCol(index));
    checkInRow = (index: number):boolean => this.checkNeighbors(this.area[index]);

    checkGameOver():boolean {
        for (let y = 0; y < this.areaHeight; y++ ) {
            if (this.checkInRow(y)) {
                return false;
            }
        }

        for (let x = 0; x < this.areaWidth; x++) {
            if (this.checkInCol(x)) {
                return false;
            }
        }

        return true;
    }

    gameOver() {
        console.log('Yor game is over!');
        process.exit();
    }

    loop(direction: EDirections, debug?:boolean):void {
        if(this.isGameOver)
            return;

        const oldState = JSON.stringify(this.area);
        this.move(direction);
        const newState = JSON.stringify(this.area);


        const didChange = oldState !== newState;
        let newAdded = false;

        if (didChange) {
            newAdded = this.addRandomPoint();
        }

        if(newAdded) {
            this.renderConsole(!debug);
            return;
        }

        if (this.checkGameOver()) {
            this.isGameOver = true;
            this.gameOver();
        }
    }

    attachEventListener(debug?: boolean) {
        readline.emitKeypressEvents(process.stdin);

        if (process.stdin.isTTY)
            process.stdin.setRawMode(true);

        process.stdin.on('keypress', (chunk, key) => {
            if(Object.values(EDirections).includes(key.name)) {
                this.loop(key.name, debug);
            } else if (key.name === 'q') {
                process.exit();
            }

            if(debug)
                console.log({key: key.name});
        });
    }

    static start(w?:number, h?:number, debug?: boolean): Game {
        const game = new Game(w, h);

        game.addRandomPoint();
        game.addRandomPoint();
        game.addRandomPoint();
        game.addRandomPoint();
        game.renderConsole(!debug);
        game.attachEventListener(debug);


        return game;
    }

}

export default Game;

