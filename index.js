var NUM_ROWS = 10;
var NUM_COLUMNS = 10;
var current = 0;    // pacman's current square
var squares;        // squares on the board

// keyboard codes
var SPACE_BAR_KEY = 32;
var ARROW_LEFT = 37;
var ARROW_UP = 38;
var ARROW_RIGHT = 39;
var ARROW_DOWN = 40;

// general constants to denote direction
var RIGHT = 0;
var LEFT = 1;
var DOWN = 2;
var UP = 3;

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

document.onkeydown = checkKey;  // checkKey is function called when key pressed
var pacmanIcon;   // stores which icon pacman should use based on direction

// ----------------------------------------------------
// -----   Start Main Driver section  -----------------
// ----------------------------------------------------

// Initialize game components

buildWallsAndPellets();

drawInitialBoard();

spawnPacman();

spawnGhost();   // currently just spawns 1 ghost that does not die

// ----------------------------------------------------
// -----   End Main Driver section  -----------------
// ----------------------------------------------------

// ---------------------------------------------------------
// Start of Set up game function section -------------------
// ---------------------------------------------------------

// Intercept keydown event

function checkKey(evt)
{
  var oldCurr = current;

  if (resolvePacMan(evt.keyCode))           // resolvePacMan returns a 1 if success
    redrawBoardPacman(oldCurr, current);    // only redraw board if necessary

}

// --------------------------------------------------------------------

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
          // push a 1 onto pellets array, 0 onto walls array
          walls.push(0);
          pellets.push(1);
          totalPellets++;
      }

  } // end for loop

}

// -------------------------------------------------------------------------

function drawInitialBoard()
{
  squares = document.querySelectorAll('.square');  // get squares

  squares[current].innerHTML = PACMAN_CLASSIC_RIGHT;   // set PacMan's current position

  for (var i=0; i<NUM_ROWS*NUM_COLUMNS; i++)  // loop through walls array, check for wall or pellet
  {
    // check for wall first
    if (walls[i] == 1)
    {
        squares[i].innerHTML = ICON_WALL;
    }
    else
    {
        // if no wall, check for pellet
        if (pellets[i] == 1)
        {
          squares[i].innerHTML = ICON_PELLET;
        }
    }

  } // end for loop

}  // end function

// ---------------------------------------------------------
// End of Set up game function section ---------------------
// ---------------------------------------------------------

// ************************************************************************

// --------------------------------------------
// -----  Start Pac Man function section ------
// --------------------------------------------

function spawnPacman()
{
    var i = 0;
    squares = document.querySelectorAll('.square');  // faster to get first?

    // put pacman on first square not a wall

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

// ----------------------------------------------------------------

function redrawBoardPacman(oldSquare, newSquare)
{
      squares = document.querySelectorAll('.square');

      squares[oldSquare].innerHTML = "";   // From square always blank after Pacman leaves

      squares[newSquare].innerHTML = pacmanIcon; // set pac man on new current

}

// -------------------------------------------------------------
// function checks for a pellet and eats it if there

function checkForPellet()
{
    if (pellets[current] == 1)
    {
        pelletsEaten++;
        score++;
        pellets[current] = 0;
    }
}

// -------------------------------------------------------------

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

// --------------------------------------------
// -----  End Pac Man function section ------
// --------------------------------------------

// ************************************************************************

// -------------------------------------------------
// ---------  Start Ghost function section ---------
// -------------------------------------------------

function spawnGhost()
{
  // find first empty square starting at the last square
  var tempSquare = (NUM_ROWS * NUM_COLUMNS) - 1;

  while (walls[tempSquare] != 0)
    tempSquare--;

  // create timer thread
  var tempTimerId = setInterval(ghostTick, 3000, ghosts.length);

  // push ghost onto array with it's timer id and location
  ghosts.push({squareNum:tempSquare, timerID: tempTimerId});

  console.log(ghosts);

  // Draw ghost on board.  Later redraws are handled by the tick timer function
  var squares = document.querySelectorAll('.square');  // faster to get first?
  squares[tempSquare].innerHTML = ICON_GHOST;

}

// ---------------------------------------------------------------------
// function called for each ghost, each tick.
// ghost id in the array passed in

function ghostTick(ghostId)
{
  var legalMove = FAIL;
  var tries = 0;
  var dir; // dir 0 = right, 1 = left, 2 = up, 3 = down

  // loop until a legal move is found or 15 tries
  while ((legalMove == FAIL) && (tries < 15))
  {
    dir = Math.floor(Math.random() * 4);  // returns a random int between 0 and 3

    // determine if legal move
    legalMove = legalGhostMove(ghostId,dir);

    if (legalMove == FAIL)
    {
      tries++;
    }
    else
    {
        // save old square number before resolving ghost move
        var oldSquare = ghosts[ghostId].squareNum;
        resolveGhost(ghostId,dir);
        redrawBoardGhost(ghostId, oldSquare); // redraw check always needed if legal move
    }

  } // end while loop

} // end function

// -----------------------------------------------------------------------
// Checks for internal and external walls

function legalGhostMove(ghostId,dir)
{

  // switch on each possible direction
  switch(dir)
  {
    case RIGHT:

      if ( (((ghosts[ghostId].squareNum + 1) % NUM_COLUMNS) != 0) && (walls[(ghosts[ghostId].squareNum)+1] == 0) )
      {
        return SUCCESS;
      }
      else
      {
        return FAIL;
      }
      break;

    case LEFT:

      if ( ((ghosts[ghostId].squareNum % NUM_COLUMNS) != 0) && (walls[ghosts[ghostId].squareNum-1] == 0) )
      {
        return SUCCESS;
      }
      else
      {
        return FAIL;
      }
      break;

    case DOWN:

      if ((ghosts[ghostId].squareNum < NUM_COLUMNS * (NUM_ROWS-1)) && (walls[ghosts[ghostId].squareNum+NUM_COLUMNS] == 0))
      {
        return SUCCESS;
      }
      else
      {
        return FAIL;
      }
      break;

    case UP:

      if ((ghosts[ghostId].squareNum >= NUM_COLUMNS) && (walls[ghosts[ghostId].squareNum-NUM_COLUMNS] == 0))
      {
        return SUCCESS;
      }
      else
      {
        return FAIL;
      }
      break;

    default:

      return FAIL;

  } // end switch

}

// -----------------------------------------------------------------------
// Update ghost data

function resolveGhost(ghostId,dir)
{

    switch(dir)
    {
      case RIGHT:

        ghosts[ghostId].squareNum++;
        break;

      case LEFT:

        ghosts[ghostId].squareNum--;
        break;

      case DOWN:

        ghosts[ghostId].squareNum += NUM_COLUMNS;
        break;

      case UP:

        ghosts[ghostId].squareNum -= NUM_COLUMNS;
        break;

    } // end switch

}

// ----------------------------------------------------------------------

function redrawBoardGhost(ghostId, oldSquare)
{
      squares = document.querySelectorAll('.square');

      squares[ghosts[ghostId].squareNum].innerHTML = ICON_GHOST;

      // Check what needs to be in old square, for now, only a pellet 
      if (pellets[oldSquare] == 1)
      {
          squares[oldSquare].innerHTML = ICON_PELLET;
      }
      else  // square is blank
      {
          squares[oldSquare].innerHTML = "";
      }

}

// -------------------------------------------------
// ---------  End Ghost function section ---------
// -------------------------------------------------

// ************************************************************************
