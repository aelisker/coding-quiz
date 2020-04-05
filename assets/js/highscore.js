var scoreAreaEl = document.querySelector(".card-header");
var clearScoreBtn = document.querySelector("#clear");

var savedScores = [];

var clearScores = function () {
  savedScores = '';
  localStorage.setItem("scores", savedScores);
  loadScores();
}

//sort function taken from https://www.educative.io/edpresso/how-to-sort-an-array-of-objects-in-javascript
var sortScores = function () {
  function dynamicsort(property,order) {
    var sort_order = 1;
    if(order === "desc"){
        sort_order = -1;
    }
    return function (a, b){
        // a should come before b in the sorted order
        if(a[property] < b[property]){
                return -1 * sort_order;
        // a should come after b in the sorted order
        }else if(a[property] > b[property]){
                return 1 * sort_order;
        // a and b are the same
        }else{
                return 0 * sort_order;
        }
    }
  }
  savedScores.sort(dynamicsort("score", "desc"));
};

var loadScores = function () {
    //load scored only if array is not a null value, otherwise function breaks
    var isArrayNull = localStorage.getItem("scores");
    if (isArrayNull) {
      savedScores = localStorage.getItem("scores");
      savedScores = JSON.parse(savedScores);
    }
    else {
      scoreAreaEl.style.fontSize = 'larger';
      scoreAreaEl.style.fontWeight = '600';
      scoreAreaEl.textContent = 'There are currently no saved scores.';
    }

    sortScores();

    var highScoreListEl = document.createElement("ul");
    highScoreListEl.className = 'score-ul';
    for (var i = 0; i < savedScores.length; i++) {
      var highScoreEl = document.createElement("li");
      // answerButtonsEl.setAttribute('answerIndex', i);
      highScoreEl.className = 'score-li';
      highScoreEl.textContent = savedScores[i].score + " - " + savedScores[i].initials;
      highScoreListEl.appendChild(highScoreEl);
    }
    scoreAreaEl.appendChild(highScoreListEl);
    // answerAreaEl.addEventListener("click", checkAnswer);
};

clearScoreBtn.addEventListener("click", clearScores);

loadScores();