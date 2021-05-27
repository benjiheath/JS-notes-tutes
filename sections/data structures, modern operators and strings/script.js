'use strict';

// Data needed for a later exercise
const flights =
  '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

// Data needed for first part of the section
const restaurant = {
  name: 'Classico Italiano',
  location: 'Via Angelo Tavanti 23, Firenze, Italy',
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
  mainMenu: ['Pizza', 'Pasta', 'Risotto'],

  openingHours: {
    thu: {
      open: 12,
      close: 22,
    },
    fri: {
      open: 11,
      close: 23,
    },
    sat: {
      open: 0, // Open 24 hours
      close: 24,
    },
  },

  //method for ordering, returning argued values from starters and mains
  order: function (starterIndex, mainIndex) {
    return [this.starterMenu[starterIndex], this.mainMenu[mainIndex]];
  },

  orderDelivery: function ({
    starterIndex = 1, // setting default values
    mainIndex = 0,
    time = '20:00',
    address,
  }) {
    console.log(
      `Order received! ${this.starterMenu[starterIndex]} and ${this.mainMenu[mainIndex]}. Placed at ${time} - deliver to ${address}.`
    );
  },

  //! strong use case for spread operator:
  //see below
  orderPasta: function (ing1, ing2, ing3) {
    console.log(
      `here is your delicious pasta with ${ing1}, ${ing2}, and ${ing3}`
    );
  },
  //rest pattern
  orderPizza: function (mainIngredient, ...otherIngredients) {
    console.log(mainIngredient);
    console.log(otherIngredients);
  },
};

restaurant.orderPizza('mushrooms', 'onion', 'peppers');

restaurant.orderDelivery({
  time: '22:30',
  address: 'Via del Sole, 21',
  mainIndex: 2,
  starterIndex: 2,
});
//! REM see this is useful when functions have a lot of parameters and its hard to remember what order to pass them in.
//! the arguments are destructured1

restaurant.orderDelivery({
  // testing default values
  address: '1 geer st',
  starterIndex: 1,
});

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||-------------------------------Destructuring arrays---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
// destructuring is an es6 feature that provides a way of unpacking values from arrays/objects and storing them in distinct variables

const arr = [2, 3, 4];

const [a1, b2, c3] = arr; //destructuring the array. original arr unaffected
console.log(a1, b2, c3);

// take two elements from 'starterMenu' property in restaurant array, skipping one:
const [riudsf, , sdiufsd] = restaurant.starterMenu; // notice how naming of the values doesn't matter- simply follows element order of array
console.log(riudsf, sdiufsd);

// REM say the categories are ordered by importance, and owner of restaurant wanted to switch the first tand third categories (switch vegetarian and italian)
let [main, , secondary] = restaurant.categories;
console.log(main, secondary); // output : italian vegetarian

[main, secondary] = [secondary, main]; //! handy
console.log(main, secondary); // output: vegetarian italian

// creating ordering method to return an array for an order, then destructuring

console.log(restaurant.order(1, 0)); // output: array ["Bruschetta", "Pizza"];

//! return two values from a function
const [appetizer, mainCourse] = restaurant.order(1, 0);
console.log(appetizer, mainCourse);

//nested destructuring

const nested = [2, 4, [5, 6]];

//storing 2 and 5
const [val1, , val2] = nested;
console.log(val1, val2);

//storing 2, and [5,6]
const [i, , [j, k]] = nested;
console.log(i, j, k);

//say we don't know length of the below array, if we try to descructure 3 elements, third will be undefined.
//may happen irl, e.g. when getting data from APIs
const unknown = [8, 9];

const [q, w, e] = unknown;
console.log(q, w, e); // output 8 9 undefined

//to do this, set default values on left side
const [p = 1, l = 1, m = 1] = unknown;
console.log(p, l, m); // output 8 9 1

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||-------------------------------Destructuring OBJECTS---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
console.log(
  '---------------------Destructuring Objects------------------------'
);

