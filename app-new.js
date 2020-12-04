const DEFAULT_SIZE = 4;

const RandomInt = (max) => Math.floor(Math.random() * max);

const getInitialValue = () => RandomInt(2) * 2 + 2;

class Point {
    constructor(val = getInitialValue()) {
        this.value = val || getInitialValue();
    }
}

const getEmptyArray = (size) => Array(size).fill(null).map(() => undefined);

class Game {
    constructor(w = DEFAULT_SIZE, h = DEFAULT_SIZE) {
        this.areaWidth = w;
        this.areaHeigh = h;
        this.area = getEmptyArray(this.areaHeigh).map(() => getEmptyArray(this.areaWidth));
    }
    renderConsole(clear = false) {
        if (clear) {
            console.clear();
        }
        let output = this.area.reduce(
            (result, row) =>
                result + row.reduce(
                    (rowResult, point) => rowResult + ((point && point.value) || 0) + " | ",
                '' ) + '\n' + "",
            '');
        console.log(output);
    };

    addRandomPoint () {
        const yCord = RandomInt(this.areaHeigh);
        const xCord = RandomInt(this.areaWidth);
        if (this.area[yCord][xCord]) {
            return this.addRandomPoint();
        }
        this.area[yCord][xCord] = new Point();
    }

    move(direction = 0) {
        const movePont = (origPos, to) => {
            if( this.area[to[0]][to[1]] || !this.area[origPos[0]][origPos[1]] ) {
                return;
            }
            const point = this.area[origPos[0]][origPos[1]];
            this.area[to[0]][to[1]] = point;
        }
    }
}

const newGame = new Game();
newGame.renderConsole(true);
newGame.addRandomPoint();
newGame.addRandomPoint();
newGame.addRandomPoint();
newGame.renderConsole(false);

