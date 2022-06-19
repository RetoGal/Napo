const CHARACTER_PARAMS = {
  rabbit: { name: "rabbit", src: "./img/zayac.png", count: 1 },
  wolf: { name: "wolf", src: "./img/volk.png" },
  ban: { name: "ban", src: "./img/ban.png" },
  home: { name: "home", src: "./img/home.png", count: 1 },
}
const FREE_CELL = 0
let numberBoard = 0
const INTERVAL_WOLVES = {}

function getDirectionButtons() {
  return {
    left:  getElementsById("left"),
    right:  getElementsById("right"),
    up: getElementsById("up"),
    down: getElementsById("down"),
  }
}

function template (number) {
  return `
  <div class="area" id="${"area" + number}">
       <button class="startBtn" id="${"startBtn" + number}">START</button>
            <select id="${"select" + number}" class="select">
                <option value="5">5x5</option>
                <option value="7">7*7</option>
                <option value="10">10*10</option>
            </select>
            <div class="message" id="${"message" + number}"></div>
            <div class="gameBoard" id="${"gameBoard" + number}">
            </div>
            <div class="buttonsDirection${number} arrowDirection">
                <div class="divUp">
                    <button class="up" id="${"up" + number}">UP</button>
                </div>
                <div class="arrow_sides">
                    <div class="divLeft"><button class="left" id="${
                      "left" + number
                    }">LEFT</button> </div>
                    <div class="divRight"><button class="right" id="${
                      "right" + number
                    }">RIGHT</button></div>
                </div>
                <div class="divDown"> <button class="down" id="${
                  "down" + number
                }">down</button></div>
            </div>
         </div>
  `
}


function getElementsById(id){
  return document.getElementById(id + numberBoard)
}

function creatGameBoard () {
  const container = document.querySelector("#container")
  const templateGame = template(numberBoard)
  const newGameArea = document.createElement("div")
  newGameArea.id = "area" + numberBoard
  newGameArea.className = "area"
  newGameArea.innerHTML = templateGame
  container.append(newGameArea)
}

function newGameBoard () {
  numberBoard++
  creatGameBoard()
  startEventListeners(numberBoard)
}

function getRandomFREE_CELLPosition ( GAME_STATE ) {
  const matrix = GAME_STATE.gameArr
  const x = Math.floor(Math.random() * matrix.length)
  const y = Math.floor(Math.random() * matrix.length)
  return matrix[x][y] === FREE_CELL ? [x, y] : getRandomFREE_CELLPosition(GAME_STATE)
}

function setCharacterInFREE_CELLPosition ( GAME_STATE, character ) {
  const matrix = GAME_STATE.gameArr
  const [x, y] = getRandomFREE_CELLPosition( GAME_STATE )
  matrix[x][y] = character
}

function setCountCharacter ( GAME_STATE, count, character ) {
  for ( let i = 0; i < count; i++ ) {
    setCharacterInFREE_CELLPosition( GAME_STATE, character )
  }
}

function getCordinatesOfCharacter ( GAME_STATE, character ) {
  const matrix = GAME_STATE.gameArr
  const cordsCharacter = []
  for ( let x = 0; x < matrix.length; x++ ) {
    for ( let y = 0; y < matrix.length; y++ ) {
      if ( matrix[x][y] === character ) {
        cordsCharacter.push([x, y])
      }
    }
  }
  return cordsCharacter
}

function getNeighbouringCoordinates ( GAME_STATE, [x, y] ) {
  const cells = [
    [x - 1, y],
    [x + 1, y],
    [x, y + 1],
    [x, y - 1],
  ]
  return cells.filter ( cell => isInRange( GAME_STATE, cell ))
}

function getFREE_CELLBoxNextToWolf ( GAME_STATE, [x, y] ) {
  const matrix = GAME_STATE.gameArr
  const sidesWolf = getNeighbouringCoordinates( GAME_STATE, [x, y] )
  const result = []
  sidesWolf.forEach( FREE_CELLCell => {

    const [x, y] = FREE_CELLCell
    if ( GAME_STATE.theGameContinues === false ) {
      return
    } else {
      if ( matrix[x][y] === FREE_CELL ) {
         result.push(FREE_CELLCell)
      }
    }
  })
  return result
}

function getRabbitNextToWolf ( GAME_STATE, [x, y] ) {
  
  const matrix = GAME_STATE.gameArr
  const sidesWolf = getNeighbouringCoordinates( GAME_STATE, [x, y] )
  sidesWolf.forEach( FREE_CELLCell => {
   if ( GAME_STATE.theGameContinues === false ) {
        return
    } else {
        const [x, y] = FREE_CELLCell
      if ( matrix[x][y] === "rabbit" ) {
        GAME_STATE.theResultOfTheGame = "gameOver"
        return
      }
    }
  })
}