//remember, objects not ordered like arrays are

//so, we just take the properties directly like so
const { name, openingHours, categories } = restaurant;
console.log(name, openingHours, categories);

//how to do above, but make variables names different to the poperty names
const {
  name: restaurantName,
  openingHours: hours,
  categories: tags,
} = restaurant;
console.log(restaurantName, hours, tags);

// like the 'default' values examples with arrays above, say we are destructuring data from an API, and we are trying
// to read a property that does not actually exist on the object. would return undefined
// similar thing as with arrays:

const { blah: starters = ['xx'] } = restaurant;
console.log(starters); // output: xx

// Mutating Variables

let a = 111;
let b = 999;
const obj = { a: 23, b: 7, c: 14 };

// {a, b} = obj; //we cannot change a and b by doing this (bc js sees code block {}, which we cannot assign anything to)
// so we myust wrap in parenth ()
({ a, b } = obj);
console.log(a, b);

// nested objects

const {
  fri: { open, close },
} = openingHours;

console.log(open, close);

//could even do:
const {
  fri: { open: o, close: c },
} = openingHours;
console.log(o, c);

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||-------------------------------Spread Operator---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
console.log('---------------------SPREAD OPERATOR------------------------');
// basically seperates entire contents of an array and places them individually
// can use spread operator when we would otherwise write individual values seperated by commas
// i.e. can only use when building an array or passing values into functions

// works on all 'iterables' (things like arrays, strings, maps, sets) (most data structures, except some objects)

const arr1 = [5, 6, 7, 8, 9];

const newArr1 = [1, 2, 3, 4, ...arr1];
console.log(newArr1); //output ARRAY: [1,2,3,4,5,6,7,8,9]

console.log(...newArr1); // output: 1 2 3 4 5 6 7 8 9 (not logged as array; logged individually)

// adding some items to beginning of a new menu array
const mainMenu2 = ['burger', 'sammich', ...restaurant.mainMenu];
console.log(mainMenu2);

// shallow-copy an array
const mainmenuCopy = [...restaurant.mainMenu];

// join 2 arrays or more
const wholeMenu = [...restaurant.mainMenu, ...restaurant.starterMenu];
console.log(wholeMenu);

//strings
//create array from letters of a word in a string, adding 'S.' at end
const str = 'benjamin';
const letters = [...str, 'S.'];
console.log(letters);

//logging string for pasta order with three ingredients specified via prompts
// const ingredients = [
//   prompt("Let's make pasta! Ingredient 1?"),
//   prompt("Let's make pasta! Ingredient 2?"),
//   prompt("Let's make pasta! Ingredient 3?"),
// ];
// restaurant.orderPasta(...ingredients); // see below for ingredients arr

// objects

//copy object and add new properties
const newRestaurant = { ...restaurant, owners: 'kok' };
console.log(newRestaurant);

//create ACTUAL copy of an object
const restaurantCopy = { ...restaurant };
restaurantCopy.name = 'cinqe terre';
console.log(restaurant.name); // logging both obj name properties to confirm they are different
console.log(restaurantCopy.name);

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||-------------------------------REST PATTERNS---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
console.log('---------------------Rest Patterns------------------------');

//opposite of spread operator in that the spread operator UNPACKS an array's elements into distinct variables,
//whilse a rest pattern PACKS/condenses values into an array.

//also, spread operator goes on RIGHT SIDE of =
// rest pattern goes on LEFT side of =

//?------------------ rest patterns with DESTRUCTURING

const arr3 = [1, 2, ...[3, 4]];

//REST pattern, see that it is on left side (Here we are destructuring)
const [a4, b5, ...others] = [1, 2, 3, 4, 5];

console.log(a4, b5, others); // output 1 2 [3, 4, 5]

