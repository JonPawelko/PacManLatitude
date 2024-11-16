// Release Notes
// v1.13 11-16-24 - Ghost respawn delay configurable, game over
// v1.12 11-13-24 - Updated ghost spawning logic, now configurable
// v1.11 11-12-24 - Rabid ghost type added, runs towards pacman when pacman in PP mode
// v1.10 11-11-24 - Ghost smarts implemented
// v1.9 11-9-24 - Tunnel feature
// v1.8 11-8- Randomized ghost timer
// v 1.7 Fri - Good bombs working fully
// v 1.6 Wed 11-6-24 - Bombs working, fixed bug where pacman dies from a bomb while on PP status
// v 1.5 Tuesday 11-5-24 - Bombs working. Blows up pacman or a wall if next to bomb

// Jon's Pacman game ------------------------

// Configurable game components
const NUM_ROWS = 10;
const NUM_COLUMNS = 10;
const WALL_PCT = .1;   // % of walls on board
const SQUARE_SIZE = 50;  // pixel size of individual squares
const NUM_GHOSTS = 5;   // number of ghosts to create on each level
const GHOST_SMARTS = 90; // % of time ghost moves towards pacman during regular mode or away from pacman during pp mode
const GHOST_RESPAWN_DELAY = 5;  // delay in seconds for dead ghosts to respawn
const SAFE_ZONE_SIZE = 4; // rows/columns of safety in upper left corner when pacman spawns or respawns
const GHOST_SPEED = 1;  // how often ghosts move in seconds
const RESET_PLAYER_DELAY = 3; // seconds
const LIVES_START = 3;
const BOMBS_START_COUNT = 10;
const POWER_PELLETS_START_COUNT = 8;  // num of pp per board
const POINTS_PER_GHOST = 10;
const POWER_PELLET_DELAY = 8; // pacman gets this many seconds to kill ghosts after eating pp
const BOMB_DELAY = 4;   // bombs blow up in this many seconds
const GOOD_BOMB_DELAY = 10; // how frequently good bombs are dropped
const GOOD_BOMB_DURATION = 9; // how many seconds a good bomb exists before disappearing
const TUNNEL1_SQUARE_NUM = 23;
const TUNNEL2_SQUARE_NUM = 77;

const GHOST_TYPE_NORMAL = 0;
const GHOST_TYPE_RABID = 1;

// Global variables
var current;    // pacman's current square
var lives;      // pacman's current # of lives remaining
var level;      // the board level
var bombCount;  // number of pacmans bombs

var squares;        // represents the squares on the board
var score;
var totalPellets;   // total pellets placed on current board
var pelletsEaten;   // total pellets eaten currently on the board
var numPowerPellets;  // number of power pellets per board
var numPowerPelletsEaten; // num of pp eaten currently on the board
var gameMode;         // mode is either "regular" (ghosts kill pacman) or "power pellet" (pacman kills ghosts)
var tunnel1num;        // tunnel hole in board, exit other tunnel
var tunnel2num;

var myPowerPelletTimerVar;  // used to end pp phase
var ghostsCreated;
var ghostsEaten;
var goodBombTimerID;
var cancelGoodBombTimerID;

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

// graphics
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
var ICON_GOOD_BOMB = "<img src='graphics/GoodBombIcon.jpg'>";
var ICON_POWER_PELLET = "<img src='graphics/PowerPellet.jpg'>";
var ICON_TUNNEL = "<img src='graphics/tunnel.jpg'>";
var ICON_GHOST_RABID = "<img src='graphics/rabidGhost.jpg'>"

const RESOLVE_PACMAN_FAIL = 0;
const RESOLVE_PACMAN_SUCCESS = 1;
const RESOLVE_PACMAN_DEATH = -1;

const GAME_MODE_POWER_OFF = 0;
const GAME_MODE_POWER_ON = 1;

const GHOST_NOT_FOUND = 0;
const GHOST_FOUND = 1;

const OFF_THE_BOARD = -1;  // square num when dead or off the board

// -------------------------------------------------------------------
// Initialize global variables

var walls;  // create the array each time a new board is started
var pellets;  // create the array each time a new board is started
var powerPellets;  // create the array each time a new board is started
var ghosts = new Array;   // use the same ghosts array the whole game
var bombs = new Array;    // dropped by pacman, bombs are similar to ghosts, 1 array position per bomb, not per square
var goodBombs = new Array;  // similar structure to pellets

totalPellets = 0;
pelletsEaten = 0;
numPowerPelletsEaten = 0;
numPowerPellets = POWER_PELLETS_START_COUNT;
ghostsEaten = 0;
ghostsCreated = 0;
score = 0;
lives = LIVES_START;
bombCount = BOMBS_START_COUNT;  // how many bombs remaining
level = 1;
gameMode = GAME_MODE_POWER_OFF;
myPowerPelletTimerVar = -1;  // stays -1 if the timer is never used, otherwise stores actual value.  Only need 1.
goodBombTimerID = -1; // -1 when not in use
cancelGoodBombTimerID = -1; // -1 when not in use

document.onkeydown = checkKey;  // checkKey is function called when key pressed
var pacmanIcon;   // stores which icon pacman should use based on direction

