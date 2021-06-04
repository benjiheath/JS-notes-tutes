'use strict';

// # --------------------- Element selection -----------------

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const allSections = document.querySelectorAll('.section');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const allimages = document.querySelectorAll('img[data-src]');
const h1 = document.querySelector('h1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const dotContainer = document.querySelector('.dots'); /*






*/ // # --------------------- Functionality -----------------

//@ --------------- Modal

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

//^ adding listener to each open-modal btn

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
}); /* 
 
 
 


 
 
*/ //@ ------------------ Smooth-scroll Nav links

// 'Learn more' smooth scroll
btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
});

// // navlinks smooth scrolling
// document.querySelectorAll('.nav__link').forEach(
//     link =>
//         link.addEventListener('click', function (e) {
//             e.preventDefault(); // prevent snapping to sections (anchors)
//             const id = this.getAttribute('href'); // getting href id from anchor
//             document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); //smooth scrolling to href id
//         }) //! REM the above method is inefficient. The more buttons we have the more performance is impacted
//     //! so, we use event DELEGATION to catch the event in a parent element (navlinks)
// )

//* event delegation
// 1. Add event listener to common parent element (navlinks)
// 2. In the listener, determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault(); // prevent snapping to sections (anchors)

    // need to prevent handling when user clicks between btns on the navlinks element
    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href'); // get href id from anchor for scroll destination
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});
// another strong use case for event delegation is for els that don't yet exist
/* 

 
 
 


 
 
*/ //@ ------------------ Reavealing sections on scroll

// => observer callback
function revealSection(entries, observer) {
    const [entry] = entries;
    // console.log(entry);

    // guard clause
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');

    // preventing already-observed sections from being observed again
    observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
}); /* 

 
 
 


 
 
*/ //@ ------------------ Nav fade

// => fade other nav links on link hover
function navFade(e, opacity) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // need siblings to fade
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
}

nav.addEventListener('mouseover', navFade.bind(0.5));
nav.addEventListener('mouseout', navFade.bind(1));

//! REM, since we would need to CALL the navFade function in order to pass the args, this would return UNDEFINED
//! which would not work as event listener expects a function
//* so we use BIND, to set THIS keyword to opacity value.
/* 
 
 


 
 
 
*/ //@ ------------------ Sticky navbar (using intersection observer API)

// => observer callback
function stickyNav(entries) {
    const [entry] = entries;
    // console.log(entry); // look at output to understand
    !entry.isIntersecting
        ? nav.classList.add('sticky')
        : nav.classList.remove('sticky');
}

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
    // makes nav appear at height-of-nav above section 1
});

headerObserver.observe(header);

/* REM - to understand: see that when 'header' is intersecting the root ('null' which is whole viewport) by
the threshold (height of nav), callback fn is executed.*/
/* 
 
 


 
 
 
*/ //@ ------------------ Tabbed Component

tabsContainer.addEventListener('click', function (e) {
    e.preventDefault();

    // REM - applying same concept as nav buttons (event delegation)
    // which tabBtn was clicked? (returns self if button, returns button if span)
    const clicked = e.target.closest('.operations__tab');

    //+ Guard clause REM - ensures nothing happens if clicked is nullish
    if (!clicked) return;

    // Activate tab
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    // Activate content
    const dataTab = clicked.getAttribute('data-tab');
    const content = `.operations__content--${dataTab}`;
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));
    document
        .querySelector(content)
        .classList.add('operations__content--active');

    // better way (no need for above vars):
    // document
    //     .querySelector(`.operations__content--${clicked.dataset.tab}`)
    //     .classList.add('operations__content--active');
}); /* 
 
 
 

 
 
*/ //@ ------------------ Lazy-loading images

// => observer callback
function loadImg(entries, observer) {
    const [entry] = entries;
    console.log(entry);

    // guard clause
    if (!entry.isIntersecting) return;

    // replace src with data-src
    entry.target.src = entry.target.dataset.src;

    // only reveal img once img has actually loaded
    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });

    // preventing already-observed sections from being observed again
    observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
});

allimages.forEach(img => imgObserver.observe(img)); /* 
 
 
 


 
 
*/ //@ ------------------ Slider component