//combining main menu and starter menu, excluding element[1] in mainmenu (risotto):
const [food1, , food2, ...otherfood] = [
  ...restaurant.mainMenu,
  ...restaurant.starterMenu,
]; // here, we use rest operator to grab the REST of the elements and store into 'otherfood' variable
// notice the skipped element was not included, hence 'REST'
console.log(food1, food2, otherfood);
//output Pizza Risotto ["Focaccia", "Bruschetta", "Garlic Bread", "Caprese Salad"]

// rest pattern in OBJECTS

const { sat: saturdayHours, ...weekdayHours } = restaurant.openingHours;
// REM with objects, since not ordered, must specify property to name the variable. e.g. 'sat: saturdayHours' here
// grabbing 'sat' property and saving it into saturdayHours. with ...weekdayHours rest pattern this is not necessary
// as it is simply grabbing the 'rest' of the properties

console.log(weekdayHours);

//? --------------rest patterns with FUNCTIONS

//like using spread operator to pass elements into function argument (see line 234)

//function to compile any given amount of number arguments (possible due to rest pattern..), and returning their avg
const add = function (...numbers) {
  //note we use rest ... syntax in parameter, but not in func body
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
};

console.log(add(2, 3)); // output [2, 3]
console.log(add(5, 10, 5, 5)); // output [3, 6, 3, 7];

// calling add func and passing in the below arr
const x = [23, 5, 7];
add(...x);
console.log(add(...x));
//notice how the syntax is exactly the same as using spread as argument.
//!spread used in arguments (func calling); rest used in paramater (func declaring)

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||-------------------------------Short circuiting (&& and ||)---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------

console.log('--------- OR || ---------');
// the OR operator (||) short circuits. if the first value is truthy, the right hand value is ignored.
//?simply returns the first truthy value, or the last value if all are falsy
console.log(3 || 'ben');
console.log('' || 'ben');
console.log(true || 0);
console.log(undefined || 0 || '' || 'hello' || 23 || null);

restaurant.numGuests = 0;
// say we want to check if restaurant obj has a property containing # of guests
// and if it doesn't, we want to set a default value of 10
// if it did, the variable would just = that of the property as the left hand operand is truthy.
const guests1 = restaurant.numGuests || 10;
console.log(guests1); // output 20 if numguests exists, 10 if not
//!REM however, this won't work if restaurant.numGuests exists and is 0. Why?

// we can fix this using the 'nullish coalescing operator' (??):
const guestsCorrect = restaurant.numGuests ?? 10;
console.log(guestsCorrect);
// very similar to OR (||) operator in that it returns the first value it sees as truthy (or 'not nullish').
// Works because ?? is concerned with nullish values (i.e 'null' and undefined). So in its eyes '0' is not falsy and
// therefore 0 is returned as it is treated as true

console.log('--------- AND && ---------');

//? && operator also short circuits, but upon evaluating a falsy value.
console.log(0 && 'ben'); // op 0

console.log('Hello' && 23 && null && 'ben'); // op = null, because it is falsy, evaluation stops
//i.e null makes it so that the result of the operation is going to be false anyway

// practical example
if (restaurant.orderPizza) {
  restaurant.orderPizza('mushrooms', 'spinach');
}

//better way, USING && SHORT CIRCUITING
restaurant.orderPizza && restaurant.orderPizza('shrooms', 'spich');
//if the property doesnt exist, the && operator evaluates it as falsy and therefore stops there. Right hand operand ignored
//if it does exist, right hand operand is evaluated and the function is called

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||-------------------------------Looping arrays: the FOR-OF loop---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
console.log('---------------------FOR OF LOOP------------------------');

// Syntax =
// for (variable of iterable) {
//    statement
// }

for (const item of wholeMenu) console.log(item);

// access element indexes of an array with for of loop and destructuring.
for (const [i, el] of wholeMenu.entries()) console.log(`${i + 1}: ${el}`);
// works becasue output for wholeMenu.entries are arrays for each item like [1, Pizza] [2, Pasta];
// i.e .entries outputs the index and actual element value in an array.

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||-------------------------------Enhanced Object literals---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
console.log(
  '---------------------Enhanced Object Literals------------------------'
);

