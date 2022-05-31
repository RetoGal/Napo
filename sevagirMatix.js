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




function keyDownArrowRight(array, character) {
  const [x, y] = findCordinateOfCharacter(array, character);
  if (array[x][y + 1] === FREE ) {
    array[x][y] = FREE;
    array[x][y + 1] = character;
  }else if(array[x][y + 1] === objImg.wolf.name){
    alert("game over")
  }else if(array[x][y + 1] === objImg.home.name ) {
    alert("Congratulations! You Won!")
  }else if(array[x][y + 1] === objImg.ban.name){
    array[x][y + 1] = objImg.ban.name
    array[x][y] = character
  }else if(array[x][y] === array[x][4] && array[x][0] === FREE) {
    array[x][y] = FREE
    array[x][0] = character
  }
}

function keyDownArrowLeft(array, character) {
  const [x, y] = findCordinateOfCharacter(array, character);
  if (array[x][y - 1] === FREE) {
    array[x][y] = FREE;
    array[x][y - 1] = character;
 }else if(array[x][y - 1] === objImg.wolf.name){
  alert("game over")
} else if(array[x][y - 1] === objImg.home.name ) {

  alert("Congratulations! You Won!")
}else if(array[x][y - 1] === objImg.ban.name){
  array[x][y - 1] = objImg.ban.name
  array[x][y] = character
}
}

function keyDownArrowUp(array, character) {
  const [x, y] = findCordinateOfCharacter(array, character);
  if (array[x - 1][y] === FREE) {
    array[x][y] = FREE;
    array[x - 1][y] = character;
  }else if(array[x - 1][y] === objImg.wolf.name){
    alert("game over")
  }else if(array[x - 1][y] === objImg.home.name){
    alert("Congratulations! You Won!")
  }else if(array[x - 1][y] === objImg.ban.name){
    array[x][y - 1] = objImg.ban.name
    array[x][y] = character
  }
}

function keyDownArrowDown(array, character) {
  const [x, y] = findCordinateOfCharacter(array, character);
  if (array[x + 1][y] === FREE) {
    array[x][y] = FREE;
    array[x + 1][y] = character;
  }else if(array[x + 1][y] === objImg.wolf.name){
    alert("game over")
  }else if(array[x + 1][y] === objImg.home.name){
    alert("Congratulations! You Won!")
  }else if(array[x + 1][y] === objImg.ban.name){
    array[x + 1][y] = objImg.ban.name
    array[x][y] = character
  
}
}

function rabbitMovements(array, character) {
  window.onkeydown = () => {
    // console.log(array[x][y])
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
  const gameBoardSize = parseInt(document.querySelector("select").value);
  const matrix = createMatrix(gameBoardSize);
  objImg.wolf.count = Math.floor((65 * matrix.length) / 100);
  objImg.ban.count = Math.floor((45 * matrix.length) / 100);

  Object.values(objImg).map(character => {
    setCountCharacter(matrix, character.count, character.name);
  });

  console.log(matrix);
  rabbitMovements(matrix, objImg.rabbit.name);
  // console.log(findCordinateOfCharacter(matrix, objImg.rabbit.name))
}
