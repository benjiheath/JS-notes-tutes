const budget = [
    { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
    { value: -45, description: 'Groceries 🥑', user: 'jonas' },
    { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
    { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
    { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
    { value: -20, description: 'Candy 🍭', user: 'matilda' },
    { value: -125, description: 'Toys 🚂', user: 'matilda' },
    { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
];

// object.freeze makes obj immutable (only top-level) (can also use on arrs)
const spendingLimits = Object.freeze({
    jonas: 1500,
    matilda: 100,
});

const addNewExpense = function (value, description, user = 'jonas') {
    user = user.toLowerCase();

    // const limit = spendingLimits[user] ? spendingLimits[user] : 0;
    //* better, using optional chainign & nullish coalescing
    const limit = spendingLimits?.[user] ?? 0;

    if (value <= limit) {
        budget.push({ value: -value, description, user });
    }
};

addNewExpense(10, 'Pizza 🍕');
addNewExpense(100, 'Going to movies 🍿', 'Matilda');
addNewExpense(200, 'Stuff', 'Jay');

const checkspendingLimits = function () {
    budget.forEach(entry => {
        -spendingLimits?.[entry.user] > entry.value
            ? (entry.flag = 'limit')
            : undefined;
    });
};
checkspendingLimits();

const logBigExpenses = function (limit) {
    let output = '';
    // for (const el of budget) {
    //     if (el.value <= -limit) {
    //         output += el.description.slice(-2) + ' / '; // Emojis are 2 chars
    //     }
    // }

    budget.forEach(entry =>
        entry.value <= -limit
            ? (output += `${entry.description.slice(-2)} - `)
            : null
    );

    output = output.slice(0, -2); // Remove last '/ '
    console.log(output);
};

console.log(budget);
logBigExpenses(1000);
