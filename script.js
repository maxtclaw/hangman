"use strict";
const wordList = [
    'alphabet',
    'biography',
    'cherubim',
    'detracted',
    'eosinophil',
    'flagrant',
    'glitterati',
    'horticulture',
    'inebriate',
    'jester',
    'kinesiology',
    'lethargic',
    'mortise',
    'nobility',
    'orthogonal',
    'platitude',
    'quarterly',
    'rescind',
    'stratosphere',
    'triumvirate',
    'undulate',
    'veracity',
    'worcestershire',
    'xenophobic',
    'yonder',
    'zooplankton'
];
let answer = '';
let lives = 8;
let correctIndex = [];
let correctGuess = '';
let incorrectGuess = '';
const $startBtn = $('.startBtn');
const $gameSection = $('.gameSection');
const $guessInput = $('input[type=text]');
const $guessSubmit = $('input[type=submit]');
const $displayDiv = $('.displayDiv');
const $correctP = $('.correctP');
const $incorrectP = $('.incorrectP');
const $livesSpan = $('.livesSpan');
// Return true if input is a letter
const isLetter = function (char) {
    return ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z'));
};
const init = function () {
    //Select random word as answer
    answer = wordList[Math.floor(Math.random() * wordList.length)];
    // Draw in the empty boxes onto the screen
    $displayDiv.empty();
    for (let i = 0; i < answer.length; i++) {
        $displayDiv.append(`<div class="letter${i} displayLetterDiv"></div>`);
    }
    disableGuessing(false);
    lives = 8;
    correctIndex = [];
    correctGuess = '';
    incorrectGuess = '';
    updateScreen();
};
// Ensure the guess is not empty or has invalid characters
const validateGuess = function (guessParameter) {
    // If guess is empty
    if (guessParameter.length < 1) {
        alert('Please input a guess into the textbox.');
        return false;
    }
    // If guess is invalid
    for (let i = 0; i < guessParameter.length; i++) {
        if (!isLetter(guessParameter[i])) {
            alert('One or more characters in your guess is not a letter.');
            return false;
        }
    }
    // If guess is valid
    return true;
};
// Return an array with only lowercase and non duplicate characters
const cleanGuess = function (guessParameter) {
    let output = guessParameter.toLowerCase().split('').filter(function (element, index, array) {
        return array.indexOf(element) == index;
    });
    return output;
};
const checkGuess = function (guessParameter) {
    const guess = cleanGuess(guessParameter);
    for (let i = 0; i < guess.length; i++) {
        // If guess is incorrect
        if (answer.indexOf(guess[i]) < 0) {
            // If incorrect guess is new
            if (incorrectGuess.indexOf(guess[i]) < 0) {
                incorrectGuess += guess[i];
                lives -= 1;
            }
        }
        // If guess is correct
        else {
            // If correct guess is new
            if (correctGuess.indexOf(guess[i]) < 0) {
                correctGuess += guess[i];
                // Track which letters have been found
                for (let j = 0; j < answer.length; j++) {
                    if (answer[j] === guess[i]) {
                        correctIndex[j] = true;
                    }
                }
            }
        }
    }
};
// Disable the guessing textfield and button
const disableGuessing = function (toggle) {
    if (toggle) {
        $guessInput.attr('disabled', toggle.toString());
        $guessSubmit.attr('disabled', toggle.toString());
    }
    else {
        $guessInput.removeAttr('disabled');
        $guessSubmit.removeAttr('disabled');
    }
};
// Check if the user has won or lost
const checkWinLose = function () {
    let correctCount = 0;
    if (lives <= 0) {
        disableGuessing(true);
        alert(`You're out of guesses! Game over! The word was ${answer}`);
    }
    else {
        for (let i = 0; i < answer.length; i++) {
            if (correctIndex[i]) {
                correctCount += 1;
            }
        }
    }
    if (correctCount === answer.length) {
        disableGuessing(true);
        alert('Nice! You got the word!');
    }
};
// Update the interface
const updateScreen = function () {
    for (let i = 0; i < answer.length; i++) {
        if (correctIndex[i]) {
            $(`.letter${i}`).addClass('correct').text(answer[i]);
        }
        if (lives <= 0 && !correctIndex[i]) {
            $(`.letter${i}`).addClass('missed').text(answer[i]);
        }
    }
    $correctP.text(correctGuess);
    $incorrectP.text(incorrectGuess);
    $livesSpan.text(lives);
};
$(document).ready(function () {
    $startBtn.on('click', function () {
        $gameSection.removeClass('hidden');
        $startBtn.text('New Game');
        init();
    });
    $('form').on('submit', function (event) {
        event.preventDefault();
        const guess = $guessInput.val();
        $guessInput.val('');
        if (validateGuess(guess)) {
            checkGuess(guess);
        }
        ;
        checkWinLose();
        updateScreen();
    });
});
