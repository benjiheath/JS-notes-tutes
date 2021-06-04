'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const imgDiv = document.querySelector('.images');

///////////////////////////////////////

//# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//# - - -- - - - - - -  Asynchronous JS, AJAX & APIs
//# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// synchronous code - executed lined by line. Each line waits for previous.

// can be problematic; e.g rmb alert() is blocking. Until user clicks 'ok' btn, execution is halted

//* Asynchronous code is non-blocking;

// # --------------------- AJAX calls -----------------

// stands for 'Asynchronous JS and XML' (XML not really used anymore - mostly JSON)
// allows communicatoin with servers asychronously

//@ --------- oldest method for AJAX calls:

// => rendering country HTML using data
const renderCountry = function (data, className = '') {
    const html = `<article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
      ).toFixed(1)} million</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0]?.name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0]?.code}</p>
    </div>
  </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
};

// => get data for country and its first neighbour, then render
const getCountryAndNeighbour = function (country) {
    // first ajax call (country 1)
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
    request.send();

    // response load event
    request.addEventListener('load', function () {
        console.log(this.responseText);

        // need to convert from JSON to obj (destructure as API returned an arr, with obj at index 0)
        const [data] = JSON.parse(this.responseText);
        console.log(data);

        // render country 1
        renderCountry(data);

        // get neighbour (country 2)
        const [neighbour] = data.borders;

        // guard clause for islands / countries with no neighbours
        if (!neighbour) return;

        // second ajax call (country 2) (note different API url as we need to search by country code instead of country name (neighbour for Portugal = 'ESP'))
        const request2 = new XMLHttpRequest();
        request2.open('GET', `//restcountries.eu/rest/v2/alpha/${neighbour}`);
        request2.send();

        request2.addEventListener('load', function () {
            console.log(this.responseText);

            // need to convert from JSON to obj (no destructuring as an the obj itself was returned this time (no arr))
            const data2 = JSON.parse(this.responseText);
            console.log(data2);

            // render country 2
            renderCountry(data2, 'neighbour');
        });
    });
};

// getCountryAndNeighbour('portugal');
// getCountryAndNeighbour('USA');

// the cards for each country may not render in order due to asynchronicity (requests getting responses at different times)

// to make sure they display in order, above we utlized 'callback hell' in which we nested listener callbacks
// this would not be good if we ended up having too many callbacks (such code makes bugs more likely etc)

//* since ES6, we can now use PROMISES to avoid this
/* 
 
 













*/ //# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//# - - -- - - - - - -  Promises & the Fetch API
//# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// A Promise is basically an object used as a placeholder for the future result of an async operation
// simplest definiton: a container for a future value

// instead of nesting callbacks, we can chain promises

//$ Promise Lifecycle
// 1. pending (getting data, asynchronously)
// 2. settled (either fullfilled or rejected)

// for a simple GET request
// const request = fetch('https://restcountries.eu/rest/v2/name/australia');
// console.log(request);
// immediately returns a Promise

/* 
 
 
 
 
 
*/ // # --------------------- Consuming Promises; handling rejected promises; throwing errors manually -----------------

// => render error msg instead of card el
const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
};

// => fetch, get JSON from response, throw error if country not found
const getJSON = function (url, errorMsg = 'Something went wrong') {
    return fetch(url) //* REM fetch returns a promise, which we can use the .then method on, which takes a callback (which takes the result of the fulfilled promise as an argument) to execute upon fulfilled settlement
        .then(response => {
            console.log(response);

            // throwing error manually for invalid country - gets caught by .catch later in chain
            // 'throw' terminates current function, like return
            if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);

            return response.json(); // Need to get our data from the response. The .json method is available on resolved response values. Returns another promise
        });
}; /* 
 
 
 
 
 



*/ // => promise chaining (Main fn)
const getCountryData = function (country) {
    //@ Country 1

    getJSON(
        `https://restcountries.eu/rest/v2/name/${country}`,
        'Country not found'
    )
        .then(dataObj => {
            renderCountry(dataObj[0]); // Since we returned a promise from .json(), ---(see getJSON fn)--- we can use .then on the callback and render the element with the data
            console.log(dataObj[0]);

            const [neighbour = 0] = dataObj[0]?.borders; // getting neighbouring country

            if (!neighbour || neighbour == 0)
                throw new Error(`Country has no neighbours!`);

            //@ Country 2

            return getJSON(`//restcountries.eu/rest/v2/alpha/${neighbour}`);
        })
        .then(dataObj2 => renderCountry(dataObj2, 'neighbour'))
        // adding .catch to handle any errors from REJECTED promises, NO MATTER WHERE they occur in the preceding chain
        .catch(err => {
            console.error(`${err}xxxxx`);
            renderError(`Something went wrong :( ${err.message}`);
        })
        .finally(() => {
            countriesContainer.style.opacity = 1;
        });

    //*REM - by returning fetch in the second .then callback, we can chain .then outside it, thereby escaping callback hell
};

