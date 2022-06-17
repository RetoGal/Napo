const CHARACTER_PARAMS = {
  rabbit: { name: "rabbit", src: "./img/zayac.png", count: 1 },
  wolf: { name: "wolf", src: "./img/volk.png" },
  ban: { name: "ban", src: "./img/ban.png" },
  home: { name: "home", src: "./img/home.png", count: 1 },
}
const FREE = 0
let numberBoard = 0

const INTERVAL_WOLVES = {}

function template(number) {
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

function getDirectionButtons(numberBoard) {
  return {
    left: document.getElementById("left" + numberBoard),
    right: document.getElementById("right" + numberBoard),
    up: document.getElementById("up" + numberBoard),
    down: document.getElementById("down" + numberBoard),
  }
}

function creatGameBoard() {
  const container = document.querySelector("#container")
  const templateGame = template(numberBoard)
  const newGameArea = document.createElement("div")
  newGameArea.id = "area" + numberBoard
  newGameArea.className = "area"
  newGameArea.innerHTML = templateGame
  container.append(newGameArea)
}

const startEventListeners = boardNumber => document.getElementById("startBtn" + boardNumber).addEventListener("click", () => start(boardNumber))

function newGameBoard() {
  numberBoard++
  creatGameBoard()
  startEventListeners(numberBoard)
}

document.querySelector(".newAreaBtn").addEventListener("click", newGameBoard)

const createMatrix = gameBoardSize => new Array(gameBoardSize).fill(FREE).map(() => new Array(gameBoardSize).fill(FREE))

function getRandomFreePosition(GAME_STATE) {
  const matrix = GAME_STATE.gameArr
  const x = Math.floor(Math.random() * matrix.length)
  const y = Math.floor(Math.random() * matrix.length)
  return matrix[x][y] === FREE ? [x, y] : getRandomFreePosition(GAME_STATE)
}

function setCharacterInFreePosition(GAME_STATE, character) {
  const matrix = GAME_STATE.gameArr
  const [x, y] = getRandomFreePosition(GAME_STATE)
  matrix[x][y] = character
}

function setCountCharacter(GAME_STATE, count, character) {
  for (let i = 0; i < count; i++) {
    setCharacterInFreePosition(GAME_STATE, character)
  }
}

function getCordinatesOfCharacter(GAME_STATE, character) {
  const matrix = GAME_STATE.gameArr
  const cordsCharacter = []
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix.length; y++) {
      if (matrix[x][y] === character) {
        cordsCharacter.push([x, y])
      }
    }
  }
  return cordsCharacter
}

const isInRange = (GAME_STATE, [x, y]) => x >= 0 && x < GAME_STATE.gameArr.length &&  y >= 0 && y < GAME_STATE.gameArr.length

function getNeighbouringCoordinates(GAME_STATE, [x, y]) {
  const cells = [
    [x - 1, y],
    [x + 1, y],
    [x, y + 1],
    [x, y - 1],
  ]
  return cells.filter(cell => isInRange(GAME_STATE, cell))
}

function getFreeBoxNextToWolf(GAME_STATE, [x, y]) {
  const matrix = GAME_STATE.gameArr
  const sidesWolf = getNeighbouringCoordinates(GAME_STATE, [x, y])
  const result = []
  sidesWolf.forEach(freeCell => {
    const [x, y] = freeCell
   
    if (GAME_STATE.theGameContinues === false) {
      clearInterval(GAME_STATE.interval)
      return
    } else {
      if (matrix[x][y] === FREE) {
        result.push(freeCell)
      }
    }
  })
  return result
}

function getRabbitNextToWolf(GAME_STATE, [x, y]) {
  const matrix = GAME_STATE.gameArr
  const sidesWolf = getNeighbouringCoordinates(GAME_STATE, [x, y])
  sidesWolf.forEach(freeCell => {
    const [x, y] = freeCell
    if (GAME_STATE.theGameContinues === false) {
      clearIntervalWolves(GAME_STATE.numberBoard)
      return
    } else {
      if (matrix[x][y] === "rabbit") {
        GAME_STATE.theResultOfTheGame = "gameOver"
        return
      }
    }
  })
}
const calculateDistance = ([x1, y1], [x2, y2]) => Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))