// ----------------------------------------------------
// -----   Start Main Driver section  -----------------
// ----------------------------------------------------

// Initialize game components
createBoard();

updateScoreboard();

buildWallsAndPellets();

createPowerPelletsAndGoodBombs();

createTunnel();

drawInitialBoard();

startGoodBombTimer();

spawnAllGhosts();

respawnPacmanTimer();


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

  // only intercept keys if pacman on the board
  if (current != OFF_THE_BOARD)
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
  document.getElementById("bombsVariable").innerHTML = bombCount;
}

// -----------------------------------------------------------------------

function buildWallsAndPellets()
{
  // deletes old arrays if exist by just recreating arrays
  walls = new Array;
  pellets = new Array;


  // iterate through each square
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

  // Check to ensure pacman has a way of escape
  // if square 0, 1, or the square below pacman is a wall, flip to pellet

  if (walls[0] == 1)
  {
    walls[0] = 0;
    pellets[0] = 1;
    totalPellets++;
  }

  if (walls[1] == 1)
  {
    walls[1] = 0;
    pellets[1] = 1;
    totalPellets++;
  }

  if (walls[NUM_COLUMNS] == 1)
  {
    walls[NUM_COLUMNS] = 0;
    pellets[NUM_COLUMNS] = 1;
    totalPellets++;
  }

  // test walls
  // walls[1] = 1;
  // walls[25] = 1;

} // end function buildWallsAndPellets

// -------------------------------------------------------------------------

function createPowerPelletsAndGoodBombs()
{
  var squareFound = false;
  var i;

  // reset pp array if it exists
  powerPellets = new Array;

  // default both pp and good bombs arrays to zeros
  for (i=0; i< NUM_ROWS*NUM_COLUMNS; i++)
  {
    powerPellets[i] = 0;
    goodBombs[i] = 0;     // new code
  }

  // now create some pp
  for (i=0; i< numPowerPellets; i++)
  {
    squareFound = false;

    // loop until you find a square with a regular pellet on it, replace it with a PP
    while (squareFound == false)
    {
      // find a random square between 1 and board size - 1
      // don't want to put in square 0.  Assume 10x10
      // floor of Math.random * (NUM_ROWS*NUM_COLUMNS - 2) = 0 to 98, add 1 = 1 to 99 (correct)
      var ppSquare = Math.floor(Math.random() * ((NUM_ROWS*NUM_COLUMNS)-2)) + 1;  // return any square on board except 0.

      // pellet found, flip to PP
      if (pellets[ppSquare] == 1)
      {
        squareFound = true;
        pellets[ppSquare] = 0;
        totalPellets--;
        powerPellets[ppSquare] = 1;
      }  // end if
    } // end while

  } // end for

}  // end function createPowerPellets

// --------------------------------------------------

function createTunnel()
{
  var squareFound = false;
  var target = TUNNEL1_SQUARE_NUM;

    // loop until you find a square with a regular pellet on it, replace it with tunnel1
    while (squareFound == false)
    {
      // pellet found, use this square as tunnel1
      if (pellets[target] == 1)
      {
        squareFound = true;
        tunnel1num = target;
        pellets[target] = 0;
        totalPellets--;
      }
      else {
        target++;
      }

    } // end while

    squareFound = false;
    target = TUNNEL2_SQUARE_NUM;

      // loop until you find a square with a regular pellet on it, replace it with tunnel1
      while (squareFound == false)
      {
        // pellet found, use this square as tunnel1
        if (pellets[target] == 1)
        {
          squareFound = true;
          tunnel2num = target;
          pellets[target] = 0;
          totalPellets--;
        }
        else {
          target++;
        }

      } // end while

}  // end function createTunnel

// --------------------------------------------------

function drawInitialBoard()
{

  squares = document.querySelectorAll('.square');  // get squares

  for (var i=0; i<NUM_ROWS*NUM_COLUMNS; i++)  // loop through full board, check for wall or pellet
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
        else  // check for PP
        {
          if (powerPellets[i] == 1)
          {
            squares[i].innerHTML = ICON_POWER_PELLET;
          }
          else  // check for tunnels
          {
              if ((tunnel1num == i) || (tunnel2num == i))
              {
                // console.log("Tunnel found at " + i);
                squares[i].innerHTML = ICON_TUNNEL;
              }
          }
        } // end else
    } // end else

    // console.log("Found something is " + foundSomething + " in square " + i);

  } // end for loop

}  // end function drawInitialBoard

// ---------------------------------------------------------
// function called after pacman completes a level

