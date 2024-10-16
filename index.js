
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

const FAIL = 0;
const SUCCESS = 1;

var PACMAN_CLASSIC_RIGHT = "<img src='graphics/Pacman icon right.jpg'>";
var PACMAN_CLASSIC_LEFT = "<img src='graphics/Pacman icon left.jpg'>";
var PACMAN_CLASSIC_UP = "<img src='graphics/Pacman icon up.jpg'>";
var PACMAN_CLASSIC_DOWN = "<img src='graphics/Pacman icon down.jpg'>";
var PACMAN_CLASSIC_RIGHT_PP = "<img src='graphics/Pacman icon right PP.jpg'>";
var PACMAN_CLASSIC_LEFT_PP = "<img src='graphics/Pacman icon left PP.jpg'>";
var PACMAN_CLASSIC_UP_PP = "<img src='graphics/Pacman icon up PP.jpg'>";
var PACMAN_CLASSIC_DOWN_PP = "<img src='graphics/Pacman icon down PP.jpg'>";
var ICON_WALL = "<img src='graphics/wallIcon.jpg'>";

// -------------------------------------------------------------------
// Initialize global variables

var walls = new Array;
document.onkeydown = checkKey;
var pacmanIcon;

// ---------------------------------------
// Initialize game components

buildWalls();

drawInitialBoard();

// ---------------------------------------

function checkKey(evt)
{
  var oldCurr = current;

  if (resolvePacMan(evt.keyCode))
    redrawBoard(oldCurr, current);

}

// ---------------------------------------

function drawInitialBoard()
{
  squares = document.querySelectorAll('.square');  // get squares

  squares[current].innerHTML = PACMAN_CLASSIC_RIGHT;   // set PacMan's current position

  for (var i=0; i<NUM_ROWS*NUM_COLUMNS; i++)  // loop through walls array, assume squares empty
  {
    if (walls[i] == 1)
    {
      squares[i].innerHTML = ICON_WALL;
    }
  }

}

// ---------------------------------------

function buildWalls()
{
  for (var i=0; i<NUM_ROWS*NUM_COLUMNS; i++)
    walls.push(0);

  walls[4] = 1;
  walls[7] = 1;

}

// --------------------------------------

function redrawBoard(oldSquare, newSquare)
{
      squares = document.querySelectorAll('.square');  // faster to get first?

      squares[oldSquare].innerHTML = "";   // blank for now, but might have 2 ghosts later ***

      squares[newSquare].innerHTML = pacmanIcon; // set pac man on new current

}

// ---------------------------------------

function resolvePacMan(direction)
{
  switch(direction)
  {

    case ARROW_RIGHT:

      if ( (((current + 1) % NUM_COLUMNS) != 0) && (walls[current+1] == 0) )
      {
        current++;
        pacmanIcon = PACMAN_CLASSIC_RIGHT;
        return SUCCESS;
      }
      break;

    case ARROW_LEFT:

      if ( ((current % NUM_COLUMNS) != 0) && (walls[current-1] == 0) )
      {
        current--;
        pacmanIcon = PACMAN_CLASSIC_LEFT;
        return SUCCESS;
      }
      break;

    case ARROW_DOWN:

      if ((current < NUM_COLUMNS * (NUM_ROWS-1)) && (walls[current+NUM_COLUMNS] == 0))
      {
        current = current + NUM_COLUMNS;
        pacmanIcon = PACMAN_CLASSIC_DOWN;
        return SUCCESS;
      }
      break;

    case ARROW_UP:

      if ((current >= NUM_COLUMNS) && (walls[current-NUM_COLUMNS] == 0))
      {
        current = current - NUM_COLUMNS;
        pacmanIcon = PACMAN_CLASSIC_UP;
        return SUCCESS;
      }
      break;

    default:

      return FAIL;

  } // end switch

} // end function

// -------------------------------------------
