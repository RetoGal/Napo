const objImg = {
  rabbit: { name: "rabbit", src: "./img/zayac.png", count: 1 },
  wolf: { name: "wolf", src: "./img/volk.png" },
  ban: { name: "ban", src: "./img/ban.png" },
  home: { name: "home", src: "./img/home.png", count: 1 },
};

const FREE = 0;

function createMatrix(gameBoardSize) {
  return new Array(gameBoardSize)
    .fill(FREE)
    .map(() => new Array(gameBoardSize).fill(FREE));
}

function GetRandomFreePosition(arr) {
  const x = Math.floor(Math.random() * arr.length);
  const y = Math.floor(Math.random() * arr.length);

  if (arr[x][y] === FREE) {
    return [x, y];
  } else {
    return GetRandomFreePosition(arr);
  }
}

function setCharacterInFreePosition(arr, character) {
  const [x, y] = GetRandomFreePosition(arr);
  arr[x][y] = character;
}

function setCountCharacter(arr, count, character) {
  for (let i = 0; i < count; i++) {
    setCharacterInFreePosition(arr, character);
  }
}

function findCordinateOfCharacter(array, character) {
  for (let i = 0; i < array.length; i++) {
    for (let k = 0; k < array.length; k++) {
      if (array[i][k] === character) {
        return [i, k];
      }
    }
  }
}

function getCordinateWolfs(array) {
  const arrayWolfs = [];
  for (let i = 0; i < array.length; i++) {
    for (let k = 0; k < array.length; k++) {
      if (array[i][k] === objImg.wolf.name) {
        arrayWolfs.push([i, k]);
      }
    }
  }
  return arrayWolfs;
}

function checkSideWolf(array, [x, y]) {
  return x >= 0 && x < array.length && y >= 0 && y < array.length;
}

function getSideWolf(array, [x, y]) {
  const wolfSides = [
    [x - 1, y],
    [x + 1, y],
    [x, y + 1],
    [x, y - 1],
  ];
  const space = wolfSides.filter(wolfSide => checkSideWolf(array, wolfSide));

  return space;
}

function getRabbitNextToWolfOrFreeBox(array,[x, y]) {
  const sidesWolf = getSideWolf(array, [x, y]);
// console.log(x, y)
  const result = [];
  sidesWolf.forEach((freeCell) => {
    const [z,k] = freeCell
    if (array[z][k] === "rabbit") {
      // console.log(array)
      alert("game over");
    } if (array[z][k] === FREE) {
     
      result.push(freeCell);
    }
  });
  return result
}




function pythagorean([x1, y1], [x2, y2]){
  return Math.round(Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)));
}



function getSidesLengthThreeAngle(array, [x, y],character){
  const sidesWolf = getRabbitNextToWolfOrFreeBox(array,[x, y]) ;
  const cordRabbit = findCordinateOfCharacter(array, character)
  const result = []
  sidesWolf.forEach(item => {

      result.push(pythagorean(item, cordRabbit))
  })
  return result
}

function findСloseСell(array, [x, y],character){
const lengthCell = getSidesLengthThreeAngle(array, [x, y],character)
const closeCell = getRabbitNextToWolfOrFreeBox(array,[x, y])
const min = Math.min(...lengthCell);
const index = lengthCell.indexOf(min);

return closeCell[index]

}



function moveWolfsOnNewBox(array, character){
  const sideWolfs = getCordinateWolfs(array)
   

  sideWolfs.forEach((item )=> {
    const [z, k] = findСloseСell(array, item,character)
    const [j, i] = item
    console.log([j, i],[z, k])
    array[j][i] = FREE
    array[z][k] = objImg.wolf.name
})
  
}



function keyDownArrowRight(array, character) {
  const [x, y] = findCordinateOfCharacter(array, character);

  let yCordinate = y + 1;

  if (y === array.length - 1) {
    yCordinate = 0;
  }

  if (array[x][yCordinate] === FREE) {
    array[x][y] = FREE;
    array[x][yCordinate] = character;
  } else if (array[x][yCordinate] === objImg.wolf.name) {
    alert("game over");
  } else if (array[x][yCordinate] === objImg.home.name) {
    alert("Congratulations! You Won!");
  } else if (array[x][yCordinate] === objImg.ban.name) {
    array[x][yCordinate] = objImg.ban.name;
    array[x][y] = character;
  }

  
  moveWolfsOnNewBox(array, character)

}

function keyDownArrowLeft(array, character) {
  const [x, y] = findCordinateOfCharacter(array, character);
  let yCordinate = y - 1;
  if (y === 0) {
    yCordinate = array.length - 1;
  }

  if (array[x][yCordinate] === FREE) {
    array[x][y] = FREE;
    array[x][yCordinate] = character;
  } else if (array[x][yCordinate] === objImg.wolf.name) {
    alert("game over");
  } else if (array[x][yCordinate] === objImg.home.name) {
    alert("Congratulations! You Won!");
  } else if (array[x][yCordinate] === objImg.ban.name) {
    array[x][yCordinate] = objImg.ban.name;
    array[x][y] = character;
  }
}

function keyDownArrowUp(array, character) {
  const [x, y] = findCordinateOfCharacter(array, character);
  let xCordinat = x - 1;
  if (x === 0) {
    xCordinat = array.length - 1;
  }

  if (array[xCordinat][y] === FREE) {
    array[x][y] = FREE;
    array[xCordinat][y] = character;
  } else if (array[xCordinat][y] === objImg.wolf.name) {
    alert("game over");
  } else if (array[xCordinat][y] === objImg.home.name) {
    alert("Congratulations! You Won!");
  } else if (array[xCordinat][y] === objImg.ban.name) {
    array[xCordinat][y] = objImg.ban.name;
    array[x][y] = character;
  }
}

function keyDownArrowDown(array, character) {
  const [x, y] = findCordinateOfCharacter(array, character);
  let xCordinat = x + 1;

  if (x === array.length - 1) {
    xCordinat = 0;
  }

  if (array[xCordinat][y] === FREE) {
    array[x][y] = FREE;
    array[xCordinat][y] = character;
  } else if (array[xCordinat][y] === objImg.wolf.name) {
    alert("game over");
  } else if (array[xCordinat][y] === objImg.home.name) {
    alert("Congratulations! You Won!");
  } else if (array[xCordinat][y] === objImg.ban.name) {
    array[xCordinat][y] = objImg.ban.name;
    array[x][y] = character;
  }
}

function rabbitMovements(array, character) {
  window.onkeydown = () => {
   
    
    if (event.key === "ArrowRight") {
      keyDownArrowRight(array, character);
     
      console.log(array);
      
    } else if (event.key === "ArrowLeft") {
      keyDownArrowLeft(array, character);
      console.log(array);
      
    } else if (event.key === "ArrowUp") {
      keyDownArrowUp(array, character);
      console.log(array);
     
    } else if (event.key === "ArrowDown") {
      keyDownArrowDown(array, character);
      console.log(array);
     
    }
  };
}

document.querySelector("button").onclick = () => {
  const gameBoardSize = parseInt(document.querySelector("select").value)
  const matrix = createMatrix(gameBoardSize)
  objImg.wolf.count = Math.floor((65 * matrix.length) / 100)
  objImg.ban.count = Math.floor((45 * matrix.length) / 100)

  Object.values(objImg).map(character => {
    setCountCharacter(matrix, character.count, character.name)
  });

  console.log(matrix)

  rabbitMovements(matrix, objImg.rabbit.name)

};
