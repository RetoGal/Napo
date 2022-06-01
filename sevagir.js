

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
  
  
  



