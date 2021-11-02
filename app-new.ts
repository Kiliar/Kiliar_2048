const DEFAULT_SIZE = 4;

enum EDirections {
    Up,
    Right,
    Left,
    Down,
}

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

type TCords = [x: number, y: number];

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
        this.area = getEmptyArray(this.areaHeight).map(() => getEmptyArray<Point>(this.areaWidth, Point));
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

    move(direction = EDirections.Up) {
        const collision = (current: Point, target: Point) => {
            if (!target.value || !current.value) return;
            if (target.value === current.value) {
                target.setVal(target.value*2)
                current.setVal(0)
            }
        }

        const movePont = ([origX, origY]: TCords, [toX, toY]: TCords) => {
            let current = this.area[origX][origY];
            let target = this.area[toX][toY]
            if( target.value || !current.value ) {
                collision(current, target)
                return;
            }
            // console.log({point, target});
            target.setVal(current.value);
            current.setVal(0);
        }

        const directions = [
            [-1,0], //Up
            [0,1],  //Right
            [0,-1], // Left
            [1,0]  // Down
        ];

        const getNewCords = ([x, y]:TCords, d:EDirections):TCords => {
            const newX = x + directions[d][0];
            const newY = y + directions[d][1];
            if(newX < 0 || newX >= this.areaWidth) return;
            if(newY < 0 || newY >= this.areaHeight) return;
            return [newX, newY];
        };

        const foo = (y: number, x: number, direction: EDirections) => {
            const curCords:TCords = [x, y];
            const newCords = getNewCords(curCords, direction);
            if(!newCords) return;
            // console.log({curCords, newCords});
            movePont(curCords, newCords);
        }

        if (direction === EDirections.Right || direction === EDirections.Down) {
            for(let row in this.area) {
                for(let col in this.area[row]) {
                    foo(+row, +col, direction);
                }
            }
        } else {
            for(let row = this.areaHeight; --row; row >= 0) {
                for(let col = this.areaWidth; --col; col >= 0) {
                    foo(+row, +col, direction);
                }
            }
        }
    }
}
const a = 4;

const newGame = new Game(a,a);
// newGame.renderConsole(true);
newGame.addRandomPoint();
newGame.addRandomPoint();
newGame.addRandomPoint();
newGame.addRandomPoint();
newGame.addRandomPoint();
newGame.renderConsole(false);
newGame.move(EDirections.Up);
newGame.renderConsole(false);
newGame.move(EDirections.Right);
newGame.renderConsole(false);
newGame.move(EDirections.Down);
newGame.renderConsole(false);
newGame.move(EDirections.Left);


newGame.renderConsole(false);