function resetBoard()
{
    current = -1;
    totalPellets = 0;
    pelletsEaten = 0;
    numPowerPelletsEaten = 0;
    numPowerPellets = POWER_PELLETS_START_COUNT;
    level++;
    gameMode = GAME_MODE_POWER_OFF;

    // turn off PP if on
    if (myPowerPelletTimerVar != -1)
    {
      clearTimeout(myPowerPelletTimerVar);
      myPowerPelletTimerVar = -1;
    }

    // resetGhosts();

    clearGhostTimers();

    updateScoreboard();

    buildWallsAndPellets();

    createPowerPelletsAndGoodBombs();

    createTunnel();

    drawInitialBoard();

    spawnAllGhosts();

    // respawn pacman
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
    squares = document.querySelectorAll('.square');

    // put pacman on first square not a wall

    while (i < walls.length)
    {
      if ((walls[i] == 0) && (powerPellets[i] == 0))
      {
        current = i;
        pacmanIcon = PACMAN_CLASSIC_RIGHT;
        squares[current].innerHTML = pacmanIcon;
        checkForPellets();

        return;
      }
      else
        i++;

    } // end while loop

}  // end function spawnPacman

// -----------------------------------------------------------------------------------
// Function respawnPacmanTimer called after pacman is killed
// -----------------------------------------------------------------------------------

function respawnPacmanTimer()
{
  // console.log("Respawn pacman called");

  var i; // for loop
  squares = document.querySelectorAll('.square');

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
    var bombFound = false;
    squares = document.querySelectorAll('.square');

    if ((oldSquare == tunnel1num) || (oldSquare == tunnel2num))
    {
      squares[oldSquare].innerHTML = ICON_TUNNEL;
    }
    else
    {
      // check bombs array for bomb in oldsquare
      for (var i=0; i<bombs.length; i++)
      {
        if (bombs[i].squareNum == oldSquare)
        {
          bombFound = true;
          squares[oldSquare].innerHTML = ICON_BOMB;
        }
      }

      if (bombFound == false)
          squares[oldSquare].innerHTML = "";   // From square always blank after Pacman leaves
      // console.log("RedrawBoardPacman blanked cell " + oldSquare);

    } // finish else - old square handled

    // deal with new square
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

    // console.log("Total pellets is " + totalPellets + " pellets eaten is " + pelletsEaten + "  power pellets eaten is " + numPowerPelletsEaten + " pp per screen is " + POWER_PELLETS_START_COUNT);

    if ((pelletsEaten == totalPellets) && (numPowerPelletsEaten == POWER_PELLETS_START_COUNT))
    {
      // console.log("Current before reset is " + current);
      resetBoard();
    }
} // end function checkForPellets

// -------------------------------------------------------------

function resolvePacMan(direction)
{
  var ghostStatus;

  switch(direction)
  {
      case SPACE_BAR_KEY:
        // console.log ("Space Bar pressed");

        if (current == OFF_THE_BOARD)
          return;

        var j=0;

        // return immediately if bomb already in square
        while (j<bombs.length)
        {
          if (bombs[j++].squareNum == current)
          {
            return;
          }
        }

        if ((bombCount > 0) && (current != tunnel1num) && (current != tunnel2num))
        {
          // console.log("Dropping a bomb in square " + current);
          bombCount--;
          updateScoreboard();
          dropBomb(current);
        }

        return; // space bar glistch

    case ARROW_RIGHT:

      if ( (((current + 1) % NUM_COLUMNS) != 0) && (walls[current+1] == 0) )
      {
          current++;

          if (processPacmanTunnel())
          {
            pacmanIcon = (gameMode == GAME_MODE_POWER_ON) ? PACMAN_CLASSIC_RIGHT_PP : PACMAN_CLASSIC_RIGHT;
            return SUCCESS;
          }

          ghostStatus = checkForGhost();

          if (ghostStatus > 0)
          {
            if (gameMode == GAME_MODE_POWER_OFF)
            {
                killPacman();
                return SUCCESS;
            }
            else
            {
                eatGhosts();
            }
          }

          checkForGoodBomb();
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

        if (processPacmanTunnel())
        {
          pacmanIcon = (gameMode == GAME_MODE_POWER_ON) ? PACMAN_CLASSIC_LEFT_PP : PACMAN_CLASSIC_LEFT;
          return SUCCESS;
        }

        ghostStatus = checkForGhost();

        if (ghostStatus > 0)
        {
          if (gameMode == GAME_MODE_POWER_OFF)
          {
              killPacman();
              return SUCCESS;
          }
          else
          {
              eatGhosts();
          }
        }

        checkForGoodBomb();
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

        if (processPacmanTunnel())
        {
            pacmanIcon = (gameMode == GAME_MODE_POWER_ON) ? PACMAN_CLASSIC_DOWN_PP : PACMAN_CLASSIC_DOWN;
            return SUCCESS;
        }

        ghostStatus = checkForGhost();

        if (ghostStatus > 0)
        {
          if (gameMode == GAME_MODE_POWER_OFF)
          {
              killPacman();
              return SUCCESS;
          }
          else
          {
              eatGhosts();
          }
        }

        checkForGoodBomb();
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

        if (processPacmanTunnel())
        {
            pacmanIcon = (gameMode == GAME_MODE_POWER_ON) ? PACMAN_CLASSIC_UP_PP: PACMAN_CLASSIC_UP;
            return SUCCESS;
        }

        ghostStatus = checkForGhost();

        if (ghostStatus > 0)
        {
          if (gameMode == GAME_MODE_POWER_OFF)
          {
              killPacman();
              return SUCCESS;
          }
          else
          {
              eatGhosts();
          }
        }

        checkForGoodBomb();
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

    lives--;
    document.getElementById("livesVariable").innerHTML = lives;

    squares = document.querySelectorAll('.square');  // faster to get first?

    if (lives > 0)
      // launch the respawn timer function
      setTimeout( respawnPacmanTimer, RESET_PLAYER_DELAY*1000);
    else
    {
      // Game Over stop all game components
      for (var i=0; i<ghosts.length; i++)
      {
          clearInterval(ghosts[i].timerID);

          if (ghosts[i].respawnId != -1)
          {
            clearTimeout(ghosts[i].respawnId);
          }

          // show last ghost that whacked pacman
          if (ghosts[i].squareNum == current)
          {
            squares[current].innerHTML = (ghosts[i].ghost_type == GHOST_TYPE_NORMAL) ? ICON_GHOST : ICON_GHOST_RABID;
          }

          // ghosts[i].squareNum = -1;
      }

      clearInterval(goodBombTimerID);

      clearTimeout(cancelGoodBombTimerID);

      for (var i=0; i<bombs.length; i++)
      {
          clearTimeout(bombs[i].timerID);
      }

      document.getElementById("GameOverMessage").innerHTML = "Game Over!";

    }

    current = OFF_THE_BOARD;

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

      ghostsEaten++;
      ghosts[i].squareNum = OFF_THE_BOARD;
      // console.log("Ate Ghost " + i + " in squarenum " + current + " total ghosts eaten is " + ghostsEaten + "  total ghosts created is " + ghostsCreated + " at " + (new Date()));

      // save respawn id in case need to clear out later
      ghosts[i].respawnId = setTimeout( ghostRespawnTimer, GHOST_RESPAWN_DELAY *1000, ghosts[i].ghost_type);

    }

  }  // end for loop

} // end function eatGhosts

