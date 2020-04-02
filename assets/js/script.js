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
var quizTime = 30;

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
  //clear answerAreaEl for next set of questions on loop
  answerAreaEl.innerHTML = "";
  for (var i = 0; i < questionList[questionIndex].choices.length; i++) {
    var answerButtonsEl = document.createElement("button");
    answerButtonsEl.setAttribute('answerIndex', i);
    answerButtonsEl.className = 'btn answer-btn';
    answerButtonsEl.innerHTML = questionList[questionIndex].choices[i];
    answerAreaEl.appendChild(answerButtonsEl);
  }
  answerAreaEl.addEventListener("click", checkAnswer);
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

  //create label
  var userScoreLabelEl = document.createElement("h2");
  userScoreLabelEl.textContent = 'You are in the top three for highscore! Enter your initials below.';
  userScoreDivEl.appendChild(userScoreLabelEl);

  //create input
  var userScoreInputEl = document.createElement("input");
  userScoreInputEl.setAttribute('type', 'text');
  userScoreInputEl.setAttribute('id', 'initials');
  userScoreInputEl.setAttribute('class', 'text-input');
  userScoreInputEl.setAttribute('placeholder', 'Enter initials here');
  userScoreDivEl.appendChild(userScoreInputEl);

  //create button
  var userScoreButtonEl = document.createElement("button");
  userScoreButtonEl.className = "btn score-button";
  userScoreButtonEl.setAttribute('value', 'submit');
  userScoreButtonEl.setAttribute('id', 'save-score');
  userScoreButtonEl.textContent = 'Submit Score!';
  userScoreDivEl.appendChild(userScoreButtonEl);

  var userInitialInput = document.querySelector("#initials").value;
  var currentScore = {
    initials: userInitialInput,
    score: userScore
  };

  //if we already have three scores, replace the lowest with current
  if (savedScores && savedScores.length == 3) {
    var intScores = parseInt(savedScores);
    intScores.sort(function(a, b){return a-b});
    if (intScores[0] < userScore) {
      savedScores.splice(0, 1, currentScore);
    }
  }
  else {
    savedScores.push(currentScore);
  }

  //save score to localstorage
  var submitButtonEl = document.querySelector("#save-score");
  submitButtonEl.addEventListener("click", function() {
    localStorage.setItem("scores", JSON.stringify(savedScores));
    userScoreInputEl.remove();
    userScoreButtonEl.remove();
  });

};

var loadScores = function() {
    // 1 get task items from localStorage
    // 2 converts tasks from stringified format back into array of objects
    // 3 iterates through tasks array and creates task elements on the page from it
    savedScores = [];
    savedScores = localStorage.getItem("scores");

    if (!savedScores) {
        return false;
    }  
    
    savedScores = JSON.parse(savedScores);

    // for (var i = 0; i < savedTasks.length; i++) {
    //     //pass each task object in the createTaskEl function
    //     createTaskEl(savedTasks[i]);
    // }
};

// Add event listener to generate button
start.addEventListener("click", startQuiz);

loadScores();


// var formEl = document.querySelector("#task-form");
// var tasksToDoEl = document.querySelector("#tasks-to-do");
// var pageContentEl = document.querySelector('#page-content');
// var tasksInProgressEl = document.querySelector("#tasks-in-progress");
// var tasksCompletedEl = document.querySelector("#tasks-completed");

// var tasks = [];

// //counter to give Id to task
// var taskIdCounter = 0;

// var taskFormHandler = function(event) {
//     event.preventDefault();
//     console.log(event);

//     //get value of input field when submit is hit
//     var taskNameInput = document.querySelector("input[name='task-name']").value;
//     console.log(taskNameInput);

//     var taskTypeInput = document.querySelector("select[name='task-type']").value;
//     console.log(taskTypeInput);


//     var isEdit = formEl.hasAttribute("data-task-id");

//     //has fata attribute, so get task id and call function
//     if (isEdit) {
//         var taskId = formEl.getAttribute("data-task-id");
//         if (!taskNameInput || !taskTypeInput) {
//             alert("You need to fill out the task form!");
//             return false;
//         }
//         else{
//             completeEditTask(taskNameInput, taskTypeInput, taskId);
//         }     
//     }
//     //no data attribute, so create object as normal and pass to createTaskEl function
//     else {
//         var taskFormData = {
//             name: taskNameInput,
//             type: taskTypeInput,
//             status: "to do"
//         };
//         if (!taskNameInput || !taskTypeInput) {
//             alert("You need to fill out the task form!");
//             return false;
//         }
//         else {
//             createTaskEl(taskFormData);
//         }  
//     }
//     formEl.reset();
// };   

// var completeEditTask = function(taskName, taskType, taskId) {
//     console.log(taskName, taskType, taskId);

