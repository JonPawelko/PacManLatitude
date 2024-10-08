let NUM_ROWS = 5;
let NUM_COLUMNS = 5;
let current = 0;

const SPACE_BAR_KEY = 32;
const ARROW_LEFT = 37;
const ARROW_UP = 38;
const ARROW_RIGHT = 39;
const ARROW_DOWN = 40;

const PLAYER_HTML = "<img src=\"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fpacman%2Fimages%2F2%2F24%2FPac-Man-0.png%2Frevision%2Flatest%2Fscale-to-width-down%2F2000%3Fcb%3D20190526005949&f=1&nofb=1&ipt=1c27ac8093b5c019b7c046f7fce36a061b055be6b3d74455530c232e3b46e7ab&ipo=images\" width=\"100px\" height=\"100px\"> </img>"

const drawBoard = () => {
      squares = document.querySelectorAll('.square');
      squares[current].innerHTML = PLAYER_HTML;
}

const checkKey = evt => {
      if (evt.keyCode == ARROW_RIGHT) {
            if ((current + 1) % NUM_COLUMNS != 0) {
                  squares[current++].innerHTML = "";
                  drawBoard();
            }
      }

      if (evt.keyCode == ARROW_LEFT) {
            if (current % NUM_COLUMNS != 0) {
                  squares[current--].innerHTML = "";
                  drawBoard();
            }
      }

      if (evt.keyCode == ARROW_UP) {
            if (current > NUM_COLUMNS - 1) {
                  squares[current].innerHTML = "";
                  current -= NUM_COLUMNS;
                  drawBoard();
            }
      }

      if (evt.keyCode == ARROW_DOWN) {
            if (current < NUM_ROWS * NUM_COLUMNS - NUM_COLUMNS) {
                  squares[current].innerHTML = "";
                  current += NUM_COLUMNS;
                  drawBoard();
            }
      }


}

document.onkeydown = checkKey;

drawBoard();