// ----------------------------------------------------------------

function myPowerPelletTimer()
{
    // Don't execute timer if Pacman already dead
    if (current != OFF_THE_BOARD)
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

    }   // end if check off the board

}   // end pp timer function

// --------------------------------------------
// function dropBomb
function dropBomb(pos)
{
    // create the timeout
    var myVar = setTimeout( myBombTimer, BOMB_DELAY *1000, bombs.length);

    // create bomb onto array
    bombs.push({squareNum:pos, timerID: myVar});

}

// end function dropBomb -----------------------------------------

// -------------------------------------------------------------------
// Function myBombTimer gets called to blow up a bomb

function myBombTimer(bombIndex)
{
    // console.log("Bomb timer called for bomb " + bombIndex + " in square " + bombs[bombIndex].squareNum);

    squares = document.querySelectorAll('.square');  // faster to get first?

    var pos = bombs[bombIndex].squareNum;

    // check exact cell first for pacman
    if (pos == current)
    {
        // player dies
        // console.log("Bomb found in pacmans square");
        squares[current].innerHTML = "";
        killPacman();
    }

    // check up only if not already in the top row  -------- up
    if (pos >= NUM_COLUMNS)
    {
      // check if pacman is in the square
      if ((pos-NUM_COLUMNS) == current)
      {
        squares[current].innerHTML = "";
        killPacman();
      }

      // check for wall
      if (walls[pos-NUM_COLUMNS] == 1)
      {
        // console.log("Blowing up an Up wall");
        walls[pos-NUM_COLUMNS] = 0;
        squares[pos-NUM_COLUMNS].innerHTML = "";
      }
    }

    // check down ----------------------------------------

    // Don't check if already in bottom row
    if (pos < ((NUM_ROWS-1)*NUM_COLUMNS))
    {
      // console.log("Checking down");

      // check if pacman in
      if ((pos+NUM_COLUMNS) == current)
      {
        squares[current].innerHTML = "";
        killPacman();
      }

      // check for wall
      if (walls[pos+NUM_COLUMNS] == 1)
      {
        // console.log("Blowing up a Down wall");
        walls[pos+NUM_COLUMNS] = 0;
        squares[pos+NUM_COLUMNS].innerHTML = "";
      }
    }

    // Check left ------------------------------------------
    if (pos % NUM_COLUMNS > 0)
    {
      // console.log("Checking left");

      // check if pacman in
      if ((pos-1) == current)
      {
        squares[current].innerHTML = "";
        killPacman();
      }

      // check for wall
      if (walls[pos-1] == 1)
      {
        // console.log("Blowing up an Left wall");
        walls[pos-1] = 0;
        squares[pos-1].innerHTML = "";
      }
    }

    // right -----------------------------------------------
    if (((pos+1) % NUM_COLUMNS) != 0)
    {
      // check if pacman in
      if ((pos+1) == current)
      {
        squares[current].innerHTML = "";
        killPacman();
      }

      // check for wall
      if (walls[pos+1] == 1)
      {
        // console.log("Blowing up an Right wall");
        walls[pos+1] = 0;
        squares[pos+1].innerHTML = "";
      }
    }

    // actually blow up bomb, replace with blank square
    squares[pos].innerHTML = "";

    // mark the bomb as off the board (not used anymore)
    bombs[bombIndex].squareNum = OFF_THE_BOARD;

}   // end function my bomb timer

