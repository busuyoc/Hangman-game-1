'use strict';
import { wordList } from './word-list.js';

// DOM variables
const wordDisplay = document.querySelector('.word-display');
const hangmanImage = document.querySelector('.hangman-box img');
const guessesText = document.querySelector('.guesses-text b');
const keyboardContainer = document.querySelector('.keyboard');
const hintElement = document.querySelector('.hint-text b');
const gameModal = document.querySelector('.game-modal');
const playAgainButton = document.querySelector('.play-again');

//state variables to use later
let currentWord;
let correctLetters;
let wrongGuessCount;
let maxGuesses = 6;

// TEST
const API_URL = 'https://random-word.ryanrk.com/api/en/word/random/?minlength=5&maxlength=9';
async function fetchData() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((json) => {
      console.log('this is THE NEW WORD:', json);
      // updateCurrentWord(json);
      updateCurrentWord(json);
    });
}

function updateCurrentWord(givenData) {
  currentWord = givenData[0].toLowerCase();
  console.log('inside updateFunc:', currentWord);
  resetGame();
  return currentWord;
}

for (let i = 97; i <= 122; i++) {
  const button = document.createElement('button');
  button.innerText = String.fromCharCode(i);
  button.classList.add('keyboard-button');
  keyboardContainer.appendChild(button);
  button.addEventListener('click', (e) => initGame(e.target, String.fromCharCode(i)));
}

const gameOver = (isVictory) => {
  setTimeout(() => {
    // shows modal if game is over
    const modalText = isVictory ? `You found the word:` : `The correct word was:`;
    gameModal.querySelector('img').src = `./images/${isVictory ? `victory` : `lost`}.gif`;
    gameModal.querySelector('h4').src = `.${isVictory ? `Congratulations!` : `Game Over!`}`;
    gameModal.querySelector('p').innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add('show');
  }, 300);
};
const initGame = (button, clickedLetter) => {
  // checks if the clicked letter is in the word
  console.log([...currentWord]);
  if (currentWord.includes(clickedLetter)) {
    // shows all correct letter in the word display
    [...currentWord].forEach((letter, index) => {
      console.log(letter, index);
      if (letter === '-' && !correctLetters.includes('-')) {
        correctLetters.push(letter);
        wordDisplay.querySelectorAll('li')[index].innerText = letter.toUpperCase();
        wordDisplay.querySelectorAll('li')[index].classList.add('guessed');
        console.log(correctLetters);
      }
      if (letter === clickedLetter) {
        correctLetters.push(letter);
        wordDisplay.querySelectorAll('li')[index].innerText = letter.toUpperCase();
        wordDisplay.querySelectorAll('li')[index].classList.add('guessed');
        gameModal.classList.remove('show');
        console.log(correctLetters);
      }
    });
  } else {
    // if clicked letter is not in the word, update wrongGuessCount and hangman img
    wrongGuessCount++;
    hangmanImage.src = `./images/hangman-${wrongGuessCount}.svg`;
  }
  button.disabled = true;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  //game over depending on outcome
  if (wrongGuessCount === maxGuesses) return gameOver(false);
  if (correctLetters.length === currentWord.length) return gameOver(true); // <<<<
};

//resets all UI elements and variables
const resetGame = function () {
  correctLetters = [];
  wrongGuessCount = 0;
  hangmanImage.src = `./images/hangman-${wrongGuessCount}.svg`;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  keyboardContainer.querySelectorAll('.keyboard-button').forEach((btn) => (btn.disabled = false));
  wordDisplay.innerHTML = currentWord
    .split('')
    .map(() => `<li class="letter"></li>`)
    .join('');

  gameModal.classList.remove('show');
};
//
async function getRandomWord() {
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = await fetchData();
  // modify this later
  console.log('this is the old word:', word);
  hintElement.innerText = hint;
  resetGame();
}

// getRandomWord();
fetchData();
// console.log(currentWord);
playAgainButton.addEventListener('click', fetchData);
