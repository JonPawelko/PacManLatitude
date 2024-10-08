
var NUM_ROWS = 5;
var NUM_COLUMNS = 5;
var current = 0;
var squares;

// key codes
var SPACE_BAR_KEY = 32;
var ARROW_LEFT = 37;
var ARROW_UP = 38;
var ARROW_RIGHT = 39;
var ARROW_DOWN = 40;

document.onkeydown = checkKey;

// ---------------------------------------

drawBoard();

// ---------------------------------------

function checkKey(evt)
{
  if (evt.keyCode == ARROW_RIGHT)
  {
    squares[current++].innerHTML = "";
    drawBoard();
  }

}

// -------------------------------------------

function drawBoard()
{
      squares = document.querySelectorAll('.square');  // faster to get first?

      squares[current].innerHTML = "X";

}