// -------------------------------------------------
// Function starts the main good bomb timer.  For ex, drop a bomb every 20 seconds

function startGoodBombTimer()
{
    // console.log ("Goodbomb start timer");
    goodBombTimerID = setInterval(myGoodBombTimer, (1000 * GOOD_BOMB_DELAY));

} // end function startGoodBombTimer

// -----------------------------------------------------------------------

function myGoodBombTimer()
{
    var i = 0;
    var bombFound = false;

      // console.log("Bomb Timer 1 called")

      // find a place to drop the good bomob
      var foundSpot = false;

      while (foundSpot == false)
      {
          var targetSpot = Math.floor(Math.random() * NUM_ROWS * NUM_COLUMNS);

          // make sure no pp as well, also no pacman, no tunnels
          if ((walls[targetSpot] == 0) && (powerPellets[targetSpot] == 0) && (targetSpot != current) && (targetSpot != tunnel1num) && (targetSpot != tunnel2num))
          {
            // space clear so far, now check for any bombs

            while ((i < bombs.length) && (bombFound == false))
            {
              if (bombs[i++].squareNum == targetSpot)
                bombFound = true;
            }

            if (bombFound == false)
            {
              goodBombs[targetSpot] = 1;
              foundSpot = true;
            }

          } // end if safe spot for a wall
      } // end while

      squares = document.querySelectorAll('.square');
      squares[targetSpot].innerHTML = ICON_GOOD_BOMB;

      cancelGoodBombTimerID = setTimeout(cancelGoodBombTimer, (1000 * GOOD_BOMB_DURATION), targetSpot);

} // end function

// -----------------------------------------------------------------------

function cancelGoodBombTimer(pos)
{
  // reset goodBombs array position back to 0
  goodBombs[pos] = 0;

  squares = document.querySelectorAll('.square');

  // Check if ghost exists on the square first, then pellet
  var ghostFound = false;
  var i=0;

  // check if ghost in square
  while ((i < ghosts.length) && (ghostFound == false))
  {
    if (ghosts[i++].squareNum == pos)
      ghostFound = true;
  }

  if (ghostFound == true)
  {
      squares[pos].innerHTML = (ghosts[i-1].ghost_type == GHOST_TYPE_NORMAL) ? ICON_GHOST : ICON_GHOST_RABID;
  }
  else
  {
      // check if pellet belongs on square
      if (pellets[pos] == 1)
        squares[pos].innerHTML = ICON_PELLET;
      else
        squares[pos].innerHTML = "";
  }

}  // end function cancelGoodBombTimer

// ---------------------------------------------------
// function checkForGoodBomb

function checkForGoodBomb()
{

  if (goodBombs[current] == 1)
  {
      bombCount++;
      updateScoreboard();
      // score++;
      goodBombs[current] = 0;
  }

}  // end function checkForGoodBomb() --------------

// --------------------------------------------------
// function processPacmanTunnel

function processPacmanTunnel()
{
  if (current == tunnel1num)
  {
    current = tunnel2num;
    return SUCCESS;
  }
  else
  {
      if (current == tunnel2num)
      {
        current = tunnel1num;
        return SUCCESS;
      }
  }

  return FAIL;

}
//
// --------------------------------------------
// -----  End Pac Man function section ------
// --------------------------------------------

// ************************************************************************
// ggg
// -------------------------------------------------
// ---------  Start Ghost function section ---------
// -------------------------------------------------

function spawnAllGhosts()
{
    // console.log("Got here, numghosts is " + NUM_GHOSTS);

    // reset ghost array after each level
    ghosts = new Array;

    for (var i=0; i<NUM_GHOSTS; i++)
    {
        spawnGhost(Math.floor(Math.random() * NUM_ROWS*NUM_COLUMNS));
    }

}  // end function spawnAllGhosts

// ---------------------------------------------------
// spawn a single ghost in a square or near it

function spawnGhost(squareNum)
{
  // console.log("Got into spawn ghost square num passed in is " + squareNum );

  ghostsCreated++;

  // find first empty square starting at the square passed in
  while (walls[squareNum] != 0)
    squareNum++;

  // generates a random number between -.4 and +.3
  var ghostRandomizer = ((Math.floor(Math.random() * 8))-4)/10;

  // create timer thread
  var tempTimerId = setInterval(ghostTick, GHOST_SPEED * 1000 * (1+ghostRandomizer), ghosts.length);

  // console.log("Ghost speed created " + GHOST_SPEED * 1000 * (1+ghostRandomizer));

  // randomly determine which type of ghost

  var tempGhostType = (Math.floor(Math.random() * 2));

  // push ghost onto array with it's timer id and location
  ghosts.push({squareNum:squareNum, ghost_type: tempGhostType, timerID: tempTimerId, respawnId: -1});

  // console.log(ghosts);

  // Draw ghost on board.  Later redraws are handled by the tick timer function
  squares = document.querySelectorAll('.square');  // faster to get first?

  squares[squareNum].innerHTML = (ghosts[ghosts.length-1].ghost_type == GHOST_TYPE_NORMAL) ? ICON_GHOST : ICON_GHOST_RABID;

} // end function spawnGhost

