const NUM_ROWS = 10;
const NUM_COLUMNS = 10;
let current = 0;

const MIN_TILE_SPAWNS = 8;
const MAX_TILE_SPAWNS = 25;

let walls = new Array;
let createWalls = new Array;

{
      let wallToAdd = 0;
      for (let i = 0; i < Math.floor(Math.random() * (MAX_TILE_SPAWNS - MIN_TILE_SPAWNS + 1)) + MIN_TILE_SPAWNS; i++) {
            wallToAdd = Math.floor(Math.random() * (document.querySelectorAll('.square').length - 0 + 1)) + 0;
            if (wallToAdd != 0 && wallToAdd != 1 && wallToAdd != 5) {
                  createWalls.push(wallToAdd);
            }
      }
}

const SUCCESS = 1;
const FAIL = 0;

const SPACE_BAR_KEY = 32;
const ARROW_LEFT = 37;
const ARROW_UP = 38;
const ARROW_RIGHT = 39;
const ARROW_DOWN = 40;

const SQUARE_SIZE = 75;

const PLAYER_HTML = "<img src=\"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fpacman%2Fimages%2F2%2F24%2FPac-Man-0.png%2Frevision%2Flatest%2Fscale-to-width-down%2F2000%3Fcb%3D20190526005949&f=1&nofb=1&ipt=1c27ac8093b5c019b7c046f7fce36a061b055be6b3d74455530c232e3b46e7ab&ipo=images\" width=\"" + SQUARE_SIZE.toString() + "\" height=\"" + SQUARE_SIZE.toString() + "\"> </img>"
const WALL_HTML = "<img src=\"https://imgs.search.brave.com/ZUkfZSuA3mbYIdAthYKKUL4EGNQ0L6aU7UuWXMU2vHc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9i/cmljay13YWxsXzIz/LTIxNDgxNjczMTUu/anBnP3NpemU9NjI2/JmV4dD1qcGc\" width=\"" + SQUARE_SIZE.toString() + "\" height=\"" + SQUARE_SIZE.toString() + "\"> </img>"

const initWalls = () => {
      squares = document.querySelectorAll('.square');
      for (let i = 0; i < squares.length; i++) {
            if (createWalls.includes(i)) {
                  walls.push(1);
            } else {
                  walls.push(0);
            }
      }
}

const drawBoard = () => {
      squares = document.querySelectorAll('.square');
      squares[current].innerHTML = PLAYER_HTML;
      for (let i = 0; i < squares.length; i++) {
            if (walls[i] == 1) {
                  squares[i].innerHTML = WALL_HTML;           
            }
      }
}

const resolvePacMan = key => {
      if (key == ARROW_RIGHT) {
            if (((current + 1) % NUM_COLUMNS != 0) && (walls[current+1] == 0)) {
                  squares[current++].innerHTML = "";
                  return SUCCESS;
            } else {
                  return FAIL;
            }
      }

      if (key == ARROW_LEFT) {
            if ((current % NUM_COLUMNS != 0)  && (walls[current-1] == 0)) {
                  squares[current--].innerHTML = "";
                  return SUCCESS;
            } else {
                  return FAIL;
            }
      }

      if (key == ARROW_UP) {
            if ((current > NUM_COLUMNS - 1) && (walls[current-NUM_COLUMNS] == 0)) {
                  squares[current].innerHTML = "";
                  current -= NUM_COLUMNS;
                  return SUCCESS;
            } else {
                  return FAIL;
            }
      }

      if (key == ARROW_DOWN) {
            if ((current < NUM_ROWS * NUM_COLUMNS - NUM_COLUMNS) && (walls[current+NUM_COLUMNS] == 0)) {
                  squares[current].innerHTML = "";
                  current += NUM_COLUMNS;
                  return SUCCESS;
            } else {
                  return FAIL;
            }
      }
}

const checkKey = evt => {
      resolvePacMan(evt.keyCode, current);
      drawBoard();
}

initWalls();

document.onkeydown = checkKey;

drawBoard();