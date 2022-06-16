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

function getRandomFreePosition(GAME_STATUS) {
  const matrix = GAME_STATUS.gameArr
  const x = Math.floor(Math.random() * matrix.length)
  const y = Math.floor(Math.random() * matrix.length)
  return matrix[x][y] === FREE ? [x, y] : getRandomFreePosition(GAME_STATUS)
}

function setCharacterInFreePosition(GAME_STATUS, character) {
  const matrix = GAME_STATUS.gameArr
  const [x, y] = getRandomFreePosition(GAME_STATUS)
  matrix[x][y] = character
}

function setCountCharacter(GAME_STATUS, count, character) {
  for (let i = 0; i < count; i++) {
    setCharacterInFreePosition(GAME_STATUS, character)
  }
}

function getCordinatesOfCharacter(GAME_STATUS, character) {
  const matrix = GAME_STATUS.gameArr
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

const isInRange = (GAME_STATUS, [x, y]) => x >= 0 && x < GAME_STATUS.gameArr.length &&  y >= 0 && y < GAME_STATUS.gameArr.length

function getNeighbouringCoordinates(GAME_STATUS, [x, y]) {
  const cells = [
    [x - 1, y],
    [x + 1, y],
    [x, y + 1],
    [x, y - 1],
  ]
  return cells.filter(cell => isInRange(GAME_STATUS, cell))
}

function getFreeBoxNextToWolf(GAME_STATUS, [x, y]) {
  const matrix = GAME_STATUS.gameArr
  const sidesWolf = getNeighbouringCoordinates(GAME_STATUS, [x, y])
  const result = []
  sidesWolf.forEach(freeCell => {
    const [x, y] = freeCell
   
    if (GAME_STATUS.theGameContinues === false) {
      clearInterval(GAME_STATUS.interval)
      return
    } else {
      if (matrix[x][y] === FREE) {
        result.push(freeCell)
      }
    }
  })
  return result
}

function getRabbitNextToWolf(GAME_STATUS, [x, y]) {
  const matrix = GAME_STATUS.gameArr
  const sidesWolf = getNeighbouringCoordinates(GAME_STATUS, [x, y])
  sidesWolf.forEach(freeCell => {
    const [x, y] = freeCell
    if (GAME_STATUS.theGameContinues === false) {
      clearIntervalWolves(GAME_STATUS.numberBoard)
      return
    } else {
      if (matrix[x][y] === "rabbit") {
        GAME_STATUS.theResultOfTheGame = "gameOver"
        return
      }
    }
  })
}
const calculateDistance = ([x1, y1], [x2, y2]) => Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))

function getSidesLengthThreeAngle(GAME_STATUS, [x, y], character) {

  const sidesWolf = getFreeBoxNextToWolf(GAME_STATUS, [x, y])
  const cordRabbit = getCordinatesOfCharacter(GAME_STATUS, character)[0]
  return sidesWolf.map(item => calculateDistance(item, cordRabbit))
}

function findNearestСell(GAME_STATUS, [x, y], character) {

  const lengthCell = getSidesLengthThreeAngle(GAME_STATUS, [x, y], character)
  const nearestСell = getFreeBoxNextToWolf(GAME_STATUS, [x, y])
  const min = Math.min(...lengthCell)
  const index = lengthCell.indexOf(min)

  return nearestСell[index]
}

function moveWolvesOnNewBox(GAME_STATUS, character) {
  const matrix = GAME_STATUS.gameArr
  const sideWolves = getCordinatesOfCharacter(GAME_STATUS,CHARACTER_PARAMS.wolf.name)
  sideWolves.forEach(cordinateWolves => {
    if (GAME_STATUS.theGameContinues === false) {
      clearInterval(GAME_STATUS.interval)
      return
    }
    const [XnearestСell, YnearestСell] = findNearestСell( GAME_STATUS, cordinateWolves, character )
    const [Xwolves, Ywolves] = cordinateWolves
    matrix[Xwolves][Ywolves] = FREE
    matrix[XnearestСell][YnearestСell] = CHARACTER_PARAMS.wolf.name
    getRabbitNextToWolf(GAME_STATUS, cordinateWolves)
  })
}


function moveRabbit(GAME_STATUS, character, x, y) {
  const matrix = GAME_STATUS.gameArr
  const [rabbitX, rabbitY] = getCordinatesOfCharacter(GAME_STATUS, character)[0]

  if (matrix[x][y] === FREE) {
    matrix[rabbitX][rabbitY] = FREE
    matrix[x][y] = character
  } else if (matrix[x][y] === CHARACTER_PARAMS.wolf.name) {
    GAME_STATUS.theResultOfTheGame = "gameOver"
    return
  } else if (matrix[x][y] === CHARACTER_PARAMS.home.name) {
    GAME_STATUS.theResultOfTheGame = "youWon"
    return
  } else if (matrix[x][y] === CHARACTER_PARAMS.ban.name) {
    matrix[x][y] = CHARACTER_PARAMS.ban.name
    matrix[rabbitX][rabbitY] = character
  }
}

function drawMessage(GAME_STATUS) {

if (GAME_STATUS.theResultOfTheGame !== "") {
    GAME_STATUS.theGameContinues = false
    gameStatusMessage(GAME_STATUS)
  }
}




