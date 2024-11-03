// Jon's Pacman game ------------------------

// Configurable game components
const NUM_ROWS = 8;
const NUM_COLUMNS = 8;
const WALL_PCT = .1;   // % of walls on board
const SQUARE_SIZE = 50;  // pixel size of individual squares
const SAFE_ZONE_SIZE = 4; // rows/columns of safety in upper left corner
const RESET_PLAYER_DELAY = 3; // seconds
const LIVES_START = 3
const BOMBS_START_COUNT = 10;
const POWER_PELLETS_START_COUNT = 3;
const POINTS_PER_GHOST = 10;
const POWER_PELLET_DELAY = 8; // seconds

var current;    // pacman's current square
var lives;
var level;
var bombs;

// Global variables
var squares;        // squares on the board
var score;
var totalPellets;   // total pellets placed on current board
var pelletsEaten;   // total pellets eaten on the board
var numPowerPellets;  // number of power pellets per board
var numPowerPelletsEaten;
var score;
var gameMode;         // mode is either "regular" (ghosts kill pacman) or "power pellet" (pacman kills ghosts)
var myPowerPelletTimerVar;

// General Constants ----------------------------

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

const RESOLVE_PACMAN_FAIL = 0;
const RESOLVE_PACMAN_SUCCESS = 1;
const RESOLVE_PACMAN_DEATH = -1;

const GAME_MODE_POWER_OFF = 0;
const GAME_MODE_POWER_ON = 1;

const GHOST_FOUND = 1;
const GHOST_NOT_FOUND = 0;

const OFF_THE_BOARD = -1;  // square num when dead or off the board

// -------------------------------------------------------------------
// Initialize global variables

var walls;
var pellets;
var powerPellets;
var ghosts = new Array;

totalPellets = 0;
pelletsEaten = 0;
numPowerPelletsEaten = 0;
numPowerPellets = POWER_PELLETS_START_COUNT;
score = 0;
lives = LIVES_START;
bombs = BOMBS_START_COUNT;
level = 1;
gameMode = GAME_MODE_POWER_OFF;
myPowerPelletTimerVar = -1;  // stays -1 if the timer is never used, otherwise stores actual value.  Only need 1.

document.onkeydown = checkKey;  // checkKey is function called when key pressed
var pacmanIcon;   // stores which icon pacman should use based on direction

// ----------------------------------------------------
// -----   Start Main Driver section  -----------------
// ----------------------------------------------------

// Initialize game components

createBoard();

updateScoreboard();

buildWallsAndPellets();

createPowerPellets();

drawInitialBoard();

spawnPacman();

// spawnGhost((NUM_ROWS*NUM_COLUMNS)-1);   // pass in starting sqaure, currently just spawns 1 ghost that does not die
// spawnGhost(Math.floor(NUM_ROWS*NUM_COLUMNS/2)); // near middle of board

spawnGhost(2);   // pass in starting square
spawnGhost(12); // near middle of board

// ----------------------------------------------------
// -----   End Main Driver section  -----------------
// ----------------------------------------------------

// ---------------------------------------------------------
// Start of game management function section -------------------
// ---------------------------------------------------------

// Intercept keydown event

function checkKey(evt)
{
  var oldCurr = current;

  if (current != OFF_THE_BOARD)   // only intercept keys if pacman on the board
  {
    if (resolvePacMan(evt.keyCode))           // resolvePacMan returns a 1 if success
       redrawBoardPacman(oldCurr, current);    // only redraw board if necessary
  }

} // end function checkKey

// --------------------------------------------------------------------

function createBoard()
{
    // get the board
    var myBoard = document.getElementById("board");
    myBoard.innerHTML = "";

    //  set the width and height styles to the number of pixels
    myBoard.style.width = (NUM_COLUMNS*SQUARE_SIZE) + "px";
    myBoard.style.height = (NUM_ROWS*SQUARE_SIZE) + "px";

    // Create the squares
    for (var i=0;i<NUM_COLUMNS*NUM_ROWS;i++)
    {
      myBoard.innerHTML = myBoard.innerHTML + '<div class="square"></div>';
    }

}   // end function createBoard