// .THEN callback only called when promise fulfilled
// .CATCH callback only called when promise rejected
// .FINALLY callback called regardless

// btn.addEventListener('click', function () {
//     getCountryData('australia');
// });

// for throwing error manually
// getCountryData('sadsdsa');

/* 
 
 
 
 









 
*/ // # --------------------- C1 -----------------

const whereAmI = function (lat, long) {
    let myCountry;

    // reverse geocode coords
    fetch(`https://geocode.xyz/${lat},${long}?geoit=json`)
        .then(response => {
            console.log(response);
            if (response.status === 403)
                throw new Error(`${response.status}: Problem with geocoding`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log(`You are in ${data.city}, ${data.country}.`);
            myCountry = data.country;
        })
        .catch(err => console.error(`${err.messagexxx}`))
        // call getCountry fn
        .then(() => getCountryData(myCountry));
};

// => use whereAmI to get country based on client coords
const getMyCountry = function () {
    function success(pos) {
        const crd = pos.coords;
        const myLat = crd.latitude;
        const myLong = crd.longitude;

        whereAmI(myLat, myLong);
    }

    navigator.geolocation.getCurrentPosition(success);
};

getMyCountry();
/* 
 




 
 
 
 
*/
//# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//# - - -- - - - - - -  Async bts - The Event Loop
//# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// see bts.png and lec #254

console.log('test start'); // 1

// setTimeout(() => console.log('0 sec timer'), 0); // 4

// Promise.resolve('Resolved promise 1').then(res => console.log(res)); // 3

console.log('test end'); // 2
/* 
 
 
 
 
 






*/
//# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//# - - -- - - - - - -  Building a simple promise
//# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const lotteryPromise = new Promise(function (resolve, reject) {
    console.log('Lottery draw is happening');
    setTimeout(function () {
        if (Math.random() >= 0.5) {
            resolve('you win!');
        } else {
            reject(new Error('You lost your money'));
        }
    }, 2000);
});

// consuming
lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// Promisifying setTimeout
const wait = seconds =>
    new Promise(resolve => setTimeout(resolve, seconds * 1000));

wait(2)
    .then(() => {
        console.log('waited for 1 secs');
        return wait(1);
    })
    .then(() => {
        console.log('waited for 2 secs');
        return wait(1);
    })
    .then(() => {
        console.log('waited for 3 secs');
        return wait(1);
    })
    .then(() => console.log('waited for 4 secs'));

Promise.resolve('res').then(x => console.log(x));
Promise.reject(new Error('Problem')).catch(x => console.error(x));
/* 
 
 



 
 
 
*/ // # --------------------- Promisifying GEOLOCATION API -----------------

navigator.geolocation.getCurrentPosition(
    position => console.log(position),
    err => console.error(err)
);

console.log('getting position');

