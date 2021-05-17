'use strict';

/* Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
about their dog's age, and stored the data into an array (one array for each). For
now, they are just interested in knowing whether a dog is an adult or a puppy.
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
old.
Your tasks:
Create a function 'checkDogs', which accepts 2 arrays of dog's ages
('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the first and the last two dogs actually have
cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
ages from that copied array (because it's a bad practice to mutate function
parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy")
4. Run the function for both test datasets */
/*
const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 18, 3];

const dogsJulia2 = [9, 16, 6, 8, 3];
const dogsKate2 = [10, 5, 6, 1, 4];

const checkDogs = function (arr1, arr2) {
  const arr1Fixed = arr1.slice(1, 3);
  console.log(arr1Fixed);

  const combined = [...arr1Fixed, ...arr2];
  console.log(combined);

  combined.forEach(function (age, i) {
    age >= 3
      ? console.log(`Dog #${i} is an adult and is ${age} years old`)
      : console.log(`Dog #${i} is still a puppy!`);
  });
};

checkDogs(dogsJulia, dogsKate);
console.log('--------data 2-------');
checkDogs(dogsJulia2, dogsKate2);

*/

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Challenge #2 ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages => {
    // convert dogAge to HumanAge; remove <18y/o dogs
    const humanAgesAdultsOnly = ages
        .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
        .filter(age => age > 18);

    // calc average
    const totalAge = humanAgesAdultsOnly.reduce((accu, age) => accu + age, 0);
    const averageAge = totalAge / humanAgesAdultsOnly.length;
    return averageAge;
};

console.log(calcAverageHumanAge(data1));
console.log(calcAverageHumanAge(data2));

// re-write above using chaining

const calcAverageHumanAgeChained = ages => {
    const averageAge = ages
        .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
        .filter(age => age > 18)
        .reduce((accu, age, i, arr) => accu + age / arr.length, 0);
    return averageAge;
};

console.log(calcAverageHumanAgeChained(data1));
console.log(calcAverageHumanAgeChained(data2));

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Challenge #3 ---------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
];

// calculate recommended portion, adding new property to each dog
const recPortion = function (arr) {
    arr.forEach(
        dog => (dog.recommendedPortion = Math.round(dog.weight ** 0.75 * 28))
    );
};

recPortion(dogs);
console.log(dogs);

// log if sarah's dog is eating too much or too little
const sarahsDog = function () {
    const dog = dogs.find(dog => dog.owners.includes('Sarah'));
    dog.curFood > dog.recommendedPortion
        ? console.log(
              `Sarah's dog is eating ${Math.abs(
                  dog.recommendedPortion - dog.curFood
              )} grams too much.`
          )
        : console.log(
              `Sarah's dog is eating ${Math.abs(
                  dog.curFood - dog.recommendedPortion
              )} grams less than reccommended.`
          );
};

console.log(sarahsDog());

// create arrs containing owners according to whether their dog is eating too much or too little

const ownersEatTooMuch = dogs
    .filter(dog => dog.curFood > dog.recommendedPortion)
    .map(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
    .filter(dog => dog.curFood < dog.recommendedPortion)
    .map(dog => dog.owners);
console.log(ownersEatTooLittle);

// log strings with owners names from the above arrs

console.log(`${ownersEatTooMuch.flat().join(' and ')}'s dogs eat too much!`);
console.log(
    `${ownersEatTooLittle.flat().join(' and ')}'s dogs eat too little!`
);

// log whether any dogs are eating exactly the recommended portion
console.log(dogs.some(dog => dog.curFood === dog.recommendedPortion));

// log whether any dogs are eating an 'okay' amount (between 90% & 110% of recommended)

console.log(
    dogs.some(
        dog =>
            dog.curFood < dog.recommendedPortion * 1.1 &&
            dog.curFood > dog.recommendedPortion * 0.9
    )
);

// create arr containing dogs meeting above condition

const dogsEatingOkay = dogs.filter(
    dog =>
        dog.curFood < dog.recommendedPortion * 1.1 &&
        dog.curFood > dog.recommendedPortion * 0.9
);

console.log(dogsEatingOkay);

// create shallow copy of dogs arr; sort by recommended food portion in ascending order

const sortedRec = Array.from(dogs).sort(
    (a, b) => a.recommendedPortion - b.recommendedPortion
);
console.log(sortedRec);
