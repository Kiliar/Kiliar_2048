export default class Point {
    public value: number;
    constructor(val = 0) {
        this.value = val;
    }
    setVal (newVal:number) {
        this.value = newVal;
    }
    static create() {
        return new Point();
    }
}