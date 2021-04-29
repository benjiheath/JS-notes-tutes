'use strict';

// element selections
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const current0El = document.querySelector('#current--0');
const current1El = document.querySelector('#current--1');

// functions

//! if player rolls a 1
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0; // resets score
  activePlayer = activePlayer === 0 ? 1 : 0; //if 0, change to 1; if not 0, change to 0

  player0El.classList.toggle('player--active'); // switching active player class
  player1El.classList.toggle('player--active');
};

let playing, activePlayer, scores, currentScore; // declaring state variables for starting conditions

//! starting conditions
const init = function () {
  playing = 1; //
  scores = [0, 0]; // TOTAL scores
  currentScore = 0;
  activePlayer = 0;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};
init();

// Dice rolling btn
btnRoll.addEventListener('click', function () {
  // button disabled if a player has won
  if (playing) {
    const dice = Math.ceil(Math.random() * 6); // diceroll
    diceEl.classList.remove('hidden'); // reveal dice
    diceEl.src = `dice-${dice}.png`; // dice image corresponds to dice value

    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(
        `current--${activePlayer}` // changes current score based on activePlayer variable
      ).textContent = currentScore;
    } else {
      switchPlayer();
    }
  }
});

// HOLD btn
btnHold.addEventListener('click', function () {
  // button disabled if a player has won
  if (playing) {
    // add current score to active player's total score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    //check if score >= 100
    if (scores[activePlayer] >= 100) {
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      playing = 0;
    } else {
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', init);