// -----------------------------------------------------------

function updateScoreboard()
{
  document.getElementById("livesVariable").innerHTML = lives;
  document.getElementById("scoreVariable").innerHTML = score;
  document.getElementById("levelVariable").innerHTML = level;
  document.getElementById("bombsVariable").innerHTML = bombs;
}

// -----------------------------------------------------------------------

function buildWallsAndPellets()
{
  // deletes old arrays if exist
  walls = new Array;
  pellets = new Array;

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

} // end function buildWallsAndPellets

// -------------------------------------------------------------------------

function createPowerPellets()
{
  var squareFound = false;
  var i;

  // reset pp array if it exists
  powerPellets = new Array;

  // default array to zeros
  for (i=0; i< NUM_ROWS*NUM_COLUMNS; i++)
    powerPellets[i] = 0;

  for (i=0; i< numPowerPellets; i++)
  {
    squareFound = false;

    while (squareFound == false)
    {
      var ppSquare = Math.floor(Math.random() * ((NUM_ROWS*NUM_COLUMNS)-1)) + 1;  // return any square on board except 0.

      if (pellets[ppSquare] == 1)
      {
        squareFound = true;
        pellets[ppSquare] = 0;
        totalPellets--;
        powerPellets[ppSquare] = 1;
      }  // end if
    } // end while

  } // end for`

}  // end function createPowerPellets

// --------------------------------------------------

function drawInitialBoard()
{
  squares = document.querySelectorAll('.square');  // get squares

  // squares[current].innerHTML = PACMAN_CLASSIC_RIGHT;   // set PacMan's current position

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
        else {
                if (powerPellets[i] == 1)
                {
                  squares[i].innerHTML = ICON_POWER_PELLET;
                }
        }
    }

  } // end for loop

}  // end function drawInitialBoard

// ---------------------------------------------------------
// function called after pacman completes a level

function resetBoard()
{
    totalPellets = 0;
    pelletsEaten = 0;
    numPowerPelletsEaten = 0;
    numPowerPellets = POWER_PELLETS_START_COUNT;

    current = -1;
    level++;
    gameMode = GAME_MODE_POWER_OFF;

    if (myPowerPelletTimerVar != -1)
    {
      clearTimeout(myPowerPelletTimerVar);
      myPowerPelletTimerVar = -1;
    }

    updateScoreboard();

    buildWallsAndPellets();

    createPowerPellets();

    drawInitialBoard();

    setTimeout( respawnPacmanTimer, RESET_PLAYER_DELAY*1000);

}

// End function resetBoard ---------------------------------

// ---------------------------------------------------------
// End of game management function section ---------------------
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
        pacmanIcon = PACMAN_CLASSIC_RIGHT;
        squares[current].innerHTML = pacmanIcon;
        checkForPellets();

        return;
      }
    } // end while loop

}  // end function spawnPacman

// -----------------------------------------------------------------------------------
// Function respawnPacmanTimer called after pacman is killed
// -----------------------------------------------------------------------------------

function respawnPacmanTimer()
{
  var i; // for loop
  squares = document.querySelectorAll('.square');  // faster to get first?

  // check each ghost to make sure they are not within the safe zone
  for (i=0;i<ghosts.length;i++)
  {
    var checkZone;    // temp var, true or false if ghost is in safety zone
    var oldSquareNum; // might need to move ghost and redraw it's previous square

    var squareNum = ghosts[i].squareNum;
    oldSquareNum = squareNum;
    var ghostMoved = false;   // assume no moves, only continue work if move required

    if (squareNum == OFF_THE_BOARD)  // off board ghost is ok, keep checking
      checkZone = false;
    else checkZone = checkIfGhostInSafetyZone(squareNum, SAFE_ZONE_SIZE);

    // move ghost required, loop until safe square found
    while (checkZone == true)
    {
      ghostMoved = true;
      squareNum = Math.floor(Math.random() * NUM_ROWS * NUM_COLUMNS);
      checkZone = checkIfGhostInSafetyZone(squareNum, SAFE_ZONE_SIZE);
    }

    if (ghostMoved == true)  // reset ghost to new safe space
    {
      ghosts[i].squareNum = squareNum;
      redrawBoardGhost(i, oldSquareNum);  // redraw new square and old square
    }

  }  // end for loop

  spawnPacman();

} // end function respawnPacmanTimer

