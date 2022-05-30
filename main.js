const objImg = {
  rabbit: { name: "rabbit", src: "./img/zayac.png" },
  wolf: { name: "wolf", src: "./img/volk.png" },
  ban: { name: "ban", src: "./img/ban.png" },
  home: { name: "home", src: "./img/home.png" },
};

function createMatrix() {
  const select = parseInt(document.querySelector("select").value);
  const matrix = new Array(select)
    .fill(null)
    .map(() => new Array(select).fill(null));

  return matrix;
}

function setRabbit() {
  const arr = createMatrix();
  const rnd = Math.floor(Math.random() * arr.length);

  if (arr[rnd][rnd] === null) {
    arr[rnd][rnd] = objImg.rabbit.name;
  } else {
    setRabbit();
  }

  return arr;
}

function setWolf() {
  const arr = setRabbit();
  const rnd = Math.floor(Math.random() * arr.length);

  if (arr[rnd][rnd] === null) {
    arr[rnd][rnd] = objImg.wolf.name;
  } else {
    setWolf();
  }

  return arr;
}

function setBan() {
  const arr = setWolf();
  const rnd = Math.floor(Math.random() * arr.length);

  if (arr[rnd][rnd] === null) {
    arr[rnd][rnd] = objImg.ban.name;
  } else {
    setBan();
  }
  console.log(arr);
}

document.querySelector("button").onclick = () => {
  const select = document.querySelector("select");

  if (select.value == 5) {
    createMatrix();
    setRabbit();
    setWolf();
    setBan();
  }
};
