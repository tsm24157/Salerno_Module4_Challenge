// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionElement = document.getElementById('questions');
var timerElement = document.getElementById('time');
var userChoiceElement = document.getElementById('choices');
var submitButtonElement = document.getElementById('submit');
var startButtonElement = document.getElementById('start');
var usernameElement = document.getElementById('initials');
var inputElement = document.getElementById('input');

// sound effects
var soundCorrect = new Audio('assets/sfx/correct.wav');
var soundIncorrect = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
  var startScreenElement = document.getElementById('start-screen');
  startScreenElement.setAttribute('class', 'hide');

  // un-hide questions section
  questionElement.removeAttribute('class');

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerElement.textContent = time;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleElement = document.getElementById('question-title');
  titleElement.textContent = currentQuestion.title;

  // clear out any old question choices
  userChoiceElement.innerHTML = '';

  // loop over choices
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

    // display on the page
    userChoiceElement.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonElement = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!buttonElement.matches('.choice')) {
    return;
  }

  // check if user guessed wrong
  if (buttonElement.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 10;

    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timerElement.textContent = time;

    // play "wrong" sound effect
    soundIncorrect.play();

    inputElement.textContent = 'Wrong!';
  } else {
    // play "right" sound effect
    soundCorrect.play();

    inputElement.textContent = 'Correct!';
  }

  // flash right/wrong feedback on page for half a second
  inputElement.setAttribute('class', 'input');
  setTimeout(function () {
    inputElement.setAttribute('class', 'input hide');
  }, 1000);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (time <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  // show final score
  var finalScoreElement = document.getElementById('final-score');
  finalScoreElement.textContent = time;

  // hide questions section
  questionElement.setAttribute('class', 'hide');
}

function clockTick() {
  // update time
  time--;
  timerElement.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = usernameElement.value.trim();

  // make sure value wasn't empty
  if (initials !== '') {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem('highscores')) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect to next page
    window.location.href = 'highscores.html';
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitButtonElement.onclick = saveHighscore;

// user clicks button to start quiz
startButtonElement.onclick = startQuiz;

// user clicks on element containing choices
userChoiceElement.onclick = questionClick;

usernameElement.onkeyup = checkForEnter;