// -----------------------------------------------------------------------------------
// End Function respawnPacmanTimer
// -----------------------------------------------------------------------------------

// ----------------------------------------------------------------

function redrawBoardPacman(oldSquare, newSquare)
{
    squares = document.querySelectorAll('.square');

    squares[oldSquare].innerHTML = "";   // From square always blank after Pacman leaves

    if (current != OFF_THE_BOARD)
      squares[newSquare].innerHTML = pacmanIcon; // set pac man on new current

}   // end function redrawBoardPacman

// -------------------------------------------------------------
// function checks for a pellet and eats it if there, else
// checks for powerPellets

function checkForPellets()
{
    if (pellets[current] == 1)
    {
        pelletsEaten++;
        score++;
        document.getElementById("scoreVariable").innerHTML = score;
        pellets[current] = 0;
    }
    else
    {
      if (powerPellets[current] == 1)
      {
          gameMode = GAME_MODE_POWER_ON;
          score++;
          document.getElementById("scoreVariable").innerHTML = score;
          powerPellets[current] = 0;
          numPowerPelletsEaten++;

          if (myPowerPelletTimerVar != -1)
          {
              // clear an old one if it's still running
              clearTimeout(myPowerPelletTimerVar);
          }

          // launch the pp timer
          myPowerPelletTimerVar = setTimeout(myPowerPelletTimer, POWER_PELLET_DELAY * 1000);

      }   // end if PP found

    } // end else

    console.log("Total pellets is " + totalPellets + " pellets eaten is " + pelletsEaten + "  power pellets eaten is " + numPowerPelletsEaten + " pp per screen is " + POWER_PELLETS_START_COUNT);

    if ((pelletsEaten == totalPellets) && (numPowerPelletsEaten = POWER_PELLETS_START_COUNT))
    {
      resetBoard();
    }
} // end function checkForPellets

// -------------------------------------------------------------

function resolvePacMan(direction)
{
  var ghostStatus;

  switch(direction)
  {
    case ARROW_RIGHT:

      if ( (((current + 1) % NUM_COLUMNS) != 0) && (walls[current+1] == 0) )
      {
          current++;

          ghostStatus = checkForGhost();

          if (ghostStatus > 0)
          {
            if (gameMode == GAME_MODE_POWER_OFF)
            {
                killPacman();
            }
            else
            {
                eatGhosts();
            }
          }

          checkForPellets();

          // Might have finished board
          if (current != -1)
          {
            pacmanIcon = (gameMode == GAME_MODE_POWER_ON) ? PACMAN_CLASSIC_RIGHT_PP : PACMAN_CLASSIC_RIGHT;
            return SUCCESS;
          }
          else
          {
            return FAIL;
          }
      }

      break;

    case ARROW_LEFT:

      if ( ((current % NUM_COLUMNS) != 0) && (walls[current-1] == 0) )
      {
        current--;

        ghostStatus = checkForGhost();

        if (ghostStatus > 0)
        {
          if (gameMode == GAME_MODE_POWER_OFF)
          {
              killPacman();
          }
          else
          {
              eatGhosts();
          }
        }

        checkForPellets();

        // Might have finished board
        if (current != -1)
        {
          pacmanIcon = (gameMode == GAME_MODE_POWER_ON) ? PACMAN_CLASSIC_LEFT_PP : PACMAN_CLASSIC_LEFT;
          return SUCCESS;
        }
        else
        {
          return FAIL;
        }
      }
      break;

    case ARROW_DOWN:

      if ((current < NUM_COLUMNS * (NUM_ROWS-1)) && (walls[current+NUM_COLUMNS] == 0))
      {
        current = current + NUM_COLUMNS;

        ghostStatus = checkForGhost();

        if (ghostStatus > 0)
        {
          if (gameMode == GAME_MODE_POWER_OFF)
          {
              killPacman();
          }
          else
          {
              eatGhosts();
          }
        }

        checkForPellets();

        // Might have finished board
        if (current != -1)
        {
          pacmanIcon = (gameMode == GAME_MODE_POWER_ON) ? PACMAN_CLASSIC_DOWN_PP : PACMAN_CLASSIC_DOWN;
          return SUCCESS;
        }
        else
        {
          return FAIL;
        }
      }
      break;

    case ARROW_UP:

      if ((current >= NUM_COLUMNS) && (walls[current-NUM_COLUMNS] == 0))
      {
        current = current - NUM_COLUMNS;

        ghostStatus = checkForGhost();

        if (ghostStatus > 0)
        {
          if (gameMode == GAME_MODE_POWER_OFF)
          {
              killPacman();
          }
          else
          {
              eatGhosts();
          }
        }

        checkForPellets();

        // Might have finished board
        if (current != -1)
        {
          pacmanIcon = (gameMode == GAME_MODE_POWER_ON) ? PACMAN_CLASSIC_UP_PP: PACMAN_CLASSIC_UP;
          return SUCCESS;
        }
        else
        {
          return FAIL;
        }
      }
      break;

  } // end switch

  return FAIL;

} // end function resolvePacMan

