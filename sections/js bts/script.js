'use strict';

//This keyword

/*!REM THIS keyword only references the object that called it in the first place. Notice below the botsky.calcage function
correctly uses the year from 'botsky' object as that is the object that is calling it. */

/*

const currentYear = 2021;

const ben = {
  name: 'ben heath',
  year: '1993',
  calcage: function () {
    const age = currentYear - this.year;
    console.log(age);
    return age;
  },
};

ben.calcage();

const botsky = {
  name: 'botsky jans',
  year: 1991,
};

botsky.calcage = ben.calcage; // adding new property (method in this case). basically copying 'calcage' method from 'ben' obj

botsky.calcage();


*/

//* ------------- PRIMITIVES VS OBJECTS ------------------
//primitives include num,string,bool,undefined,null,symbol,bigint

//objs (reference values) include object literals, arrays, functions etc

let age = 28;
let oldAge = age; // see output how oldAge remains as 28 due to being above 'age=29' in the code
age = 29;

console.log(age, oldAge); // output 29, 28

//same but with obj...
const me = {
  name: 'ben',
  age: 29,
};

const friend = me;
friend.age = 27; // see output below. friend obj changed the 'me' obj...

console.log('friend:', friend); //output shows age as 27
console.log('me:', me); //output shows age as 27

// (SEE .png)
// primitives stored in callstack
// objects stored in memory heap

//so, const is only immutable via primitives. Whereas const objects are mutable.
// this is because what is actually 'constant' is the value in the stack, which in the case of objs, is a reference value to value in the memory heap

let lastName = 'Heath';
let oldLastName = lastName;
lastName = 'Davis';
console.log(lastName, oldLastName);

const jessica = {
  firstName: 'Jessica',
  lastName: 'Williams',
  age: 27,
};

const marriedJessica = jessica;

marriedJessica.lastName = 'Smith';

console.log('Before marriage:', jessica);
console.log('After marriage:', marriedJessica);

// how to actually copy an object and change a property without mutating the original

const jessica2 = {
  firstName: 'Jessica',
  lastName: 'Williams',
  age: 27,
  family: ['alice', 'bob'],
};

const jessicaCopy = Object.assign({}, jessica2); // see mdn for easy syntax explanation
//ONLY WORKS ON FIRST LEVEL i.e if original obj has an array within it for example, the array will be mutated if changed
//i.e is a 'shallow copy'
jessicaCopy.lastName = 'davis';
console.log(jessicaCopy.lastName);
