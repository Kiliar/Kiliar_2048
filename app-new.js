const DEFAULT_SIZE = 4;

const RandomInt = (max) => Math.floor(Math.random() * max);

const getInitialValue = () => RandomInt(2) * 2 + 2;

class Point {
    constructor(val = 0) {
        this.value = val;
    }
    setVal (newVal) {
        this.value = newVal;
    }
}

const getEmptyArray = (size, Value) => Array(size).fill(null).map(() => Value ? new Value() : undefined);

class Game {
    constructor(w = DEFAULT_SIZE, h = DEFAULT_SIZE) {
        this.areaWidth = w;
        this.areaHeigh = h;
        this.area = getEmptyArray(this.areaHeigh).map(() => getEmptyArray(this.areaWidth, Point));
    }
    renderConsole(clear = false) {
        if (clear) {
            console.clear();
        }
        let output = this.area.reduce(
            (result, row) =>
                result + row.reduce(
                    (rowResult, point) =>
                        rowResult + ((point && point.value) || 0) + " | ",
                '' ) + '\n' + "",
            '');
        console.log(output);
    };

    addRandomPoint () {
        const yCord = RandomInt(this.areaHeigh);
        const xCord = RandomInt(this.areaWidth);
        const target = this.area[yCord][xCord];
        if (target.value) {
            return this.addRandomPoint();
        }
        this.area[yCord][xCord] = new Point(getInitialValue());
    }

    move(direction = 0) {
        const movePont = (origPos, to) => {
            let point = this.area[origPos[0]][origPos[1]];
            let target = this.area[to[0]][to[1]]
            if( target.value || !point.value ) {
                return;
            }
            console.log({point, target});
            this.area[to[0]][to[1]].setVal(point.value);
            this.area[origPos[0]][origPos[1]].setVal(0);
        }
        const directions = [
            [-1,0],
            [0,1],
            [1,0],
            [0,-1]
        ];
        const getNewCords = ([x, y], d) => {
            const newX = x + directions[d][0];
            const newY = y + directions[d][1];
            if(newX < 0 || newX > this.areaHeigh) return;
            if(newY < 0 || newY > this.areaHeigh) return;
            return [newX, newY];
        };
        for(let row in this.area) {
            for(let col in this.area[row]) {
                const curCords = [+row, +col];
                const newCords = getNewCords(curCords, direction);
                if(!newCords) continue;
                // console.log({curCords, newCords});
                movePont(curCords, newCords);
            }
        }
    }
}

const newGame = new Game();
// newGame.renderConsole(true);
newGame.addRandomPoint();
newGame.addRandomPoint();
newGame.addRandomPoint();
newGame.renderConsole(false);
newGame.move();
newGame.move();
newGame.move();
newGame.move();
newGame.renderConsole(false);

