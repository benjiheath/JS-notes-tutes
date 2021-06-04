// # --------------------- Constructor functions & New Operator -----------------

const Person = function (firstName, birthYear) {
    // instance properties
    this.firstName = firstName;
    this.birthYear = birthYear;

    // instance methods

    // DONT DO THIS:
    // this.calcAge = function () {
    //     console.log(2037 - this.birthYear);
    // };
    //! do X.prototype.calcAge - see below under Prototypes
};
// common OOP convention: use first-letter capitals for contructor functions
// cannot use => function as we need 'this' kw

const ben = new Person('ben', 1993);

// 1. New empty {} created
// 2. fn is called, where 'this' = {}
// 3. {} linked to prototype
// 4. fn automatically returns {}

const matilda = new Person('Matilda', 2017);
const john = new Person('John', 2002);

console.log(ben, matilda, john);

console.log(ben instanceof Person); // true
/* 
 
 


 
 
 
*/ // # --------------------- Prototypes -----------------

console.log(Person.prototype);

Person.prototype.calcAge = function () {
    console.log(2021 - this.birthYear);
    // REM 'this' keyword is set to the obj that is calling the method
};

ben.calcAge();
//* this way, only one copy of this fn exists, but all Person objs have access to it
// if we were to write the method in the constructor fn, all Person objs would have a copy of the fn

console.log(Person.prototype.isPrototypeOf(ben)); // true

Person.prototype.species = 'Homo Sapiens';
console.log(ben);
console.log(ben.species);
console.log(ben.hasOwnProperty('firstName')); // true
console.log(ben.hasOwnProperty('species')); //false
console.log(ben.__proto__.constructor);
console.log(Person.prototype);

console.log(ben.__proto__);
console.log(ben.__proto__.__proto__);

const arr = [1, 2, 3, 4, 5, 5, 5, 6, 6, 7, 9]; // new Array === []
console.log(arr.__proto__);

Array.prototype.removeDuplicates = function () {
    return [...new Set(this)];
};

console.log(arr.removeDuplicates());

const h1 = document.querySelector('h1');
console.dir(x => x + 1); /* 
 
 




 
 
*/ // # --------------------- Object.create -----------------

// need to set prototype manually

const personProto = {
    calcAge() {
        console.log(2021 - this.birthYear);
    },

    // similar to constructor function, but we call below
    init(firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    },
};

const steven = Object.create(personProto);

console.log(steven); // empty object - but has __proto__ including calcAge

steven.init('steven', 2002);
steven.calcAge();

console.log(steven.__proto__);

const bob = Object.create(personProto);

bob.init('bob', 1979);
bob.calcAge(); /* 
 
 
 



 
 
*/ // # --------------------- C1 -----------------

const Car = function (make, speed) {
    this.make = make;
    this.speed = speed;
};

const aur = new Car('Toyota', 100);
const golf = new Car('VW', 150);

Car.prototype.accelerate = function () {
    this.speed += 10;
    console.log(`${this.make} going ${this.speed} km/h!`);
};

aur.accelerate();

Car.prototype.brake = function () {
    this.speed -= 5;
    console.log(`${this.make} going ${this.speed} km/h!`);
};

golf.brake();
golf.brake();
golf.accelerate();
golf.accelerate();
golf.brake();
golf.accelerate();
golf.accelerate();
golf.accelerate(); /* 
 


 
*/ // # --------------------- C2 -----------------

class CarCl {
    constructor(make, speed) {
        this.make = make;
        this.speed = speed;
    }

    accelerate() {
        this.speed += 10;
        console.log(`${this.make} going ${this.speed} km/h!`);
    }

    brake() {
        this.speed -= 5;
        console.log(`${this.make} going ${this.speed} km/h!`);
    }

    get speedUS() {
        return this.speed / 1.6;
    }

    set speedUS(speed) {
        this.speed = speed * 1.6;
    }
}

const s3 = new CarCl('audi', 120);

s3.brake();
s3.accelerate();
s3.accelerate();
s3.accelerate();
s3.brake();
s3.accelerate();

console.log(s3.speedUS); /* 
 
 
 
 
 
*/ // # --------------------- C3 -----------------

const EV = function (make, speed, charge) {
    Car.call(this, make, speed);
    this.charge = charge;
};

EV.prototype = Object.create(Car.prototype);

EV.prototype.chargeBattery = function (chargeTo) {
    this.charge = chargeTo;
};

EV.prototype.accelerate = function () {
    this.speed += 20;
    this.charge -= 0.01;
    console.log(
        `${this.make} going ${this.speed}km/h, with a charge of ${
            this.charge * 100
        }%`
    );
};

const Tesla = new EV('Tesla', 120, 0.23);

