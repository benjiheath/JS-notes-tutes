'use strict';

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Default Parameters ---------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

//? pushing booking information from an obj into an arr

const bookings = [];

const createBooking = function (
  flightNum,
  numPassengers = 1,
  price = 199 * numPassengers // price multiplied by numPassengers
) {
  // default parameters
  const booking = {
    flightNum, // notice enhanced object literal syntax (can just pass in var(parameters in this case) names without having to use 'property: key' syntax)
    numPassengers,
    price,
  };
  console.log(booking);
  bookings.push(booking);
};

createBooking('LH123');
createBooking('LH123', 3, 250);
createBooking('LH123', 2); // price = 398 since default value was multiplied by 2 passengers

//? to skip entering a parameter, e.g. skipping 'numPassengers':
createBooking('LH123', undefined, 220);

console.log(bookings);

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Passing args into funcs: value vs reference ---------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

const flight = 'LH234';
const ben = {
  name: 'Ben',
  passport: 247837420,
};

const checkIn = function (flightNum, passenger) {
  flightNum = 'LH999';
  passenger.name = 'Mr. ' + passenger.name;

  if (passenger.passport === 247837420) {
    // alert('Checked in');
  } else {
    // alert('Wrong passport!');
  }
};

checkIn(flight, ben);

console.log(flight); // output: LH234 (unchanged by line 50)
console.log(ben); // output: {name: "Mr. Ben", passport: 247837420} -- see name WAS changed by line 51

const newPassport = function (person) {
  person.passport = Math.random() * 100000000;
};

newPassport(ben);
checkIn(flight, ben);
console.log(ben);

//! a main point is to be careful with passing in objects in functions as the original obj can easily be mutated

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- First-class and higher-order functions  ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

//* see funcs.png

//* First-class functions

// since functions are technically a type of 'object' in JS, rmb that they are treated as values
// which is why they can be stored in vars and objs, and passed in as arguments
// can also return functions FROM functions

//* Higher order functions
// are functions that RECEIVE another function as an argument (a callback function), or
// return a new function, or both

//? Creating a higher order function (accepting callback functions)

const oneWord = function (str) {
  return str.replace(/ /g, '').toLowerCase();
}; // func to replace all empty space with empty string

const upperFirstWord = function (str) {
  const [first, ...others] = str.split(' ');
  return [first.toUpperCase(), ...others].join(' ');
}; // func to make first word uppercase

//HIGHER ORDER FUNCTION with callbacks
const transformer = function (str, func) {
  console.log(`passed string: ${str}`);
  console.log(`Transformed string: ${func(str)}`);

  console.log(`transformed by: ${func.name}`);
};

transformer('Motorcycle on the roof', upperFirstWord);

transformer('Motorcycle on the roof', oneWord);

//? forEach function used on arrs

const high5 = () => console.log(`high 5`);

const nm = ['Ben', 'mcgee', 'bob'];
nm.forEach(high5); // pass in a callback function to be used on each element
// output = high 5 x 3, since there are 3 elements

//* ------------------- Functions returning functions
//* -------------------------------------------------

// const greet = function (greeting) {
//   return function (name) {
//     console.log(`${greeting} ${name}`);
//   };
// };

// using arrow funcs
const greet = greeting => name => console.log(`${greeting} ${name}`);

const greeterWelcome = greet('Welcome'); // storing 'greet' func result in var, which is the child function
greeterWelcome('Ben'); // calling
// output: 'Welcome Ben'

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Call, Apply and BIND methods ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

const quantas = {
  airline: 'Quantas',
  iataCode: 'QA',
  bookings: [],
  book(flightNum, name) {
    console.log(
      `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`
    );
    this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
  },
};

quantas.book(246, 'Ben Heath');
quantas.book(333, 'Stevy 9Lives');

console.log(quantas.bookings);

const eurowings = {
  airline: 'Eurowings',
  iataCode: 'EW',
  bookings: [],
  book() {},
};

const book = quantas.book; // storing the book method from quantas obj into external function for use with different objs

// book(444, 'axe exe'); //! TypeError due to 'this' keyword = undefined (since no longer a method)

//* to fix this we can use one of three methods: call, apply, and bind

//? CALL method -----------

book.call(eurowings, 444, 'axe exe'); // syntax func.call(targetObj, arg1, arg2 etc)
// sets 'this' keyword to the first arg specified ('eurowings' in this case)
console.log(eurowings.bookings);

