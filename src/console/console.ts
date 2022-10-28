import Point from "../game2048/point";
import {EConsoleColors} from "../helpers/constants";

export class Console {
    cellHeight = 1;
    cellWidth = 5;
    height: number;
    constructor(h = 4) {
        this.height = h;
    }


    getPointColor(point: Point): EConsoleColors {
        switch (point.value) {
            case 0:
                return  EConsoleColors.FgBlack;
            case 2:
                return EConsoleColors.FgGreen;
            case 4:
                return EConsoleColors.FgMagenta;
            case 8:
                return EConsoleColors.FgBlue;
            case 16:
                return EConsoleColors.FgBlue;
            case 32:
                return EConsoleColors.FgYellow;
            case 64:
                return EConsoleColors.FgGreen;
            default:
                return EConsoleColors.Reset;
        }
    }

    formatCell(point: Point) {
        const valueStr = String(point.value);

        const formattedValue = `${this.getPointColor(point)}${valueStr}${EConsoleColors.Reset}`;

        const spaceLength = (this.cellWidth - valueStr.length) / 2;

        let spacer = ' '.repeat(Math.floor(spaceLength));
        let spacer2 = ' '.repeat(Math.ceil(spaceLength));

        return `${spacer}${formattedValue}${spacer2}`;
    }
    
    render(data: Point[][], clear: boolean = false) {
        if (clear) {
            console.clear();
        }

        let buffer = new Array(this.height * this.cellHeight).fill('');

        for(let row in data) {
            for(let col in data[row]) {
                const val = data[row][col];
                buffer[Number(row)]+= this.formatCell(val);
            }
        }
        console.log(buffer.join('\n'));
    }

}