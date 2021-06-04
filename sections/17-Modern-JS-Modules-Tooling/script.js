// Importing module
// import {
//     addToCart,
//     totalQuantity,
//     totalPrice as price,
// } from './shoppingCart.js';
//+ // with 'as' we are renaming totalPrice to 'price' within this context

// addToCart('bread', 5);
// // console.log(cart); // not defined

console.log('Importing module');

// //* import all exports from a module
// import * as ShoppingCart from './shoppingCart.js';

// ShoppingCart.addToCart('bread', 5);

// importing default export fn from shoppingCart
import add, { cart } from './shoppingCart.js';
add('pizza', 2);
add('bread', 5);
add('apples', 4);

console.log(cart); /* 
 
 
 



 
 
*/ // some basic command line commands

// cd .. = go up a folder
// ls = show files/folders
// enter a selected folder = cd foldername
// make new folder = mkdir foldername
// make file = touch file
// rm = delete
// move a file up a folder: mv filename ../
// delete a folder = rmdir
/* 
 
 



 
 
 
*/ // # --------------------- NPM -----------------

// import cloneDeep from './node_modules/lodash-es/cloneDeep.js'; // not practical; just for demo purposes
import cloneDeep, { camelCase } from 'lodash-es';

const state = {
    cart: [
        { product: 'bread', quantity: 5 },
        { product: 'pizza', quantity: 3 },
    ],
    user: { loggedIn: true },
};

const stateClone = Object.assign({}, state);
// state.user.loggedIn = false;
console.log(stateClone);

const stateDeepClone = cloneDeep(state);
console.log(stateDeepClone);

// when sharing/git, don't include node_modules

// npm install - installs based on package.json

// # --------------------- Bundling with parcel & npm scripts -----------------

// REM updates modules in browser without needing page refresh (maintains state)
if (module.hot) {
    module.hot.accept();
}

// npm scripts

// added "start": "parcel index.html" to package.json
// can then simply npm run start

class Person {
    greeting = 'Hey';
    constructor(name) {
        this.name = name;
        console.log(`${this.greeting}, ${this.name}`);
    }
}

const jonas = new Person('jonas');

console.log(jonas);

console.log(cart.find(el => el.quantity >= 2));