// ---------------------------------------------------------------------
// Function used to delay the respawning of ghosts, passing in the type
//
function ghostRespawnTimer(type)
{
  // spawn a new ghost
  reSpawnGhost(Math.floor(Math.random() * (NUM_ROWS*NUM_COLUMNS)), type);

}

// ---------------------------------------------------------------------

function reSpawnGhost(squareNum, ghostType)
{
  // make sure now spawing directly on pacman or within 1 square

  ghostsCreated++;
  var safeSquareFound = false;

  while (safeSquareFound == false)
  {
      if (!((walls[squareNum] == 1) || (current == squareNum) || (current == squareNum+1) || (current == squareNum-1) || (current == squareNum+NUM_COLUMNS) || (current == squareNum-NUM_COLUMNS)))
        safeSquareFound = true;
      else
      {
        // increase squareNum and try again
        squareNum++;

        // if got to the end of the board, try a new random square
        if (squareNum == NUM_COLUMNS*NUM_ROWS)
          squareNum = Math.floor(Math.random() * (NUM_ROWS*NUM_COLUMNS));

      } // end else squarenum too big

  } // end while

  // generates a random number between -.4 and +.3
  var ghostRandomizer = ((Math.floor(Math.random() * 8))-4)/10;

  // create timer thread
  var tempTimerId = setInterval(ghostTick, GHOST_SPEED * 1000 * (1+ghostRandomizer), ghosts.length);

  // console.log("Ghost speed created " + GHOST_SPEED * 1000 * (1+ghostRandomizer));

  // push ghost onto array with it's location, type, and timer id
  ghosts.push({squareNum:squareNum, ghost_type: ghostType, timerID: tempTimerId, respawnId: -1});

  var temp = new String((ghosts.length)-1);

  // console.log("New ghost num " + temp + " of type " + ghostType + " spawned in square " + squareNum + "  total ghosts created is " + ghostsCreated + " at " + " at " + (new Date()));
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

  // console.log("Ghost tick called for ghost id " + ghostId);

  // loop until a legal move is found or 15 tries
  while ((legalMove == FAIL) && (tries < 15) && (ghosts[ghostId].squareNum != OFF_THE_BOARD))
  {
    dir = calcGhostDirection(ghosts[ghostId].ghost_type, ghosts[ghostId].squareNum);

    // dir = Math.floor(Math.random() * 4);  // returns a random int between 0 and 3

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

        processGhostTunnel(ghostId);

        break;

      case LEFT:

        ghosts[ghostId].squareNum--;

        checkIfOnGhostPacman(ghostId);

        processGhostTunnel(ghostId);

        break;

      case DOWN:

        ghosts[ghostId].squareNum += NUM_COLUMNS;

        checkIfOnGhostPacman(ghostId);

        processGhostTunnel(ghostId);

        break;

      case UP:

        ghosts[ghostId].squareNum -= NUM_COLUMNS;

        checkIfOnGhostPacman(ghostId);

        processGhostTunnel(ghostId);

        break;

    } // end switch

}   // end function resolveGhost

// ----------------------------------------------------------------------

function redrawBoardGhost(ghostId, oldSquare)
{
    // console.log("Ghost " + ghostId + " redraw called for pos " + ghosts[ghostId].squareNum);

    var bombFound = false;

    squares = document.querySelectorAll('.square');

    if (ghosts[ghostId].squareNum != OFF_THE_BOARD)
    {
        squares[ghosts[ghostId].squareNum].innerHTML = (ghosts[ghostId].ghost_type == GHOST_TYPE_NORMAL) ? ICON_GHOST : ICON_GHOST_RABID;
    }
    // Check what needs to be in old square, could be anything including a wall - in between screen glitch

    // Check for a bomb, hightest priority, then check rest

    // check bombs array for bomb in oldsquare
    var i = 0;

    while ((i < bombs.length) && (bombFound == false))
    {
      if (bombs[i++].squareNum == oldSquare)
      {
        bombFound = true;
        squares[oldSquare].innerHTML = ICON_BOMB;
      }
    }

    // no bomb, keep checking
    if (bombFound == false)
    {
      if (goodBombs[oldSquare] == 1)
      {
          squares[oldSquare].innerHTML = ICON_GOOD_BOMB;
      }
      else
      {
          // check for pellet
          if (pellets[oldSquare] == 1)
          {
              squares[oldSquare].innerHTML = ICON_PELLET;
          }
          else  // no pellet
          {
              if (powerPellets[oldSquare] == 1)
              {
                  squares[oldSquare].innerHTML = ICON_POWER_PELLET;
              }
              else  // no pp
              {
                  if ((oldSquare == tunnel1num) || (oldSquare == tunnel2num))
                  {
                      squares[oldSquare].innerHTML = ICON_TUNNEL;
                  }
                  else
                  {

                      if (walls[oldSquare] == 1)
                      {
                          squares[oldSquare].innerHTML = ICON_WALL;
                      }
                      else
                      {
                          squares[oldSquare].innerHTML = "";
                      }   // else check for wall


                  } // end else tunnel check

              }  // end else check for pp

          } // end else check for pellet

      } // end outer else, check for good bomb

    } // end check for bomb

}   // end function redrawBoardGhost

