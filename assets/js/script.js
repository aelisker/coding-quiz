var questionList = [
  {
    question: "This is a test question. The answer is B.",
    choices: ['A. This answer', 'B. That Answer', 'C. Maybe this one?', 'D. No it\'s totaly this one'],
    answer: 1
  },
  {
    question: "This is a test question. The answer is A.",
    choices: ['A. This answer', 'B. That Answer', 'C. Maybe this one?', 'D. No it\'s totaly this one'],
    answer: 0
  },
  {
    question: "This is a test question. The answer is D.",
    choices: ['A. This answer', 'B. That Answer', 'C. Maybe this one?', 'D. No it\'s totaly this one'],
    answer: 3
  },
  {
    question: "This is a test question. The answer is A.",
    choices: ['A. This answer', 'B. That Answer', 'C. Maybe this one?', 'D. No it\'s totaly this one'],
    answer: 0
  },
  {
    question: "This is a test question. The answer is C.",
    choices: ['A. This answer', 'B. That Answer', 'C. Maybe this one?', 'D. No it\'s totaly this one'],
    answer: 2
  },
  {
    question: "This is a test question. The answer is A.",
    choices: ['A. This answer', 'B. That Answer', 'C. Maybe this one?', 'D. No it\'s totaly this one'],
    answer: 0
  }
];

var savedScores = [];

//used for countdown timer and determining score
var quizTime = 50;

//keeping track of number of questions user gets through
var questionIndex = 0;

//used to save score for completion
var userScore = 0;

var startQuiz = function() {
  startTimer(); 

  createQuestions();

  //after start, remove start button
  var startButton = document.querySelector("#start");
  startButton.remove();
};

var startTimer = function() {
  //find id of countdown-timer in html, declare as variable
  var pageElement = document.querySelector("#countdown-timer");
  
  //start timer with setInterval. Use text content to show time on page
  var quizCountdown = setInterval(function() {
    quizTime--;
    pageElement.textContent = "You have " + quizTime + " seconds left!";
    if (quizTime < 0) {
      quizTime = 0;
    }
    //end quiz when time reaches zero
    if (quizTime === 0) {
      clearInterval(quizCountdown);
      //only run endQuiz if time expires. If questionIndex is same length as array, user has cycled through all questions and already run endQuiz
      if (questionIndex !== questionList.length) {
        endQuiz();
      }  
    } 
  }, 1000);
};

//print question to page
var createQuestions = function () {
  var promptAreaEl = document.querySelector("#question-prompt");
  promptAreaEl.textContent = questionList[questionIndex].question;
  createAnswers();
};

//create answer buttons
var createAnswers = function () {
  var answerAreaEl = document.querySelector("#responses");
  var answerButtonAreaEl = document.createElement("div");
  //clear answerAreaEl for next set of questions on loop
  answerAreaEl.innerHTML = "";
  for (var i = 0; i < questionList[questionIndex].choices.length; i++) {
    var answerButtonsEl = document.createElement("button");
    answerButtonsEl.setAttribute('answerIndex', i);
    answerButtonsEl.className = 'btn answer-btn';
    answerButtonsEl.innerHTML = questionList[questionIndex].choices[i];
    answerButtonAreaEl.appendChild(answerButtonsEl);
    answerAreaEl.appendChild(answerButtonAreaEl);
  }
  answerButtonAreaEl.addEventListener("click", checkAnswer);
};

//check answer for correct or incorrect as well as quiz end
var checkAnswer = function () {
  //does the answerIndex value we set match with answer in array?
  if (event.target.getAttribute('answerIndex') == questionList[questionIndex].answer) {
    alert("correct");
    questionIndex++;
    if (questionIndex < questionList.length) {
      createQuestions();
    }
    else {
      endQuiz();
    }
  }
  else {
    alert("Incorrect");
    quizTime = quizTime - 5;
  } 
};

