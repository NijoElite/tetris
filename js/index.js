const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');

const config = {
    tileSize: 20,
    rowsCount: 20,
    colsCount: 10,
};

/* GLOBAL VAR */
const blocks = [];
let activeTetromino = null;

const status = [];
for (let row = 0; row < config.rowsCount; row++) {
    status[row] = [];
    for (let col = 0; col < config.colsCount; col++) {
        status[row][col] = 0;
    }
}

/* CLASSES */
class Block {

    constructor(row, col, color) {
        this.row = row;
        this.col = col;
        this.color = color;
    }

    draw() {
        const k = config.tileSize;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000000';

        ctx.fillRect(k * this.col, k * this.row, k, k);
        ctx.strokeRect(k * this.col, k * this.row, k, k);

    }

    copy() {
        return new Block(this.row, this.col, this.color)
    }
}

class Tetromino {

    // 7 types of Tetromino
    constructor(type) {
        this.blocks = [];
        this.type = type;

        switch (type) {
            // ++++
            case 0:
                this.blocks.push(new Block(0,3,"#940000"));
                this.blocks.push(new Block(0,4,"#940000"));
                this.blocks.push(new Block(0,5,"#940000"));
                this.blocks.push(new Block(0,6,"#940000"));
                break;

            // +--
            // +++
            case 1:
                this.blocks.push(new Block(0,3,"#7A9400"));
                this.blocks.push(new Block(1,3,"#7A9400"));
                this.blocks.push(new Block(1,4,"#7A9400"));
                this.blocks.push(new Block(1,5,"#7A9400"));
                break;
            // --+
            // +++
            case 2:
                this.blocks.push(new Block(0,5,"#007F94"));
                this.blocks.push(new Block(1,3,"#007F94"));
                this.blocks.push(new Block(1,4,"#007F94"));
                this.blocks.push(new Block(1,5,"#007F94"));
                break;
            // ++
            // ++
            case 3:
                this.blocks.push(new Block(0,3,"#B274DC"));
                this.blocks.push(new Block(0,4,"#B274DC"));
                this.blocks.push(new Block(1,3,"#B274DC"));
                this.blocks.push(new Block(1,4,"#B274DC"));
                break;
            // -++
            // ++-
            case 4:
                this.blocks.push(new Block(0,4,"#607EFB"));
                this.blocks.push(new Block(0,5,"#607EFB"));
                this.blocks.push(new Block(1,3,"#607EFB"));
                this.blocks.push(new Block(1,4,"#607EFB"));
                break;
            // -+-
            // +++
            case 5:
                this.blocks.push(new Block(0,4,"#DC749D"));
                this.blocks.push(new Block(1,3,"#DC749D"));
                this.blocks.push(new Block(1,4,"#DC749D"));
                this.blocks.push(new Block(1,5,"#DC749D"));
                break;
            // ++-
            // -++
            case 6:
                this.blocks.push(new Block(0,3,"#6DF500"));
                this.blocks.push(new Block(0,4,"#6DF500"));
                this.blocks.push(new Block(1,4,"#6DF500"));
                this.blocks.push(new Block(1,5,"#6DF500"));
                break;
        }

    }

    rotate() {
        // dont rotate if it is cube
        if (this.type === 3) {
            return;
        }

        let centerBlock = this.blocks[1];

        this.blocks.forEach(block => {
           /*
                X = x0 + (x - x0) * cos(a) - (y - y0) * sin(a);
                Y = y0 + (y - y0) * cos(a) + (x - x0) * sin(a);
                after simplification for a = Pi / 2
                X = x0 - (y - y0);
                Y = y0 + (x - x0);
           */
            let col = centerBlock.col - (block.row - centerBlock.row);
            let row = centerBlock.row + (block.col - centerBlock.col);

            block.col = col;
            block.row = row;
        });
    }

    tryRotate() {
        const ghostTetromino = this.copy();
        ghostTetromino.rotate();

        return !ghostTetromino.checkCollide();
    }


    draw() {
        this.blocks.forEach(block => block.draw());
    }

