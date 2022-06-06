const objImg = {
  rabbit : { name: "rabbit", src: "./img/zayac.png" },
  wolf :   { name: "wolf", src: "./img/volk.png" },
  ban :    { name: "ban", src: "./img/ban.png" },
  house :  { name : "house", src: "./img/home.png"},
  
  }
  
  
  function createGameBoard(size) {
    const out = document.querySelector(".out")
    const gameBoard = document.createElement("div")
    gameBoard.className = "gameBoard"
    gameBoard.style.width = size
    gameBoard.style.height = size
    out.append(gameBoard)
  }
  
  function createLitleDiv(length) {
    for (let i = 0; i < length; i++) {
        const litleDiv = document.createElement("div")
        litleDiv.className = "litleDiv"
        document.querySelector(".gameBoard")
            .append(litleDiv)
    }
  }
  
  function idForDiv(len) {
    const litleDivs = document.querySelectorAll(".litleDiv")
    let arr = []
    for ( let i = 0; i <= len; i++ ) {
        for ( let k = 0; k < len; k++ ) {
            if ( k == len ) {
                arr.push(`${i + 1}0`)
            } else {
                arr.push(`${i}${k}`)
            }
        }
    }
    for ( let k = 0; k < litleDivs.length; k++ ) {
        for ( let i = 0; i <= k; i++ ) {
            litleDivs[k].id = arr[i]
        }
    }
  }
  
  function addImgEmptyDiv(nameImg) {
    const image = document.createElement("img")
    const collectionDiv = document.querySelectorAll(".litleDiv")
    let random = Math.floor(Math.random() * collectionDiv.length)
    image.src = nameImg
    image.style.width = "60px"
    image.style.height = "60px"
    if ( collectionDiv[random].innerHTML == '' ) {
        collectionDiv[random].appendChild(image)
    } else {
      addImgEmptyDiv(nameImg)
    }
  }
  
  
  
  function countWolfAndBan(count,img) {
    const imgGame = img
    for ( let i = 0; i < count; i++ ) {
      addImgEmptyDiv(imgGame)
    }
  }
  
  document.querySelector("button").onclick = () => {
    const select = document.querySelector("select")
    document.querySelector(".out")
        .innerHTML = ""
    if ( select.value == 5 ) {
        let sizeBoard = "320px"
        createGameBoard(sizeBoard)
        createLitleDiv(25)
        idForDiv(5)
        addImgEmptyDiv(objImg.rabbit.src)
        addImgEmptyDiv(objImg.house.src)
        countWolfAndBan(2,objImg.ban.src)
        countWolfAndBan(3,objImg.wolf.src)
       
    } else if ( select.value == 7 ) {
        let sizeBoard = "448px"
        createGameBoard(sizeBoard)
        createLitleDiv(49)
        idForDiv(7)
        addImgEmptyDiv(objImg.rabbit.src)
        addImgEmptyDiv(objImg.house.src)
        countWolfAndBan(3,objImg.ban.src)
        countWolfAndBan(5,objImg.wolf.src)
    } else if ( select.value == 10 ) {
        let sizeBoard = "620px"
        createGameBoard(sizeBoard)
        createLitleDiv(100)
        idForDiv(10)
        addImgEmptyDiv(objImg.rabbit.src)
        addImgEmptyDiv(objImg.house.src)
        countWolfAndBan(4,objImg.ban.src)
        countWolfAndBan(6,objImg.wolf.src)
    }
  };
  
  
  



  const imgDatas = {
    rabbit: {
      name: 'nap',
      src: 'img/nap.jpg',
      count: 1,
    },
    wolf: {
      name: 'gel',
      src: 'img/wolf.jpg',
    },
    home: {
      name: 'home',
      src: 'img/home.jpg',
      count: 1,
    },
    fence: {
      name: 'fence',
      src: 'img/fence.jpg',
    },
  };
  
  let FREE_CELL = 0;
  const RABBIT = imgDatas.rabbit.name;
  const WOLF = imgDatas.wolf.name;
  const HOME = imgDatas.home.name;
  const FENCE = imgDatas.fence.name;
  const X = 0;
  const Y = 1;
  
  function start() {
    clearDivs();
    hideGameMessages();
    const value = selectValue();
    const createMass = createEmptyMass(value);
  
    imgDatas.wolf.count = Math.ceil((60 * value) / 100);
    imgDatas.fence.count = Math.ceil((40 * value) / 100);
  
    gameAreaSize(value);
    getRandomPosition(createMass);
  
    Object.values(imgDatas).map((elemnt) => {
      setCharacters(createMass, elemnt.name, elemnt.count);
    });
  
    moveRabbit(createMass, RABBIT);
    createGameArea(createMass, value);
  }
  
  function selectValue() {
    const select = parseInt(document.getElementById('gameSelect').value);
  
    return select;
  }
  
  function createEmptyMass(gameBoardSize) {
    const gameBoard = new Array(gameBoardSize)
      .fill(FREE_CELL)
      .map(() => new Array(gameBoardSize).fill(FREE_CELL));
  
    return gameBoard;
  }
  
  function getRandomPosition(gamePlaceArr) {
    let x = Math.floor(Math.random() * gamePlaceArr.length);
    let y = Math.floor(Math.random() * gamePlaceArr.length);
  
    if (gamePlaceArr[x][y] === FREE_CELL) {
      return [x, y];
    } else {
      return getRandomPosition(gamePlaceArr);
    }
  }
  
  function setHeroesAtRandomPosition(gamePlaceArr, gameHero) {
    const [x, y] = getRandomPosition(gamePlaceArr);
  
    gamePlaceArr[x][y] = gameHero;
  }
  
  function setCharacters(gamePlaceArr, character, gameHeroCount) {
    for (let i = 0; i < gameHeroCount; i++) {
      setHeroesAtRandomPosition(gamePlaceArr, character);
    }
  }
  
  function findCordOfCharacter(gamePlaceArr, character) {
    const findInGameplace = function (accumulator, row, x) {
      row.forEach((element, y) => {
        if (element === character) {
          accumulator.push([x, y]);
        }
      });
      return accumulator;
    };
    return gamePlaceArr.reduce(findInGameplace, []);
  }
  
  function keyDownLeftNew(gamePlaceArr) {
    const rabbitCord = findCordOfCharacter(gamePlaceArr, RABBIT);
  
    const newCoordData = newXnewYcoordinatesAfterKeyPress(rabbitCord);
  
    if (rabbitCord[X][Y] === FREE_CELL) {
      newCoordData.left[Y] = gamePlaceArr.length - 1;
    }
    verifyCell(gamePlaceArr, rabbitCord, newCoordData.left);
  }
  
  function keyDownRightNew(gamePlaceArr) {
    const rabbitCord = findCordOfCharacter(gamePlaceArr, RABBIT);
  
    const newCoordData = newXnewYcoordinatesAfterKeyPress(rabbitCord);
  
    if (rabbitCord[X][Y] === gamePlaceArr.length - 1) {
      newCoordData.right[Y] = FREE_CELL;
    }
    verifyCell(gamePlaceArr, rabbitCord, newCoordData.right);
  }
  
  function keyDownDownNew(gamePlaceArr) {
    const rabbitCord = findCordOfCharacter(gamePlaceArr, RABBIT);
  
    const newCoordData = newXnewYcoordinatesAfterKeyPress(rabbitCord);
  
    if (rabbitCord[X][X] === gamePlaceArr.length - 1) {
      newCoordData.down[X] = FREE_CELL;
    }
    verifyCell(gamePlaceArr, rabbitCord, newCoordData.down);
  }
  
  function keyDownUpNew(gamePlaceArr) {
    const rabbitCord = findCordOfCharacter(gamePlaceArr, RABBIT);
  
    const newCoordData = newXnewYcoordinatesAfterKeyPress(rabbitCord);
  
    if (rabbitCord[X][X] === FREE_CELL) {
      newCoordData.up[X] = gamePlaceArr.length - 1;
    }
    verifyCell(gamePlaceArr, rabbitCord, newCoordData.up);
  }
  
  function verifyCell(gamePlaceArr, rabbitCord, rabbitNewCoordinate) {
    const [x, y] = rabbitCord[X];
    const [i, j] = rabbitNewCoordinate;
  
    if (gamePlaceArr[i][j] == FREE_CELL) {
      gamePlaceArr[i][j] = RABBIT;
      gamePlaceArr[x][y] = FREE_CELL;
    } else if (gamePlaceArr[i][j] === HOME) {
      gamePlaceArr[x][y] = FREE_CELL;
      showGameMessages('win');
    } else if (gamePlaceArr[i][j] === FENCE) {
      return;
    }
    if (gamePlaceArr[i][j] === WOLF) {
      showGameMessages('gameOver');
    }
  }
  
  function moveRabbit(gamePlaceArr) {
    window.onkeydown = (event) => {
      if (event.key === 'ArrowLeft') {
        keyDownLeftNew(gamePlaceArr);
      } else if (event.key === 'ArrowRight') {
        keyDownRightNew(gamePlaceArr);
      } else if (event.key === 'ArrowDown') {
        keyDownDownNew(gamePlaceArr);
      } else if (event.key === 'ArrowUp') {
        keyDownUpNew(gamePlaceArr);
      }
      wolvesCoordinates(gamePlaceArr);
      clearDivs();
      createGameArea(gamePlaceArr);
    };
  }
  
  function newXnewYcoordinatesAfterKeyPress(rabbitcoordinates) {
    const [x, y] = rabbitcoordinates[X];
  
    const newCoordinates = {
      up: [x - 1, y],
      down: [x + 1, y],
      right: [x, y + 1],
      left: [x, y - 1],
    };
  
    return newCoordinates;
  }
  
  function wolvesCoordinates(gamePlaceArr) {
    const wolvesCordAfterStep = findCordOfCharacter(gamePlaceArr, WOLF);
  
    const coordinatesAfterRabbitStep = wolvesCordAfterStep.forEach((element) => {
  
      const singleWolf = findCellsArroundWolves(gamePlaceArr, element);
      const emtyCells = findEmptyCellsAroundWolf(gamePlaceArr, singleWolf);
      const shortDistance = shortestDistanceBox(emtyCells, gamePlaceArr);
  
      moveWolves(gamePlaceArr, element, shortDistance);
    });
  
    return coordinatesAfterRabbitStep;
  }
  
  function conditionForCells(gamePlaceArr, [x, y]) {
    return x >= 0 && x < gamePlaceArr.length && y >= 0 && y < gamePlaceArr.length;
  }
  
  function findCellsArroundWolves(gamePlaceArr, [x, y]) {
    const review = [
      [x - 1, y],
      [x + 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    const allBoxesAroundWolves = review.filter((boxes) =>
      conditionForCells(gamePlaceArr, boxes)
    );
  
    return allBoxesAroundWolves;
  }
  
  function findEmptyCellsAroundWolf(gamePlaceArr, cordsArray) {
    const emptyCellsArray = [];
  
    cordsArray.forEach((wolf) => {
      const [x, y] = wolf;
      if (gamePlaceArr[x][y] === RABBIT) {
        showGameMessages('gameOver');
      }
      if (gamePlaceArr[x][y] === FREE_CELL) {
        emptyCellsArray.push(wolf);
      }
    });
  
    return emptyCellsArray;
  }
  
  function calculateDistanceFromRabbit([x1, y1], [[x2, y2]]) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }
  
  function getDistances(emtyCells, gamePlaceArr) {
    const rabbitCord = findCordOfCharacter(gamePlaceArr, RABBIT);
    const cells = [];
  
    emtyCells.forEach((cell) => {
      cells.push(calculateDistanceFromRabbit(cell, rabbitCord));
    });
    return cells;
  }
  
  function shortestDistanceBox(emtyCells, gamePlaceArr) {
    const distanceArray = getDistances(emtyCells, gamePlaceArr);
  
    const minOfDistances = Math.min(...distanceArray);
  
    const index = distanceArray.indexOf(minOfDistances);
  
    return emtyCells[index];
  }
  
  function moveWolves(gamePlaceArr, wolvesCord, minDistanceData) {
    const [q, k] = wolvesCord;
  
    const [a, b] = minDistanceData;
  
    gamePlaceArr[a][b] = WOLF;
    gamePlaceArr[q][k] = FREE_CELL;
  }
  
  function clearDivs() {
    const place = document.getElementById('place');
    place.innerHTML = '';
  }
  
  function clearDivs() {
    const place = document.getElementById('place');
    place.innerHTML = '';
  }
  
  function gameAreaSize(gameBoardSize) {
    const gamePlace = document.getElementById('place');
    const gamePlaceSize = gameBoardSize * 60 + 20 + 'px';
    gamePlace.style.width = gamePlaceSize;
  }
  
  function createPlace(boxIndex) {
    const containerNode = document.getElementById('place');
  
    const myDiv = document.createElement('div');
  
    myDiv.setAttribute('id', boxIndex);
  
    containerNode.append(myDiv);
  }
  
  function createCharacterImage(boxIndex, characterImgSrc) {
    const imgDiv = document.getElementById(boxIndex);
  
    const img = document.createElement('img');
  
    img.src = characterImgSrc;
  
    imgDiv.append(img);
  }
  
  function createGameArea(gamePlaceArr) {
    gamePlaceArr.forEach((row, i) => {
      row.forEach((column, j) => {
        const boxIndex = '' + `${i}${j}`;
  
        if (column === FREE_CELL) {
          createPlace(boxIndex);
        }
  
        if (column === RABBIT) {
          createPlace(boxIndex);
          createCharacterImage(boxIndex, imgDatas.rabbit.src);
        }
        if (column === HOME) {
          createPlace(boxIndex);
          createCharacterImage(boxIndex, imgDatas.home.src);
        }
  
        if (column === WOLF) {
          createPlace(boxIndex);
          createCharacterImage(boxIndex, imgDatas.wolf.src);
        }
  
        if (column === FENCE) {
          createPlace(boxIndex);
          createCharacterImage(boxIndex, imgDatas.fence.src);
        }
      });
    });
  }
  
  function showGameMessages(gameStatus) {
    const mainDiv = document.getElementById('showMessage');
  
    const message = document.querySelector('#showMessage > h2');
  
    const gameBoard = document.getElementById('container');
  
    gameBoard.style.display = 'none';
  
    if (gameStatus === 'gameOver') {
      message.innerText = 'Game over';
  
    } else if (gameStatus === 'win') {
      message.innerText = 'You win';
    }
  
    mainDiv.style.display = 'block';
  }
  
  function hideGameMessages() {
    const mainDiv = document.getElementById('showMessage');
  
    mainDiv.style.display = 'none';
  
    const gameBoard = document.getElementById('container');
    
    gameBoard.style.display = 'block';
  }