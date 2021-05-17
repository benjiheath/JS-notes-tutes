'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

//
//
//
//
//
//
//
//
//
//
// -***************************************************************************
// -********************** Functions ******************************************
// -***************************************************************************

//? Add username properties

const addUsernames = function (accs) {
    accs.forEach(acc => {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
addUsernames(accounts);

//? add Deposits & Withdrawal properties

const addDepositsWithdrawals = accs => {
    accs.forEach(acc => {
        acc.deposits = acc.movements.filter(mov => mov > 0);
    });
    accs.forEach(acc => {
        acc.withdrawals = acc.movements.filter(mov => mov < 0);
    });
};

//? display transactions (contains sort functionality)

const displayMovements = function (acc, sort = false) {
    const movs = sort
        ? acc.movements.slice(0).sort((a, b) => a - b) // slice to avoid mutating original arr
        : acc.movements;

    movs.forEach(function (mov, i) {
        // create movement_row element

        const movType = mov > 0 ? 'deposit' : 'withdrawal';

        const html = `
         <div class="movements__row">
         <div class="movements__type movements__type--${movType}">${
            i + 1
        } ${movType}</div>
         <div class="movements__value">${mov} $</div>
         </div>
`;

        containerMovements.insertAdjacentHTML('afterbegin', html); // afterbegin so that newest els (transactions) are placed at top
    });
};

//? Calc and display in/out/interest summaries

const displaySummary = acc => {
    const totalIn = acc.deposits.reduce((accu, val) => accu + val, 0);
    const totalOut = acc.withdrawals.reduce((accu, val) => accu + val, 0);
    labelSumIn.textContent = `${totalIn} $`;
    labelSumOut.textContent = `${Math.abs(totalOut)} $`; // math.abs to get rid of '-' sign

    // Interest only paid on transaction if interest >= 1$

    const interest = acc.deposits
        .map(mov => (mov * currentAccount.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((accu, int) => accu + int, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}$`;
};

//? calc and display balance using reduce

const calcPrintBalance = acc => {
    acc.balance = acc.movements.reduce((accu, val) => accu + val, 0);
    labelBalance.textContent = `${acc.balance} $`;
};

// refactor UI fns
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
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// -***************************************************************************
// -**************************** Button handlers ******************************
// -***************************************************************************

//? -********************** Login ******************

let currentAccount;
// if user & pin correct
// arrow button reveals layout

btnLogin.addEventListener('click', function (e) {
    e.preventDefault(); // prevents btn from reloading page (default form behaviour)

    // set currentAcc var to match username input
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );

    //  check pin input against currentAccount pin - login if matched
    if (Number(inputLoginPin.value) === currentAccount?.pin) {
        // Display UI
        containerApp.style.opacity = 100;
        // Display welcome message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(' ')[0]
        }!`;

        // Clear input fields (necessary due to enter key)
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur(); // unfocuses pin input field

        updateUI();
    }
});

//? -********************** Transfers ******************

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
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
});

//? -********************** Request Loan ******************

// check if any deposit > 10% of loan amount

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);

    const loanCondition = currentAccount.movements.some(
        mov => mov > amount * 0.1
    );
    if (amount > 0 && loanCondition) {
        currentAccount.movements.push(amount);

        // Clear input field
        inputLoanAmount.value = '';
        inputLoanAmount.blur();

        updateUI();
    }
});

//? -********************** SORT movements ******************

let sorted = false;

btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    containerMovements.innerHTML = '';

    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});

//? -********************** Close account and log out******************

btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (
        inputCloseUsername.value === currentAccount?.username &&
        Number(inputClosePin.value) === currentAccount.pin
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
});

//---------------------------------------------------------------------
//---------------------------------------------------------------------
//? Mapping initials from account names into seperate arr (test)
//---------------------------------------------------------------------
//---------------------------------------------------------------------

// const makeUsernames = arr => {
//     const accInitials = arr.map(n => {
//         // split first and last into arr
//         const split = n.owner.split(' ');

//         // slice first letter from each
//         const firstLetters = split.map(w => w.slice(0, 1)); // or, return w[0]

//         // return joined lowercased initials to mapped arr
//         return firstLetters.join('').toLowerCase();
//     });
//     return accInitials;
// };