var endQuiz = function () {
  //remove answer buttons as quiz
  var answerButtonsEl = document.querySelectorAll(".answer-btn");
  for (var i = 0; i < answerButtonsEl.length; i++) {
    answerButtonsEl[i].remove();
  }

  //if index and array length match, user has got through all questions
  if (questionIndex == questionList.length) {
    userScore = quizTime;
    quizTime = 0;
    alert("Congratulations! You've made it all the way through with a score of " + userScore + " seconds remaining.");
    checkSavedScores();
  }
  else {
    alert("You ran out of time. Better luck next time!");

    //add try again button
  }

  //compare to high score
};

var checkSavedScores = function () {
  if (savedScores && savedScores.length == 3) {
    var topThree = false;
    for (var i = 0; i < 3; i++) {
      savedScoreInt = parseInt(savedScores[i].score);
      if (savedScoreInt < userScore) {
        topThree = true;
        saveUserScore();
        break;
      }
    }
    if (!topThree) {
      //need to say sorry not high enough
      alert("Sorry! You were not top three!");
    }
  }
  else {
    saveUserScore();
  }
};

var saveUserScore = function() {
  var userScoreDivEl = document.querySelector("#responses");

  //create label for entering score
  var userScoreLabelEl = document.createElement("h2");
  userScoreLabelEl.textContent = 'You are in the top three for highscore! Enter your initials below.';
  userScoreDivEl.appendChild(userScoreLabelEl);

  //create input field for initials
  var userScoreInputEl = document.createElement("input");
  userScoreInputEl.setAttribute('type', 'text');
  userScoreInputEl.setAttribute('id', 'initials');
  userScoreInputEl.setAttribute('class', 'text-input');
  userScoreInputEl.setAttribute('placeholder', 'Enter initials here');
  userScoreDivEl.appendChild(userScoreInputEl);

  //create button for submitting scores
  var userScoreButtonEl = document.createElement("button");
  userScoreButtonEl.className = "btn score-button";
  userScoreButtonEl.setAttribute('value', 'submit');
  userScoreButtonEl.setAttribute('id', 'save-score');
  userScoreButtonEl.textContent = 'Submit Score!';
  userScoreDivEl.appendChild(userScoreButtonEl);
  
  //assistance on this code, need to analyze
  var userInitialInput = document.querySelector("#initials").value;
  console.log(userInitialInput);
  var currentScore = {
    score: userScore, id : savedScores.length
  };

  //if we already have three scores, replace the lowest with current
  if (savedScores && savedScores.length == 3) {

    //create array with current scores, sort by lowest first, find out if current score is higher
    var arrayForSorting = [savedScores[0].score, savedScores[1].score, savedScores[2].score];
    sortedArray = arrayForSorting.sort(function(a, b){return a-b});
    if (sortedArray[0] < userScore) {
      //since current score is higher, find out which current array item needs to be replaced
      if (savedScores[0].score < savedScores[1].score && savedScores[0].score < savedScores[2].score) {
        savedScores.splice(0, 1, currentScore);
      }
      else if (savedScores[1].score < savedScores[0].score && savedScores[1].score < savedScores[2].score) {
        savedScores.splice(1, 1, currentScore);
      }
      else {
        savedScores.splice(2, 1, currentScore);
      }
      
    }
  }
  //if we don't have three saved scores, safe to save current with no other criteria checks
  else {
    savedScores.push(currentScore);
  }

  //assistance on this from TA, need to run through multiple times with debugger to understand what is going on
  var submitButtonEl = document.querySelector("#save-score");
  submitButtonEl.addEventListener("click", function() {
    var userInitialInput = document.querySelector("#initials").value;
    var current = savedScores.find((element)=> element['id'] == currentScore['id']);
    current['initials'] = userInitialInput;
    localStorage.setItem("scores", JSON.stringify(savedScores));
    userScoreInputEl.remove();
    userScoreButtonEl.remove();
  });

};

var loadScores = function() {
    //load scored only if array is not a null value, otherwise function breaks
    var isArrayNull = localStorage.getItem("scores");
    if (isArrayNull) {
      savedScores = localStorage.getItem("scores");
      savedScores = JSON.parse(savedScores);
    }
};

// Add event listener to generate button
start.addEventListener("click", startQuiz);

loadScores();