function gameMovement(GAME_STATUS, character) {
  if (GAME_STATUS.theGameContinues === false) {
    clearInterval(GAME_STATUS.interval)
    return
  } else {
    const directionButtons = getDirectionButtons(GAME_STATUS.numberBoard)
    Object.values(directionButtons).map(arrow => {
      arrow.onclick = () => {
        const matrix = GAME_STATUS.gameArr
        const [x, y] = getCordinatesOfCharacter(GAME_STATUS, character)[0]
        let newX = x
        let newY = y
        if (arrow.id === "left" + GAME_STATUS.numberBoard) {
          y === 0 ? (newY = matrix.length - 1) : (newY = y - 1)
        } else if (arrow.id === "right" + GAME_STATUS.numberBoard) {
          y === matrix.length - 1 ? (newY = 0) : (newY = y + 1)
        } else if (arrow.id === "up" + GAME_STATUS.numberBoard) {
          x === 0 ? (newX = matrix.length - 1) : (newX = x - 1)
        } else if (arrow.id === "down" + GAME_STATUS.numberBoard) {
          x === matrix.length - 1 ? (newX = 0) : (newX = x + 1)
        }
        moveRabbit(GAME_STATUS, character, newX, newY)
        drawGameArea(GAME_STATUS)
      }
    })
  }
}

const clearGameBoard = GAME_STATUS => (document.getElementById("gameBoard" + GAME_STATUS.numberBoard).innerHTML = "")

const myGameBoardSize = (GAME_STATUS, boardSize) => (document.getElementById("gameBoard" + GAME_STATUS.numberBoard).style.width = boardSize * 60 + 20 + "px")

function createLitleDivForCharacter(GAME_STATUS, indexesOfElementsInAMatrix) {
  const litleDiv = document.createElement("div")
  litleDiv.id = indexesOfElementsInAMatrix + GAME_STATUS.numberBoard
  litleDiv.className = "box"
  document.getElementById("gameBoard" + GAME_STATUS.numberBoard).append(litleDiv)
}



function putСharacterInCell( indexesOfElementsInAMatrix, imgCharacters, GAME_STATUS) {
  const cellForCharacter = document.getElementById( indexesOfElementsInAMatrix + GAME_STATUS.numberBoard)
  const NewAttributeImg = document.createElement("img")
  NewAttributeImg.src = imgCharacters
  cellForCharacter.append(NewAttributeImg)
}

function drawGameArea(GAME_STATUS) {
  const matrix = GAME_STATUS.gameArr
  clearGameBoard(GAME_STATUS)
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix.length; y++) {
      const idCharacter = `${x}${y}`
      createLitleDivForCharacter(GAME_STATUS, idCharacter)
      switch (matrix[x][y]) {
        case "rabbit":
          putСharacterInCell(  idCharacter, CHARACTER_PARAMS.rabbit.src, GAME_STATUS )
          break
        case "wolf":
          putСharacterInCell(idCharacter, CHARACTER_PARAMS.wolf.src, GAME_STATUS )
          break
        case "home":
          putСharacterInCell( idCharacter, CHARACTER_PARAMS.home.src, GAME_STATUS)
          break
        case "ban":
          putСharacterInCell(idCharacter, CHARACTER_PARAMS.ban.src, GAME_STATUS)
          break
      }
    }
  }
  drawMessage(GAME_STATUS)
}


function addGameStatusToObject(GAME_STATUS){
INTERVAL_WOLVES[GAME_STATUS.numberBoard] = GAME_STATUS
}

function clearIntervalWolves(numberBoard) {
  if (INTERVAL_WOLVES[numberBoard]) {
       clearInterval(INTERVAL_WOLVES[numberBoard].interval)
   }}


function gameStatusMessage(GAME_STATUS) {
  document.getElementById("gameBoard" + GAME_STATUS.numberBoard).style.display =
    "none"
  document.getElementById("message" + GAME_STATUS.numberBoard).style.display =
    "block"
  if (GAME_STATUS.theResultOfTheGame === "gameOver") {
    document.getElementById("message" + GAME_STATUS.numberBoard).innerHTML =
      "Game Over"
  } else if (GAME_STATUS.theResultOfTheGame === "youWon") {
    document.getElementById("message" + GAME_STATUS.numberBoard).innerHTML =
      "Congratulations! youWon!"
  }
}

const wolfCount = GAME_STATUS => (CHARACTER_PARAMS.wolf.count = Math.floor((65 * GAME_STATUS.gameArr.length) / 100))
const banCount = GAME_STATUS => (CHARACTER_PARAMS.ban.count = Math.floor((45 * GAME_STATUS.gameArr.length) / 100))

function start(numberBoard) {
  clearIntervalWolves(numberBoard)
  document.getElementById("gameBoard" + numberBoard).style.display = "flex"
  document.getElementById("message" + numberBoard).style.display = "none"
  document.querySelector(".buttonsDirection" + numberBoard).style.display ="block"
  const gameSize = "select" + numberBoard
  const gameBoardSize = parseInt(document.getElementById(gameSize).value)
  const matrix = createMatrix(gameBoardSize)
   
const GAME_STATUS = {
    gameArr: matrix,
    theGameContinues: true,
    theResultOfTheGame: "",
    numberBoard: numberBoard,
    interval : setInterval(() => {
               moveWolvesOnNewBox(GAME_STATUS, CHARACTER_PARAMS.rabbit.name)
               drawGameArea(GAME_STATUS)
    }, 2000),
  }
 
  addGameStatusToObject(GAME_STATUS)
  clearGameBoard(GAME_STATUS)
  wolfCount(GAME_STATUS)
  banCount(GAME_STATUS)
  Object.values(CHARACTER_PARAMS).map(character => setCountCharacter(GAME_STATUS, character.count, character.name))
  myGameBoardSize(GAME_STATUS, gameBoardSize)
  gameMovement(GAME_STATUS, CHARACTER_PARAMS.rabbit.name)
  drawGameArea(GAME_STATUS)
}