//     //find matching task list item
//     var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

//     //set new values
//     taskSelected.querySelector("h3.task-name").textContent = taskName;
//     taskSelected.querySelector("span.task-type").textContent = taskType;

//     //loop through tasks array and task object with new content
//     for (var i = 0; i < tasks.length; i++) {
//         if (tasks[i].id === parseInt(taskId)) {
//             tasks[i].name = taskName;
//             tasks[i].type = taskType;
//         }
//     };

//     alert("Task Updated!");

//     //remove task ID so form is clear
//     formEl.removeAttribute("data-task-id");
//     document.querySelector("#save-task").textContent = "Add Task";

//     saveTasks();
// };

// var createTaskEl = function(taskDataObj) {

//     //checking values passed in on taskDataObj
//     console.log(taskDataObj);
//     console.log(taskDataObj.status);

//     // create list item
//     var listItemEl = document.createElement("li");
//     listItemEl.className = "task-item";

//     //add task id as custom attribute
//     listItemEl.setAttribute("data-task-id", taskIdCounter);
//     listItemEl.setAttribute("draggable", "true");

//     // create div to hold task info and add to list item
//     var taskInfoEl = document.createElement("div");
//     // give it a class name
//     taskInfoEl.className = "task-info";
//     // add HTML content to div
//     taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

//     listItemEl.appendChild(taskInfoEl);

//     //add ID to object, push object to array
//     taskDataObj.id = taskIdCounter;
//     tasks.push(taskDataObj);

//     var taskActionsEl = createTaskActions(taskIdCounter);
//     console.log(taskActionsEl);
//     listItemEl.appendChild(taskActionsEl);

//     // add entire list item to list
//     tasksToDoEl.appendChild(listItemEl);

//     //increase task counter for next unique id
//     taskIdCounter++;

//     saveTasks();
// };

// var createTaskActions = function(taskId) {
//     var actionContainerEl = document.createElement("div");
//     actionContainerEl.className = "task-actions";

//     //create button
//     var editButtonEl = document.createElement("button");
//     editButtonEl.textContent = "Edit";
//     editButtonEl.className = "btn edit-btn";
//     editButtonEl.setAttribute("data-task-id", taskId);

//     actionContainerEl.appendChild(editButtonEl);

//     //create delete button
//     var deleteButtonEl = document.createElement("button");
//     deleteButtonEl.textContent = "Delete";
//     deleteButtonEl.className = "btn delete-btn";
//     deleteButtonEl.setAttribute("data-task-id", taskId);

//     actionContainerEl.appendChild(deleteButtonEl);

//     //create dropdown menu
//     var statusSelectEl = document.createElement("select");
//     statusSelectEl.className = "select-status";
//     statusSelectEl.setAttribute("name", "status-change");
//     statusSelectEl.setAttribute("data-task-id", taskId);

//     actionContainerEl.appendChild(statusSelectEl);

//     var statusChoices = ["To Do", "In Progress", "Completed"];
//     for (var i = 0; i < statusChoices.length; i++) {
//         //create option element
//         var statusOptionEl = document.createElement("option");
//         statusOptionEl.textContent = statusChoices[i];
//         statusOptionEl.setAttribute("value", statusChoices[i]);

//         //append to select
//         statusSelectEl.appendChild(statusOptionEl);
//     }

//     return actionContainerEl;
// };

// var taskButtonHandler = function(event) {
//     console.log(event.target);

//     var targetEl = event.target;

//     if (targetEl.matches(".delete-btn")) {
//         console.log("You clicked a delete button!");
//         var taskId = targetEl.getAttribute("data-task-id");
//         deleteTask(taskId);
//     }
//     else if (targetEl.matches(".edit-btn")) {
//         var taskId = targetEl.getAttribute("data-task-id");
//         editTask(taskId);
//     }
// };

// var taskStatusChangeHandler = function(event) {
//     console.log(event.target);
//     console.log(event.target.getAttribute("data-task-id"));

//     //get task item's Id
//     var taskId = event.target.getAttribute("data-task-id");

//     //get currently selected option's value and convert to lowercase
//     var statusValue = event.target.value.toLowerCase();

//     var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

//     if (statusValue === "to do") {
//         tasksToDoEl.appendChild(taskSelected);
//     }
//     else if (statusValue === "in progress") {
//         tasksInProgressEl.appendChild(taskSelected);
//     }
//     else if (statusValue === "completed") {
//         tasksCompletedEl.appendChild(taskSelected);
//     }

//     //update tasks in task array
//     for (var i = 0; i < tasks.length; i++) {
//         if (tasks[i].id === parseInt(taskId)) {
//             tasks[i].status = statusValue;
//         }
//         console.log(tasks);
//     }