function getSidesLengthThreeAngle ( GAME_STATE, [x, y] ) {

  const sidesWolf = getFREE_CELLBoxNextToWolf( GAME_STATE, [x, y] )
  const cordRabbit = getCordinatesOfCharacter( GAME_STATE, CHARACTER_PARAMS.rabbit.name )[0]
  return sidesWolf.map(item => calculateDistance( item, cordRabbit ))

}

function findNearestСell ( GAME_STATE, [x, y] ) {

  const lengthCell = getSidesLengthThreeAngle( GAME_STATE, [x, y] )
  const nearestСell = getFREE_CELLBoxNextToWolf( GAME_STATE, [x, y] )
  const min = Math.min(...lengthCell)
  const index = lengthCell.indexOf( min )

  return nearestСell[index]
}

function moveWolvesOnNewBox ( GAME_STATE ) {

  const matrix = GAME_STATE.gameArr
  const sideWolves = getCordinatesOfCharacter( GAME_STATE,CHARACTER_PARAMS.wolf.name )
  sideWolves.forEach( cordinateWolves => {
    
    if (GAME_STATE.theGameContinues === false) {
      return
    }
    const [XnearestСell, YnearestСell] = findNearestСell( GAME_STATE, cordinateWolves )
    const [Xwolves, Ywolves] = cordinateWolves
    matrix[Xwolves][Ywolves] = FREE_CELL
    matrix[XnearestСell][YnearestСell] = CHARACTER_PARAMS.wolf.name
    getRabbitNextToWolf( GAME_STATE, cordinateWolves )
      
  })
}

function moveRabbit ( GAME_STATE, x, y ) {
  const matrix = GAME_STATE.gameArr
  const [rabbitX, rabbitY] = getCordinatesOfCharacter( GAME_STATE, CHARACTER_PARAMS.rabbit.name )[0]
  
  matrix[rabbitX][rabbitY] = FREE_CELL
  matrix[x][y] === FREE_CELL ?  matrix[x][y] = CHARACTER_PARAMS.rabbit.name : 
  matrix[x][y] === CHARACTER_PARAMS.wolf.name ?  GAME_STATE.theResultOfTheGame = "gameOver" :
  matrix[x][y] === CHARACTER_PARAMS.home.name ? GAME_STATE.theResultOfTheGame = "youWon" : matrix[rabbitX][rabbitY] = CHARACTER_PARAMS.rabbit.name

 }

function drawMessage ( GAME_STATE ) {
if (GAME_STATE.theResultOfTheGame !== "") {
    GAME_STATE.theGameContinues = false
    gameStatusMessage(GAME_STATE)
    return
  }
}

function gameMovement ( GAME_STATE ) {
  if (GAME_STATE.theGameContinues === false) {
    return
  } 
   else {
    const directionButtons = getDirectionButtons ()
    Object.values(directionButtons).map(arrow => {
      arrow.onclick = () => {
        const matrix = GAME_STATE.gameArr
        const [x, y] = getCordinatesOfCharacter( GAME_STATE, CHARACTER_PARAMS.rabbit.name )[0]
        let newX = x
        let newY = y
        if (arrow.id === "left" + GAME_STATE.numberBoard) {

          y === 0 ? ( newY = matrix.length - 1 ) : ( newY = y - 1 )

        } else if ( arrow.id === "right" + GAME_STATE.numberBoard ) {

          y === matrix.length - 1 ? ( newY = 0 ) : ( newY = y + 1 )

        } else if ( arrow.id === "up" + GAME_STATE.numberBoard ) {

          x === 0 ? ( newX = matrix.length - 1 ) : ( newX = x - 1 )

        } else if ( arrow.id === "down" + GAME_STATE.numberBoard ) {

          x === matrix.length - 1 ? ( newX = 0 ) : ( newX = x + 1 )

        }
        moveRabbit ( GAME_STATE, newX, newY )
        drawGameArea ( GAME_STATE )
      }
    })
  }
}

function createLitleDivForCharacter ( GAME_STATE, indexesOfElementsInAMatrix ) {

  const litleDiv = document.createElement("div")
  litleDiv.id = indexesOfElementsInAMatrix + GAME_STATE.numberBoard
  litleDiv.className = "box"
  getElementsById("gameBoard").append(litleDiv)
  
}