// can ADD a property consisting of a variable (e.g a seperate object or array etc) to an object simply by adding the variable name to the object
const alreadyExistingObject = {
  prop1: 10,
  prop2: 5,
};
// add it to the below obj:
const obbjj = {
  [`num-${10 + alreadyExistingObject.prop2}`]: 50, // prop name becomes 'num-15'
  color: 'green',
  alreadyExistingObject,
};
console.log(obbjj);

// easier syntax to add method to obj:

const obj247 = {
  prop1: 10,
  prop2: 5,
  testMethod(parr1, parr2) {
    // notice no ':' needed, and no 'function' needed.
    console.log(parr1, parr2);
  },
};

// it is possible to COMPUTE property names. see obbjj line 389

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------- Optional Chaining ---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
console.log('---------------------Optional Chaining------------------------');

// useful for checking deeply nested properties

// say we are getting data like the restaruant obj above from an API, and we don't know when restaurants are open on what days
// e.g. we want to check monday opening hours, if they exist

//instead of doing:
if (restaurant.openingHours && restaurant.openingHours.mon)
  console.log(restaurant.openingHours.mon.open);

// we use optional chaining operator
console.log(restaurant.openingHours?.mon?.open);
// only logs if .mon and .openingHours properties are not nullish (not null or undefined) - prevents error.
// ouput: undefined

// real world example:
// to loop over 'days' arr and return whether it is open or not
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

for (const day of days) {
  restaurant.openingHours[day]?.open && console.log(`Open on ${day}`);
} //! REMEMBER - since here we are using variable name 'day' as the property name, we MUST use bracket notation!
// output: open on thu
// output: open on fri

// more specific outputs for above
for (const day2 of days) {
  const openTime = restaurant.openingHours[day2]?.open ?? 'closed'; //REM (see nullish coalescing operator section. Necessary here as sat.open is 0)
  console.log(`On ${day2} we are open at ${openTime}`);
}

// for (const day3 of days) {
//   const openTime = restaurant.openingHours[day3]?.open; // storing opening time in variable for usage in string
//   openTime ?? console.log(`On ${day3} we are closed`);
//   opentime && console.log(`On ${day3} we are open at ${openTime}`);
// }

// METHODS - can also use opt-chaining when calling methods (checking if it exists before calling)
console.log(restaurant.order?.(0, 1) ?? 'Method does not exist');
console.log(restaurant.order3wdfsdf?.(0, 1) ?? 'Method does not exist'); // op: method does not exist

// ARRAYS -
const users = [
  {
    name: 'Ben',
    email: 'geer@goor.com',
    age: 27,
  },
  {
    name: 'kyochi',
    email: 'kyo@goor.com',
    age: 55,
  },
];

console.log(users[0].name); // just noting here the syntax for simply getting one of the properties from an obj inside an arr
console.log(users[0]?.name ?? 'User array empty');

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------- LOOPING OVER OBJECTS: keys, objects, entries ---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
console.log(
  '-------------LOOPING OVER OBJECTS: keys, objects, entries----------------'
);

// property NAMES
//! Object.keys
let openStr = `we are open on ${Object.keys(openingHours).length} days: `; // string variable

// logging each day in the openingHours property (which is a nested obj)
for (const dayy of Object.keys(openingHours)) {
  openStr += `${dayy} `; // using temp-lit here to add spaces
}

console.log(openStr); // logging days restaurant is that are open

// property VALUES
//! Object.values
const values = Object.values(openingHours);
console.log(values);

// ENTIRE OBJECT
const entries = Object.entries(openingHours);
console.log(entries);

for (const [key, { open, close }] of entries) {
  // REM USING DESTRUCTURING. see how since the 'value' of each day is also an object (containing open and close), we need to nest another destructuring assignment
  console.log(`On ${key} we open at ${open} and close at ${close}`);
}