// console.log(makeUsernames(accounts));

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Simple array methods ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

let arr = ['a', 'b', 'c', 'd', 'e'];

//? SLICE - extract elements
//* does not mutate
// extract part of an arr without mutating the original arr (take a slice)

// parameters (startIndex)
// or
// parameters (startIndex, endIndex)
console.log(arr.slice(2)); // output: ['c', 'd', 'e']
console.log(arr.slice(2, 4)); // output: ['c', 'd']
console.log(arr.slice(-2)); // REM can enter neg parameters output: ['d', 'e']
// how to get the last element of any arr:
console.log(arr.slice(-1));

// can use .slice to make shallow copy of any arr (simply call without any args)
// same outcome as using spread operator
// splice would be needed if we were trying to chain arr methods like arr.slice.method1.method2

let arr2 = [...arr];
arr2 = arr.slice();

//? SPLICE - DELETE elements  ----------------------------
//! mutates
// like slice, but DOES mutate original arr

// syntax from mdn:
// splice(start)
// splice(start, deleteCount)
// splice(start, deleteCount, item1)
// splice(start, deleteCount, item1, item2, itemN)

console.log(arr2.splice(2)); // output: ['c', 'd', 'e']
console.log(arr2); // output: ['a', 'b']]

// in real world, typically the spliced elements are not of interest to us.
// e.g. deleting last el of an arr
arr.splice(-1);
console.log(arr);

//? REVERSE  ----------------------------
//! mutates

arr = ['a', 'b', 'c', 'd', 'e'];

const arr3 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr3.reverse()); // output: ["f", "g", "h", "i", "j"]

//? CONCAT ----------------------------
//* does not mutate - returns new arr
// MERGE two or more arrs

const letters = arr.concat(arr3);
console.log(letters); // output: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]

//? JOIN
console.log(letters.join(' - ')); // output: a - b - c - d - e - f - g - h - i - j

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Looping arrays: forEach ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
    movement > 0
        ? console.log(`${i}: you deposited ${movement}`)
        : console.log(`${i}: you withdrew ${Math.abs(movement)}`);
    // Math.abs removes the '-' sign
}

//? using forEach loop:

// SYNTAX:

// targetArr.forEach ( function (element))
// targetArr.forEach(function (element, index)
// or
// forEach(function(element, index, arr))

// ----- Arrow function
// forEach((element) => { ... } )
// forEach((element, index) => { ... } )
// forEach((element, index, array) => { ... } )
console.log('-------------forEach--------------');

movements.forEach(function (movement, i) {
    movement > 0
        ? console.log(`${i}: you deposited ${movement}`)
        : console.log(`${i}: you withdrew ${Math.abs(movement)}`);
});

// fundamental different between for of loops and forEach loops are that you CANNOT break out of a for of loop

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- MAP, FILTER, REDUCE ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

// MAP similar to forEach (loops over els) but creates a new arr with the resultant values from a callback func
// typically much more useful than the forEach method

// FILTER filters for els in original arr that satisfy specified conditions into new arr

// REDUCE 'boils' down all arr els into a single value
// e.g. getting sum of all els

//? MAP ---------------------------------------------------------

const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300];

// convert from euro to USD
const eurToUsd = 1.1;

const m2Usd = movements2.map(mov => (mov * eurToUsd).toFixed(0));
console.log(m2Usd);

// create arr with dep/wdraw outputs
const movementDescriptions = movements2.map((mov, i) => {
    return `${i}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`;
});

console.log(movementDescriptions);

//? FILTER  ---------------------------------------------------------

const deposits = movements2.filter(mov => mov > 0);
console.log(deposits);

const withdrawals = movements2.filter(mov => mov < 0);
console.log(withdrawals);

//? REDUCE ---------------------------------------------------------

// one form of syntax is
// arr.reduce((accumulator, currentValue, index), initialValue)
// where the accumulator is the value that will be eventually returned
// where initialValue is the value that the accumulator begins at

const getTotal1 = arr => arr.reduce((accu, val) => accu + val, 0);

const totalDeposits = getTotal1(deposits);

console.log(totalDeposits);

const totalWithDrawals = getTotal1(withdrawals);

