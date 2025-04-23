// Release Notes
// v1.17 12-14-24 - Added Wall Builder ghost
// v1.16 12-8-24 - Added audio effects
// v1.15 12-2-24  - Mostly minor bug fixes
// v1.14 11-28-24 - Added Poison Ghost - reconfigured ghost logic
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
const GAME_LENGTH = 10 // minutes;
const NUM_ROWS = 12;  // 12
const NUM_COLUMNS = 26;  // 26
const WALL_PCT = .19;   // % of walls on board
const SQUARE_SIZE = 50;  // pixel size of individual squares
const NUM_GHOSTS = 9;   // 9 or 10 for prod - number of ghosts to create on each level
const GHOST_SMARTS = 70; // % of time ghost moves towards pacman during regular mode or away from pacman during pp mode
const GHOST_RESPAWN_DELAY = 4;  // delay in seconds for dead ghosts to respawn
const SAFE_ZONE_SIZE = 4; // rows/columns of safety in upper left corner when pacman spawns or respawns
const GHOST_SPEED = 1;  // how often ghosts move in seconds
const RESET_PLAYER_DELAY = 3; // seconds
const LIVES_START = 3;
const EXTRA_LIFE_POINTS = 500;
const BOMBS_START_COUNT = 15;
const POWER_PELLETS_START_COUNT = Math.floor(((NUM_ROWS*NUM_COLUMNS)+1)/40);  // num of pp per board, 1 per 40 squares
const POINTS_PER_GHOST = 10;
const POWER_PELLET_DELAY = 8; // pacman gets this many seconds to kill ghosts after eating pp
const BOMB_DELAY = 4;   // bombs blow up in this many seconds
const GOOD_BOMB_DELAY = 10; // how frequently good bombs are dropped
const GOOD_BOMB_DURATION = 9; // how many seconds a good bomb exists before disappearing
const POISON_DELAY = 5;   // how many seconds poison lasts
const POISON_PERCENT = .1; // How ofen poison ghost drops poison
const WALL_BUILD_TIME = 4;  // # of seconds to build a wall
const WALL_BUILD_PERCENT = .1; // How often wall builder ghost stops and builds a wall

const GHOST_TYPE_NORMAL = 0;
const GHOST_TYPE_RABID = 1;
const GHOST_TYPE_POISON = 2;
const GHOST_TYPE_WALL_BUILDER = 3;
const NUM_GHOST_TYPES = 4;

const BACKGROUND_AUDIO = "sounds/pacmanfever.mp3";
const KILLED_BY_GHOST_AUDIO = "sounds/killedByGhost.mp3";
const EAT_GHOST_AUDIO = "sounds/eatghost.mp3";

var myAudio = new Audio; // ("sounds/pacmanfever.mp3");
var musicStarted = false;

// Global variables
var gameStatus = 0; // 0 = over or not started, 1 = running
var current;    // pacman's current square
var lives;      // pacman's current # of lives remaining
var extraLife = 0; // denotes whether player earned the 1 extra life
var level;      // the board level
var bombCount;  // number of pacmans bombs
var timerSeconds = GAME_LENGTH * 60; // how many seconds left in the game

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
var totalGhostSpeed = 0;
var regGhostCount = 0;
var rabidGhostCount = 0;
var poisonGhostCount = 0;
var wallBuilderGhostCount = 0;
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
var ICON_WALL_WITH_PELLET = "<img src='graphics/wallIconWithPellet.jpg'>";
var ICON_PELLET = "<img src='graphics/PelletIcon.jpg'>";
var ICON_BOMB = "<img src='graphics/BombIcon1.jpg'>";
var ICON_GOOD_BOMB = "<img src='graphics/GoodBombIcon.jpg'>";
var ICON_POWER_PELLET = "<img src='graphics/PowerPellet.jpg'>";
var ICON_TUNNEL = "<img src='graphics/tunnel.jpg'>";
var ICON_POISON = "<img src='graphics/poison.jpg'>";