//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------- WORKING WITH STRINGS ---------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
//* ||||------------------------------------------------------------------------------------------------------------------------
console.log('--------------strings-----------');

const airline = 'TAP Air Portugal';
const plane = 'A320';

// get char at a specific position in a string
console.log(plane[0]);
// can get .length like arrs
console.log(airline.length);

// string methods

// get position# of a specific char in a string
console.log(airline.indexOf('r'));
// get position# of the LAST-occuring specific char in a string
console.log(airline.lastIndexOf('r'));
// get position of a word (returns index of first char) (case sensitive)
console.log(airline.indexOf('Air'));

// SLICE method

// example use case - extract part of a string using Slice method
// syntax: slice(beginIndex, endIndex)
console.log(airline.slice(4)); // op: 'Air Portugal' (sliced at pos#4). DOES NOT CHANGE/MUTATE ORIGINAL STRING
// methods like this always return a new string. impossible to mutate strings as they are primitives
// remaining string is called a 'Substring'
// using endIndex parameter as well:
console.log(airline.slice(4, 7)); // op: 'Air'

// extract first word without knowing indexes
console.log(airline.slice(0, airline.indexOf(' '))); // used the first-occuring empty space char to isolate first word

// extract last word
console.log(airline.slice(airline.lastIndexOf(' ') + 1)); // space was included, so +1 to increase slice index

// can use a negative beginIndex arg - counts backwards
console.log(airline.slice(-2)); // op: al
// pos beginIndex neg endIndex
console.log(airline.slice(1, -1)); // op: AP Air Portuga

// func - receives airplane seat, logs if middle seat or not (B and E are middle seats)
function middleSeat(seat) {
  seat.indexOf('B') === -1 && seat.indexOf('E') === -1
    ? console.log('NOT middle seat!')
    : console.log('middle seat...');
}
//another way:
function middleSeat2(seat) {
  const s = seat.slice(-1); // isolates last char in seat
  s === 'B' || s === 'E'
    ? console.log('middle seat...')
    : console.log('NOT middle seat!');
} //? could also use .includes for boolean

console.log('--------firstfunc--------');
middleSeat('11C');
middleSeat('11B');
middleSeat('3E');

console.log('--------secondFunc--------');
middleSeat2('11C');
middleSeat2('11B');
middleSeat2('3E');

// changing strings to upper/lowercase

const airlineAu = 'Quantas Airlines';

console.log(airlineAu.toUpperCase());
console.log(airlineAu.toLowerCase());

// fix capitalisation example

const passenger = 'bEn';
const passengerLc = passenger.toLowerCase();
const passengerCorrect = passengerLc[0].toUpperCase() + passengerLc.slice(1);
console.log(passengerCorrect);

// compare user input email example (trim method)

const email = 'goor@geer.com';
const loginEmail = '  goor@GEER.Com \n';

const emailLc = loginEmail.toLowerCase();

const emailTrimmed = emailLc.trim(); // removes all whitespace
console.log(emailTrimmed);

// BETTER WAY - doing all in one step
const normalizedEmail = loginEmail.toLowerCase().trim();
console.log(normalizedEmail);

// REPLACING parts of strings

// convert usa price formatting to UK
const priceUSA = '210.34$';
const priceEU = priceUSA.replace('.', ',').replace('$', '£');
console.log(priceEU); // op: 210,34£

// replace multiple entire words

// change 'door' to 'gate' (.replaceAll method)
const announcement =
  'All passengers come to boarding door 23. Boarding door 23!';
const announcementFixed = announcement.replaceAll('door', 'gate');
console.log(announcementFixed);

// BOOLEAN methods (includes, startsWith, endsWith)

const plane2 = 'A320neo';
console.log(plane.includes('A3'));
console.log(plane.startsWith('A3'));

