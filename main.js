const CHARACTER_PARAMS = {
  rabbit: { name: "rabbit", src: "./img/zayac.png", count: 1 },
  wolf: { name: "wolf", src: "./img/volk.png" },
  ban: { name: "ban", src: "./img/ban.png" },
  home: { name: "home", src: "./img/home.png", count: 1 },
}
const FREE = 0
let numberBoard = 0
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
function getDirection(numberBoard) {
  return (DIRECTION = {
    left: document.getElementById("left" + numberBoard),
    right: document.getElementById("right" + numberBoard),
    up: document.getElementById("up" + numberBoard),
    down: document.getElementById("down" + numberBoard),
  })
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

function startEventListeners(boardNumber) {
  const startbtn = document.getElementById("startBtn" + boardNumber)
  startbtn.addEventListener("click", () => start(boardNumber))
}

function newGameBoard() {
  numberBoard++
  creatGameBoard()
  startEventListeners(numberBoard)
 
}

const newAreaBtn = document.querySelector(".newAreaBtn")
newAreaBtn.addEventListener("click", newGameBoard)

const createMatrix = (gameBoardSize) => new Array(gameBoardSize).fill(FREE).map(() => new Array(gameBoardSize).fill(FREE))

function getRandomFreePosition(GAME_STATUS) {
  const matrix = GAME_STATUS.gameArr
  const x = Math.floor(Math.random() * matrix.length)
  const y = Math.floor(Math.random() * matrix.length)
  if (matrix[x][y] === FREE) {
    return [x, y]
  } else {
    return getRandomFreePosition(GAME_STATUS)
  }
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

function findCordinateOfCharacter(GAME_STATUS, character) {
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

function isInRange(GAME_STATUS, [x, y]) {
  const matrix = GAME_STATUS.gameArr
  return x >= 0 && x < matrix.length && y >= 0 && y < matrix.length
}

function getNeighbouringCoordinates(GAME_STATUS, [x, y]) {
  const cells = [
    [x - 1, y],
    [x + 1, y],
    [x, y + 1],
    [x, y - 1],
  ]
  return cells.filter(cell => isInRange(GAME_STATUS, cell))
}

function getRabbitNextToWolfOrFreeBox(GAME_STATUS, [x, y]) {
  const matrix = GAME_STATUS.gameArr
  const sidesWolf = getNeighbouringCoordinates(GAME_STATUS, [x, y])
  const result = []
  sidesWolf.forEach(freeCell => {
    if (GAME_STATUS.theGameContinues === false) {
      return
    } else {
      const [z, k] = freeCell
      if (matrix[z][k] === "rabbit") {
        GAME_STATUS.TheResultOfTheGame = "gameOver"
        gameStatusMessage(GAME_STATUS, "gameOver")
        GAME_STATUS.theGameContinues = false
        return
      } else if (matrix[z][k] === FREE) {
        result.push(freeCell)
      }
    }
  })
  return result
}

const calculateDistance = ([x1, y1], [x2, y2]) => Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))

function getSidesLengthThreeAngle(GAME_STATUS, [x, y], character) {
  const sidesWolf = getRabbitNextToWolfOrFreeBox(GAME_STATUS, [x, y])
  const cordRabbit = findCordinateOfCharacter(GAME_STATUS, character)[0]
  return sidesWolf.map(item => calculateDistance(item, cordRabbit))
}

function findNearestСell(GAME_STATUS, [x, y], character) {
  const lengthCell = getSidesLengthThreeAngle(GAME_STATUS, [x, y], character)
  const nearestСell = getRabbitNextToWolfOrFreeBox(GAME_STATUS, [x, y])
  const min = Math.min(...lengthCell)
  const index = lengthCell.indexOf(min)
  return nearestСell[index]
}

function moveWolfsOnNewBox(GAME_STATUS, character) {
  const matrix = GAME_STATUS.gameArr
  const sideWolfs = findCordinateOfCharacter(
    GAME_STATUS,
    CHARACTER_PARAMS.wolf.name
  )
  sideWolfs.forEach(corditateWolfs => {
    if (GAME_STATUS.theGameContinues === false) {
      return
    } else {
      const [z, k] = findNearestСell(GAME_STATUS, corditateWolfs, character)
      const [j, i] = corditateWolfs
      matrix[j][i] = FREE
      matrix[z][k] = CHARACTER_PARAMS.wolf.name
    }
  })
}

function moveRabbit(GAME_STATUS, character, x, y) {
  const matrix = GAME_STATUS.gameArr
  const [rabbitX, rabbitY] = findCordinateOfCharacter(GAME_STATUS, character)[0]
  if (matrix[x][y] === FREE) {
    matrix[rabbitX][rabbitY] = FREE
    matrix[x][y] = character
  } else if (matrix[x][y] === CHARACTER_PARAMS.wolf.name) {
    GAME_STATUS.TheResultOfTheGame = "gameOver"
    gameStatusMessage(GAME_STATUS, "gameOver")
    GAME_STATUS.theGameContinues = false
    return
  } else if (matrix[x][y] === CHARACTER_PARAMS.home.name) {
    GAME_STATUS.TheResultOfTheGame = "youWon"
    gameStatusMessage(GAME_STATUS, "youWon")
    GAME_STATUS.theGameContinues = false
    return
  } else if (matrix[x][y] === CHARACTER_PARAMS.ban.name) {
    matrix[x][y] = CHARACTER_PARAMS.ban.name
    matrix[rabbitX][rabbitY] = character
  }
  moveWolfsOnNewBox(GAME_STATUS, character)
}

function gameMovement(GAME_STATUS, character) {
  if (GAME_STATUS.theGameContinues === false) {
    return
  } else {
    const direction = getDirection(GAME_STATUS.numberBoard)
    direction.right.onclick = () => {
      const matrix = GAME_STATUS.gameArr
      const [x, y] = findCordinateOfCharacter(GAME_STATUS, character)[0]
      let newX = x
      let newY = y + 1
      if (y === matrix.length - 1) {
        newY = 0
      }
      moveRabbit(GAME_STATUS, character, newX, newY)
      drawGameArea(GAME_STATUS)
    }

    direction.left.onclick = () => {
      
      const matrix = GAME_STATUS.gameArr
      const [x, y] = findCordinateOfCharacter(GAME_STATUS, character)[0]
      let newX = x
      let newY = y - 1
      if (y === 0) {
        newY = matrix.length - 1
      }
      moveRabbit(GAME_STATUS, character, newX, newY)
      drawGameArea(GAME_STATUS)
    }

    direction.up.onclick = () => {
      const matrix = GAME_STATUS.gameArr
      const [x, y] = findCordinateOfCharacter(GAME_STATUS, character)[0]
      let newX = x - 1
      let newY = y
      if (x === 0) {
        newX = matrix.length - 1
      }
      moveRabbit(GAME_STATUS, character, newX, newY)
      drawGameArea(GAME_STATUS)
    }

    direction.down.onclick = () => {
      const matrix = GAME_STATUS.gameArr
      const [x, y] = findCordinateOfCharacter(GAME_STATUS, character)[0]
      let newX = x + 1
      let newY = y
      if (x === matrix.length - 1) {
        newX = 0
      }
      moveRabbit(GAME_STATUS, character, newX, newY)
      drawGameArea(GAME_STATUS)
    }
  }
}

const clearGameBoard = GAME_STATUS => (document.getElementById("gameBoard" + GAME_STATUS.numberBoard).innerHTML = "")

const myGameBoardSize = (GAME_STATUS, boardSize) =>
  (document.getElementById("gameBoard" + GAME_STATUS.numberBoard).style.width =
    boardSize * 60 + 20 + "px")

function createLitleDivForCharacter(GAME_STATUS, indexesOfElementsInAMatrix) {
  const litleDiv = document.createElement("div")
  litleDiv.id = indexesOfElementsInAMatrix + GAME_STATUS.numberBoard
  litleDiv.className = "box"
  document.getElementById("gameBoard" + GAME_STATUS.numberBoard).append(litleDiv)
}

function putСharacterInCell(
  indexesOfElementsInAMatrix,
  imgCharacters,
  GAME_STATUS
) {
  const cellForCharacter = document.getElementById(
    indexesOfElementsInAMatrix + GAME_STATUS.numberBoard
  )
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
          putСharacterInCell(
            idCharacter,
            CHARACTER_PARAMS.rabbit.src,
            GAME_STATUS
          )
          break
        case "wolf":
          putСharacterInCell(
            idCharacter,
            CHARACTER_PARAMS.wolf.src,
            GAME_STATUS
          )
          break
        case "home":
          putСharacterInCell(
            idCharacter,
            CHARACTER_PARAMS.home.src,
            GAME_STATUS
          )
          break
        case "ban":
          putСharacterInCell(idCharacter, CHARACTER_PARAMS.ban.src, GAME_STATUS)
          break
      }
    }
  }
}

