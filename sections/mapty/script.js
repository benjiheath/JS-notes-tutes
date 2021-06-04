'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// # --------------------- Local storage API -----------------

//^ storing workouts in local storage

// syntax: storage.setItem(keyName, keyValue);
// both params are DOMstrings (need to convert object/arr to string using JSON.stringify())

const user1 = {
  name: 'ben',
  workouts: [],
};

const workouts = [1, 2, 5, 6];

localStorage.setItem('workout', JSON.stringify(workouts));

console.log(localStorage); /* 


 
 
 
 

*/ //^ utilizing the local storage to display on page load

// need to convert from string back to obj/arr

const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem('workout'));
  console.log(data);

  // if no local storage, do nothing
  if (!data) return;

  user1.workouts = data;
};

getLocalStorage();
console.log(user1);