function getSidesLengthThreeAngle(GAME_STATE, [x, y]) {

  const sidesWolf = getFreeBoxNextToWolf(GAME_STATE, [x, y])
  const cordRabbit = getCordinatesOfCharacter(GAME_STATE, CHARACTER_PARAMS.rabbit.name)[0]
  return sidesWolf.map(item => calculateDistance(item, cordRabbit))
}

function findNearestСell(GAME_STATE, [x, y]) {

  const lengthCell = getSidesLengthThreeAngle(GAME_STATE, [x, y])
  const nearestСell = getFreeBoxNextToWolf(GAME_STATE, [x, y])
  const min = Math.min(...lengthCell)
  const index = lengthCell.indexOf(min)

  return nearestСell[index]
}

function moveWolvesOnNewBox(GAME_STATE) {
  const matrix = GAME_STATE.gameArr
  const sideWolves = getCordinatesOfCharacter(GAME_STATE,CHARACTER_PARAMS.wolf.name)
  sideWolves.forEach(cordinateWolves => {
    if (GAME_STATE.theGameContinues === false) {
      clearInterval(GAME_STATE.interval)
      return
    }
    const [XnearestСell, YnearestСell] = findNearestСell( GAME_STATE, cordinateWolves )
    const [Xwolves, Ywolves] = cordinateWolves
    matrix[Xwolves][Ywolves] = FREE
    matrix[XnearestСell][YnearestСell] = CHARACTER_PARAMS.wolf.name
    getRabbitNextToWolf(GAME_STATE, cordinateWolves)
  })
}


function moveRabbit(GAME_STATE, x, y) {
  const matrix = GAME_STATE.gameArr
  const [rabbitX, rabbitY] = getCordinatesOfCharacter(GAME_STATE, CHARACTER_PARAMS.rabbit.name)[0]

  if (matrix[x][y] === FREE) {
    matrix[rabbitX][rabbitY] = FREE
    matrix[x][y] = CHARACTER_PARAMS.rabbit.name
  } else if (matrix[x][y] === CHARACTER_PARAMS.wolf.name) {
    GAME_STATE.theResultOfTheGame = "gameOver"
    return
  } else if (matrix[x][y] === CHARACTER_PARAMS.home.name) {
    GAME_STATE.theResultOfTheGame = "youWon"
    return
  } else if (matrix[x][y] === CHARACTER_PARAMS.ban.name) {
    matrix[x][y] = CHARACTER_PARAMS.ban.name
    matrix[rabbitX][rabbitY] = CHARACTER_PARAMS.rabbit.name
  }
}

function drawMessage(GAME_STATE) {
if (GAME_STATE.theResultOfTheGame !== "") {
    GAME_STATE.theGameContinues = false
    gameStatusMessage(GAME_STATE)
  }
}




function gameMovement(GAME_STATE) {
  if (GAME_STATE.theGameContinues === false) {
    clearInterval(GAME_STATE.interval)
    return
  } else {
    const directionButtons = getDirectionButtons(GAME_STATE.numberBoard)
    Object.values(directionButtons).map(arrow => {
      arrow.onclick = () => {
        const matrix = GAME_STATE.gameArr
        const [x, y] = getCordinatesOfCharacter(GAME_STATE, CHARACTER_PARAMS.rabbit.name)[0]
        let newX = x
        let newY = y
        if (arrow.id === "left" + GAME_STATE.numberBoard) {
          y === 0 ? (newY = matrix.length - 1) : (newY = y - 1)
        } else if (arrow.id === "right" + GAME_STATE.numberBoard) {
          y === matrix.length - 1 ? (newY = 0) : (newY = y + 1)
        } else if (arrow.id === "up" + GAME_STATE.numberBoard) {
          x === 0 ? (newX = matrix.length - 1) : (newX = x - 1)
        } else if (arrow.id === "down" + GAME_STATE.numberBoard) {
          x === matrix.length - 1 ? (newX = 0) : (newX = x + 1)
        }
        moveRabbit(GAME_STATE, newX, newY)
        drawGameArea(GAME_STATE)
      }
    })
  }
}

const clearGameBoard = GAME_STATE => (document.getElementById("gameBoard" + GAME_STATE.numberBoard).innerHTML = "")

const myGameBoardSize = (GAME_STATE, boardSize) => (document.getElementById("gameBoard" + GAME_STATE.numberBoard).style.width = boardSize * 60 + 20 + "px")

