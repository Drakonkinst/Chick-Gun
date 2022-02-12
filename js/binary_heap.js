const BinaryHeap = (() => {
    function print(arr) {
        return;
        console.log("Array: (" + arr.length + ")");
        for(let x of arr) {
            console.log(x);
        }
        console.log("End Array");
            
    }
    
    function swap(arr, itemA, itemB) {
        if(itemA === itemB) {
            console.log("Same item, skip!");
            return;
        }
        arr[itemA.heapIndex] = itemB;
        arr[itemB.heapIndex] = itemA;
        let itemAIndex = itemA.heapIndex;
        itemA.heapIndex = itemB.heapIndex;
        itemB.heapIndex = itemAIndex;
    }
    
    function sortUp(arr, item) {
        //console.log("START SORTUP");
        print(arr);
        let parentIndex = (item.heapIndex - 1) / 2;
        let attempts = 0;
        while(attempts < 10) {
            let parentItem = arr[parentIndex];
            if(parentItem == null) {
                return;
            }
            if(item.compareTo(parentItem) > 0) {
                swap(arr, item, parentItem);
            } else {
                return;
            }
            
            parentIndex = (item.heapIndex - 1) / 2;
            attempts++;
        }
        console.error("Max attempts reached - sortUp")
    }
    
    function sortDown(arr, item) {
        console.log("Size: " + arr.length);
        //console.log("START SORTDOWN");
        print(arr);
        let size = arr.length;
        let attempts = 0;
        while(attempts < 100) {
            attempts++;
            let childIndexLeft = item.heapIndex * 2 + 1;
            let childIndexRight = item.heapIndex * 2 + 2;
            let swapIndex = 0;
            
            if(childIndexLeft < size) {
                swapIndex = childIndexLeft;
                if(childIndexRight < size) {
                    if(arr[childIndexLeft].compareTo(arr[childIndexRight]) < 0) {
                        swapIndex = childIndexRight;
                    }
                }
                
                let compare = item.compareTo(arr[swapIndex]);
                console.log("Compare: " + compare);
                if(item.compareTo(arr[swapIndex]) < 0) {
                    console.log("SwapIndex: " + swapIndex);
                    console.log("Start: [" + item.heapIndex + ", " + arr[swapIndex].heapIndex + "]");
                    swap(arr, item, arr[swapIndex]);
                    console.log("End: [" + item.heapIndex + ", " + arr[swapIndex].heapIndex + "]");
                } else {
                    return;
                }
            } else {
                return;
            }
            attempts++;
        }
        console.error("Max attempts reached- sortDown");
    }
    
    /* Items used in heap must have compareTo() */
    return class BinaryHeap {
        constructor() {
            this.items = [];
            this.size = 0;
            console.log("New heap!");
        }
        
        add(item) {
            item.heapIndex = this.size;
            this.items.push(item);
            sortUp(this.items, item);
            //console.log("ADD SORTUP");
            print(this.items);
            this.size++;
        }
        
        removeFirst() {
            if(this.size <= 0) {
                return null;
            }
            /*
            if(this.size === 1) {
                this.size = 0;
                let firstItem = this.items[0];
                this.items.length = 0;
                return firstItem;
            }*/
            
            let firstItem = this.items[0];
            this.size--;
            this.items[0] = this.items[this.size];
            this.items[0].heapIndex = 0;
            this.items.splice(this.size, 1);
            if(this.size === 0) {
                return firstItem;
            }
            sortDown(this.items, this.items[0]);
            //console.log("REMOVEFIRST SORTDOWN")
            print(this.items);
            return firstItem;
        }
        
        updateItem(item) {
            // only increase priority in pathfinding, so sortDown() is not needed here
            sortUp(this.items, item);
        }
        
        contains(item) {
            if(item.heapIndex == null || item.heapIndex < 0) {
                return false;
            }
            return item.compareTo(this.items[item.heapIndex]) === 0;
        }
        
        getSize() {
            return this.size;
        }
    };
})();