console.log(totalWithDrawals);

// get balance from transactions
const balance1 = getTotal1(movements2);

console.log(balance1);

//? get maximum of an arr
// each iteration: if current value > accu, return current val.
const maxMovement = movements2.reduce(
    (accu, val) => (val > accu ? val : accu),

    movements2[0]
);

console.log(maxMovement);

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- CHAINING METHODS ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

// can only chain an arr method after another if the previous one returned a new arr.
// e.g. can only .reduce last below

// bad practice to chain methods that mutate original arr

const movements3 = [200, 450, -400, 3000, -650, -130, 70, 1300];

const depositsToUsdSum = movements3
    .filter(mov => mov > 0)
    .map(mov => mov * eurToUsd)
    .reduce((accu, mov) => mov + accu, 0);
console.log(depositsToUsdSum);

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- FIND METHOD ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

// retreive one el of an arr based on a condition
// like filter, but will not return a new arr. It will just return the first element meeting the condition

const withd = movements3.find(mov => mov < 0);
console.log(withd);

// checking for accs with interest rate >= 1.5% - good use case
//* find very useful for arrs of objs
const accWithSpecInt = accounts.find(acc => acc?.interestRate >= 1.5);
console.log(accWithSpecInt);

// ------------------------------- findIndex Method ------------------------------------------------

// same as find, but returns index instead of the element itself
// see 'close account' handler

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- some and every ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

// .some - checks arr for atleast one el meeting the condition and returns boolean (see loanBtn handler)
console.log(movements3.some(mov => mov > 5000)); // output: false

// .every - checks if EVERY element meets a condition. returns boolean

console.log(account4.movements.every(mov => mov > 0)); // output: true (all els are deposits)
console.log(movements3.every(mov => mov > 0)); // output: true (some els are withdrawals)

//!REM

// in cases where we re-use the same callback fn & condition for arr methods, we can store the callback in a var & pass it into arr methods
// e.g. for the above: const deposits = mov => mov > 0;
// console.log(movements3.every(deposits));

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- flat and flatMap ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

const nestedArr = [[1, 2, 3], [4, 5, 6], 7, 8];

// using .flat method to combine above els into one arr
console.log(nestedArr.flat()); // output: [1, 2, 3, 4, 5, 6, 7, 8]

// however, with no arg passed in, only flattens by ONE level of depth by default
const deepNestedArr = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(deepNestedArr.flat()); // output: [Array(2), 3, 4, Array(2), 7, 8]

// .flat takes 'depth' arg.
console.log(deepNestedArr.flat(2)); // output : [1, 2, 3, 4, 5, 6, 7, 8]

const deeperNestedArr = [[[[1, 2], 3], [4, [5, 6]], 7], 8];
console.log(deeperNestedArr.flat(3)); // output : [1, 2, 3, 4, 5, 6, 7, 8]

// say bank wants to calc total balance from all acc movements:

const totalBankBalance = accounts
    // all acc movements into one arr (.map into .flat very common - see flatMap)
    .map(acc => acc.movements)
    .flat()

    //calc total
    .reduce((accu, mov) => accu + mov);
console.log(totalBankBalance);

// same using flatMap (takes same callback fn arg as .map - simply flattens after)
// cannot change depth of flattening, so cannot use is depth > 1
const totalBankBalance2 = accounts
    // all acc movements into one arr
    .flatMap(acc => acc.movements)

    //calc total
    .reduce((accu, mov) => accu + mov);
console.log(totalBankBalance);

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Sorting arrays ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];

// by default, .sort converts els to strings, then sorts.
// MUTATES original arr

console.log(owners.sort()); // output: ["Adam", "Jonas", "Martha", "Zach"]

console.log(movements3.sort()); // output: [-130, -400, -650, 1300, 200, 3000, 450, 70]
// since sorting as if they are strings, sorted in the same way words/letters are (first char then second char etc)

// syntax using callback: sort((firstEl, secondEl) => { ... } )
// think of el1 and el2 parameters as two consecutive els in the arr
// return <0 (negative) to let el1, el2 order remain. (keep order)
// return >0 (positive) to change order to el2, el1 (switch order)

