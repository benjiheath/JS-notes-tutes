'use strict';

/* ----------------------------------------------------------------------------------------------
------------Element Selection ------------------------------------------------------------------
----------------------------------------------------------------------------------------------*/

// Selection variables
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const totalScore0El = document.querySelector('#score--0');
const totalScore1El = document.querySelector('#score--1');
const score0El = document.querySelector('#current--0');
const score1El = document.querySelector('#current--1');
const diceEl = document.querySelector('.dice');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');
const image = document.querySelector('img');
const modal = document.querySelector('#modal');
const modalMsg = document.querySelector('.modalmsg');
const modalBtnNew = document.querySelector('.btn--modal');

/* ----------------------------------------------------------------------------------------------
------------Functions------------------------------------------------------------------
----------------------------------------------------------------------------------------------*/
// reveal dice for roll button
const revealDice = function () {
  diceEl.classList.remove('hidden');
};

// player activation
const activatePlayer1 = function () {
  player0El.classList.remove('player--active');
  player1El.classList.add('player--active');
};
const activatePlayer0 = function () {
  player1El.classList.remove('player--active');
  player0El.classList.add('player--active');
};

// Starting/reset conditions
const startingConditions = function () {
  score0El.textContent = 0;
  score1El.textContent = 0;
  totalScore0El.textContent = 0;
  totalScore1El.textContent = 0;
  diceEl.classList.add('hidden');
  activatePlayer0();
  modal.classList.remove('modal');
  modal.classList.add('hidden');
};
startingConditions();

/* ----------------------------------------------------------------------------------------------
------------ State ------------------------------------------------------------------
----------------------------------------------------------------------------------------------*/
// Scores
let score0 = 0; //
let score1 = 0; //
let totalScore0 = 0;
let totalScore1 = 0;

// Dice roll
let diceRoll = 0;
const diceRollFunction = function () {
  diceRoll = Math.ceil(Math.random() * 6);
};

/* ---------------------------------------------------------------------------------------------
------------Buttons ------------------------------------------------------------------
----------------------------------------------------------------------------------------------*/

// Roll Dice button
btnRoll.addEventListener('click', function () {
  revealDice();
  diceRollFunction();
  image.src = `dice-${diceRoll}.png`; //sets dice image to rolled value
  console.log(diceRoll);
  if (player0El.classList.contains('player--active')) {
    if (diceRoll === 1) {
      activatePlayer1(); // switch player if rolled a 1
      score0 = 0;
      score0El.textContent = score0;
    } else {
      score0El.textContent = score0 += diceRoll; //adds rolled dice value to score
    }
  } else if (player1El.classList.contains('player--active')) {
    if (diceRoll === 1) {
      activatePlayer0(); // switch player if rolled a 1
      score1 = 0;
      score1El.textContent = score1;
    } else {
      score1El.textContent = score1 += diceRoll; //adds rolled dice value to score
    }
  }
});

// Hold button
btnHold.addEventListener('click', function () {
  if (player0El.classList.contains('player--active')) {
    totalScore0 += score0;
    score0 = 0;
    score0El.textContent = score0;
    totalScore0El.textContent = totalScore0;
    if (totalScore0 >= 50) {
      modalMsg.textContent = 'Player 1 Wins!';
      modal.classList.remove('hidden');
      modal.classList.add('modal');
    } else {
      activatePlayer1();
    }
  } else if (player1El.classList.contains('player--active')) {
    totalScore1 += score1;
    score1 = 0;
    score1El.textContent = score1;
    totalScore1El.textContent = totalScore1;
    if (totalScore1 >= 50) {
      modalMsg.textContent = 'Player 2 Wins!';
      modal.classList.remove('hidden');
      modal.classList.add('modal');
    } else {
      activatePlayer0();
    }
  }
});

//New game / reset button
btnNew.addEventListener('click', startingConditions);

//modal newgame/reset button
modalBtnNew.addEventListener('click', startingConditions);
