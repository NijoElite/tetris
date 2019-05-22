const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');

const config = {
    tileSize: 10,
    rowsCount: 20,
    colsCount: 10,
};

// Grid is 10x20
const grid = new Array(config.rowsCount * config.colsCount).fill(0);

// Stores all tetromino
const tetrominos = [];

let activeTetromino = null;

class Point {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

class Tetromino {

    // 7 types of Tetromino
    constructor(type) {
        this.blocks = [];
        switch (type) {
            // ++++
            case 0:
                this.blocks.push(new Point(0,3));
                this.blocks.push(new Point(0,4));
                this.blocks.push(new Point(0,5));
                this.blocks.push(new Point(0,6));
                this.color = "#940000";
                break;

            // +--
            // +++
            case 1:
                this.blocks.push(new Point(0,3));
                this.blocks.push(new Point(1,3));
                this.blocks.push(new Point(1,4));
                this.blocks.push(new Point(1,5));
                this.color = "#7A9400";
                break;
            // --+
            // +++
            case 2:
                this.blocks.push(new Point(0,5));
                this.blocks.push(new Point(1,3));
                this.blocks.push(new Point(1,4));
                this.blocks.push(new Point(1,5));
                this.color = "#007F94";
                break;
            // ++
            // ++
            case 3:
                this.blocks.push(new Point(0,3));
                this.blocks.push(new Point(0,4));
                this.blocks.push(new Point(1,3));
                this.blocks.push(new Point(1,4));
                this.color = "#B274DC";
                break;
            // -++
            // ++-
            case 4:
                this.blocks.push(new Point(0,4));
                this.blocks.push(new Point(0,5));
                this.blocks.push(new Point(1,3));
                this.blocks.push(new Point(1,4));
                this.color = "#607EFB";
                break;
            // -+-
            // +++
            case 5:
                this.blocks.push(new Point(0,4));
                this.blocks.push(new Point(1,3));
                this.blocks.push(new Point(1,4));
                this.blocks.push(new Point(1,5));
                this.color = "#DC749D";
                break;
            // ++-
            // -++
            case 6:
                this.blocks.push(new Point(0,3));
                this.blocks.push(new Point(0,4));
                this.blocks.push(new Point(1,4));
                this.blocks.push(new Point(1,5));
                this.color = "#6DF500";
                break;
        }
    }

    draw() {
        this.blocks.forEach((block) => {
           const k = config.tileSize;
            ctx.rect(k * block.col, k * block.row, k, k);
        });

        ctx.fillStyle = this.color;
        ctx.fill();
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
}

function mouseHandler (e) {
    if (e.key === 'a' || e.key === 'A') {
        activeTetromino.move(0);
    }
    if (e.key === 'd' || e.key === 'd') {
        activeTetromino.move(1);
    }
    if (e.key === 's' || e.key === 'S') {
        activeTetromino.move(2);
    }

    draw();
}

document.addEventListener('keyup', mouseHandler);

function draw() {
    ctx.beginPath();
    ctx.clearRect(0,0, 28800, 40099);

    tetrominos.forEach((t) => t.draw());
}

const t = new Tetromino(3);
activeTetromino = t;
tetrominos.push(t);

// Draw and move
setInterval(() => {
    activeTetromino.move(2)
    draw();
}, 500);


// Add new
setInterval(() => {
    const t = new Tetromino(3);
    activeTetromino = t;
    tetrominos.push(t);
}, 6000);