// ------------------------------------------------
// function calcGhostDirection

function calcGhostDirection(type, pos)
{
  var pacRow = Math.floor(current/NUM_COLUMNS);
  var pacCol = (current % NUM_COLUMNS);
  var ghostRow = Math.floor(pos/NUM_COLUMNS);
  var ghostCol = (pos % NUM_COLUMNS);

  var random = Math.floor(Math.random() * 100) + 1;

  // console.log("Random is " + random + "  Pac row is " + pacRow + "  Pac col is " + pacCol + "  Ghost row is " + ghostRow + "  Ghost col is " + ghostCol);

  // #1 - pacman is directly above ghost, ghost should move up
  if ((pacRow < ghostRow) && (pacCol == ghostCol))
  {
      // if random <= GHOST_SMARTS then execute the "right" movement
      if (random <= GHOST_SMARTS)
      {
        // console.log("Returned up");

        // return UP if in regular game mode or DOWN if in PP mode
        return (gameMode == GAME_MODE_POWER_OFF) ? UP : (type != GHOST_TYPE_RABID) ? DOWN : UP;
      }
      else // randomly go in 1 of the other 3 directions
      {
          // console.log("Returned Not up");

          var random2 = Math.floor(Math.random() * 3);

          if (random2 == 0)
            return LEFT;
          else if (random2 == 1)
            return RIGHT;
          else
            // return opposite of "right" movement
            return (gameMode == GAME_MODE_POWER_OFF) ? DOWN : UP;
      }   // end else

  } // end up UP scenario

  // #2 - pacman is below above ghost, ghost should move down
  if ((pacRow > ghostRow) && (pacCol == ghostCol))
  {
    if (random <= GHOST_SMARTS)
    {
      // console.log("Returned down");
      return (gameMode == GAME_MODE_POWER_OFF) ? DOWN : (type != GHOST_TYPE_RABID) ? UP : DOWN;
    }
    else // randomly go in 1 of the other 3 directions
    {
        // console.log("Returned not down");

        var random2 = Math.floor(Math.random() * 3);

        if (random2 == 0)
          return LEFT;
        else if (random2 == 1)
          return RIGHT;
        else
          return (gameMode == GAME_MODE_POWER_OFF) ? UP : DOWN;
    }   // end else

  }

  // #3 - pacman is directly left of ghost
  if ((pacRow == ghostRow) && (pacCol < ghostCol))
  {
    if (random <= GHOST_SMARTS)
    {
      // console.log("Returned left");
      return (gameMode == GAME_MODE_POWER_OFF) ? LEFT : (type != GHOST_TYPE_RABID) ? RIGHT : LEFT;
    }
    else // randomly go in 1 of the other 3 directions
    {
        // console.log("Returned not left");

        var random2 = Math.floor(Math.random() * 3);

        if (random2 == 0)
          return (gameMode == GAME_MODE_POWER_OFF) ? RIGHT : LEFT;
        else if (random2 == 1)
          return UP;
        else
          return DOWN;
    }   // end else

  }

  // #4 - pacman is directly right of ghost
  if ((pacRow == ghostRow) && (pacCol > ghostCol))
  {
    if (random <= GHOST_SMARTS)
    {
      // console.log("Returned right");
      return (gameMode == GAME_MODE_POWER_OFF) ? RIGHT : (type != GHOST_TYPE_RABID) ? LEFT : RIGHT;
    }
    else // randomly go in 1 of the other 3 directions
    {
        // console.log("Returned not right");
        var random2 = Math.floor(Math.random() * 3);

        if (random2 == 0)
          return (gameMode == GAME_MODE_POWER_OFF) ? LEFT : RIGHT;
        else if (random2 == 1)
          return UP;
        else
          return DOWN;
    }   // end else

  }

  // #5 - pacman is north west - up, left
  if ((pacRow < ghostRow) && (pacCol < ghostCol))
  {
    // console.log("Returned up or left");

    if (random <= GHOST_SMARTS)
    {
      var random2 = Math.floor(Math.random() * 2);

      if (random2 == 0)
        return (gameMode == GAME_MODE_POWER_OFF) ? UP : (type != GHOST_TYPE_RABID) ? DOWN : UP;
      else
        return (gameMode == GAME_MODE_POWER_OFF) ? LEFT : (type != GHOST_TYPE_RABID) ? RIGHT : LEFT;
    }
    else // randomly go in 1 of the other 2 directions
    {
        // console.log("Returned not up or left");
        var random2 = Math.floor(Math.random() * 2);

        if (random2 == 0)
          return (gameMode == GAME_MODE_POWER_OFF) ? RIGHT : LEFT;
        else
          return (gameMode == GAME_MODE_POWER_OFF) ? DOWN : UP;
    }   // end else

  }

  // #6 - pacman is north east - up, right
  if ((pacRow < ghostRow) && (pacCol > ghostCol))
  {
    // console.log("Returned up or right");

    if (random <= GHOST_SMARTS)
    {
      var random2 = Math.floor(Math.random() * 2);

      if (random2 == 0)
        return (gameMode == GAME_MODE_POWER_OFF) ? UP : (type != GHOST_TYPE_RABID) ? DOWN : UP;
      else
        return (gameMode == GAME_MODE_POWER_OFF) ? RIGHT : (type != GHOST_TYPE_RABID) ? LEFT : RIGHT;
    }
    else // randomly go in 1 of the other 2 directions
    {
        // console.log("Returned not up or right");

        var random2 = Math.floor(Math.random() * 2);

        if (random2 == 0)
          return (gameMode == GAME_MODE_POWER_OFF) ? LEFT : RIGHT;
        else
          return (gameMode == GAME_MODE_POWER_OFF) ? DOWN : UP;
    }   // end else

  }

  // #7 - pacman is south west
  if ((pacRow > ghostRow) && (pacCol < ghostCol))
  {
    // console.log("Returned down or left");

    if (random <= GHOST_SMARTS)
    {
      var random2 = Math.floor(Math.random() * 2);

      if (random2 == 0)
        return (gameMode == GAME_MODE_POWER_OFF) ? DOWN : (type != GHOST_TYPE_RABID) ? UP : DOWN;
      else
        return (gameMode == GAME_MODE_POWER_OFF) ? LEFT : (type != GHOST_TYPE_RABID) ? RIGHT : LEFT;
    }
    else // randomly go in 1 of the other 2 directions
    {
        // console.log("Returned not down or left");

        var random2 = Math.floor(Math.random() * 2);

        if (random2 == 0)
          return (gameMode == GAME_MODE_POWER_OFF) ? RIGHT : LEFT;
        else
          return (gameMode == GAME_MODE_POWER_OFF) ? UP : RIGHT;
    }   // end else

  }
  else // else #8 - pacman is south east
  {
    if (random <= GHOST_SMARTS)
    {
      // console.log("Returned down or right");

      var random2 = Math.floor(Math.random() * 2);

      if (random2 == 0)
        return (gameMode == GAME_MODE_POWER_OFF) ? DOWN : (type != GHOST_TYPE_RABID) ? UP : DOWN;
      else
        return (gameMode == GAME_MODE_POWER_OFF) ? RIGHT : (type != GHOST_TYPE_RABID) ? LEFT : RIGHT;
    }
    else // randomly go in 1 of the other 2 directions
    {
        // console.log("Returned not down or right");

        var random2 = Math.floor(Math.random() * 2);

        if (random2 == 0)
          return (gameMode == GAME_MODE_POWER_OFF) ? UP : DOWN;
        else
          return (gameMode == GAME_MODE_POWER_OFF) ? LEFT : RIGHT;
    }   // end else

  }

} // end function calcGhostDirection

