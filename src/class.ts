//泛型
class Queue<T> {
    private data: T[] = [];
    push = (item: T) => this.data.push(item);
    pop = (): T | undefined => this.data.shift(); 
}

const queue = new Queue<number>();

queue.push(56);
// queue.push('77');