// --------------------------------------------
function killPacman()
{
    current = OFF_THE_BOARD;
    lives--;
    document.getElementById("livesVariable").innerHTML = lives;

    if (lives > 0)
      // launch the respawn timer function
      setTimeout( respawnPacmanTimer, RESET_PLAYER_DELAY*1000);
    else {
      window.alert("Game Over");
    }

}

// ---  end function killPacman --------------------

// -------------------------------------------------
//

function eatGhosts()
{
    // console.log("Eat ghost called");

  for (var i=0; i<ghosts.length; i++)
  {
    if (ghosts[i].squareNum == current)
    {
      // console.log("Found a ghost to Eat " + i);

      ghosts[i].squareNum = OFF_THE_BOARD;

      // console.log("Ghosts squarenum is " + ghosts[i].squareNum);

      // spawn a new ghost
      reSpawnGhost(Math.floor(Math.random() * (NUM_ROWS*NUM_COLUMNS)));  // return any square on board

    }

  }  // end for loop

} // end function eatGhosts

// ----------------------------------------------------------------

function myPowerPelletTimer()
{
    gameMode = GAME_MODE_POWER_OFF;
    myPowerPelletTimerVar = -1;

    switch (pacmanIcon) {

      case PACMAN_CLASSIC_RIGHT_PP:
          pacmanIcon = PACMAN_CLASSIC_RIGHT;
          break;

      case PACMAN_CLASSIC_LEFT_PP:
          pacmanIcon = PACMAN_CLASSIC_LEFT;
          break;

      case PACMAN_CLASSIC_UP_PP:
          pacmanIcon = PACMAN_CLASSIC_UP;
          break;

      case PACMAN_CLASSIC_DOWN_PP:
          pacmanIcon = PACMAN_CLASSIC_DOWN;
          break;

      default:

    } // end switch

    squares = document.querySelectorAll('.square');  // faster to get first?
    squares[current].innerHTML = pacmanIcon;

}

//
// --------------------------------------------
// -----  End Pac Man function section ------
// --------------------------------------------

// ************************************************************************

// -------------------------------------------------
// ---------  Start Ghost function section ---------
// -------------------------------------------------

function spawnGhost(squareNum)
{
  // find first empty square starting at the square passed in
  while (walls[squareNum] != 0)
    squareNum--;

  // create timer thread
  var tempTimerId = setInterval(ghostTick, 3000, ghosts.length);

  // push ghost onto array with it's timer id and location
  ghosts.push({squareNum:squareNum, timerID: tempTimerId});

  // console.log(ghosts);

  // Draw ghost on board.  Later redraws are handled by the tick timer function
  squares = document.querySelectorAll('.square');  // faster to get first?
  squares[squareNum].innerHTML = ICON_GHOST;

} // end function spawnGhost

// ---------------------------------------------------------------------

