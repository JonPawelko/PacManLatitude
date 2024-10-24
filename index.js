
var NUM_ROWS = 10;
var NUM_COLUMNS = 10;
var current = 0;
var squares;
var tickCounter = 0;

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

var ICON_GHOST = "<img src='graphics/blueGhost.jpg'>";

var ICON_PELLET = "<img src='graphics/PelletIcon.jpg'>";
var ICON_BOMB = "<img src='graphics/BombIcon1.jpg'>";
var ICON_POWER_PELLET = "<img src='graphics/PowerPellet.jpg'>";

var WALL_PCT = .25;   // % of walls on board

// -------------------------------------------------------------------
// Initialize global variables

var walls = new Array;
var pellets = new Array;
var ghosts = new Array;

var totalPellets = 0;
var pelletsEaten = 0;
var score = 0;

document.onkeydown = checkKey;
var pacmanIcon;

// ---------------------------------------
// Initialize game components

buildWallsAndPellets();

drawInitialBoard();

spawnPacman();

spawnGhost();

// ---------------------------------------
// Intercept keydown event

function checkKey(evt)
{
  var oldCurr = current;

  if (resolvePacMan(evt.keyCode))           // resolvePacMan returns a 1 if success
    redrawBoardPacman(oldCurr, current);    // only redraw board if necessary

}

// ---------------------------------------

function drawInitialBoard()
{
  squares = document.querySelectorAll('.square');  // get squares

  squares[current].innerHTML = PACMAN_CLASSIC_RIGHT;   // set PacMan's current position

  for (var i=0; i<NUM_ROWS*NUM_COLUMNS; i++)  // loop through walls array, check for wall or pellet
  {
    if (walls[i] == 1)
    {
        squares[i].innerHTML = ICON_WALL;
    }
    else
    {
        if (pellets[i] == 1)
        {
          squares[i].innerHTML = ICON_PELLET;
        }
    }

  } // end for loop

}  // end function

// ---------------------------------------

function spawnPacman()
{
    var i = 0;
    squares = document.querySelectorAll('.square');  // faster to get first?

    while (i < walls.length)
    {
      if (walls[i++] == 0)
      {
        current = i-1;
        squares[current].innerHTML = PACMAN_CLASSIC_RIGHT;
        return;
      }
    } // end while loop

}  // end function

// ---------------------------------------

function buildWallsAndPellets()
{
  for (var i=0; i<NUM_ROWS*NUM_COLUMNS; i++)
  {
      var temp = Math.random();   // random # between 0 and 1

      if (temp < WALL_PCT)   // put walls on 25% of squares
      {
          walls.push(1);    // push a wall onto array
          pellets.push(0);  // push a zero onto pellets array
      }
      else
      {
          walls.push(0);
          pellets.push(1);
          totalPellets++;
      }

  }

}

// --------------------------------------

function redrawBoardPacman(oldSquare, newSquare)
{
      squares = document.querySelectorAll('.square');  // faster to get first?

      squares[oldSquare].innerHTML = "";   // From square always blank after Pacman leaves

      squares[newSquare].innerHTML = pacmanIcon; // set pac man on new current

}

// ---------------------------------------

function checkForPellet()
{
    if (pellets[current] == 1)
    {
        pelletsEaten++;
        score++;
        pellets[current] = 0;
    }
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

        checkForPellet();

        pacmanIcon = PACMAN_CLASSIC_RIGHT;
        return SUCCESS;
      }
      break;

    case ARROW_LEFT:

      if ( ((current % NUM_COLUMNS) != 0) && (walls[current-1] == 0) )
      {
        current--;

        checkForPellet();

        pacmanIcon = PACMAN_CLASSIC_LEFT;
        return SUCCESS;
      }
      break;

    case ARROW_DOWN:

      if ((current < NUM_COLUMNS * (NUM_ROWS-1)) && (walls[current+NUM_COLUMNS] == 0))
      {
        current = current + NUM_COLUMNS;

        checkForPellet();

        pacmanIcon = PACMAN_CLASSIC_DOWN;
        return SUCCESS;
      }
      break;

    case ARROW_UP:

      if ((current >= NUM_COLUMNS) && (walls[current-NUM_COLUMNS] == 0))
      {
        current = current - NUM_COLUMNS;

        checkForPellet();

        pacmanIcon = PACMAN_CLASSIC_UP;
        return SUCCESS;
      }
      break;

    default:

      return FAIL;

  } // end switch

} // end function

// -------------------------------------------

function ghostTick(ghostId)
{
  // dir 0 = right, 1 = down, 2 = left, 3 = up
  var dir = Math.floor(Math.random() * 4);  // returns a random int between 0 and 3

  // Will continue to work on this over the next several days


  //  squares = document.querySelectorAll('.square');  // faster to get first?
  //
  // squares[99].innerHTML = tickCounter++;
  //
  // if (tickCounter == 4)
  // {
  //   clearInterval(ghostTimerID);
  // }

}

// -------------------------------------------

function spawnGhost()
{
  // find first empty square starting at the last square
  var tempSquare = (NUM_ROWS * NUM_COLUMNS) - 1;

  while (walls[tempSquare] != 0)
    tempSquare--;

  // create timer thread
  var tempTimerId = setInterval(ghostTick, 1000, ghosts.length-1);

  // push ghost onto array with it's timer id and location
  ghosts.push({squareNum:tempSquare, timerID: tempTimerId});

  console.log(ghosts);

  // Draw ghost on board.  Later redraws handled by timer function
  var squares = document.querySelectorAll('.square');  // faster to get first?
  squares[tempSquare].innerHTML = ICON_GHOST;

}