const addGameStatusToObject = (GAME_STATE) => INTERVAL_WOLVES[GAME_STATE.numberBoard] = GAME_STATE

const clearIntervalWolves = (numberBoard) => INTERVAL_WOLVES[numberBoard] ?  clearInterval(INTERVAL_WOLVES[numberBoard].interval) : INTERVAL_WOLVES[numberBoard] = []

const wolfCount = GAME_STATE => (CHARACTER_PARAMS.wolf.count = Math.floor((65 * GAME_STATE.gameArr.length) / 100))

const banCount = GAME_STATE => (CHARACTER_PARAMS.ban.count = Math.floor((45 * GAME_STATE.gameArr.length) / 100))

function createLitleDivForCharacter(GAME_STATE, indexesOfElementsInAMatrix) {
  const litleDiv = document.createElement("div")
  litleDiv.id = indexesOfElementsInAMatrix + GAME_STATE.numberBoard
  litleDiv.className = "box"
  document.getElementById("gameBoard" + GAME_STATE.numberBoard).append(litleDiv)
}



function putСharacterInCell( indexesOfElementsInAMatrix, imgCharacters, GAME_STATE) {
  const cellForCharacter = document.getElementById( indexesOfElementsInAMatrix + GAME_STATE.numberBoard)
  const NewAttributeImg = document.createElement("img")
  NewAttributeImg.src = imgCharacters
  cellForCharacter.append(NewAttributeImg)
}

function drawGameArea(GAME_STATE) {
  const matrix = GAME_STATE.gameArr
  clearGameBoard(GAME_STATE)
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix.length; y++) {
      const idCharacter = `${x}${y}`
      createLitleDivForCharacter(GAME_STATE, idCharacter)
      switch (matrix[x][y]) {
        case "rabbit":
          putСharacterInCell(  idCharacter, CHARACTER_PARAMS.rabbit.src, GAME_STATE )
          break
        case "wolf":
          putСharacterInCell(idCharacter, CHARACTER_PARAMS.wolf.src, GAME_STATE )
          break
        case "home":
          putСharacterInCell( idCharacter, CHARACTER_PARAMS.home.src, GAME_STATE)
          break
        case "ban":
          putСharacterInCell(idCharacter, CHARACTER_PARAMS.ban.src, GAME_STATE)
          break
      }
    }
  }
  drawMessage(GAME_STATE)
}

  function gameStatusMessage(GAME_STATE) {
  document.getElementById("gameBoard" + GAME_STATE.numberBoard).style.display =
    "none"
  document.getElementById("message" + GAME_STATE.numberBoard).style.display =
    "block"
  if (GAME_STATE.theResultOfTheGame === "gameOver") {
    document.getElementById("message" + GAME_STATE.numberBoard).innerHTML =
      "Game Over"
  } else if (GAME_STATE.theResultOfTheGame === "youWon") {
    document.getElementById("message" + GAME_STATE.numberBoard).innerHTML =
      "Congratulations! youWon!"
  }
}

function start(numberBoard) {
  clearIntervalWolves(numberBoard)
  document.getElementById("gameBoard" + numberBoard).style.display = "flex"
  document.getElementById("message" + numberBoard).style.display = "none"
  document.querySelector(".buttonsDirection" + numberBoard).style.display ="block"
  const gameSize = "select" + numberBoard
  const gameBoardSize = parseInt(document.getElementById(gameSize).value)
  const matrix = createMatrix(gameBoardSize)
   
const GAME_STATE = {
    gameArr: matrix,
    theGameContinues: true,
    theResultOfTheGame: "",
    numberBoard: numberBoard,
    interval : setInterval(() => {
               moveWolvesOnNewBox(GAME_STATE)
               drawGameArea(GAME_STATE)},2000),
  }
 
  addGameStatusToObject(GAME_STATE)
  clearGameBoard(GAME_STATE)
  wolfCount(GAME_STATE)
  banCount(GAME_STATE)
  Object.values(CHARACTER_PARAMS).map(character => setCountCharacter(GAME_STATE, character.count, character.name))
  myGameBoardSize(GAME_STATE, gameBoardSize)
  gameMovement(GAME_STATE)
  drawGameArea(GAME_STATE)
}