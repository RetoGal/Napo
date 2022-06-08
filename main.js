const CHARACTER_PARAMS = {
  rabbit: { name: "rabbit", src: "./img/zayac.png", count: 1 },
  wolf: { name: "wolf", src: "./img/volk.png" },
  ban: { name: "ban", src: "./img/ban.png" },
  home: { name: "home", src: "./img/home.png", count: 1 },
}
const FREE = 0
function createMatrix(gameBoardSize) {
  return new Array(gameBoardSize)
    .fill(FREE)
    .map(() => new Array(gameBoardSize).fill(FREE))
}
function getRandomFreePosition(arr) {
  const x = Math.floor(Math.random() * arr.length)
  const y = Math.floor(Math.random() * arr.length)
  if (arr[x][y] === FREE) {
    return [x, y]
  } else {
    return getRandomFreePosition(arr)
  }
}
function setCharacterInFreePosition(arr, character) {
  const [x, y] = getRandomFreePosition(arr)
  arr[x][y] = character
}
function setCountCharacter(arr, count, character) {
  for (let i = 0; i < count; i++) {
    setCharacterInFreePosition(arr, character)
  }
}
function findCordinateOfCharacter(array, character) {
  const cordsCharacter = []
  for (let x = 0; x < array.length; x++) {
    for (let y = 0; y < array.length; y++) {
      if (array[x][y] === character) {
        cordsCharacter.push([x, y])
      }
    }
  }
  return cordsCharacter
}
function isInRange(array, [x, y]) {
  return x >= 0 && x < array.length && y >= 0 && y < array.length
}
function getNeighbouringCoordinates(array, [x, y]) {
  const cells = [
    [x - 1, y],
    [x + 1, y],
    [x, y + 1],
    [x, y - 1],
  ]
  return cells.filter(cell => isInRange(array, cell))
}
function getRabbitNextToWolfOrFreeBox(array, [x, y]) {
  const sidesWolf = getNeighbouringCoordinates(array, [x, y])
  const result = []
  sidesWolf.forEach(freeCell => {
    const [z, k] = freeCell
    if (array[z][k] === "rabbit") {
      gameStatusMessage("gameOver")
    }
    if (array[z][k] === FREE) {
      result.push(freeCell)
    }
  })
  return result
}
const calculateDistance = ([x1, y1], [x2, y2]) =>
  Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
function getSidesLengthThreeAngle(array, [x, y], character) {
  const sidesWolf = getRabbitNextToWolfOrFreeBox(array, [x, y])
  const cordRabbit = findCordinateOfCharacter(array, character)[0]
  return sidesWolf.map(item => calculateDistance(item, cordRabbit))
}
function findNearestСell(array, [x, y], character) {
  const lengthCell = getSidesLengthThreeAngle(array, [x, y], character)
  const nearestСell = getRabbitNextToWolfOrFreeBox(array, [x, y])
  const min = Math.min(...lengthCell)
  const index = lengthCell.indexOf(min)
  return nearestСell[index]
}
function moveWolfsOnNewBox(array, character) {
  const sideWolfs = findCordinateOfCharacter(array, CHARACTER_PARAMS.wolf.name)
  sideWolfs.forEach(item => {
    const [z, k] = findNearestСell(array, item, character)
    const [j, i] = item
    array[j][i] = FREE
    array[z][k] = CHARACTER_PARAMS.wolf.name
  })
}
function moveRabbit(array, character, x, y) {
  const [rabbitX, rabbitY] = findCordinateOfCharacter(array, character)[0]
  if (array[x][y] === FREE) {
    array[rabbitX][rabbitY] = FREE
    array[x][y] = character
  } else if (array[x][y] === CHARACTER_PARAMS.wolf.name) {
    gameStatusMessage("gameOver")
  } else if (array[x][y] === CHARACTER_PARAMS.home.name) {
    gameStatusMessage("youWon")
  } else if (array[x][y] === CHARACTER_PARAMS.ban.name) {
    array[x][y] = CHARACTER_PARAMS.ban.name
    array[rabbitX][rabbitY] = character
  }
  moveWolfsOnNewBox(array, character)
}
function gameMovement(array, character) {
  window.onkeydown = event => {
    const [x, y] = findCordinateOfCharacter(array, character)[0]
    let newX = x
    let newY = y
    if (event.key === "ArrowRight") {
      newY = y + 1
      if (y === array.length - 1) {
        newY = 0
      }
    } else if (event.key === "ArrowLeft") {
      newY = y - 1
      if (y === 0) {
        newY = array.length - 1
      }
    } else if (event.key === "ArrowUp") {
      newX = x - 1
      if (x === 0) {
        newX = array.length - 1
      }
    } else if (event.key === "ArrowDown") {
      newX = x + 1
      if (x === array.length - 1) {
        newX = 0
      }
    }
    moveRabbit(array, character, newX, newY)
    drawGameArea(array)
  }
}
const clearGameBoard = () => (document.querySelector(".out").innerHTML = "")
const myGameBoardSize = boardSize =>
  (document.querySelector(".out").style.width = boardSize * 60 + 20 + "px")
function createLitleDivForCharacter(indexesOfElementsInAMatrix) {
  const litleDiv = document.createElement("div")
  litleDiv.id = indexesOfElementsInAMatrix
  litleDiv.className = "box"
  document.querySelector(".out").append(litleDiv)
}
function putСharacterInCell(indexesOfElementsInAMatrix, imgCharacters) {
  const cellForCharacter = document.getElementById(indexesOfElementsInAMatrix)
  const NewAttributeImg = document.createElement("img")
  NewAttributeImg.src = imgCharacters
  cellForCharacter.append(NewAttributeImg)
}
function drawGameArea(matrix) {
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
  document.querySelector(".out").style.display = "none"
  document.querySelector(".message").style.display = "block"
  if (status === "gameOver") {
    document.querySelector(".message").innerHTML = "Game Over"
  } else if (status === "youWon") {
    document.querySelector(".message").innerHTML = "Congratulations! youWon!"
  }
}
document.querySelector("button").onclick = () => {
  clearGameBoard()
  document.querySelector(".message").style.display = "none"
  document.querySelector(".out").style.display = "flex"
  const gameBoardSize = parseInt(document.querySelector("select").value)
  const matrix = createMatrix(gameBoardSize)
  const GAME_STATUS = {
    gameArr: matrix,
    theGameContinues: true,
    TheResultOfTheGame: null,
  }
 CHARACTER_PARAMS.wolf.count = Math.floor(
    (65 * GAME_STATUS.gameArr.length) / 100
  )
  CHARACTER_PARAMS.ban.count = Math.floor(
    (45 * GAME_STATUS.gameArr.length) / 100
  )
  Object.values(CHARACTER_PARAMS).map(character => {
    setCountCharacter(GAME_STATUS.gameArr, character.count, character.name)
  })
  myGameBoardSize(gameBoardSize)
  gameMovement(GAME_STATUS.gameArr, CHARACTER_PARAMS.rabbit.name)
  drawGameArea(GAME_STATUS.gameArr)
}