//     saveTasks();
// };

// var dragTaskHandler = function(event) {
//     // console.log("event.target:", event.target);
//     // console.log("event.type:", event.type);
//     // console.log("event", event);

//     var taskId = event.target.getAttribute("data-task-id");
//     console.log("Task ID", taskId);

//     event.dataTransfer.setData("text/plain", taskId);

//     // var getId = event.dataTransfer.getData("text/plain");
//     // console.log("getId", getId, typeof getId);
// };

// var dropZoneDragHandler = function(event) {
//     //console.log("Dragover Event Target", event.target);
//     var taskListEl = event.target.closest(".task-list");
//     if (taskListEl) {
//         event.preventDefault();
//         taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
//     }   
// };

// var dragLeaveHandler = function(event) {
//     var taskListEl = event.target.closest(".task-list");
//     if (taskListEl) {
//         taskListEl.removeAttribute("style");
//     }
// };

// var dropTaskHandler = function(event) {
//     var id = event.dataTransfer.getData("text/plain");
//     // console.log("drop event", event.target, event.dataTransfer, id);

//     var draggableElement = document.querySelector("[data-task-id='" + id +"']");
//     // console.log(draggableElement);
//     // console.dir(draggableElement);

//     var dropZoneEl = event.target.closest(".task-list");
//     var statusType = dropZoneEl.id;
//     // console.log(statusType);
//     // console.dir(dropZoneEl);

//     //set status of task based on dropZone id
//     var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
//     // console.dir(statusSelectEl);
//     // console.log(statusSelectEl);

//     if (statusType === "tasks-to-do") {
//         statusSelectEl.selectedIndex = 0;
//     }
//     else if (statusType === "tasks-in-progress") {
//         statusSelectEl.selectedIndex = 1;
//     }
//     else if (statusType === "tasks-completed") {
//         statusSelectEl.selectedIndex = 2;
//     }

//     dropZoneEl.removeAttribute("style");
//     dropZoneEl.appendChild(draggableElement);

//     //loop through tasks array to find and update the updated task's status
//     for (var i = 0; i < tasks.length; i++) {
//         if (tasks[i].id === parseInt(id)) {
//             tasks[i].status = statusSelectEl.value.toLowerCase();
//         }
//     }
//     console.log(tasks);

//     saveTasks();
// };

// var deleteTask = function(taskId) {
//     var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
//     taskSelected.remove();

//     //create new array to hold updated list of tasks
//     var updatedTaskArr = [];

//     //loop through current tasks
//     for (var i = 0; i < tasks.length; i++) {
//         //if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
//         if (tasks[i].id !== parseInt(taskId)) {
//             updatedTaskArr.push(tasks[i]);
//         }
//     }

//     //reassign tasks array to be the same as updatedTaskArr
//     tasks = updatedTaskArr;

//     saveTasks();
// };

// var editTask = function(taskId) {
//     console.log("editing task #" + taskId);

//     //get ask list item element
//     var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

//     //get content from task name and type
//     var taskName = taskSelected.querySelector("h3.task-name").textContent;
//     console.log(taskName);

//     var taskType = taskSelected.querySelector("span.task-type").textContent;
//     console.log(taskType);

//     document.querySelector("input[name='task-name']").value = taskName;
//     document.querySelector("select[name='task-type']").value = taskType;

//     document.querySelector("#save-task").textContent = "Save Task";

//     //give from task ID so we can later check if it is being edited
//     formEl.setAttribute("data-task-id", taskId);
// };

// var saveTasks = function() {
//     localStorage.setItem("tasks", JSON.stringify(tasks));
// };

// var loadTasks = function() {
//     // 1 get task items from localStorage
//     // 2 converts tasks from stringified format back into array of objects
//     // 3 iterates through tasks array and creates task elements on the page from it

//     savedTasks = localStorage.getItem("tasks");
//     console.log(savedTasks);

//     if (!savedTasks) {
//         return false;
//     }  
    
//     savedTasks = JSON.parse(savedTasks);

//     for (var i = 0; i < savedTasks.length; i++) {
//         //pass each task object in the createTaskEl function
//         createTaskEl(savedTasks[i]);
//     }
// };
    
// formEl.addEventListener("submit", taskFormHandler);

// pageContentEl.addEventListener("dragstart", dragTaskHandler);

// pageContentEl.addEventListener("dragover", dropZoneDragHandler);

// pageContentEl.addEventListener("drop", dropTaskHandler);

// pageContentEl.addEventListener("dragleave", dragLeaveHandler);

// pageContentEl.addEventListener("change", taskStatusChangeHandler);

// pageContentEl.addEventListener("click", taskButtonHandler);

// loadTasks();

// console.log(buttonEl);