const getPos = function () {
    return new Promise((resolve, reject) => {
        //     navigator.geolocation.getCurrentPosition(
        //         position => resolve(position),
        //         err => reject(err)
        //     );

        //* instead of the above, we can simply
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

getPos().then(pos => console.log(pos.coords.latitude)); /* 
 
 
 



 
*/
// => whereAmI but no need to pass in args
const whereAmI = function () {
    let myCountry;

    getPos()
        .then(pos => {
            const { latitude: lat, longitude: long } = pos.coords;

            return fetch(`https://geocode.xyz/${lat},${long}?geoit=json`);
        })
        .then(response => {
            console.log(response);
            if (response.status === 403)
                throw new Error(`${response.status}: Problem with geocoding`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log(`You are in ${data.city}, ${data.country}.`);
            myCountry = data.country;
        })
        .catch(err => console.error(`${err.messagexxx}`))
        // call getCountry fn
        .then(() => getCountryData(myCountry));
};

btn.addEventListener('click', whereAmI); /* 
 
 

 
 
 
 
 






*/
//# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//# - - -- - - - - - -  Consuming Promises with Async/Await ---- REM
//# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// just grabbing fn from above
const getPos2 = function () {
    return new Promise((resolve, reject) => {
        //     navigator.geolocation.getCurrentPosition(
        //         position => resolve(position),
        //         err => reject(err)
        //     );

        //* instead of the above, we can simply
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}; /* 
 
 
 
 
 
*/
// see how the chode looks synchronous, but is actually asynchronous

const whereAmI2 = async function () {
    // get geolocation
    const pos = await getPos2();
    const { latitude: lat, longitude: long } = pos.coords;

    // reverse geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json`);
    const dataGeo = await resGeo.json();
    console.log(dataGeo.country);

    // country data
    const res = await fetch(
        `https://restcountries.eu/rest/v2/name/${dataGeo.country}`
    ); // REM
    // await stops execution at this point until fetch promise fulfilled
    // the value of this await expression will be the resolved value of the promise

    // above is exactly same as (async/await basically syntactic sugar)
    // fetch(`https://restcountries.eu/rest/v2/name/${country}`).then(res =>
    //     console.log(res)
    // );

    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);
    countriesContainer.style.opacity = 1;
};

// whereAmI2();
console.log('first'); // logs before the async fn
/* 
 
 
 
 
 
*/ // # --------------------- Error handling with async/await (try...catch) -----------------

const whereAmI3 = async function () {
    // get geolocation
    try {
        const pos = await getPos2();
        const { latitude: lat, longitude: long } = pos.coords;

        // reverse geocoding
        const resGeo = await fetch(
            `https://geocode.xyz/${lat},${long}?geoit=json`
        );

        if (!resGeo.ok) {
            throw new Error(`issue getting geo`);
        }

        const dataGeo = await resGeo.json();

        // country data
        const res = await fetch(
            `https://restcountries.eu/rest/v2/name/${dataGeo.country}`
        );
        // REM
        // await stops execution at this point until fetch promise fulfilled
        // the value of this await expression will be the resolved value of the promise

        // above is exactly same as (async/await basically syntactic sugar)
        // fetch(`https://restcountries.eu/rest/v2/name/${country}`).then(res =>
        //     console.log(res)
        // );

        if (!res.ok) {
            throw new Error(`issue getting country`);
        }

        const data = await res.json();
        renderCountry(data[0]);
        countriesContainer.style.opacity = 1;

        return `you are in ${dataGeo.city}, ${dataGeo.country}`;
    } catch (err) {
        console.error(err);
        renderError(`Something went wrong: ${err.message}`);
        countriesContainer.style.opacity = 1;

        // async fn returned promiuse will always be fulfilled, even if err
        // so we need to re-throw the err so it gets propagated down and caught @ .catch on the fn call below
        throw err;
    }
};

// whereAmI3();
// # --------------------- Returning values from Async fns -----------------

// async fns always return promises
// the value we RETURN will be the FULFILLED value of the returned promise
// so, we use .then

// console.log('1: will get location');
// const city = whereAmI3();
// console.log(city); // logs promise

// whereAmI3()
//     .then(city => console.log(`2: ${city}`))
//     .catch(err => console.error(`2: ${err}`))
//     .finally(() => console.log('3: Finished getting location'));

//REM
// (async function () {
//     try {
//         const city = await whereAmI3();
//         console.log(`2: ${city}`);
//     } catch (err) {
//         console.error(`2: ${err}`);
//     }
//     console.log('3: finished getting location');
// })();

// # --------------------- Promises in parallel ----------------- REM

// say we want to get capitals for three countries,
//$ but order doesn't matter
// using const x = await fetch(url) three times in a row would be unecessary, as each request would have to wait for the previous
//* so we use Promise.all combinator fn

const get3Countries = async function (c1, c2, c3) {
    try {
        // const [data1] = await getJSON(
        //     `https://restcountries.eu/rest/v2/name/${c1}`
        // );
        // const [data2] = await getJSON(
        //     `https://restcountries.eu/rest/v2/name/${c2}`
        // );
        // const [data3] = await getJSON(
        //     `https://restcountries.eu/rest/v2/name/${c3}`
        // );

        // takes an arr of promises, returning a new promise which will run all the promises together
        //! rem, if one promise rejects, entire promise is rejected
        const data = await Promise.all([
            getJSON(`https://restcountries.eu/rest/v2/name/${c1}`),
            getJSON(`https://restcountries.eu/rest/v2/name/${c2}`),
            getJSON(`https://restcountries.eu/rest/v2/name/${c3}`),
        ]);

        // returned an arr of data (access c1 by data[0][0])
        console.log(data);
        // log arr of all capitals
        const capitals = data.map(d => d[0].capital);
        console.log(capitals);
    } catch (err) {
        console.error(err);
    }
};

// get3Countries('australia', 'germany', 'usa');
/* 
 
 
 
 
 
*/ // # --------------------- Other promise combinators (RACE, allSettled, any) -----------------

// Promise.race
// just like .all, rec's an arr - but settles upon first settlement of an input promise
// (.all and .race two most common/important)

//* can be very useful REM

const raceTest = async function () {
    const res = await Promise.race([
        getJSON(`https://restcountries.eu/rest/v2/name/italy`),
        getJSON(`https://restcountries.eu/rest/v2/name/usa`),
        getJSON(`https://restcountries.eu/rest/v2/name/canada`),
    ]);
    console.log(res); // returns data for whichever promise was settled first
};

//* say for users with unreliable internet, we could .race with a request, but also including a timeOut promise
// e.g. if request not filled after X seconds, reject promise (cancelling request)

// making the timeOut promise to use with .race
const timeout = function (seconds) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error('request took too long'));
        }, seconds * 1000);
    });
};

