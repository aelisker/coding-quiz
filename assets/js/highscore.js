var scoreAreaEl = document.querySelector(".card-header");
var clearScoreBtn = document.querySelector("#clear");

var savedScores = [];

var clearScores = function () {
  savedScores = '';
  localStorage.setItem("scores", savedScores);
  loadScores();
}

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