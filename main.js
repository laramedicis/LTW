

window.onload = (event) => {
  var mainMenuBars = document.getElementById('main-menu-bars');
  var mainMenu = document.getElementById('main-menu');
  var login = document.getElementById('login');
  var loginOverlay = document.getElementById('game-login');
  var pageMask = document.getElementById('page-mask');
  var configForm = document.getElementById('game-configuration-form');

  var openOverlays = Array.from(document.getElementsByClassName('open-overlay'));
  var gameOverlays = document.getElementsByClassName('game-overlay');
  var closeButtons = document.getElementsByClassName('close-button');
  var pageNavButtons = document.getElementsByClassName('page-nav-button');


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
    var seedDimensions = (80/seeds).toString() + "%";

    for (var i = 0; i < seeds; i++){
      var seed = document.createElement("DIV");
      seed.classList.add("seed");
      seed.style.width = seedDimensions;
      seed.style.paddingTop = seedDimensions;
      pit.appendChild(seed);
    }
    return 0;


  }

  function buildPits(row, pits, seeds){
    var pitWidthValue = 100/pits;
    var pitWidth = pitWidthValue.toString() + "%";

    for (var j = 0; j < pits; j++){
      var pit = document.createElement("DIV");

      pit.classList.add("pit");
      pit.style.width = pitWidth;
      pit.style.paddingTop = pitWidth;

      buildSeeds(pit, seeds);

      row.appendChild(pit);
    }

    return 0;
  }

  function buildBoard(pits, seeds){

    var rows = document.getElementsByClassName('row');
    var pitsPerRow = pits/2;




    for (var i = 0; i < rows.length; i++){
      rows[i].innerHTML = '';
      buildPits(rows[i], pitsPerRow, seeds);

    }

    // buildPits(pits, seeds);

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

  var pits = data.get("pits");
  var seeds = data.get("seeds");

  buildBoard(pits, seeds);

});


};
