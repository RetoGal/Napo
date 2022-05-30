const objImg = {
  rabbit: { name: "rabbit", src: "./img/zayac.png", id: 1 },
  wolf: { name: "wolf", src: "./img/volk.png", id: 2 },
  ban: { name: "ban", src: "./img/ban.png", id: 3 },
  house: { name: "house", src: "./img/home.png", id: 4 },
};

// function createGameBoard(size) {
//   const out = document.querySelector(".out");
//   const gameBoard = document.createElement("div");
//   gameBoard.className = "gameBoard";
//   gameBoard.style.width = size;
//   gameBoard.style.height = size;
//   out.append(gameBoard);
// }

// function createLitleDiv(length) {
//   for (let i = 0; i < length; i++) {
//     const litleDiv = document.createElement("div");
//     litleDiv.className = "litleDiv";
//     document.querySelector(".gameBoard").append(litleDiv);
//   }
// }


// function idForDiv(len) {
//   const litleDivs = document.querySelectorAll(".litleDiv")
//   let arr = []
//   for ( let i = 0; i <= len; i++ ) {
//       for ( let k = 0; k < len; k++ ) {
//           if ( k == len ) {
//               arr.push(`${i + 1}0`)
//           } else {
//               arr.push(`${i}${k}`)
//           }
//       }
//   }
//   for ( let k = 0; k < litleDivs.length; k++ ) {
//       for ( let i = 0; i <= k; i++ ) {
//           litleDivs[k].id = arr[i]
//       }
//   }
// }

function createMatrix() {
  const select = parseInt(document.querySelector("select").value);
  const matrix = new Array(select)
    .fill(null)
    .map(() => new Array(select).fill(null));

   
  return matrix;
}




function setRabbit() {
  const arr = createMatrix();
  const rnd =  Math.floor(Math.random() * arr.length);
  
  if (arr[rnd][rnd] === null) {
    arr[rnd][rnd] = objImg.rabbit.name;
  } 
  else {
    setRabbit() 
  }
  
  return arr
}

function setWolf() {
  const arr = setRabbit() ;
  const rnd = Math.floor(Math.random() * arr.length);;
  
  if (arr[rnd][rnd] === null) {
    arr[rnd][rnd] = objImg.wolf.name;
  } 
 
  else {
    setWolf()
  }
  console.log(arr)
}


function countImg(len){
  for( let i = 0; i < len; i++)
}



document.querySelector("button").onclick = () => {
  const select = document.querySelector("select");

  if (select.value == 5) {
    
    createMatrix();
    setRabbit();
    setWolf();

  }
};
