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

/*like the 'default' values examples with arrays above, say we are destructuring data from an API, and we are trying
to read a property that does not actually exist on the object. would return undefined*/
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

/* opposite of spread operator in that the spread operator UNPACKS an array's elements into distinct variables,
whilse a rest pattern PACKS/condenses values into an array. */
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
/* REM with objects, since not ordered, must specify property to name the variable. e.g. 'sat: saturdayHours' here
is grabbing 'sat' property and saving it into saturdayHours. with ...weekdayHours rest pattern this is not necessary
as it is simply grabbing the 'rest' of the properties*/

console.log(weekdayHours);

//? --------------rest patterns with FUNCTIONS

//like using spread operator to pass elements into function argument (see lines 217-223)

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
//spread used in arguments (func calling); rest used in paramater (func declaring)
