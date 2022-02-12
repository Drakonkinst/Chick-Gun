const NodeGrid = (() => {
    const DIST_ACROSS = 10;
    const DIST_DIAGONAL = 14;
    
    return class NodeGrid {
        static constructFor(world, nodeSize) {
            let grid = [];
            let xCoord = 0;
            let yCoord = 0;
            let total = 0;
            for(let i = 0; i < world.width; i += nodeSize) {
                let row = [];
                yCoord = 0;
                for(let j = 0; j < world.height; j += nodeSize) {
                    let worldPos = Vector.of(i + (nodeSize / 2), j + (nodeSize / 2));
                    let node = new Node(xCoord, yCoord, worldPos);
                    
                    row.push(node);
                    total++;
                    yCoord++;
                }
                xCoord++;
                grid.push(row);
            }
            console.log("Created node grid with " + total + " nodes");
            return grid;
        }
        
        constructor(world, nodeSize) {
            this.world = world;
            this.nodeSize = nodeSize;
            this.grid = NodeGrid.constructFor(world, nodeSize);
            this.width = this.grid.length;
            this.height = this.grid[0].length;
            this.affectedNodes = [];
        }
        
        getNodeAt(x, y) {
            if(x instanceof Vector) {
                y = x.y;
                x = x.x;
            }
            let width = this.world.width;
            let height = this.world.height;
            if(x < 0 || x >= width || y < 0 || y >= height) {
                return null;
            }
            let mapX = Math.floor(x / this.nodeSize);
            let mapY = Math.floor(y / this.nodeSize);
            return this.grid[mapX][mapY];
        }
        
        getNeighbors(node) {
            let neighbors = [];
            let x = node.x;
            let y = node.y;

            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i == 0 && j == 0) {
                        continue;
                    }
                    
                    let checkX = x + i;
                    let checkY = y + j;
                    if(this.isWalkable(checkX, checkY)) {
                        let neighbor = this.grid[checkX][checkY];
                        if(Math.abs(i) == 1 && Math.abs(j) == 1) {
                            // corner
                            // use || if no corners should be cut
                            // use && if both corners must be blocked
                            if(!this.isWalkable(checkX, y) || !this.isWalkable(x, checkY)) {
                                continue;
                            }
                        }
                        neighbors.push(neighbor);
                    }
                }
            }
            return neighbors;
        }
        
        isWalkable(x, y) {
            if(x >= 0 && x < this.width && y >= 0 && y < this.height) {
                let node = this.grid[x][y];
                return node.canWalk();
            }
            return false;
        }
        
        getDistance(nodeA, nodeB) {
            let xDelta = Math.abs(nodeA.x - nodeB.x);
            let yDelta = Math.abs(nodeA.y - nodeB.y);
            
            let numDiagonal;
            let numAcross;
            if(xDelta < yDelta) {
                numDiagonal = xDelta;
                numAcross = yDelta - xDelta;
            } else {
                numDiagonal = yDelta;
                numAcross = xDelta - yDelta;
            }
            
            return numDiagonal * DIST_DIAGONAL + numAcross * DIST_ACROSS;
        }
        
        calculatePath(startPos, endPos) {
            let startNode = this.getNodeAt(startPos.x, startPos.y);
            let endNode = this.getNodeAt(endPos.x, endPos.y);            

            if(startNode == null || endNode == null) {
                console.log("Invalid start or end positions during path calculation, aborting");
                return null;
            }
            
            startNode.gCost = 0;
            this.affectedNodes.push(startNode);

            let open = new BinaryHeap();
            let closed = new Set();

            console.log("Adding START " + startNode.x + ", " + startNode.y);
            open.add(startNode);

            while(open.getSize() > 0) {
                
                // find node with lowest f-cost
                let current = open.removeFirst();
                /*
                let current = open[0];
                open.forEach(node => {
                    if(node.getFCost() >= 0 && node.getFCost() < current.getFCost()) {
                        current = node;
                    }
                });
                
                // remove current from open and add it to closed
                open.splice(open.indexOf(current), 1);*/
                closed.add(current);

                if(current == endNode) {
                    return this.retracePath(endNode);
                }

                let neighbors = this.getNeighbors(current);
                for(let i = 0; i < neighbors.length; i++) {
                    let neighbor = neighbors[i];
                    if(/*!neighbor.canWalk() || */closed.has(neighbor)) {
                        continue;
                    }
                    
                    let newPathCost = current.gCost + this.getDistance(current, neighbor);
                    if(newPathCost < neighbor.gCost || !open.contains(neighbor)) {
                        neighbor.gCost = newPathCost;
                        neighbor.hCost = this.getDistance(neighbor, endNode);
                        this.affectedNodes.push(neighbor);
                        neighbor.parent = current;

                        console.log("Adding " + neighbor.x + ", " + neighbor.y);
                        open.add(neighbor);
                    }
                }
            }
        }
        
        retracePath(endNode) {
            let path = [];
            let current = endNode;
            while(current.parent) {
                path.push(current);
                current = current.parent;
            }
            path.reverse();
            this.resetGrid();
            Game.temp.path = path;
            return path;
        }
        
        resetGrid() {
            for(let node of this.affectedNodes) {
                node.reset();
            }
            this.affectedNodes.length = 0;
        }
        
        
    };
})();