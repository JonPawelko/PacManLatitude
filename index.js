let NUM_ROWS = 5;
let NUM_COLUMNS = 5;
let current = 0;

const SPACE_BAR_KEY = 32;
const ARROW_LEFT = 37;
const ARROW_UP = 38;
const ARROW_RIGHT = 39;
const ARROW_DOWN = 40;

const checkKey = evt => {
      if (evt.keyCode == ARROW_RIGHT) {
            alert("Hello");
      }
}

document.onkeydown = checkKey;

function test()
{
      var squares = document.querySelectorAll('.square');

      squares[current].innerHTML = "X";

}