// -----------------------------------------------

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
        // kill ghost and respawn

        ghosts[ghostId].squareNum = OFF_THE_BOARD;

        // spawn a new ghost
        reSpawnGhost(Math.floor(Math.random() * (NUM_ROWS*NUM_COLUMNS)), ghosts[ghostId].ghost_type);  // return any square on board

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
//
function clearGhostTimers()
{
    for (var i=0; i<ghosts.length; i++)
    {
      clearInterval(ghosts[i].timerID);

      if (ghosts[i].respawnId != -1)
      {
        clearTimeout(ghosts[i].respawnId);
      }

    }  // end for loop

} // end function

// -------------------------------------------------------


// ----------------------------------------------
// function resetGhosts - clears out ghosts at end of board and respawns
//
// not called anymore
//
function resetGhosts()
{
    for (var i=0; i<ghosts.length; i++)
    {
      if (ghosts[i].squareNum != -1)
      {
        // console.log("Reset Ghost " + i + " in squarenum " + current);
        ghosts[i].squareNum = OFF_THE_BOARD;
      } // end if

    }  // end for loop

    // spawn a new ghost for each one on the board
    // not used
    reSpawnGhost(Math.floor(Math.random() * (NUM_ROWS*NUM_COLUMNS)));  // return any square on board

    // spawn a new ghost for each one on the board
    // not used
    reSpawnGhost(Math.floor(Math.random() * (NUM_ROWS*NUM_COLUMNS)));  // return any square on board

} // end function eatGhosts

// end function resetGhosts -----------------------
//
// function processGhostTunnel
//
function processGhostTunnel(ghostId)
{
  squares = document.querySelectorAll('.square');  // get squares

  if (ghosts[ghostId].squareNum == tunnel1num)
  {
    // need to redraw tunnel square
    squares[tunnel1num].innerHTML = ICON_TUNNEL;
    ghosts[ghostId].squareNum = tunnel2num;
  }
  else
  {
      if (ghosts[ghostId].squareNum == tunnel2num)
      {
        squares[tunnel2num].innerHTML = ICON_TUNNEL;
        ghosts[ghostId].squareNum = tunnel1num;
      }
  } // end else

}  // end function processGhostTunnel ---------------

// -------------------------------------------------
// ---------  End Ghost function section ---------
// -------------------------------------------------

// ************************************************************************