Tesla.accelerate();
Tesla.accelerate();
Tesla.accelerate();
Tesla.brake();
Tesla.chargeBattery(0.9);
Tesla.accelerate(); /* 
 
 
 







 
 
*/ // # --------------------- ES6 Classes -----------------

//! Classes are NOT hoisted (even declarations)
//+ classes are first-class citizens (can be passed into & returned from fns)

// class expression
// const PersonClExp = Class {};

// class declaration
class PersonCl {
    constructor(firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    }

    // methods written here will be on the prototype of the objects, not in the objects themselves
    calcAge() {
        console.log(2021 - this.birthYear);
    }
}

const jessica = new PersonCl('jessica', 1990);
console.log(jessica);
jessica.calcAge();

console.log(jessica.__proto__ === PersonCl.prototype); // true

// can also add methods same as earlier:
PersonCl.prototype.greet = function () {
    console.log(`Welcome ${this.firstName}`);
};

jessica.greet(); /* 
 

 
 
 
*/ // # --------------------- Setters/Getters -----------------

// can

const account = {
    owner: 'Ben',
    movements: [200, 530, 120, 300],
    birthYear: 1991,

    get latest() {
        return this.movements.slice(-1).pop();
    },
};

console.log(account.latest); /* 
 
 

 


 
*/ // # --------------------- Inheritance between Classes (not just prototypal inheritance)-----------------

// making a new Student (child) class that inherits from the Person (parent) class

//^ class inheritance via constructor functions:

const Student = function (firstName, birthYear, course) {
    // need to set this keyword since we are just calling the Person fn (where 'this' would be undefined)
    // so we use .call
    Person.call(this, firstName, birthYear);
    this.course = course;
};

Student.prototype = Object.create(Person.prototype); // sets Student __proto__ to person

Student.prototype.introduce = function () {
    console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const mike = new Student('mike', 2015, 'Computer Science');

mike.introduce();
console.log(mike);

mike.calcAge();
console.log(mike.__proto__);
console.dir(mike.__proto__.__proto__);

Student.prototype.constructor = Student;
console.dir(Student.prototype.constructor); /* 
 
 
 
 
 
*/ //* class inheritance via ES6 CLASSES :

// making a new StudentCl (child) class that inherits from the PersonCl (parent) class

// need:
// 1. 'extends' keyword to 'declare' parent
// 2. 'super' fn (basically constructor fn of parent class)

class StudentCl extends PersonCl {
    constructor(firstName, birthYear, course) {
        // always needs to happen first! (sets 'this' kw)
        super(firstName, birthYear);
        this.course = course;
    }

    introduce() {
        console.log(`My name is ${this.firstName} and I study ${this.course}`);
    }

    calcAge() {
        console.log(
            `I'm ${2021 - this.birthYear}, but as a student I feel more like ${
                2021 - this.birthYear + 10
            }`
        );
    }
}

const martha = new StudentCl('Martha', 2012, 'Law');

martha.introduce();
martha.calcAge();
martha.greet(); /* 
 
 
 
 
 
*/ //^ class inheritance via object.create:

const PersonProto2 = {
    calcAge() {
        console.log(2021 - this.birthYear);
    },

    init(firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    },
};

const bill = Object.create(PersonProto2);

const StudentProto = Object.create(PersonProto2);

StudentProto.init = function (firstName, birthYear, course) {
    PersonProto2.init.call(this, firstName, birthYear);
    this.course = course;
};

StudentProto.introduce = function () {
    console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const jay = Object.create(StudentProto);

jay.init('Jay', 2010, 'Computer Science');
jay.introduce(); /* 
 
 
 
 
 




*/ // # --------------------- Another class example ( inc encapsulation) -----------------

class Account {
    // Public fields
    locale = navigator.language;
    #movements = [];

    constructor(owner, currency, pin) {
        this.owner = owner;
        this.currency = currency;
        this._pin = pin;

        // protected
        this.#movements = [];

        this.locale = navigator.language;

        console.log(`Thanks for opening an account, ${this.owner}`);
    }
    // public interface
    getMovements() {
        return this.#movements;
    }
    deposit(val) {
        this.#movements.push(val);
    }

    withdraw(val) {
        this.#movements.push(-val);
    }

    _approveLoan(val) {
        return true;
    }

    requestLoan(val) {
        if (this._approveLoan(val)) {
            this.deposit(val);
            console.log(`Loan approved`);
        }
    }
}

const acc1 = new Account('Ben', 'AUD', 1111);
console.log(acc1);

acc1.deposit(250);
acc1.withdraw(140);

console.log(acc1.getMovements());

console.log(acc1);

console.log(acc1._pin);

acc1.requestLoan(500);
console.log(acc1);

//^ encapsulation

// Public fields
// Private Methods
// Public methods
// Private methods
/* 
 
 
 
 
 
*/ // # --------------------- ES6 Classes Summary -----------------
