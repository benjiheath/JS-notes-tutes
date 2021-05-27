'use strict';

// accounts
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2021-05-15T10:17:24.185Z',
        '2021-05-16T16:33:06.386Z',
        '2021-05-17T12:43:26.374Z',
        '2021-05-18T12:49:59.371Z',
        '2021-05-19T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2021-05-16T16:33:06.386Z',
        '2021-05-17T14:43:26.374Z',
        '2021-05-18T18:49:59.371Z',
        '2021-05-19T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// empty the movements container
containerMovements.innerHTML = '';

const now = new Date(); /* 
 
 
 
 
 


 
 
*/ // ==============================================================================================
// ================================================================================================
// #                                     Functions
// ================================================================================================
// ================================================================================================

// => Add username properties
const addUsernames = function (accs) {
    accs.forEach(acc => {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
addUsernames(accounts); /* 
 
 
 
 
 
 
 
*/ // =>  add Deposits & Withdrawal properties
const addDepositsWithdrawals = accs => {
    accs.forEach(acc => {
        acc.deposits = acc.movements.filter(mov => mov > 0);
    });
    accs.forEach(acc => {
        acc.withdrawals = acc.movements.filter(mov => mov < 0);
    });
}; /* 
 
 
 
 
 
 
 
*/ // =>  format movement date (Intl)
const formatMovementDate = function (date, locale) {
    // if days passed <1, display 'today'; if >1 && <2, display 'yesterday

    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(now, date); // passing in current date & date of event

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else {
        //using API:
        return new Intl.DateTimeFormat(locale).format(date);
        // const day = `${date.getDate()}`.padStart(2, 0); // padStart to make 'X' '0X'
        // const month = `${date.getMonth() + 1}`.padStart(2, 0);
        // const year = date.getFullYear();
        // return `${day}/${month}/${year}`;
    }
}; /* 
 
 
 
 
 
 
 
*/ // =>  Format currency (Intl)
const formatCurrency = function (acc, targNum) {
    const formatBal = new Intl.NumberFormat(acc.locale, {
        style: 'currency',
        currency: acc.currency,
    }).format(targNum);

    return formatBal;
}; /* 
 
 
 
 
 
 
 
*/ //  =>  display transactions (with sort)
const displayMovements = function (acc, sort = false) {
    const movs = sort
        ? acc.movements.slice(0).sort((a, b) => a - b) // slice to avoid mutating original arr
        : acc.movements;

    movs.forEach(function (mov, i) {
        // create movement_row element

        const movType = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date, acc.locale);

        const formattedMov = new Intl.NumberFormat(acc.locale, {
            style: 'currency',
            currency: acc.currency,
        }).format(mov);

        const html = `
         <div class="movements__row">
         <div class="movements__type movements__type--${movType}">${
            i + 1
        } ${movType}</div>
         <div class="movements__date">${displayDate}</div>
         <div class="movements__value">${formatCurrency(acc, mov)}</div>
         </div>
`;

        containerMovements.insertAdjacentHTML('afterbegin', html); // afterbegin so that newest els (transactions) are placed at top
    });
}; /* 
 
 
 
 
 
 
 
*/ // =>  In/Out/Interest Summary
const displaySummary = acc => {
    const totalIn = acc.deposits.reduce((accu, val) => accu + val, 0);
    const totalOut = acc.withdrawals.reduce((accu, val) => accu + val, 0);
    labelSumIn.textContent = formatCurrency(acc, totalIn);
    labelSumOut.textContent = formatCurrency(acc, totalOut); // math.abs to get rid of '-' sign

    //^ Interest only paid on transaction if interest >= 1$

    const interest = acc.deposits
        .map(mov => (mov * currentAccount.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((accu, int) => accu + int, 0);
    labelSumInterest.textContent = formatCurrency(acc, interest);
}; /*
 
 
 

 
 
*/ // =>  Balance
const calcPrintBalance = acc => {
    acc.balance = acc.movements.reduce((accu, val) => accu + val, 0);
    labelBalance.textContent = formatCurrency(acc, acc.balance);
}; /* 
 
 
 


 
 
*/ // =>  logout timer
const startLogoutTimer = function () {
    const tick = () => {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        // in each call, print remaining time, 1000);
        labelTimer.textContent = `${min}:${sec}`;

        // when 0, stop timer and logout
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = 'Log in to get started';
            containerApp.style.opacity = 0;
        }

        // decrease 1s
        time--;
    };

    // set time to 5min
    let time = 60 * 5;

    // call timer every second
    tick(); // Initial call. exported to own fn to acheive instant execution on login (no 1s delay)\
    const timer = setInterval(tick, 1000);
    return timer; // returning timer so that check if one is running (from login handler)
}; /* 
 
 
 
 
 
 
*/ //  =>  refactor UI fns
const updateUI = function () {
    // clear movements container:
    containerMovements.innerHTML = '';
    // add change to deps/withdrawals
    addDepositsWithdrawals(accounts);
    // Display movements
    displayMovements(currentAccount);
    // Display balance
    calcPrintBalance(currentAccount);
    // Display summary
    displaySummary(currentAccount);
}; /* 
 
 
 
 








 
 
 
*/ // ==============================================================================================
// ================================================================================================
// #                                     Button Handlers
// ================================================================================================
// ================================================================================================

//@ ********************** Login ******************

let currentAccount, timer;
// if user & pin correct
// arrow button reveals layout

//! FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
    e.preventDefault(); // prevents btn from reloading page (default form behaviour)

    // set currentAcc var to match username input
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );

    //  check pin input against currentAccount pin - login if matched
    if (+inputLoginPin.value === currentAccount?.pin) {
        // Display UI
        containerApp.style.opacity = 100;
        // Display welcome message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(' ')[0]
        }!`;

        // Create current date and time
        // Intl API f or date/time

        // setting formatting options for date
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        };
        // gets users locale from browser
        const locale = navigator.language;
        labelDate.textContent = new Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now);

        // const now = new Date();

        // const day = `${now.getDate()}`.padStart(2, 0); // padStart to make '5' (for example) '05'
        // const month = `${now.getMonth() + 1}`.padStart(2, 0);
        // const year = now.getFullYear();
        // const hour = `${now.getHours()}`.padStart(2, 0);
        // const min = `${now.getMinutes()}`.padStart(2, 0);

        // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

        // Clear input fields (necessary due to enter key)
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur(); // unfocuses pin input field

        updateUI();

        // log out timer
        if (timer) clearInterval(timer);
        timer = startLogoutTimer();
    }
}); /* 
 
 
 
 
 
 
 
*/ //@ ********************** Transfers ******************

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = +inputTransferAmount.value;
    const recipient = inputTransferTo.value;
    const recipientAcc = accounts.find(acc => acc.username === recipient);

    if (
        currentAccount.balance >= amount &&
        amount > 0 &&
        recipientAcc?.username
    ) {
        // push negative amount to currentAccount's movements -
        currentAccount.movements.push(-amount);
        // push positive amount to recipient's movments +
        recipientAcc.movements.push(amount);

        // push date to sender and recipient
        currentAccount.movementsDates.push(now.toISOString());
        recipientAcc.movementsDates.push(now.toISOString());

        // Clear input fields (necessary due to enter key)
        inputTransferTo.value = inputTransferAmount.value = '';
        inputTransferTo.blur();
        inputTransferAmount.blur();

        updateUI();
    } else if (currentAccount.balance < amount) {
        alert(
            `Insufficient funds. You'll need another ${
                amount - currentAccount.balance
            }$ to make this transaction.`
        );
    }
    // log out timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
}); /* 
 
 
 
 
 
 
 
*/ //@ ********************** Request Loan ******************

// check if any deposit > 10% of loan amount

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Math.floor(+inputLoanAmount.value);

    const loanCondition = currentAccount.movements.some(
        mov => mov > amount * 0.1
    );
    if (amount > 0 && loanCondition) {
        // push amount to movements
        currentAccount.movements.push(amount);
        // push date to movementDates
        currentAccount.movementsDates.push(now.toISOString());

        // Clear input field
        inputLoanAmount.value = '';
        inputLoanAmount.blur();

        // updateUI (simulating loan approval delay)
        const loanTimer = setTimeout(() => updateUI(), 2000);

        // updateUI();
    }
    // log out timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
}); /* 
 
 
 
 
 
 
 
*/ //@ ********************** SORT movements ******************

let sorted = false;

btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    containerMovements.innerHTML = '';

    displayMovements(currentAccount, !sorted);
    sorted = !sorted;

    // log out timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
}); /* 
 
 
 
 
 
 
 
*/ //@ ********************** Close account and log out******************

btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (
        inputCloseUsername.value === currentAccount?.username &&
        +inputClosePin.value === currentAccount.pin
    ) {
        const index = accounts.findIndex(ind => ind === currentAccount);
        accounts.splice(index, 1);
        console.log(accounts);

        // Clear input fields
        inputCloseUsername.value = inputClosePin.value = '';
        inputClosePin.blur();
        inputCloseUsername.blur();

        // hide ui (logout)
        containerApp.style.opacity = 0;
    }
}); /* 
 
 
 
 































 
 
 
*/ //! Lectures
// ==============================================================================================
// ================================================================================================
// #                                     Converting & Checking Numbers
// ================================================================================================
// ================================================================================================

// numbers always represented internally as floating point numbers (with decimals)
// console.log(23 == 23.0); // output: true

//? Easier way to convert strings to numbers:

// instead of Number('23):
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px')); // output: 30
console.log(Number.parseInt('e23')); // output: NaN (because it didn't begin with a number)

console.log(Number.parseInt('2.5rem')); // output: 2
console.log(Number.parseFloat('2.5rem')); // output: 2.5

console.log(Number.isNaN(20)); // output: false
console.log(Number.isNaN('20')); // output: false
console.log(Number.isNaN(+'20x')); // output: true
console.log(Number.isNaN(23 / 0)); // output: false (dividing by 0 = infinity)

// Best way to check if value is a number
console.log(Number.isFinite(20)); // output: true
console.log(Number.isFinite('20')); // output: false
console.log(Number.isFinite(+'20x')); // output: false
console.log(Number.isFinite(23 / 0)); // output: false (dividing by 0 = infinity)

// there is also Number.isInteger
/* 
 
 
 
 
 
 
 
*/ // ==============================================================================================
// ================================================================================================
// #                                     Math & Rounding
// ================================================================================================
// ================================================================================================
// square root
console.log(Math.sqrt(25));

// cubic root
console.log(8 ** (1 / 3));

// get max value
console.log(Math.max(5, 18, 11));

// min value
console.log(Math.min(5, 18, 11));

// calc area of a circle with 10px radius
console.log(Math.PI * Number.parseFloat('10px') ** 2);

//? random numbers

//* Good way to generate random numbers between a specified range:
const randomInt = (min, max) => Math.round(Math.random() * (max - min) + min);

console.log(randomInt(20, 21));

//! Apparently the best way?
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

console.log(getRandomIntInclusive(20, 21));

//? Rounding integers

// Math.round
// Math.ceil ---- rounds up
// Math.floor --- rounds down

//! REM - .toFixed() always returns a STRING
/* 
 
 
 
 
 
 
 
*/ // ==============================================================================================
// ================================================================================================
// #                                     Remainder Operator
// ================================================================================================
// ================================================================================================

console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1 (1 is the remainder)

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2 (2 is the remainder)

//? check if even or odd
console.log(6 % 2); // if even, dividing by 2 will leave no remainder (0)
console.log(5 % 2);

const isEven = n => n % 2 === 0;

console.log(isEven(10));
console.log(isEven(21));
console.log(isEven(514));

//* useful for when you need to do something every 'nth' time
//? e.g. color every 2nd row of transactions

labelBalance.addEventListener('click', function () {
    [...document.querySelectorAll('.movements__row')].forEach(function (
        row,
        i
    ) {
        if (i % 2 === 0) row.style.backgroundColor = 'lightblue';
    });
}); /* 
 
 
 
 
 
 
 
*/ // ==============================================================================================
// ================================================================================================
// #                                     Creating Dates
// ================================================================================================
// ================================================================================================

const now3 = new Date();
console.log(now3);

// can parse from strings

// somewhat unreliable unless the string being parsed was created by JS

console.log(new Date('May 19 2021 07:20:02'));
console.log(new Date('December 24, 2015'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5)); // output: Thu Nov 19 2037 15:23:05 GMT+1000
// months are 0 based

console.log(new Date(0));

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear()); // 2037
console.log(future.getMonth()); // 10
console.log(future.getDate()); // 19
console.log(future.getDay()); // 4 (day in week, where 0 is Sunday)
console.log(future.getHours()); // 15
console.log(future.getMinutes()); // 23
console.log(future.getMilliseconds()); // 0

console.log(future.toISOString());

console.log(future.getTime()); // gets timestamp (msec since unix)

console.log(Date.now()); // current msec since unix

// change year in 'future' const
future.setFullYear(2040);
console.log(future);
/* 
 
 
 
 
 
 
 
*/ // ==============================================================================================
// ================================================================================================
// #                                     Date Operations
// ================================================================================================
// ================================================================================================

// can calc time passed between two dates (date 1 - date 2) using the timestamp (time passed in ms since unix)

const future2 = new Date(2037, 10, 19, 15, 23);
console.log(+future2); // converting to number (timestamp)

//? calculating days between two dates
const calcDaysPassed = (date1, date2) =>
    Math.abs(+date2 - +date1) / (1000 * 60 * 60 * 24);

//* good use case: when wanting to display 'yesterday' or 'today' instead of the actual date

console.log(
    calcDaysPassed(new Date(2037, 3, 14, 12, 5), new Date(2037, 3, 14, 15, 5))
);
/* 
 
 
 
 
 
 
 
*/ // ==============================================================================================
// ================================================================================================
// #                                     Intl API
// ================================================================================================
// ================================================================================================

// dates

// numbers

const num = 3884764.23;

// see mdn for more option properties
const options = {
    style: 'currency',
    unit: 'celsius',
    currency: 'AUD',
    // useGrouping: false,
};

console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num));

console.log(
    'Browser: ',
    new Intl.NumberFormat(navigator.language, options).format(num)
);
/* 
 
 
 
 
 
 
 
*/ // ==============================================================================================
// ================================================================================================
// #                                     Timers: setTimeout & setInterval
// ================================================================================================
// ================================================================================================
//? setTimeout
// callback only executed once

// syntax: setTimeout(function, milliseconds, param1, param2, ...)

const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
    (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
    3000,
    ...ingredients
);

if (ingredients.includes('spinach')) {
    clearTimeout(pizzaTimer);
}

// asynchronous (js continues reading chode - doesnt wait for callback to be executed after 3s)

//? setInterval
// callback executed every specified amount of ms

setInterval(() => {
    const now = new Date();
    console.log(now);
}, 5000);

// console clock

const clock = setInterval(() => {
    const now2 = new Date();
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    console.log(
        new Intl.DateTimeFormat(navigator.language, options).format(now2)
    );
}, 60000);