const sliderFn = function () {
    // => starting conditions
    function init() {
        createDots();
        activateDot(0);
        goToSlide(0);
    }

    init();

    let currentSlide = 0;
    const maxSlide = slides.length - 1;

    // => transform slides
    function goToSlide(slide) {
        slides.forEach(
            (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
        );
    }

    // => next slide
    function nextSlide() {
        if (currentSlide === maxSlide) {
            currentSlide = 0;
        } else currentSlide++;

        goToSlide(currentSlide);
        activateDot(currentSlide);
    }

    // => previous slide
    function prevSlide() {
        if (currentSlide === 0) {
            currentSlide = maxSlide;
        } else {
            currentSlide--;
        }
        goToSlide(currentSlide);
        activateDot(currentSlide);
    }

    // on click
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    // on left/right keypress
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    //$ ------- DOTS

    // => creating dot els
    function createDots() {
        slides.forEach((_, i) =>
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`
            )
        );
    }

    // => show active dot
    function activateDot(slide) {
        document
            .querySelectorAll('.dots__dot')
            .forEach(dot => dot.classList.remove('dots__dot--active'));

        document
            .querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active');
    }

    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            currentSlide = e.target.dataset.slide;
            goToSlide(currentSlide);
            activateDot(currentSlide);
        }
    });
};
sliderFn();
/*



































*/
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
// LECTURES

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// ------------------------------- //# Select, create, delete elements REM
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// selecting entire document
console.log(document.documentElement);

console.log(document.head);
console.log(document.body);

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));
// both return HTMLcollection - which updates (mutates?) when any of the els are changed/deleted

// creating and inserting elements

// .insertAdjacentHTML (see login in bankist)

//!cookie msg
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent =
// //     'We use cookies for improved functionality asnd analytics.';
// message.innerHTML =
//     'We use cookies for improved functionality asnd analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // inserting el into DOM

// header.prepend(message);
// // inserts a set of Node objects or DOMString objects before the first child of the Element

// header.append(message);
// // same as prepend but at end

// // prepending then appending like above would only move the el; would not copy it.
// // if we wanted to copy:
// // header.append(message.cloneNode(true));

// // to insert an el before or after another el (as a sibling)
// // header.before(message);
// // header.after(message);

// // Delete elements
// document
//     .querySelector('.btn--close-cookie')
//     .addEventListener('click', function () {
//         message.remove();
//     });
/* 
     
     
     
     


     
*/ // --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// ------------------------------- //# Styles, attributes and classes
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

//# --------------------- Styles ---------------

// inline styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height); // returns nothing as this method only deals with inline
// console.log(message.style.backgroundColor); // rgb (55,56,61) (because we set it above)

// //^ how to get the css styles
// console.log(getComputedStyle(message).margin);
// console.log(getComputedStyle(message).height);

// // say we want to add 40px to height
// message.style.height =
//     Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// console.log(message.style.height);

//^ changing CSS ROOT variables
// document.documentElement.style.setProperty('--color-primary', 'orangered');
/* 
 



*/ //# --------------------- Attributes ---------------

const logo = document.querySelector('.nav__logo');
console.log(logo.src); // logs absolute url (http://127.0.0.1:8080/img/logo.png)
//? to get relative url:
console.log(logo.getAttribute('src')); // output: img/logo.png
// same goes for href attributes on links

console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// getting non-standard attributes from els:
// e.g ('src' and 'alt' etc are expected on <img> els, so js creates properties for them)
console.log(logo.getAttribute('designer'));

// setAttribute
logo.setAttribute('company', 'Bankist'); // inline '<..... company="Bankist">

// Data attributes
console.log(logo.dataset.versionNumber); /* 
 



*/ //# --------------------- Classes ---------------

logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); /* 
 
 
 


 
 
*/ // --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// ------------------------------- //# Implementing smooth scrolling REM
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//     // getting coords of section 1
//     const s1coords = section1.getBoundingClientRect();

//     // scrolling to section
//     // (need to add scroll offset to left/top values so that we scroll correctly regardless of viewport position)
//     // window.scrollTo(
//     //     s1coords.left + window.pageXOffset,
//     //     s1coords.top + window.pageYOffset
//     // );

//     // ?smooth
//     // old way

//     // window.scrollTo({
//     //     left: s1coords.left + window.pageXOffset,
//     //     top: s1coords.top + window.pageYOffset,
//     //     behavior: 'smooth',
//     // });

//     * modern way REM

//     section1.scrollIntoView({ behavior: 'smooth' });

//     // returns obj - includes coords of section 1
//     console.log(s1coords);
//     // returns obj
//     console.log(e.target.getBoundingClientRect());
//     // getting current scroll positions (x/y)
//     console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
//     // height/width of viewport
//     console.log(
//         document.documentElement.clientHeight,
//         document.documentElement.clientWidth
//     );
// });
/* 
 
 
 


 
 
*/ // --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// ------------------------------- //# Types of Events and Event Handlers
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

// see mdn for all event types
// mouse-enter event

// h1.addEventListener('mouseenter', function (e) {
//     alert('addEventListener: Great! You are reading the heading');
// });

// another way of attaching eventListener to an element
// h1.onmouseenter = function (e) {
//     alert('direct');
// };
/* 
 
 
 
 
 
*/ //? how to remove listener (listening to an event only once)

const h1Alert = function (e) {
    alert('addEventListener: Great! You are reading the heading');

    // once alert window 'ok' is clicked, listener is removed
    h1.removeEventListener('mouseenter', h1Alert);
};

// h1.addEventListener('mouseenter', h1Alert);
/* 
 
 
 
 

 
*/ // --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// ------------------------------- //# Event Propagation: Bubbling and Capturing
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

// rgb(255,255,255)

//? Creating a random color

// const randomInt = (min, max) => {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1) + min);
// };

// const randomColorGen = () => {
//     const gen = randomInt(0, 255);
//     const gen2 = randomInt(0, 255);
//     const gen3 = randomInt(0, 255);

//     const randomColor = `rgb(${gen}, ${gen2}, ${gen3})`;
//     console.log(randomColor);
//     return randomColor;
// };

// // document.querySelector('body').style.backgroundColor = randomColor;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColorGen();
//     console.log('LINK', e.target, e.currentTarget);
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColorGen();
//     console.log('CONTAINER', e.target, e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColorGen();
//     console.log('NAV', e.target, e.currentTarget);
// });
/* 
 
 
 
 
 
*/ // --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// ------------------------------- //# Event Delegation: Implementing page Navigation
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

// see smooth navlinks smooth scrolling
/* 
 
 



 
 
*/ // --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
// ------------------------------- //# DOM Traversing (finding/selecting up/down/sideways)
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

//? Going downwards: child els

// REM, can use querySelector on els, not just document
// good way to select multiple elements in a specific area, avoiding those elswhere on the page with the same class/id etc
console.log(h1.querySelectorAll('.highlight'));

// DIRECT children of an el (not grandkids)
console.log(h1.children);

// first Child
console.log(h1.firstElementChild); /* 
 
 
 
 
 
*/ //? Going upwards: parent els

// direct parent
console.log(h1.parentNode);
console.log(h1.parentElement);

//! find ANY parent/ancestor REM
// say there were multiple headers, but we only wanted the one that was parent to h1
console.log(h1.closest('.header'));
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// .closest essentially opposite of querySelector (QS finds children, .closests finds parents)
//* OR, FIND SELF IF NOT NECESSARY TO FIND HIGHEST (RETURNS ITSELF IF SELECTOR STRING MATCHES)
//* see tabsContainer handler
/* 
 
 
 
 
 
*/ //? Going sideways: siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// get ALL siblings
// simply move to parent el, then get its children
console.log(h1.parentElement.children);
// returns a HTMLCollection (not an arr, but is an iterable we can spread into an arr)

const [...sibs] = h1.parentElement.children;

console.log(sibs);

// say we wanted to apply a change to the el's siblings, but not the el
sibs.forEach(el => {
    if (el !== h1) {
        // el.style.transform = 'scale(0.95)';
    }
});
/* 
 
 
 
 

*/ //# ==============================================================================================
//#                             Passing args to event handlers
//# ================================================================================================

// when hover over a navlink, fade others

// difference between mouseover and mouseenter is that mouseenter does not bubble.

//# ==============================================================================================
//#                             Lifecycle DOM Events
//# ================================================================================================

document.addEventListener('DOMContentLoaded', function (e) {
    console.log(e);
});

// window.addEventListener('beforeunload', function (e) {
//     e.preventDefault();
//     console.log(e);
//     e.returnValue = '';
// });

const sumOfUnique = function (nums) {
    let arr = [];

    nums.forEach(num => {
        // const sliced = nums.slice(nums.indexOf(num), nums.indexOf(num) + 1)
        const filtered = nums.filter(n => n !== num);
        if (nums.length - filtered.length === 1) {
            arr.push(num);
        }
    });
    if (arr.length !== 0) {
        const sum = arr.reduce((acc, num) => acc + num);
        return sum;
    } else {
        return 0;
    }
};

const n = [1, 2, 3, 4, 5];

console.log(n.slice(n.indexOf(2), n.indexOf(2) + 1));

// const filtered = n => n !== num

// if nums.length - filtered.length === 1

// arr.push num

const arr1 = [1, 2, 3, 2];

console.log(sumOfUnique(arr1));
