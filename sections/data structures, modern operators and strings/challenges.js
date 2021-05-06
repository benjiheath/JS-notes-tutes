'use strict';

const game = {
  team1: 'Bayern Munich',
  team2: 'Borrussia Dortmund',
  players: [
    [
      'Neuer',
      'Pavard',
      'Martinez',
      'Alaba',
      'Davies',
      'Kimmich',
      'Goretzka',
      'Coman',
      'Muller',
      'Gnarby',
      'Lewandowski',
    ],
    [
      'Burki',
      'Schulz',
      'Hummels',
      'Akanji',
      'Hakimi',
      'Weigl',
      'Witsel',
      'Hazard',
      'Brandt',
      'Sancho',
      'Gotze',
    ],
  ],
  score: '4:0',
  scored: ['Lewandowski', 'Gnarby', 'Lewandowski', 'Hummels'],
  date: 'Nov 9th, 2037',
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

// const players1 = game.players[0]; //! WRONG
// console.log(players1);

// const players2 = game.players[1]; //! WRONG
// console.log(players2);

//? need to destructure...
const [players1, players2] = game.players;
console.log(players1, players2);

// first player in arr = goalkeeper(gk). using rest operator
const [gk, ...fieldPlayers] = players1;
console.log(gk);
console.log(fieldPlayers);

// joining p1 and p2 for allPlayers
const allPlayers = [...players1, ...players2];
console.log(allPlayers);

// updating players1 arr with 3 substitute players
const players1Final = [...players1, 'Thiago', 'Coutinho', 'Perisic'];
console.log(players1Final);

// destructuring game.odds
const { team1, x: draw, team2 } = game.odds;
console.log(team1, draw, team2);
// another way to do it:
// const {odds: {team1, x: draw, team2}} = game;

// rest operator in func parameter to take any number of inputted player names for console print
const printGoals = function (...pNames) {
  console.log(`${pNames} ---- ${pNames.length} goals scored.`);
};

// calling func, manually inputting values
printGoals('Davies,', 'Muller', 'Lewandowski', 'Kimmich');

// passing in .scored property. Spread operator needed for arg since if we just pass in 'game.scored', the .length
// value will only be 1 (since only one arg)
printGoals(...game.scored);

team1 < team2 && console.log('team 1 more likely to win');
team1 < team2 && console.log('team 1 more likely to win');

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------- Challenge 2 ---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------

// 1. looping over game.scored arr to output "Goal x: player"
for (const [i, pname] of game.scored.entries())
  console.log(`Goal ${i + 1}: ${pname}`);

// 2. using loop to calc average odds from game.odds nested obj
const oddsValues = Object.values(game.odds);

let avgOdds = 0;
let sumOdds = 0;

for (const oddz of oddsValues) {
  sumOdds += oddz;
}

avgOdds = sumOdds / oddsValues.length;

console.log(avgOdds);

// into a func?
const calcAvOdds = function (targ) {
  let avgOddsF = 0;
  let sumOddsF = 0;
  for (const oddzF of targ) {
    sumOddsF += oddzF;
  }
  avgOddsF = sumOddsF / targ.length;
  return avgOddsF;
};

console.log(calcAvOdds(oddsValues));

// 3. Printing odds to console as 'Odd of (outcome): (odd value)'

// const { team1: team1Name, team2: team2Name } = game;
// const { team1: team1Odds, team2: team2Odds } = game.odds;

const entriesOdds = Object.entries(game.odds);
console.log(entriesOdds);

for (const [teamName, teamOdd] of entriesOdds) {
  const teamOrDrawStr = game[teamName] ? `victory ${game[teamName]}` : 'draw';
  //! REMEMBER - since here we are using variable name 'teamName' in the property target, MUST use bracket notation! [], not just game.teamName
  console.log(`Odd of ${teamOrDrawStr}: ${teamOdd}`);
}

// 4. Scorers. If scorers[player] exists, then its value is increased by 1. If not, property is added and assigned value of 1

const scorers = {};

for (const playerz of game.scored) {
  scorers[playerz] ? scorers[playerz]++ : (scorers[playerz] = 1);
}
// if scorers[player] exists, then its value is increased by 1. If not, property is added and assigned value of 1

console.log(scorers);

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------- Challenge 3 ---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------

document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));

const textarea = document.querySelector('textarea');
const button = document.querySelector('button');

button.addEventListener('click', function () {
  const text = document.querySelector('textarea').value.toLowerCase();

  const rows = text.split('\n'); // splitting by \u into arr
  console.log(rows);

  for (const row of rows) {
    const [first, second] = row.trim().split('_'); // split each row into individual words, descructuring each into vars
    const second1 = second.replace(second[0], second[0].toUpperCase()); // make second word first-letter-uppercased
    const output1 = `${first}${second1} ${'x'.repeat(row + 1)}`.padEnd(20);
    const output2 = `${'x'.repeat(rows.indexOf(row) + 1)}`;
    console.log(output1 + output2);
  }
  console.log(rows);
});

// seperate lines by \u into ARR
// loop over elements, SPLITTING into arrs?
// then join each arr and push to new arr?
