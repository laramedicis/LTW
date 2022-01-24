

window.onload = (event) => {
  var mainMenuBars = document.getElementById('main-menu-bars');
  var mainMenu = document.getElementById('main-menu');
  var login = document.getElementById('login');
  var loginOverlay = document.getElementById('game-login');
  var pageMask = document.getElementById('page-mask');
  var configForm = document.getElementById('game-configuration-form');
  var registerForm = document.getElementById('register-form');

  var createAccount = document.getElementById('new-account');

  var initialiazerSeedsArray = document.getElementsByClassName("initializer-seed");

  var openOverlays = Array.from(document.getElementsByClassName('open-overlay'));
  var gameOverlays = document.getElementsByClassName('game-overlay');
  var closeButtons = document.getElementsByClassName('close-button');
  var pageNavButtons = document.getElementsByClassName('page-nav-button');
  var gameBoard;

  var registerButton = document.getElementById("register-button");



  function generateRandomPoint(seed, circleHeight, circleWidth){


    var xCenter = circleWidth/4;
    var yCenter = circleHeight/4;
    var radius = circleWidth/4;

    var randAngle = Math.random() * 2 * Math.PI;
    var hypotenuse = Math.sqrt(Math.random()) * radius;
    var adjacent = Math.cos(randAngle) * hypotenuse;
    var opposite = Math.sin(randAngle) * hypotenuse;

    seed.style.left = (xCenter+adjacent).toString() + "%";
    seed.style.top = (yCenter+opposite).toString() + "%";


  }


  function randomizeInitializerSeedPositions(){


      for (var i=0; i<initialiazerSeedsArray.length; i++){
        var seed = initialiazerSeedsArray[i];
        var pit = initialiazerSeedsArray[i].parentElement;
        generateRandomPoint(seed, pit.clientHeight, pit.clientWidth);
      }
  }

  randomizeInitializerSeedPositions();



  mainMenuBars.addEventListener("click", function(e){

    e.preventDefault();
    mainMenu.classList.toggle('closed');
    mainMenu.classList.toggle('open');

  });

  login.addEventListener("click", function(e){
    for (var j = 0; j < gameOverlays.length; j++){
      if (gameOverlays[j].id != "game-login"){
        gameOverlays[j].style.display = "none";
      }
    }
    loginOverlay.style.display = "flex";
    pageMask.style.display = "block";
  });

  for (var i = 0; i < openOverlays.length; i++) {
    openOverlays[i].addEventListener('click', function(e){
      var index = openOverlays.indexOf(e.target);
      for (var j = 0; j < gameOverlays.length; j++){
        if (j != index){
          gameOverlays[j].style.display = "none";
        }
      }
      gameOverlays[index].style.display = "flex";
      pageMask.style.display = "block";
    });
  }

  for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', function(e){
      var parentElement = e.target.parentElement;
      parentElement.style.display = "none";
      pageMask.style.display = "none";
    });
  }

  for (var i = 0; i < pageNavButtons.length; i++) {
    pageNavButtons[i].addEventListener('click', function(e){

      e.target.parentElement.parentElement.style.display = "none";

      if (e.target.classList.contains("next-page")){
        console.log(e.target.parentElement.nextElementSibling);
        e.target.parentElement.parentElement.nextElementSibling.style.display = "block";
      }
      else {
        e.target.parentElement.parentElement.previousElementSibling.style.display = "block";
      }
    });
  }

  function buildSeeds(pit, seeds){
    for (var i = 0; i < seeds; i++){
      var seed = document.createElement("DIV");
      seed.classList.add("seed");
      seed.style.width = "20%";
      seed.style.paddingTop = "20%";
      pit.appendChild(seed);

      generateRandomPoint(seed, pit.clientHeight, pit.clientWidth);
    }
    return 0;


  }

  function buildPits(row, pits, seeds, player, invertedIndex=false){
    var pitWidthValue = 100/pits;
    var pitWidth = pitWidthValue.toString() + "%";
    for (var j = 0; j < pits; j++){
      var pit = document.createElement("DIV");
      pit.classList.add("pit");
      pit.setAttribute('player',player);
      pit.setAttribute('pitIndex', invertedIndex? pits-1-j : j);
      pit.innerHTML=seeds[j];
      pit.style.width = pitWidth;
      pit.style.paddingTop = pitWidth;
      buildSeeds(pit, seeds[j]);
      row.appendChild(pit);
    }
    return 0;
  }

  function buildBoard(board,numPits){
    var rows = document.getElementsByClassName('row');
    let players = Object.keys(board.sides);
    let stores = document.getElementsByClassName('storage');
    for(let i=0;i<2;++i){
      rows[i].innerHTML = '';
      buildPits(rows[i], numPits, board.sides[players[i]].pits, players[i],i==0);
      stores[i].style.color="bisque";
      stores[i].textContent=board.sides[players[i]].store;
      if(board.gameOver){
        if(board.sides.players[i].store > board.sides.players[i?0:1].store)
          stores[i].textContent = stores[i].textContent.concat(["(WINNER)"]);
      }
      else{
        if(board.turn==players[i])
          stores[i].textContent = stores[i].textContent.concat(["(",board.turn,"'s turn)"]);
      }
    }
    return 0;
  }
  function updateBoard(board){
    var rows = document.getElementsByClassName('row');
    let players = Object.keys(board.sides);
    let stores = document.getElementsByClassName('storage');
    for (var i = 0; i < 2; i++){
      var rowpits = rows[i].childNodes;
      let pits = board.sides[players[i]].pits.length
      for(var j = 0; j < pits;++j){
        rowpits[j].innerHTML = board.sides[players[i]].pits[i==0? pits-1-j : j];
        buildSeeds(rowpits[j], board.sides[players[i]].pits[i==0? pits-1-j : j]);
      }
      stores[i].textContent = board.sides[players[i]].store;
      if(board.gameOver){
        if(board.sides[players[i]].store > board.sides[players[i==1?0:1]].store)
          stores[i].textContent = stores[i].textContent.concat(["(WINNER)"]);
      }
      else{
        if(board.turn==players[i])
          stores[i].textContent = stores[i].textContent.concat(["(",board.turn,"'s turn)"]);
      }
    }
    return 0;
  }

  configForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // construct a FormData object, which fires the formdata event
  new FormData(configForm);
  });

  configForm.addEventListener('formdata', (e) => {

    // Get the form data from the event object
    let data = e.formData;
    const aiLevel = data.get("againstCPU")=="1"?data.get("difficulty"):0;
    let players = new Array(2);
    if(aiLevel>0)
      players=['AI','Player'];
    else
      players=['Top','Bottom'];
    gameBoard = new MancalaLocal(
        data.get("pits"), data.get("seeds"),players[0],players[1],
        data.get("starter")=="1"? players[1]:players[0],
        aiLevel);

    buildBoard(gameBoard.board,data.get("pits"));

    var pits = document.getElementsByClassName("pit");
    for( var i =0;i<pits.length;++i){
      pits[i].addEventListener('click',
        function(e){
          let player=e.target.attributes['player'].value;
          if(player!=gameBoard.board.turn || player=='AI') return;
          gameBoard.board = MancalaLocal.move(gameBoard.board,player,e.target.attributes['pitIndex'].value);
          updateBoard(gameBoard.board);
          if(aiLevel>0 && gameBoard.board.turn == 'AI' && !gameBoard.board.gameOver){
            var AIPlay = ()=>{
              gameBoard.board = MancalaLocal.aiMove(gameBoard.board,aiLevel);
              setTimeout(() => {
                  updateBoard(gameBoard.board);
                  if(gameBoard.board.turn=='AI'  && !gameBoard.board.gameOver)
                    AIPlay();
                }, 1000);
            }
            AIPlay();
          }
        }
      );
    }
  });


  createAccount.onclick = function(){
      var loginForm = document.getElementById('login-form');
      var registerForm = document.getElementById('register-form');

      loginForm.classList.add("hide");
      loginForm.classList.remove("show");
      registerForm.classList.add("show");
      registerForm.classList.remove("hide");
  };

  function register(nickname, password){
    console.log("CALLED REGISTER");
  }

  registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // construct a FormData object, which fires the formdata event
  new FormData(registerForm);
  });

  registerForm.addEventListener('formdata', (e) => {
    let data = e.formData;

    var nickname = data.get("uname");
    var password = data.get("psw");

    register(nickname, password);
  });

  function ranking(){

  }

};
