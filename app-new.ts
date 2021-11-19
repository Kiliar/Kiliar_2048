import * as readline from 'readline';

const DEFAULT_SIZE = 4;

enum EDirections {
    Up,
    Right,
    Left,
    Down,
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

const RandomInt = (max) => Math.floor(Math.random() * max);

const getInitialValue = () => RandomInt(0) * 2 + 2;

class Point {
    public value: number;
    constructor(val = 0) {
        this.value = val;
    }
    setVal (newVal) {
        this.value = newVal;
    }
}

const getEmptyArray = <T>(size, Value?: { new(): T }) => Array(size).fill(null).map(() => Value ? new Value() : undefined);

class Game {
    private readonly areaWidth: number;
    private readonly areaHeight: number;
    private readonly area: Point[][];
    constructor(w = DEFAULT_SIZE, h = DEFAULT_SIZE) {
        this.areaWidth = w;
        this.areaHeight = h;
        this.area = getEmptyArray<null>(this.areaHeight).map(() => getEmptyArray<Point>(this.areaWidth, Point));
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

    addRandomPoint () {
        const yCord = RandomInt(this.areaHeight);
        const xCord = RandomInt(this.areaWidth);
        const target = this.area[yCord][xCord];
        if (target.value) {
            return this.addRandomPoint();
        }
        this.area[yCord][xCord] = new Point(getInitialValue());
    }

    makeNewBlankCells = (size:number) => getEmptyArray(size, Point);

    moveInRow(rowIndex:number, reverse: boolean) {
        const row = this.area[rowIndex];

        this.area[rowIndex] = this.moveInArray(row, reverse);
    }

    moveInCol(colIndex:number, reverse:boolean) {
        const col = this.area.map((row, cord) => this.area[cord][colIndex]);

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
            for (let x = 0; x < this.areaHeight; x++ ) {
                this.moveInRow(x, direction === EDirections.Right);
            }
        } else {
            for(let y = 0; y < this.areaWidth; y++) {
                this.moveInCol(y, direction === EDirections.Down);
            }
        }

        // this.addRandomPoint();
    }
}

const newGame = new Game(4, 4);
newGame.addRandomPoint();
// newGame.addRandomPoint();
// newGame.addRandomPoint();
// newGame.addRandomPoint();
// newGame.addRandomPoint();
// newGame.addRandomPoint();
// newGame.addRandomPoint();
newGame.renderConsole(true);


readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY)
    process.stdin.setRawMode(true);

process.stdin.on('keypress', (chunk, key) => {
    switch (key.name) {
        case 'up':
            newGame.move(EDirections.Up);
            break;
        case 'down':
            newGame.move(EDirections.Down);
            break;
        case 'left':
            newGame.move(EDirections.Left);
            break;
        case 'right':
            newGame.move(EDirections.Right);
            break;
        case 'q':
            process.exit();
            break;
    }

    newGame.renderConsole(true);
});

