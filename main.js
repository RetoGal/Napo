const objImg = {
  rabbit: { name: "rabbit", src: "./img/zayac.png" },
  wolf: { name: "wolf", src: "./img/volk.png" },
  ban: { name: "ban", src: "./img/ban.png" },
  home: { name: "home", src: "./img/home.png" },
};

const matrix = createMatrix();
const wolfCount = Math.floor((65 * matrix.length) / 100);
const banCount = Math.floor((45 * matrix.length) / 100);

function createMatrix() {
  const select = parseInt(document.querySelector("select").value);
  const matrix = new Array(select)
    .fill(null)
    .map(() => new Array(select).fill(null));

  return matrix;
}

function setRandomPosition ( arr, gameHero ) {
  const x = Math.floor(Math.random() * arr.length);
  const y = Math.floor(Math.random() * arr.length);

  if ( arr[x][y] === null ) {
    arr[x][y] = gameHero;
  } else {
    setRandomPosition( arr, gameHero );
  }
}

function countWolfAndBan ( arr, count, gameHero ) {
  for ( let i = 0; i < count; i++ ) {
    setRandomPosition( arr, gameHero );
  }
}

document.querySelector("button").onclick = () => {
  const select = document.querySelector("select");

  if (select.value == 5) {
    const matrix = createMatrix();
    const wolfCount = Math.floor((65 * matrix.length) / 100);
    const banCount = Math.floor((45 * matrix.length) / 100);
    setRandomPosition(matrix, objImg.rabbit.name);
    setRandomPosition(matrix, objImg.home.name);
    countWolfAndBan(matrix, wolfCount, objImg.wolf.name);
    countWolfAndBan(matrix, banCount, objImg.ban.name);
    console.log(matrix);
  }
};
