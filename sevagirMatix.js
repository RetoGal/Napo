const CHARACTER_PARAMS = {
  rabbit: { name: "rabbit", src: "./img/zayac.png", count: 1 },
  wolf: { name: "wolf", src: "./img/volk.png" },
  ban: { name: "ban", src: "./img/ban.png" },
  home: { name: "home", src: "./img/home.png", count: 1 },
}

const FREE = 0


function template(number){
  return `
  <div class="area" id="${'area' + number}">
       <button class="startBtn" id="${'startBtn' + number}">START</button>
            <select id="${'select' + number} " class="select">
                <option value="5">5x5</option>
                <option value="7">7*7</option>
                <option value="10">10*10</option>

            </select>
            <div class="message" id="${'message' + number}"></div>
            <div class="gameBoard" id="${'gameBoard' + number}">

            </div>
            <div class="buttons">
                <div class="divUp">
                    <button class="up" id="${'up' + number}">UP</button>
                </div>
                <div class="arrow_sides">
                    <div class="divLeft"><button class="left" id="${'left' + number}">LEFT</button> </div>
                    <div class="divRight"><button class="right" id="${'right' + number}">RIGHT</button></div>
                </div>

                <div class="divDown"> <button class="down" id="${'down' + number}">down</button></div>
            </div>
         </div>
  `
}

const DIRECTION = {
  left: document.querySelector(`#${'left' + numberBoard}`),
  right: document.querySelector(`#${'right' + numberBoard}`),
  up: document.querySelector(`#${'up' + numberBoard}`),
  down: document.querySelector(`#${'down' + numberBoard}`),
}

function creatGameBoard(GAME_STATUS) {
  let numberBoard = GAME_STATUS.numberBoard
  ++numberBoard
  const container = document.querySelector("#container")
  const template = template(number)
  const newGameArea = document.createElement("div")
  newGameArea.id = "gameArea" + numberBoard
  newGameArea.className = area
  newGameArea.innerHTML = template
  container.append(newGameArea)
}


function createMatrix(gameBoardSize) {
  return new Array(gameBoardSize)
    .fill(FREE)
    .map(() => new Array(gameBoardSize).fill(FREE))
}
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
        gameStatusMessage(GAME_STATUS.TheResultOfTheGame)
        GAME_STATUS.theGameContinues = false
        return
      } else if (matrix[z][k] === FREE) {
        result.push(freeCell)
      }
    }
  })
  return result
}
const calculateDistance = ([x1, y1], [x2, y2]) =>
  Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
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
  console.log(lengthCell, nearestСell)
  return nearestСell[index]
}

function moveWolfsOnNewBox(GAME_STATUS, character) {
  const matrix = GAME_STATUS.gameArr
  const sideWolfs = findCordinateOfCharacter(
    GAME_STATUS,
    CHARACTER_PARAMS.wolf.name
  )
  sideWolfs.forEach(item => {
    if (GAME_STATUS.theGameContinues === false) {
      return
    } else {
      const [z, k] = findNearestСell(GAME_STATUS, item, character)
      const [j, i] = item
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
    gameStatusMessage(GAME_STATUS.TheResultOfTheGame)
    GAME_STATUS.theGameContinues = false
    return
  } else if (matrix[x][y] === CHARACTER_PARAMS.home.name) {
    GAME_STATUS.TheResultOfTheGame = "youWon"
    gameStatusMessage(GAME_STATUS.TheResultOfTheGame)
    GAME_STATUS.theGameContinues = false
    console.log(GAME_STATUS)
    return
  } else if (matrix[x][y] === CHARACTER_PARAMS.ban.name) {
    matrix[x][y] = CHARACTER_PARAMS.ban.name
    matrix[rabbitX][rabbitY] = character
  }
  moveWolfsOnNewBox(GAME_STATUS, character)
}

function gameMovement(GAME_STATUS, character) {
  if(GAME_STATUS.theGameContinues === false){
    return
  }else {
    DIRECTION.right.onclick = () => {
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
    DIRECTION.left.onclick = () => {
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
    DIRECTION.up.onclick = () => {
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
    DIRECTION.down.onclick = () => {
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
const clearGameBoard = () => (document.querySelector("#gameBoard").innerHTML = "")
const myGameBoardSize = boardSize =>
  (document.querySelector("#gameBoard").style.width = boardSize * 60 + 20 + "px")
function createLitleDivForCharacter(indexesOfElementsInAMatrix) {
  const litleDiv = document.createElement("div")
  litleDiv.id = indexesOfElementsInAMatrix
  litleDiv.className = "box"
  document.querySelector("#gameBoard").append(litleDiv)
}
function putСharacterInCell(indexesOfElementsInAMatrix, imgCharacters) {
  const cellForCharacter = document.getElementById(indexesOfElementsInAMatrix)
  const NewAttributeImg = document.createElement("img")
  NewAttributeImg.src = imgCharacters
  cellForCharacter.append(NewAttributeImg)
}
function drawGameArea(GAME_STATUS) {
  const matrix = GAME_STATUS.gameArr
  clearGameBoard()
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix.length; y++) {
      const idCharacter = `${x}${y}`
      createLitleDivForCharacter(idCharacter)
      switch (matrix[x][y]) {
        case "rabbit":
          putСharacterInCell(idCharacter, CHARACTER_PARAMS.rabbit.src)
          break
        case "wolf":
          putСharacterInCell(idCharacter, CHARACTER_PARAMS.wolf.src)
          break
        case "home":
          putСharacterInCell(idCharacter, CHARACTER_PARAMS.home.src)
          break
        case "ban":
          putСharacterInCell(idCharacter, CHARACTER_PARAMS.ban.src)
          break
      }
    }
  }
}
function gameStatusMessage(status) {
  document.querySelector("#gameBoard").style.display = "none"
  document.querySelector("#message").style.display = "block"
  if (status === "gameOver") {
    document.querySelector("#message").innerHTML = "Game Over"
  } else if (status === "youWon") {
    document.querySelector("#message").innerHTML = "Congratulations! youWon!"
  }
}



document.querySelector("button").onclick = () => {
  clearGameBoard()
  document.querySelector(".buttons").style.display = "block"
  document.querySelector("#message").style.display = "none"
  document.querySelector("#gameBoard").style.display = "flex"
  const gameBoardSize = parseInt(document.querySelector("#select").value)
  const matrix = createMatrix(gameBoardSize)
  const GAME_STATUS = {
    gameArr: matrix,
    theGameContinues: true,
    TheResultOfTheGame: null,
    numberBoard: 0,
  }
  CHARACTER_PARAMS.wolf.count = Math.floor(
    (65 * GAME_STATUS.gameArr.length) / 100
  )
  CHARACTER_PARAMS.ban.count = Math.floor(
    (45 * GAME_STATUS.gameArr.length) / 100
  )
  Object.values(CHARACTER_PARAMS).map(character => {
    setCountCharacter(GAME_STATUS, character.count, character.name)
  })
  myGameBoardSize(gameBoardSize)
  gameMovement(GAME_STATUS, CHARACTER_PARAMS.rabbit.name)
  drawGameArea(GAME_STATUS)
}


document.querySelector(".newArreaBtn").onclick = newArreaBtn