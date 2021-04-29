'use strict';

/*------------------------------------------------------------------------------------------------------
---------------------------------------Variables--------------------------------------------------------
------------------------------------------------------------------------------------------------------*/

//MAIN NUMBER VARIABLE
let secretNumber = 0;
const secretNumberFunction = function () {
  secretNumber = Math.ceil(Math.random() * 20);
};
secretNumberFunction(); //calling function, otherwise number = 0 on page load.

//SCORE variable
let score = 20; //REM use let here since score needs to change

//HIGHscore variable
let highscore = 0;

/*------------------------------------------------------------------------------------------------------
---------------------------------------Functions (refactoring)------------------------------------------
------------------------------------------------------------------------------------------------------*/

const displayMessage = function (message) {
  return (document.querySelector('.message').textContent = message);
};
const displayScore = function (scoreValue) {
  return (document.querySelector('.score').textContent = scoreValue);
};
const displayGuess = function (guess) {
  return (document.querySelector('.guess').value = guess);
};
const displayNumber = function (number) {
  return (document.querySelector('.number').textContent = number);
};
const numberWidth = function (width) {
  return (document.querySelector('.number').style.width = width);
};
const bgColor = function (color) {
  return (document.querySelector('body').style.backgroundColor = color);
};

/*------------------------------------------------------------------------------------------------------
---------------------------------------Buttons---------------------------------------------------------
------------------------------------------------------------------------------------------------------*/

//AGAIN button handler
document.querySelector('.again').addEventListener('click', function () {
  secretNumberFunction();
  score = 20;
  displayScore(score); //reset score to 20
  displayGuess(''); //reset input field
  displayMessage('Start guessing, you stinky BOT'); // reset message
  displayNumber('?'); // reset number display to question mark
  numberWidth('15rem'); //reset number display width
  bgColor('#222'); // reset background color
});

//CHECK button handler
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value); //storing guess input into const as number

  if (!guess) {
    displayMessage('No number entered!');

    // when guess is CORRECT
  } else if (guess === secretNumber) {
    displayMessage('Correct Number!!');
    bgColor('green'); //css body = green
    numberWidth('30rem'); //css increase width of number div
    displayNumber(secretNumber); // reveal correct number

    if (score > highscore) {
      //Highscore
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }

    //when guess is WRONG
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(
        guess > secretNumber
          ? 'Your guess is too high!'
          : 'Your guess is too low!'
      );
      score--; //decreasing score -1
      displayScore(score); //updating 'Score' display
    } else {
      displayMessage('You lost the game...:(');
      displayScore(0);
      //css body = red
      bgColor('red');
    }
  }
});
