import * as readline from 'readline';
import Point from "./point";
import {getFilledArray, RandomInt} from "../helpers";

const DEFAULT_SIZE = 4;

enum EDirections {
    Up = 'up',
    Right = 'right',
    Left = 'left',
    Down = 'down',
}

// noinspection JSUnusedGlobalSymbols
enum EConsoleColors {
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",
    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",
    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m",
}


const getInitialValue = () => RandomInt(1) * 2 + 2;



class Game {
    private readonly areaWidth: number;
    private readonly areaHeight: number;
    private readonly area: Point[][];
    private isGameOver: boolean = false;
    constructor(w = DEFAULT_SIZE, h = DEFAULT_SIZE) {
        this.areaWidth = w;
        this.areaHeight = h;
        this.area = getFilledArray<Point[]>(h, () => getFilledArray<Point>(w, Point.create))
    }
    renderConsole(clear = false) {
        if (clear) {
            console.clear();
        }

        let result = '';

        for(let row in this.area) {
            for(let col in this.area[row]) {
                const val = this.area[row][col];
                let color = EConsoleColors.Reset;
                switch (val.value) {
                    case 0:
                        color = EConsoleColors.FgBlack;
                        break;
                    case 2:
                        color = EConsoleColors.FgGreen;
                        break;
                    case 4:
                        color = EConsoleColors.FgMagenta;
                        break;
                    case 8:
                        color = EConsoleColors.FgBlue;
                        break;
                    case 16:
                        color = EConsoleColors.FgBlue;
                        break;
                    case 32:
                        color = EConsoleColors.FgYellow;
                        break;
                    case 64:
                        color = EConsoleColors.FgGreen;
                        break;

                }

                result+=` ${color}${val.value}${EConsoleColors.Reset} |`;


            }
            result+='\n';
        }
        console.log(result);
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
        game.renderConsole(!debug);
        game.attachEventListener(debug);


        return game;
    }

}

export default Game;