const timeoutTest = async function () {
    try {
        const result = await Promise.race([
            getJSON(`https://restcountries.eu/rest/v2/name/italy`),
            timeout(5),
        ]);

        console.log(result[0]);
    } catch (err) {
        console.error(err);
    }
};

// timeoutTest();

//^ Promise.allSettled
// unlike .all (which rejects as soon as an input promise rejects (short circuits)), .allSettled returns all promise results
// i.e does not short circuit

//^ Promise.any
// returns the first fullfilled promise, but rejected promises are ignored
// different to .race in that .race returns SETTLED promises (fullfilled OR rejected)
/* 
 
 
 
 
 






*/ // # --------------------- C2 -----------------

const wait = seconds =>
    new Promise(resolve => setTimeout(resolve, seconds * 1000));

// first try
// const createImg = function (imgPath) {
//     return new Promise(
//         resolve => {
//             const img = document.createElement('img');
//             img.src = imgPath;

//             img.addEventListener('load', function () {
//                 imgDiv.append(img);
//                 resolve(img);
//             });
//         },
//         reject => new Error(reject)
//     );
// };

// createImg('img/img-1.jpg')
//     .then(res => {
//         wait(2).then(() => (res.style.display = 'none'));
//     })
//     .then(() => createImg('img/img-2.jpg'))
//     .then(res => {
//         wait(2).then(() => (res.style.display = 'none'));
//     })
//     .then(() => createImg('img/img-3.jpg'))
//     .then(res => {
//         wait(2).then(() => (res.style.display = 'none'));
//     })
//     .catch(err => console.error(err));

// second - improved
const createImg = function (imgPath) {
    return new Promise(function (resolve, reject) {
        const img = document.createElement('img');
        img.src = imgPath;

        img.addEventListener('load', function () {
            imgDiv.append(img);
            resolve(img);
        });

        img.addEventListener('error', function () {
            reject(new Error('problem loading img'));
        });
    });
};

// createImg('img/img-1.jpg')
//     .then(img => {
//         wait(2).then(() => (img.style.display = 'none'));
//     })
//     .then(() => createImg('img/img-2.jpg'))
//     .then(img => {
//         wait(2).then(() => (img.style.display = 'none'));
//     })
//     .then(() => createImg('img/img-3.jpg'))
//     .then(img => {
//         wait(2).then(() => (img.style.display = 'none'));
//     })
//     .catch(err => console.error(err));
/* 
 
 
 
 



 
*/ // # --------------------- C3 -----------------

//@ part 1 - recreate above with asyc/await

// first
const loadNPause = async function () {
    try {
        // load and get img
        let img = await createImg('img/img-1.jpg');

        // display for 2 seconds
        await wait(2);

        // hide img
        img.style.display = 'none';

        // repeat for img 2
        img = await createImg('img/img-2.jpg');
        await wait(2);
        img.style.display = 'none';

        // repeat for img 3
        img = await createImg('img/img-3.jpg');
        await wait(2);
        img.style.display = 'none';
    } catch (err) {
        console.error(err);
    }
};

// refactoring attempt
// TODO how to adapt for loop?
const loadNPauseRef = async function () {
    try {
        const cycle = async function (num) {
            // load and get img
            let img = await createImg(`img/img-${num}.jpg`);

            // display for 2 seconds
            await wait(2);

            // hide img
            img.style.display = 'none';
        };

        for (let i = 1; i <= 3; i++) {
            cycle(i);
        }
    } catch (err) {
        console.error(err);
    }
};

// loadNPause();

// loadNPauseRef();

//@ part 2 // REM

const images = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];

const loadAll = async function (imgArr) {
    try {
        const imgs = imgArr.map(async img => await createImg(img));
        console.log(imgs); // arr of promises (since map callback is async)

        // to fix, use promise combinator
        const AllImgs = await Promise.all(imgs);

        console.log(AllImgs); // images

        AllImgs.forEach(img => img.classList.add('parallel'));
    } catch (err) {
        console.error(err);
    }
};

loadAll(images);