function reSpawnGhost(squareNum)
{
  // make sure now spawing directly on pacman or within 1 square

  var safeSquareFound = false;

  while (safeSquareFound == false)
  {
      if (!((walls[squareNum] == 1) || (current == squareNum) || (current == squareNum+1) || (current == squareNum-1) || (current == squareNum+NUM_COLUMNS) || (current == squareNum-NUM_COLUMNS)))
        safeSquareFound = true;
      else {
        // increase squareNum and try again
        squareNum++;
      }
  }

  // create timer thread
  var tempTimerId = setInterval(ghostTick, 3000, ghosts.length);

  // push ghost onto array with it's timer id and location
  ghosts.push({squareNum:squareNum, timerID: tempTimerId});

  // Later redraws are handled by the tick timer function

} // end function spawnGhost

// ---------------------------------------------------------------------
// function called for each ghost, each tick.
// ghost id in the array passed in

function ghostTick(ghostId)
{
  var legalMove = FAIL;
  var tries = 0;
  var dir; // dir 0 = right, 1 = left, 2 = up, 3 = down


  // loop until a legal move is found or 15 tries
  while ((legalMove == FAIL) && (tries < 15) && (ghosts[ghostId].squareNum != OFF_THE_BOARD))
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

} // end function ghostTick

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

} // end function legalGhostMove

// -----------------------------------------------------------------------
// Update ghost data

function resolveGhost(ghostId,dir)
{
    switch(dir)
    {
      case RIGHT:

        ghosts[ghostId].squareNum++;
        checkIfOnGhostPacman(ghostId);
        break;

      case LEFT:

        ghosts[ghostId].squareNum--;
        checkIfOnGhostPacman(ghostId);
        break;

      case DOWN:

        ghosts[ghostId].squareNum += NUM_COLUMNS;
        checkIfOnGhostPacman(ghostId);
        break;

      case UP:

        ghosts[ghostId].squareNum -= NUM_COLUMNS;
        checkIfOnGhostPacman(ghostId);
        break;

    } // end switch

}   // end function resolveGhost

// ----------------------------------------------------------------------

function redrawBoardGhost(ghostId, oldSquare)
{
    // console.log("Ghost " + ghostId + " redraw called for pos " + ghosts[ghostId].squareNum);

    if (ghosts[ghostId].squareNum != OFF_THE_BOARD)
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
          if (powerPellets[oldSquare] == 1)
          {
              squares[oldSquare].innerHTML = ICON_POWER_PELLET;
          }
          else
            squares[oldSquare].innerHTML = "";
        }
    } // end check if ghost is on board

}   // end function redrawBoardGhost

// ------------------------------------------------

function checkForGhost()
{
    for (var i=0; i<ghosts.length; i++)
    {
      if (ghosts[i].squareNum == current)
        return GHOST_FOUND;
    }
    return GHOST_NOT_FOUND;
}

// ------------------------------------------------
 function checkIfOnGhostPacman(ghostId)
 {
      if ((ghosts[ghostId].squareNum == current) && (gameMode == GAME_MODE_POWER_ON))
      {
        // kill ghost
        ghosts[ghostId].squareNum = -1;
      }
      else
      {
        if ((ghosts[ghostId].squareNum == current) && (gameMode == GAME_MODE_POWER_OFF))
        {
          // kill pacman
          killPacman();
        }
      } // end else

 }  // end function checkIfOnGhostPacman

// ----------------------------------------------------------------------
// True / false returned - Check if the position is in the safety zone
function checkIfGhostInSafetyZone(pos, size)
{
  var i; // for loop
  var j;

  // if size is 3, check a 9 square range if safe
  for (i=0; i<size; i++)
  {
      for (j=0; j<size; j++)
      {
          if (((i*NUM_COLUMNS)+j) == pos)
          {
            // Ghost's position is in the safety zone
            return true;
          }
      }   // end inner for loop

  }  // end outer for loop

  // console.log("Position not in safety zone: Pos = " + pos + ". Size = " + size);
  return false;

} // end function check ghost safety zone

// ----------------------------------------------

// -------------------------------------------------
// ---------  End Ghost function section ---------
// -------------------------------------------------

// ************************************************************************
