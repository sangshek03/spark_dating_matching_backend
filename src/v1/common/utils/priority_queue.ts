export class PriorityQueue<T> {
    private items: { priority: number; value: T }[] = [];
    private readonly maxSize: number;
  
    constructor(maxSize: number = 20) {
      this.maxSize = maxSize;
    }
  
    enqueue(value: T, priority: number): void {
      // Add the new item
      const newItem = { priority, value };
      
      // Find the position to insert (maintain descending order by priority)
      let inserted = false;
      for (let i = 0; i < this.items.length; i++) {
        if (priority > this.items[i].priority) {
          this.items.splice(i, 0, newItem);
          inserted = true;
          break;
        }
      }
      
      // If not inserted, add to the end
      if (!inserted) {
        this.items.push(newItem);
      }
      
      // Trim the queue if it exceeds max size
      if (this.items.length > this.maxSize) {
        this.items.pop();
      }
    }
  
    getTopN(n: number): T[] {
      return this.items.slice(0, n).map(item => item.value);
    }
  
    contains(predicate: (value: T) => boolean): boolean {
      return this.items.some(item => predicate(item.value));
    }
  
    remove(predicate: (value: T) => boolean): void {
      const index = this.items.findIndex(item => predicate(item.value));
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    }
  
    size(): number {
      return this.items.length;
    }
  
    clear(): void {
      this.items = [];
    }
  }