// sort - ascending
console.log(
    movements3.sort((el1, el2) => {
        if (el1 > el2) return 1;
        if (el1 < el2) return -1;
    })
); // output: [-650, -400, -130, 70, 200, 450, 1300, 3000]

//! MUCH BETTER WAY
/* since if el1 > el2, then el1 - el2 will always be positive, therefore returning a POSITIVE value
and since if el1 < el2, then el1 - el2 will always be negative, therefore returning a NEGATIVE value
which achieves same as above */

console.log(movements3.sort((el1, el2) => el1 - el2));
// output: [-650, -400, -130, 70, 200, 450, 1300, 3000]

// descending (switch params);
console.log(movements3.sort((el1, el2) => el2 - el1));
// output: [3000, 1300, 450, 200, 70, -130, -400, -650]

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Programatically creating/filling arrays ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

// using arr constructor

// if only one numerical arg, creates an arr of that length with empty els
const x = new Array(7);
console.log(x); // output: [ , , , , , , ]

// .fill method (mutates)
// syntax: .fill(value, start, end)
console.log(x.fill(1, 3, 5));

//? array.from method
// callback fn syntax exactly like .map method
const y = Array.from({ length: 20 }, (_, i) => i + 1); // the underscore_ is to denote that we arent using the first param
console.log(y);

// generate arr with random dice rolls
const rdr = Array.from({ length: 10 }, el => Math.ceil(Math.random() * 6));
console.log(rdr);

/* say we didn't have any movements/transactions for the app in our code (they were only stored in user interface)
but we wanted to calc the totals */

labelBalance.addEventListener('click', function () {
    const movementsUI = Array.from(
        document.querySelectorAll('.movements__value'),
        el => Number(el.textContent.replace(' $', ''))
    );

    const movementsUItotal = movementsUI.reduce((accu, val) => accu + val);

    console.log(movementsUI);
    console.log(movementsUItotal);
});

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- Which array method to use? ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

// see arrmethods.png

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------- arr method practice ------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

const allDepositsTotal = accounts
    .flatMap(acc => acc.movements)
    .filter(mov => mov > 0)
    .reduce((accu, val) => accu + val);
console.log(allDepositsTotal);

//? Count how many deposits in the bank > 1000

const numDeps1k = accounts
    .flatMap(acc => acc.movements)
    .filter(mov => mov >= 1000)
    .reduce((_, __, ___, arr) => arr.length);

console.log(numDeps1k);

// or

const numDeps1k2 = accounts
    .flatMap(acc => acc.movements)
    .filter(mov => mov >= 1000).length;

console.log(numDeps1k2);

// or, using reduce with no filter

const numDeps1k3 = accounts
    .flatMap(acc => acc.movements)
    .reduce((accu, val, i) => (val >= 1000 ? ++accu : accu), 0);
// NOTICE ++ operator syntax (++accu istead of accu++)
// necessary becasue accu++ will still just return the original val (even though it did increment it) and therefore will not add to the 0

console.log(numDeps1k3);

//? create new obj containing sum of deps and withdrawals using reduce

const { depositsTotal, withs } = accounts
    .flatMap(acc => acc.movements)
    .reduce(
        (accu, val) => {
            // val > 0 ? (accu.depositsTotal += val) : (accu.withs += val);
            accu[val > 0 ? 'depositsTotal' : 'withs'] += val;
            return accu;
        },
        { depositsTotal: 0, withs: 0 }
    );

console.log(depositsTotal, withs);

//? movements3 - deposits from euro to USD using only reduce

console.log(movements3);

const depEuroToUSD = movements3.reduce((accu, val, i) => {
    if (val > 0) {
        accu.push(Number((val * eurToUsd).toFixed(1)));
    }
    return accu;
}, []);

console.log(depEuroToUSD);

//? convert any string to title case
// this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {
    const exceptions = [
        'a',
        'and',
        'the',
        'but',
        'or',
        'an',
        'in',
        'on',
        'with',
    ];

    const titleCase = title
        .toLowerCase()
        .split(' ')
        .map(word =>
            // checking against exceptions arr. if not exclusion, uppercase applied
            exceptions.includes(word)
                ? word
                : word.replace(word[0], word[0].toUpperCase())
        )
        .join(' ');

    return titleCase;
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