    // Three possible direction: 0 - left, 1 - right,  2 - down
    move(dir) {
        let dRow, dCol;

        if (dir === 0) {
            dRow = 0;
            dCol = -1;
        } else if (dir === 1) {
            dRow = 0;
            dCol = 1;
        } else if (dir === 2) {
            dRow = 1;
            dCol = 0;
        }

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            block.row += dRow;
            block.col += dCol;
        }
    }

    checkCollide() {
        const ghostBlocks = this.getBlocks();

        // check collide with end of map
        for (let i = 0; i < ghostBlocks.length; i++) {
            let ghost = ghostBlocks[i];
            // check collide with end of map
            if (ghost.row < 0 || ghost.row >= config.rowsCount ||
                ghost.col < 0 || ghost.col >= config.colsCount) {
                return true;
            }
        }

        // check for collides with blocks
        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];

            for (let j = 0; j < ghostBlocks.length; j++) {
                let ghost = ghostBlocks[j];
                if (block.row === ghost.row && block.col === ghost.col) {
                    return true;
                }
            }
        }
        return false;
    }

    tryMove(dir) {
        const ghostTetromino = this.copy();
        ghostTetromino.move(dir);

        return !ghostTetromino.checkCollide();
    }

    copy() {
        let copiedBlocks = [];
        this.blocks.forEach(block => copiedBlocks.push(block.copy()));

        let copied = new Tetromino(this.type);
        copied.blocks = copiedBlocks;

        return copied;
    }

    getBlocks() {
        return this.blocks;
    }
}


/* KEY */
function keyHandler (e) {
    let dir;

    if(e.key === 'r') {
        if (activeTetromino.tryRotate())
        {
            activeTetromino.rotate();
            draw();
        }
        return;
    } else
    if (e.key === 'a' || e.key === 'A') {
        dir = 0;
    } else
    if (e.key === 'd' || e.key === 'd') {
        dir = 1;
    } else
    if (e.key === 's' || e.key === 'S') {
        dir = 2;
    } else {
        return;
    }

    const isCollide = !activeTetromino.tryMove(dir);

    // if it cannot move down, then it will be stopped
    if (dir === 2 && isCollide) {
        generateNew();
    }

    if (!isCollide) {
        activeTetromino.move(dir)
    }

    draw();
}

document.addEventListener('keydown', keyHandler);


/* FUNCTIONS */
function draw() {

    // Clear
    ctx.beginPath();
    ctx.clearRect(0,0, 28800, 40099);
    // k * this.col, k * this.row, k, k
    // Draw map
    const k = config.tileSize;
    for (let r = 0; r < config.rowsCount; r++) {
        for (let c = 0; c < config.colsCount; c++) {
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.strokeRect(k * c, k * r, k, k)
        }
    }

    // Draw active
    activeTetromino.draw();

    // Draw blocks
    blocks.forEach((t) => t.draw());
}

function generateNew() {
    if (activeTetromino !== null) {
        activeTetromino.getBlocks().forEach(block => {
            blocks.push(block);

            status[block.row][block.col] = 1;
        });
    }

    let type = Math.floor(Math.random() * 7);
    activeTetromino = new Tetromino(type);

    removeLines();
}

function removeLines() {
    const rowsToRemove = {};
    let count = 0;

    // Find which rows must be removed
    for (let row = 0; row < config.rowsCount; row++) {
        let isFull = true;
        for (let col = 0; col < config.colsCount; col++) {
            if (status[row][col] === 0) {
                isFull = false;
            }
        }

        if (isFull) {
            rowsToRemove[row] = true;
            count++;
        }
    }

    // Remove
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (rowsToRemove[block.row]) {
            blocks.splice(i, 1);
            status[block.row][block.col] = 0;
            i--;
        }
    }

    // Move down all blocks
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < count; j++) {
            blocks[i].row++;
        }
    }
}

function end() {
    clearInterval(mainInterval);

    alert('You lost');
}

/* MAIN TIMER */
const mainInterval = setInterval(() => {
    if (activeTetromino === null) {
        generateNew();
    }
    else if (!activeTetromino.tryMove(2)) {
        generateNew();

        // if the block crashed right after respawn, then the end of the game
        if (activeTetromino.checkCollide()) {
            end();
        }
        return;
    }
    else {
        activeTetromino.move(2);
    }

    draw();
}, 200);