var ICON_GHOST = "<img src='graphics/blueGhost.jpg'>";
var ICON_GHOST_RABID = "<img src='graphics/rabidGhost.jpg'>"
var ICON_GHOST_POISON = "<img src='graphics/poisonGhost.jpg'>"
var ICON_GHOST_WALL_BUILDER = "<img src='graphics/WallBuilderGhost.jpg'>"

const GAME_MODE_POWER_OFF = 0;
const GAME_MODE_POWER_ON = 1;
const GAME_MODE_OVER = -1;

const GHOST_NOT_FOUND = 0;
const GHOST_FOUND = 1;

const OFF_THE_BOARD = -1;  // square num when dead or off the board

// -------------------------------------------------------------------
// Initialize global variables

// All arrays here
var walls;  // create the array each time a new board is started
var pellets;  // create the array each time a new board is started
var powerPellets;  // create the array each time a new board is started

var ghosts = new Array;   // new ghost array each board
var bombs = new Array;    // dropped by pacman, bombs are similar to ghosts, 1 array position per bomb, not per square
var goodBombs = new Array;  // similar structure to pellets
var poison = new Array;   // similar to bombs, but dropped by ghosts

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

// Begin "Driver" section - Initialize game components
createBoard();

buildWallsAndPellets();

createItems();

createTunnel();

drawInitialBoard();

launchWallCheckerTimer();

// Wait here for start button click

// End Driver section
//
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

  // if (musicStarted == false)
  // {
  //     musicStarted = true;
  //
  //     myAudio.src = BACKGROUND_AUDIO;
  //     // myAudio.muted = true;
  //     myAudio.play();
  // }

  // only intercept keys if pacman on the board and game not over
  if ((current != OFF_THE_BOARD) && (gameStatus == 1))
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

  document.getElementById("regGhostCount").innerHTML = regGhostCount;
  document.getElementById("rabidGhostCount").innerHTML = rabidGhostCount;
  document.getElementById("poisonGhostCount").innerHTML = poisonGhostCount;
  document.getElementById("wallBuilderGhostCount").innerHTML = wallBuilderGhostCount;

  // zzz
  document.getElementById("aveGhostSpeed").innerHTML = Math.floor(totalGhostSpeed/NUM_GHOSTS);

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

} // end function buildWallsAndPellets

// ----------------------------------------------------------------------


function launchWallCheckerTimer()
{
    // setTimeout(wallCheckerFunction, 5000);
    setInterval(wallCheckerFunction, 1000);

}

// -----------------------------------------------------------------------
// Runs every second to make sure all wall cells show correctly

function wallCheckerFunction()
{
    squares = document.querySelectorAll('.square');
    var found = 0;
    var temp;
    var newString;  // convert html to proper format

    for (i=0;i<walls.length;i++)
    {
        temp = squares[i].innerHTML;
        newString = temp.replace(/"/g, "'");

//           console.log("Square num " + i + " wall " + walls[0] + " bool wall only " + (newString == ICON_WALL));

          if (walls[i] == 1)
          {
              if ((pellets[i] == 1) && (newString != ICON_WALL_WITH_PELLET))
              {
                  squares[i].innerHTML = ICON_WALL_WITH_PELLET;
                  console.log("Wall with pellet scenario fixed.");
                  found = 1;
              }
              else
              {
                if ((pellets[i] == 0) && (newString != ICON_WALL))
                {
                  squares[i].innerHTML = ICON_WALL;
                  console.log("Wall without pellet scenario fixed.");
                  found = 1;
                }
              } // end else

          } // end if walls

    }   // end for loop

    // if (found == 0)
    //   console.log("No missing walls found");

} // end function

// ----------------------------------------------------------------------

// -------------------------------------------------------------------------
// This function creates the power pellets, good bombs, and poison arrays
// Creates some PP, but not good bombs or poison, those are created later

function createItems()
{
  var squareFound = false;
  var i;

  // reset arrays
  powerPellets = new Array;
  goodBombs = new Array;
  poison = new Array;

  // default all arrays to zeros
  for (i=0; i< NUM_ROWS*NUM_COLUMNS; i++)
  {
    powerPellets[i] = 0;
    goodBombs[i] = 0;
    poison[i] = 0;
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

      // pellet found, flip to PP, don't put in square 0
      if ((pellets[ppSquare] == 1) && (ppSquare != 0))
      {
        squareFound = true;
        pellets[ppSquare] = 0;
        totalPellets--;
        powerPellets[ppSquare] = 1;
      }  // end if
    } // end while

  } // end for

}  // end function createItems

