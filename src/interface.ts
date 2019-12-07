interface Point {
    x: number,
    y: number
}

interface Foo {
    type: string
}

console.log('hello interface');


class MyPoint implements Point {
    x: number;
    y: number;
    constructor ({x = 0, y = 0} = {}){
        this.x = x;
        this.y = y;
    }
    getXxY () {
        return this.x * this.y;
    }
}

let pp:Point = new MyPoint();

console.log('implement interface----->', pp);