function gameStatusMessage(GAME_STATUS, status) {
  document.getElementById("gameBoard" + GAME_STATUS.numberBoard).style.display =
    "none"
  document.getElementById("message" + GAME_STATUS.numberBoard).style.display =
    "block"
  if (status === "gameOver") {
    document.getElementById("message" + GAME_STATUS.numberBoard).innerHTML =
      "Game Over"
  } else if (status === "youWon") {
    document.getElementById("message" + GAME_STATUS.numberBoard).innerHTML =
      "Congratulations! youWon!"
  }
}

const wolfCount = GAME_STATUS =>  (CHARACTER_PARAMS.wolf.count = Math.floor((65 * GAME_STATUS.gameArr.length) / 100))
const banCount = GAME_STATUS =>(CHARACTER_PARAMS.ban.count = Math.floor((45 * GAME_STATUS.gameArr.length) / 100))

function start(numberBoard) {
  document.getElementById("gameBoard" + numberBoard).style.display ="flex"
  document.getElementById("message" + numberBoard).style.display = "none"
  document.querySelector(".buttonsDirection" + numberBoard).style.display = "block"
  const gameSize = "select" + numberBoard
  const gameBoardSize = parseInt(document.getElementById(gameSize).value)
  const matrix = createMatrix(gameBoardSize)
  const GAME_STATUS = {
    gameArr: matrix,
    theGameContinues: true,
    TheResultOfTheGame: null,
    numberBoard: numberBoard,
  }

 
  clearGameBoard(GAME_STATUS)
  wolfCount(GAME_STATUS)
  banCount(GAME_STATUS)
  Object.values(CHARACTER_PARAMS).map(character =>
    setCountCharacter(GAME_STATUS, character.count, character.name)
  )
  myGameBoardSize(GAME_STATUS, gameBoardSize)
  gameMovement(GAME_STATUS, CHARACTER_PARAMS.rabbit.name)
  drawGameArea(GAME_STATUS)
}

const id = 5
const gameSate = 4
console.log(`${id}${gameSate}`)