// --------------------------------------------------

function createTunnel()
{
  var squareFound = false;

  // calculate the first tunnel to be in the upper left
  var target = (Math.floor((.2*NUM_ROWS))*NUM_COLUMNS) + Math.floor(.10*NUM_COLUMNS);

  // console.log("Target1 is " + target);

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

    // calculate the second tunnel to be in the bottom right
    target = (Math.floor((.75*NUM_ROWS))*NUM_COLUMNS) + Math.floor(.85*NUM_COLUMNS);

    // console.log("Target2 is " + target);

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
    regGhostCount = 0;
    rabidGhostCount = 0;
    poisonGhostCount = 0;
    wallBuilderGhostCount = 0;
    totalGhostSpeed = 0;

    // turn off PP if on
    if (myPowerPelletTimerVar != -1)
    {
      clearTimeout(myPowerPelletTimerVar);
      myPowerPelletTimerVar = -1;
    }

    clearGhostTimers();

    buildWallsAndPellets();

    createItems();

    createTunnel();

    drawInitialBoard();

    spawnAllGhosts();

    updateScoreboard();

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
// Function respawnPacmanTimer called after pacman is killed or on a new level
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
    if ((current != OFF_THE_BOARD) && (gameMode != GAME_MODE_OVER))
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

        if ((++score >= EXTRA_LIFE_POINTS) && (extraLife == 0))
        {
          extraLife = 1;
          document.getElementById("livesVariable").innerHTML = ++lives;
        }

        document.getElementById("scoreVariable").innerHTML = score;
        pellets[current] = 0;
    }
    else
    {
      if (powerPellets[current] == 1)
      {
          gameMode = GAME_MODE_POWER_ON;

          if ((++score >= EXTRA_LIFE_POINTS) && (extraLife == 0))
          {
            extraLife = 1;
            document.getElementById("livesVariable").innerHTML = ++lives;
          }

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

          // function returns true if on poison
          if (checkForPoison())
          {
              killPacman();
              return SUCCESS;
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

        if (checkForPoison())
        {
            killPacman();
            return SUCCESS;
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

        if (checkForPoison())
        {
            killPacman();
            return SUCCESS;
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

        if (checkForPoison())
        {
            killPacman();
            return SUCCESS;
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
    var killPacmanAudio = new Audio(KILLED_BY_GHOST_AUDIO);
    killPacmanAudio.volume = .2;
    killPacmanAudio.play();

    lives--;
    document.getElementById("livesVariable").innerHTML = lives;

    gameMode = GAME_MODE_POWER_OFF;

    squares = document.querySelectorAll('.square');  // faster to get first?

    if (lives > 0)
    {
      current = OFF_THE_BOARD;
      pacmanIcon = PACMAN_CLASSIC_RIGHT;

      // launch the respawn timer function
      setTimeout( respawnPacmanTimer, RESET_PLAYER_DELAY*1000);
    }
    else
    {
      myAudio.pause();

      gameMode = GAME_MODE_OVER;

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
            // console.log("Last ghost that whacked pacman");
            squares[current].innerHTML = getGhostIcon(ghosts[i].ghost_type);
          }

          // clear poison timers
          if (ghosts[i].ghost_type == GHOST_TYPE_POISON)
          {
              for (var j=0; j<ghosts[i].poisonTimers.length;j++)
              {
                if (ghosts[i].poisonTimers[j] != -1)
                  clearTimeout(ghosts[i].poisonTimers[j]);
              }
          }

          // ghosts[i].squareNum = -1;
      } // end for loop

      clearInterval(goodBombTimerID);

      clearTimeout(cancelGoodBombTimerID);

      for (var i=0; i<bombs.length; i++)
      {
          clearTimeout(bombs[i].timerID);
      }

      document.getElementById("GameOverMessage").innerHTML = "Game Over!";

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

      ghostsEaten++;

      score += POINTS_PER_GHOST;

      if ((score >= EXTRA_LIFE_POINTS) && (extraLife == 0))
      {
        extraLife = 1;
        document.getElementById("livesVariable").innerHTML = ++lives;
      }

      var eatGhostAudio = new Audio(EAT_GHOST_AUDIO);

      eatGhostAudio.volume = .2;

      eatGhostAudio.play();


      // zzzz
      // switch (ghosts[i].ghost_type)
      // {
      //
      //   case GHOST_TYPE_POISON:
      //
      //       poisonGhostCount++;
      //       break;
      //
      //     case GHOST_TYPE_RABID:
      //
      //         rabidGhostCount++;
      //         break;
      //
      //     case GHOST_TYPE_WALL_BUILDER:
      //
      //         wallBuilderGhostCount++;
      //         break;
      //
      //     case GHOST_TYPE_NORMAL:
      //
      //         regGhostCount++;
      //         break;
      //
      //   default:
      //
      // }

      ghosts[i].squareNum = OFF_THE_BOARD;
      // console.log("Ate Ghost " + i + " in squarenum " + current + " total ghosts eaten is " + ghostsEaten + "  total ghosts created is " + ghostsCreated + " at " + (new Date()));

      // save respawn id in case need to clear out later
      ghosts[i].respawnId = setTimeout( ghostRespawnTimer, GHOST_RESPAWN_DELAY *1000, ghosts[i].ghost_type, ghosts[i].speed);

    }

  }  // end for loop

  updateScoreboard();

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

        // don't need to check for a pellet here because Pacman would have already eaten it
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

      // check for pellet (Wallbuilder ghost builds walls on pellets)
      if (pellets[pos-NUM_COLUMNS] == 1)
      {
        squares[pos-NUM_COLUMNS].innerHTML = ICON_PELLET;
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

      // check for pellet (Wallbuilder ghost builds walls on pellets)
      if (pellets[pos+NUM_COLUMNS] == 1)
      {
        squares[pos+NUM_COLUMNS].innerHTML = ICON_PELLET;
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

      // check for pellet (Wallbuilder ghost builds walls on pellets)
      if (pellets[pos-1] == 1)
      {
        squares[pos-1].innerHTML = ICON_PELLET;
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

      // check for pellet (Wallbuilder ghost builds walls on pellets)
      if (pellets[pos+1] == 1)
      {
        squares[pos+1].innerHTML = ICON_PELLET;
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

          // make sure no pp as well, also no pacman, no tunnels, no poison
          if ((walls[targetSpot] == 0) && (powerPellets[targetSpot] == 0) && (targetSpot != current) && (targetSpot != tunnel1num) && (targetSpot != tunnel2num) && (poison[targetSpot] == 0))
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

  // Check if Pacman on square first
  if (current == pos)
  {
    squares[pos].innerHTML = pacmanIcon;
    return;
  }

  // Check if ghost exists on the square, then pellet
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
      squares[pos].innerHTML = getGhostIcon(ghosts[i-1].ghost_type);
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

// -------------------------------------------------
//
function checkForPoison()
{
    if (poison[current]==1)
      return true;
    else
      return false;

}

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
        // don't spawn ghost in safety zone
        var safe = false;
        var pos;

        while (safe == false)
        {
            pos = Math.floor(Math.random() * NUM_ROWS*NUM_COLUMNS);

            // check function returns true if ghost in safety zone
            safe = !checkIfGhostInSafetyZone(pos, SAFE_ZONE_SIZE);
        }

        spawnGhost(pos);
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
  // var ghostRandomizer = 0; // ((Math.floor(Math.random() * 8))-4)/10;

  var ghostSpeed = GHOST_SPEED * 1000 * (1 + ghostRandomizer) * (1-((level-1)*.06));
  // var ghostSpeed = GHOST_SPEED * 1000 * (1 + ghostRandomizer); // * (1-((level-1)*.06));
  // console.log("Randomizer is " + ghostRandomizer + " Ghost speed is " + ghostSpeed + " level is " + level);

  // hard code ghost speed here
  // var ghostSpeed = 500; // GHOST_SPEED * 1000 * (1+ghostRandomizer);

  totalGhostSpeed += ghostSpeed;

  // create timer thread
  var tempTimerId = setInterval(ghostTick, ghostSpeed, ghosts.length);

  // console.log("Ghost speed created in spawnGhost " + ghostSpeed);

  // randomly determine which type of ghost

  var tempGhostType = (Math.floor(Math.random() * NUM_GHOST_TYPES));

  // hard code a test ghost here
  // tempGhostType = GHOST_TYPE_WALL_BUILDER;

  switch (tempGhostType) {

    case GHOST_TYPE_POISON:

        poisonGhostCount++;
        var poisonTimerIds = new Array;
        ghosts.push({squareNum:squareNum, ghost_type: tempGhostType, timerID: tempTimerId, respawnId: -1, poisonTimers: poisonTimerIds, speed: ghostSpeed});

        break;

      case GHOST_TYPE_RABID:

          rabidGhostCount++;
          ghosts.push({squareNum:squareNum, ghost_type: tempGhostType, timerID: tempTimerId, respawnId: -1, speed: ghostSpeed});

          break;

      case GHOST_TYPE_WALL_BUILDER:

          wallBuilderGhostCount++;
          ghosts.push({squareNum:squareNum, ghost_type: tempGhostType, timerID: tempTimerId, respawnId: -1, wallTimerID: -1, wallTickCount: 0, speed: ghostSpeed});

          break;

      case GHOST_TYPE_NORMAL:

          regGhostCount++;
          ghosts.push({squareNum:squareNum, ghost_type: tempGhostType, timerID: tempTimerId, respawnId: -1, speed: ghostSpeed});

          break;

    default:

  }

  updateScoreboard();

  // console.log(ghosts);

  // Draw ghost on board.  Later redraws are handled by the tick timer function
  squares = document.querySelectorAll('.square');  // faster to get first?

  squares[squareNum].innerHTML = getGhostIcon(ghosts[ghosts.length-1].ghost_type);

} // end function spawnGhost

// ---------------------------------------------------------------------
// Function used to delay the respawning of ghosts, passing in the type
//
function ghostRespawnTimer(type, speed)
{
  // spawn a new ghost
  reSpawnGhost(Math.floor(Math.random() * (NUM_ROWS*NUM_COLUMNS)), type, speed);

}

// ---------------------------------------------------------------------

function reSpawnGhost(squareNum, ghostType, speed)
{
  // check if game over
  if (gameStatus == 0)
    return;

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
  var tempTimerId = setInterval(ghostTick, speed, ghosts.length);

  switch (ghostType) {

    case GHOST_TYPE_POISON:

        // poisonGhostCount++;
        var poisonTimerIds = new Array;
        ghosts.push({squareNum:squareNum, ghost_type: ghostType, timerID: tempTimerId, respawnId: -1, poisonTimers: poisonTimerIds, speed: speed});

        break;

      case GHOST_TYPE_RABID:

          // rabidGhostCount++;
          ghosts.push({squareNum:squareNum, ghost_type: ghostType, timerID: tempTimerId, respawnId: -1, speed: speed});

          break;

      case GHOST_TYPE_WALL_BUILDER:

          // wallBuilderGhostCount++;
          ghosts.push({squareNum:squareNum, ghost_type: ghostType, timerID: tempTimerId, respawnId: -1, wallTimerID: -1, wallTickCount: 0, speed: speed});

          break;

      case GHOST_TYPE_NORMAL:

          // regGhostCount++;
          ghosts.push({squareNum:squareNum, ghost_type: ghostType, timerID: tempTimerId, respawnId: -1, speed: speed});

          break;

    default:

  }

  updateScoreboard();

  console.log("Ghost speed created in reSpawnGhost " + speed);
  // var temp = new String((ghosts.length)-1);
  // console.log("New ghost num " + temp + " of type " + ghostType + " spawned in square " + squareNum + "  total ghosts created is " + ghostsCreated + " at " + " at " + (new Date()));

  // Later redraws are handled by the tick timer function

} // end function reSpawnGhost

// ---------------------------------------------------------------------
// function called for each ghost, each tick.
// ghost id in the array passed in

function ghostTick(ghostId)
{
  var legalMove = FAIL;
  var tries = 0;
  var dir; // dir 0 = right, 1 = left, 2 = up, 3 = down

  // console.log("Ghost tick called for ghost id " + ghostId);
  // console.log(ghosts);

  // check if game over
  if (gameStatus == 0)
    return;

  // Check if wall builder ghost and not time to build, then increment counter and return

  if (ghosts[ghostId].ghost_type == GHOST_TYPE_WALL_BUILDER)
  {
    if ((ghosts[ghostId].wallTimerID != -1) && (ghosts[ghostId].wallTickCount != WALL_BUILD_TIME))
    {
      ghosts[ghostId].wallTickCount++;

      // Show the icon again just in case it was replaced with a good bomb, unless off the board
      if (ghosts[ghostId].squareNum != OFF_THE_BOARD)
      {
        squares = document.querySelectorAll('.square');
        squares[ghosts[ghostId].squareNum].innerHTML = ICON_GHOST_WALL_BUILDER;
      }

      return;
    }
    else
    {
      ghosts[ghostId].wallTimerID = -1;
      ghosts[ghostId].wallTickCount = 0;
    }
  }

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
    var oldSquare = ghosts[ghostId].squareNum;

    switch(dir)
    {
      case RIGHT:

        ghosts[ghostId].squareNum++;

        checkIfOnGhostPacman(ghostId);

        if (!processGhostTunnel(ghostId))
          processPoison(ghostId,oldSquare);

        break;

      case LEFT:

        ghosts[ghostId].squareNum--;

        checkIfOnGhostPacman(ghostId);

        if (!processGhostTunnel(ghostId))
          processPoison(ghostId,oldSquare);

        break;

      case DOWN:

        ghosts[ghostId].squareNum += NUM_COLUMNS;

        checkIfOnGhostPacman(ghostId);

        if (!processGhostTunnel(ghostId))
          processPoison(ghostId,oldSquare);

        break;

      case UP:

        ghosts[ghostId].squareNum -= NUM_COLUMNS;

        checkIfOnGhostPacman(ghostId);

        if (!processGhostTunnel(ghostId))
          processPoison(ghostId,oldSquare);

        break;

    } // end switch

    // if wall builder ghost, determine whether to build a wall
    if (ghosts[ghostId].ghost_type == GHOST_TYPE_WALL_BUILDER)
    {
      var wallCheck = Math.floor(Math.random() * 100) + 1;
      // console.log("Check is " + wallCheck);

      // if check, try to build wall
      if (wallCheck < WALL_BUILD_PERCENT * 100)
      {
          // launch timer to build wall
          var tempWallTimerId = setTimeout(myWallBuildTimer, WALL_BUILD_TIME * ghosts[ghostId].speed * .98, ghostId);
          ghosts[ghostId].wallTimerID = tempWallTimerId;

      } // end if wallCheck

    } // end if wall builder ghost type

}   // end function resolveGhost

// ----------------------------------------------------------------------

function redrawBoardGhost(ghostId, oldSquare)
{
    // console.log("Ghost " + ghostId + " redraw called for pos " + ghosts[ghostId].squareNum);

    var bombFound = false;

    squares = document.querySelectorAll('.square');

    if (ghosts[ghostId].squareNum != OFF_THE_BOARD)
    {
        squares[ghosts[ghostId].squareNum].innerHTML = getGhostIcon(ghosts[ghostId].ghost_type);
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
      if (poison[oldSquare] == 1)
      {
          squares[oldSquare].innerHTML = ICON_POISON;
      }
      else
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

        } // end check for poison

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

        // if normal ghost, do something

        // if rabid ghost, do something

        // if Mole ghost, ....

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
        reSpawnGhost(Math.floor(Math.random() * (NUM_ROWS*NUM_COLUMNS)), ghosts[ghostId].ghost_type, ghosts[ghostId].speed);  // return any square on board

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

      if (ghosts[i].ghost_type == GHOST_TYPE_POISON)
      {
        for (var j=0; j<ghosts[i].poisonTimers.length;j++)
        {
          if (ghosts[i].poisonTimers[j] != -1)
            clearTimeout(ghosts[i].poisonTimers[j]);
        }
      }

      if (ghosts[i].ghost_type == GHOST_TYPE_WALL_BUILDER)
      {
        if (ghosts[i].wallTimerID != -1)
          clearTimeout(ghosts[i].wallTimerID);
      }

    }  // end for loop

} // end function

// -------------------------------------------------------
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
    return true;
  }
  else
  {
      if (ghosts[ghostId].squareNum == tunnel2num)
      {
        squares[tunnel2num].innerHTML = ICON_TUNNEL;
        ghosts[ghostId].squareNum = tunnel1num;
        return true;
      }
  } // end else

  return false;

}  // end function processGhostTunnel ---------------

// --------------------------------------------------
//
function getGhostIcon(type)
{
  switch (type) {

    case GHOST_TYPE_NORMAL:

      return ICON_GHOST;
      break;

    case GHOST_TYPE_RABID:

      return ICON_GHOST_RABID;
      break;

    case GHOST_TYPE_POISON:

        return ICON_GHOST_POISON;
        break;

    case GHOST_TYPE_WALL_BUILDER:

        return ICON_GHOST_WALL_BUILDER;
        break;

    default:
        return "Error - Incorrect Ghost Type";

  }
}

// end function getGhostIcon -------------
// --------------------------------------------------
//

// --------------------------------------------------
//

function processPoison(ghostId,oldSquare)
{
    // console.log("Process Poison - array is " + poison);

    // randomly determine if drop poison if right type of ghost
    if (ghosts[ghostId].ghost_type == GHOST_TYPE_POISON)
    {
        var check = Math.floor(Math.random() * 100) + 1;
        // console.log("Check is " + check);

        // don't drop poison on existing poison or tunnel or goodbomb
        if ((check < POISON_PERCENT * 100) && (poison[oldSquare] != 1) && (oldSquare != tunnel1num) && (oldSquare != tunnel2num) && (goodBombs[oldSquare] != 1))
        {
            // need to send save each timer id in case board ends with multiple poisons on the board
            var myPoisonCount = ghosts[ghostId].poisonTimers.length;

            // console.log("Dropping poison in square " + oldSquare);
            var tempTimerId = setTimeout(myPoisonTimer, POISON_DELAY * 1000, ghostId, oldSquare, myPoisonCount);
            ghosts[ghostId].poisonTimers.push(tempTimerId);
            poison[oldSquare] = 1;
        }
    } // end if

}

// -------------------------------------------------
// Need to pass in both because a ghost could have moved since dropping poison

function myPoisonTimer(ghostId,squareNum,myPoisonCounter)
{
    //console.log("Poison timer called for poison in square " + squareNum);

    poison[squareNum] = 0;
    ghosts[ghostId].poisonTimers[myPoisonCounter] = -1;  // reset

    squares = document.querySelectorAll('.square');  // faster to get first?

    if (goodBombs[squareNum] == 1)
    {
        squares[squareNum].innerHTML = ICON_GOOD_BOMB;
    }
    else
    {
        // check for pellet
        if (pellets[squareNum] == 1)
        {
            squares[squareNum].innerHTML = ICON_PELLET;
        }
        else  // no pellet
        {
            if (powerPellets[squareNum] == 1)
            {
                squares[squareNum].innerHTML = ICON_POWER_PELLET;
            }
            else {
              squares[squareNum].innerHTML = "";
            }
        }
    }

}   // end pp timer function


// -------------------------------------------------
// zzz

function myWallBuildTimer(ghostId)
{
    var spotFound = false;
    var numTries = 0;

    if (ghosts[ghostId].squareNum == OFF_THE_BOARD)
      return;

    var dir = Math.floor(Math.random() * 4);  // returns a random int between 0 and 3

    while ((spotFound == false) && (numTries < 4))
    {
        switch (dir)
        {
          case RIGHT:

              if ((checkIfSquareOKforWall((ghosts[ghostId].squareNum)+1) == true) && (((ghosts[ghostId].squareNum + 1) % NUM_COLUMNS) != 0))
              {
                spotFound = true;
                walls[(ghosts[ghostId].squareNum)+1] = 1;
                redrawWallSquare((ghosts[ghostId].squareNum)+1);
              }
              else
              {
                  numTries++;
                  dir = (dir+1) % 4;
              }

              break;

          case LEFT:

              if ((checkIfSquareOKforWall((ghosts[ghostId].squareNum)-1) == true) && ((ghosts[ghostId].squareNum % NUM_COLUMNS) != 0))
              {
                spotFound = true;
                walls[(ghosts[ghostId].squareNum)-1] = 1;
                redrawWallSquare((ghosts[ghostId].squareNum)-1);
              }
              else
              {
                  numTries++;
                  dir = (dir+1) % 4;
              }

              break;

          case UP:

              if ((checkIfSquareOKforWall((ghosts[ghostId].squareNum)-NUM_COLUMNS) == true) && (ghosts[ghostId].squareNum >= NUM_COLUMNS))
              {
                spotFound = true;
                walls[(ghosts[ghostId].squareNum)-NUM_COLUMNS] = 1;
                redrawWallSquare((ghosts[ghostId].squareNum)-NUM_COLUMNS);
              }
              else
              {
                  numTries++;
                  dir = (dir+1) % 4;
              }

              break;

          case DOWN:

              if ((checkIfSquareOKforWall((ghosts[ghostId].squareNum)+NUM_COLUMNS) == true) && ((ghosts[ghostId].squareNum < NUM_COLUMNS * (NUM_ROWS-1))))
              {
                spotFound = true;
                walls[(ghosts[ghostId].squareNum)+NUM_COLUMNS] = 1;
                redrawWallSquare((ghosts[ghostId].squareNum)+NUM_COLUMNS);
              }
              else
              {
                  numTries++;
                  dir = (dir+1) % 4;
              }

              break;

          default:

        } // end switch

    }   // end while

}  // end function checkIfBuildWall

// ------------------------------------------------
//
function checkIfSquareOKforWall(squareNum)
{
  // can't build a wall on a wall
  if (walls[squareNum] == 1)
    return false;

  // can't build a wall on a tunnel
  if ((tunnel1num == squareNum) || (tunnel2num == squareNum))
    return false;

  // can't build a wall on pacman
  if (current == squareNum)
    return false;

  // check for ghosts
  for (i=0;i<ghosts.length;i++)
  {
    if (ghosts[i].squareNum == squareNum)
      return false;
  }

  // check for bombs, good bombs, powerpellets

  if (bombs[squareNum] == 1)
      return false;

  if (goodBombs[squareNum] == 1)
      return false;

  if (powerPellets[squareNum] == 1)
      return false;

  // all checks failed, square ok, return true
  return true;
}

// ------------------------------------------------
//
function redrawWallSquare(squareNum)
{
    squares = document.querySelectorAll('.square');  // get squares

    if (pellets[squareNum] == 0)
      squares[squareNum].innerHTML = ICON_WALL;
    else
      squares[squareNum].innerHTML = ICON_WALL_WITH_PELLET;

}

// end function redrawWallSquare --------------------

// -------------------------------------------------
// ---------  End Ghost function section ---------
// -------------------------------------------------

// ************************************************************************

function startGame()
{
    gameStatus = 1; // on

    // Get rid of Start button
    document.getElementById("startButtonSpan").innerHTML = "";

    document.getElementById("timer").innerHTML = GAME_LENGTH + ":00";

    setInterval(timerFunction, 1000);

    myAudio.src = BACKGROUND_AUDIO;
    myAudio.loop = true;
    myAudio.volume = .4;
    // myAudio.muted = true;
    myAudio.play();

    startGoodBombTimer();

    setTimeout( spawnAllGhosts, 2000);

    updateScoreboard();

    respawnPacmanTimer();

}

// ----------------------------------------------------

function timerFunction()
{
    timerSeconds--;

    if (timerSeconds < 0)
      return;

    var mins = Math.floor(timerSeconds / 60);

    var secs = Math.floor(timerSeconds % 60);

    if (secs < 10)
      secs = "0" + secs;

    document.getElementById("timer").innerHTML = mins + ":" + secs;

    if ((mins == 0) && (secs == 0))
    {
      gameStatus = 0; // over
    }
}