book.call(quantas, 444, 'Mary Cooper');
console.log(quantas.bookings);

const swiss = {
  airline: 'Swiss Air Lines',
  iataCode: 'SAL',
  bookings: [],
};
book.call(swiss, 555, 'Mary Smith');
console.log(swiss.bookings);

//? APPLY Method

// takes target obj as first arg, then an array of the args as 2nd arg.

const flightData = [583, 'George Cooper'];
book.apply(swiss, flightData);
console.log(swiss.bookings);

//not used a lot in modern js since we can do this instead, using spread operator:
book.call(swiss, ...flightData);

//? -----------------------------------------
//? --------------BIND method ---------------
//? -----------------------------------------

// takes target obj as arg, to replace 'this' keyword.
// DOES NOT CALL the function; simply RETURNS a new function with the 'this' keyword replaced

// so store in variable. Here we can make store funcs for all the airlines
// this way we wouldnt have to use book.call all the time.

const bookSAL = book.bind(swiss);
const bookEW = book.bind(eurowings);
bookSAL(601, 'Steve Smith');
console.log(swiss.bookings);

// ALSO binds further args, if specified. (this is called partial application)
// e.g here we make a func for booking EW flights for flight 444:

const bookEW444 = book.bind(eurowings, 444);
bookEW444('Sam Cook'); // here we pass the remaining arg that isnt binded, which is name
console.log(eurowings.bookings);

//? objects event listeners (good .bind use case)

quantas.planes = 300;
quantas.buyPlane = function () {
  console.log(this); // THIS KEYWORD IS POINTING TO THE BUTTON ELEMENT as it is being called by the event listener

  this.planes++;
  console.log(this.planes);
};

//fix using bind:

const buyPlane = quantas.buyPlane;
const buyPlaneQA = buyPlane.bind(quantas);

document.querySelector('.buy').addEventListener('click', buyPlaneQA);

// Partial application

const addTax = (rate, value) => value + value * rate;
console.log(addTax(0.1, 200));

// here we are just trying to add VAT, which is always 23%. But since we don't care abt 'this' keyword here, we use 'null' as first arg in the syntax
const addVAT = addTax.bind(null, 0.23);
console.log(addVAT(200));

// CHALLENGE - doing same without using bind (using function returning function)

const addTaxRate = rate => value => value + value * value;
const addVAT2 = addTaxRate(0.23);
addVAT2(200);

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Immediately-Invoked Function Expressions ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

// IIFEs are functions that are immediately run as soon as they are defined. Run only once -- cannot be called after.

(function () {
  console.log('iife');
})();

// with arrow

(() => console.log('iife'))();

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Closures -------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

// A closure secures a function's access to variables of its parent function at the functions' time of creation , even after the parent function has returned/completed.
// The function keeps a reference to its outer scope.

// below, returned function has continuous access to passengerCount even though the function completes

//! a closure is like a backpack that a function carries around everywhere. The backpack contains all of the variables that were present in the environment where the func was created.

const secureBooking = function () {
  let passengerCount = 0;

  return function () {
    passengerCount++;
    console.log(`${passengerCount} passengers`);
  };
};

const booker = secureBooking();

booker();
booker();
booker();

console.dir(booker); // see output - secureBooking has closure including passengerCount

// Another closure example:

// no need to return a func from a func to create a closure

let f;

const g = function () {
  const a = 23;
  f = function () {
    console.log(a * 2);
  };
};

g();
f();

console.dir(f); // g has closure including a

// Another example:
//? inc setTimeout Function (timer)

const boardPassengers = function (n, waitTimeSeconds) {
  const perGroup = n / 3;

  setTimeout(function () {
    console.log(`We are now boarding all ${n} passengers`);
    console.log(`There are 3 groups, each with ${perGroup} passengers`);
  }, waitTimeSeconds * 1000); // func executes after (waitTime * 1000 miliseconds)

  console.log(`Will start boarding in ${waitTimeSeconds} seconds`);
};

boardPassengers(180, 5);

// Challenge 2:

(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';
  document.querySelector('body').addEventListener('click', function () {
    header.style.color = 'blue';
  });
})();

/* even though IIFE is already executed, callback function 'captured' its variable environment (closure), which included the header var.
So, upon click, the callback function retains access to it and successfully changes the h1 color. */