// practice - check baggage to see if passenger is allowed on plane
const checkBaggage = function (items) {
  const baggage = items.toLowerCase(); // commonly used to convert user inputs to lowercase for case sensitivity
  baggage.includes('knife') || baggage.includes('gun')
    ? console.log('passenger not allowed to board')
    : console.log('passenger cleared to board');
};

checkBaggage('I have a laptop, some food, and a Knife'); // if not for .toLowerCase in func, 'Knife' wouldn't be detected
checkBaggage('I have snacks and a book');
checkBaggage('I have spare clothes and a gun');

// SPLIT method - seperates strings based on a seperator. outputs arr.

console.log('a-very-nice-string'.split('-')); // op: arr ["a", "very", "nice", "string"]

// using destructuring

const fullName = 'Ben Heath';

const [firstName, lastName] = fullName.split(' ');
console.log(firstName, lastName);

// say we want to name lastName uppercase, and add 'Mr' at the beginning
const nameFunc = function (name) {
  const [fName, lName] = name.split(' '); //! handy
  const lNameU = lName.toUpperCase();
  const fNameC = fName[0].toUpperCase() + fName.slice(1);
  const title = 'Mr';
  console.log(`${title} ${fNameC} ${lNameU}`);
};
nameFunc(fullName);
nameFunc('goor geer');

// BETTER WAY USING JOIN method - essentially opposite of split method. Joins arr elements into a str
//sytax: join(separator) (e.g. if ['a','b','c'] _____ join('--')) = 'a--b--c'

const nameArr = ['Mr', firstName, lastName.toUpperCase()].join(' ');
console.log(nameArr);

// capitalize first letter of multiple words
const ppassenger = 'jessica ann smith davis';

const capitalizeName = function (name) {
  const split = name.split(' ');
  const namesUpperCase = [];

  for (const i of split) {
    namesUpperCase.push(i.replace(i[0], i[0].toUpperCase()));
  }
  console.log(namesUpperCase.join(' '));
};

capitalizeName(ppassenger);

//! Camel case func
const camelCase = function (input) {
  const split = input.split(' '); // splits input into arr
  const upperCase = []; // arr for pushing uppercased words

  for (const i of split) {
    upperCase.push(i.replace(i[0], i[0].toUpperCase())); // pushing uppercased words to arr
  }
  const joined = upperCase.join(''); // joining arr elements into str with '', i.e no gap
  console.log(joined);
};

camelCase(ppassenger);
camelCase('one two three four five six seven eight');

// PADDING a string. (to add chars to a string until it reaches a desired length)

const message = 'Go to gate 23!';
console.log(message.padStart(25, '+'));
console.log(message.padEnd(25, '+'));

// example - masking credit card deets

const maskCreditCard = function (number) {
  const str = number + ''; // works because + operator detects string operand, so converts all operands to string.
  // could just do String(number);
  const removeNums = str.slice(-4); // removing all nums except last 4
  const maskPadded = removeNums.padStart(str.length, 'X');
  console.log(maskPadded);
};

maskCreditCard(1225567892831994);
maskCreditCard('1225567892831994');

// REPEAT method

const message2 = 'Congestion ahead ... Proceed with caution... ';

console.log(message2.repeat(5)); // output is the string joined to itself 5 times

// using repeat in a function
const planesWaiting = function (n) {
  console.log(`There are ${n} planes waiting! ${' <o> '.repeat(n)}`);
};
planesWaiting(5);
planesWaiting(10);

// Isolating data from messy string
const flights2 =
  '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

const getCode = str => str.slice(0, 3).toUpperCase(); // refactor

for (const flight of flights2.split('+')) {
  const [msg, origin, dest, time] = flight.split(';');
  const output = `${msg.includes('Delayed') ? 'X' : ''}${msg.replaceAll(
    '_',
    ' '
  )} from ${getCode(origin)} to ${getCode(dest)} (${time.replace(
    ':',
    'h'
  )})`.padStart(45);
  console.log(output);
}
