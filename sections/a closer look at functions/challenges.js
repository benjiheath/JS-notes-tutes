'use strict';

const poll = {
  question: 'What is your favourite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
  // This generates [0, 0, 0, 0]. More in the next section!
  answers: new Array(4).fill(0),
  registerNewAnswer() {
    const promptInput = Number(
      prompt(
        `${this.question} \n ${this.options.join(
          '\n'
        )} \n (Write option number)`
      )
    );
    console.log(promptInput);

    // update poll arr on input submission
    typeof promptInput === 'number' &&
      promptInput < this.answers.length &&
      this.answers[promptInput]++;

    this.displayResults();
    this.displayResults('string');
  },

  displayResults(type = 'array') {
    type === 'string'
      ? console.log(`Poll results are: ${this.answers.join(', ')}`)
      : console.log(this.answers);
  },
};

document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));
