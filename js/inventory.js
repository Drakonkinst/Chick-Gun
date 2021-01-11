const Inventory = (() => {
    const ITEM_MAX_DEFAULT = 999;
    
    return class Inventory {
        constructor() {
            this.itemCount = {};
            this.itemCountMax = {};
            this.eventListeners = {};
        }
        
        setItem(id, count) {
            let max = this.getItemMax(id);
            
            if(count > max) {
                count = max;
            }
            
            if(count < 0) {
                count = 0;
            }
            
            this.itemCount[id] = count;
            
            if(this.eventListeners.hasOwnProperty(id)) {
                let callbacks = this.eventListeners[id];
                for(let callback of callbacks) {
                    callback(count);
                }
            }
        }
        
        addItem(id, count) {
            count = count || 1;
            this.setItem(id, this.getItem(id) + count);
        }
        
        removeItem(id, count) {
            count = count || 1;
            this.setItem(id, this.getItem(id) - count);
        }
        
        setItemMax(id, count) {
            this.itemCountMax[id] = count;
            if(this.getItem(id) > count) {
                this.setItem(id, count);
            }
        }
        
        getItem(id) {
            if(this.itemCount.hasOwnProperty(id)) {
                return this.itemCount[id];
            }
            return 0;
        }
        
        getItemMax(id) {
            if(this.itemCountMax.hasOwnProperty(id)) {
                return this.itemCountMax[id];
            }
            return ITEM_MAX_DEFAULT;
        }
        
        addEventListener(id, callback) {
            if(!Array.isArray(this.eventListeners[id])) {
                this.eventListeners[id] = [];
            }
            let listenerMap = this.eventListeners;
            listenerMap[id].push(callback);
            
            return {
                remove() {
                    listenerMap[id] = listenerMap[id].filter(cb => {
                        return cb !== callback;
                    });
                }
            }
        }
    };
})();