function putСharacterInCell ( indexesOfElementsInAMatrix, imgCharacters, GAME_STATE) {

  const cellForCharacter = document.getElementById( indexesOfElementsInAMatrix + GAME_STATE.numberBoard)
  const NewAttributeImg = document.createElement("img")
  NewAttributeImg.src = imgCharacters
  cellForCharacter.append( NewAttributeImg )
}

 function drawGameArea ( GAME_STATE ) {

  const matrix = GAME_STATE.gameArr
  clearGameBoard()
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix.length; y++) {
      const idCharacter = `${x}${y}`
      createLitleDivForCharacter ( GAME_STATE, idCharacter )

      switch ( matrix[x][y] ) {

        case "rabbit":
          putСharacterInCell( idCharacter, CHARACTER_PARAMS.rabbit.src, GAME_STATE )
          break
        case "wolf":
          putСharacterInCell( idCharacter, CHARACTER_PARAMS.wolf.src, GAME_STATE )
          break
        case "home":
          putСharacterInCell( idCharacter, CHARACTER_PARAMS.home.src, GAME_STATE )
          break
        case "ban":
          putСharacterInCell( idCharacter, CHARACTER_PARAMS.ban.src, GAME_STATE )
          break
      }
    }
  }
  drawMessage( GAME_STATE )
}

function gameStatusMessage ( GAME_STATE ) {
  getElementsById("gameBoard").style.display = "none"
  getElementsById("message").style.display = "block"

  GAME_STATE.theResultOfTheGame === "gameOver" ?   getElementsById("message").innerHTML = "Game Over" :
  GAME_STATE.theResultOfTheGame === "youWon" ?  getElementsById("message").innerHTML = "Congratulations! youWon!" :
  GAME_STATE.theGameContinues === true

}

function start ( numberBoard ) {

  clearIntervalWolves( numberBoard )
  getElementsById("gameBoard").style.display = "flex"
  getElementsById("message").style.display = "none"
  document.querySelector(".buttonsDirection" + numberBoard).style.display ="block"
  const gameSize = "select" + numberBoard
  const gameBoardSize = parseInt( document.getElementById(gameSize).value )
  const matrix = createMatrix( gameBoardSize )
  
  const GAME_STATE = {
    gameArr: matrix,
    theGameContinues: true,
    theResultOfTheGame: "",
    numberBoard: numberBoard,
    interval : setInterval(() => {
               moveWolvesOnNewBox( GAME_STATE )
               drawGameArea( GAME_STATE )}, 3000),
  }

  addGameStatusToObject( GAME_STATE )
  clearGameBoard()
  wolfCount( GAME_STATE )
  banCount( GAME_STATE )
  Object.values( CHARACTER_PARAMS ).map( character => setCountCharacter ( GAME_STATE, character.count, character.name ))
  myGameBoardSize(gameBoardSize )
  gameMovement( GAME_STATE )
  drawGameArea( GAME_STATE )
}

document.querySelector(".newAreaBtn").addEventListener("click", newGameBoard)

const startEventListeners = boardNumber =>  getElementsById("startBtn").addEventListener("click", () => start(boardNumber))

const isInRange = ( GAME_STATE, [x, y] ) => x >= 0 && x < GAME_STATE.gameArr.length &&  y >= 0 && y < GAME_STATE.gameArr.length

const createMatrix = gameBoardSize => new Array( gameBoardSize ).fill( FREE_CELL ).map(() => new Array( gameBoardSize ).fill( FREE_CELL ))

const calculateDistance = ( [x1, y1], [x2, y2] ) => Math.round(Math.sqrt(Math.pow( x1 - x2, 2 ) + Math.pow( y1 - y2, 2 )))

const clearGameBoard =  () => getElementsById("gameBoard").innerHTML = "" 

const myGameBoardSize =  boardSize =>  getElementsById("gameBoard").style.width = boardSize * 60 + 20 + "px" 

const addGameStatusToObject =  GAME_STATE  => INTERVAL_WOLVES[ GAME_STATE.numberBoard ] = GAME_STATE

const clearIntervalWolves =  numberBoard  => INTERVAL_WOLVES[ numberBoard ] ?  clearInterval( INTERVAL_WOLVES[numberBoard].interval ) : INTERVAL_WOLVES[ numberBoard ] = []

const wolfCount = GAME_STATE => ( CHARACTER_PARAMS.wolf.count = Math.floor(( 65 * GAME_STATE.gameArr.length) / 100 ))

const banCount = GAME_STATE => ( CHARACTER_PARAMS.ban.count = Math.floor((45 * GAME_STATE.gameArr.length) / 100) )