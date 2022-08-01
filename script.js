const app = {};

app.wordList = [
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

app.answer;
app.lives;

app.correctIndex = [];
app.correctGuess = '';
app.incorrectGuess = '';

app.$startBtn = $('.startBtn');
app.$gameSection = $('.gameSection');
app.$guessInput = $('input[type=text]');
app.$guessSubmit = $('input[type=submit]');
app.$displayDiv = $('.displayDiv');
app.$correctP = $('.correctP');
app.$incorrectP = $('.incorrectP');
app.$livesSpan = $('.livesSpan')


// Return true if input is a letter
app.isLetter = function(char){
    return ((char >= 'A' &&  char <= 'Z') || (char >= 'a' &&  char <= 'z'));
}



app.init = function(){
    //Select random word as answer
    app.answer = app.wordList[Math.floor(Math.random()*app.wordList.length)];

    // Draw in the empty boxes onto the screen
    app.$displayDiv.empty();

    for(let i = 0; i < app.answer.length; i++){
        app.$displayDiv.append(`<div class="letter${i} displayLetterDiv"></div>`)
    }

    app.disableGuessing(false);

    app.lives = 8;
    app.correctIndex = [];
    app.correctGuess = '';
    app.incorrectGuess = '';

    app.updateScreen();

}

// Ensure the guess is not empty or has invalid characters
app.validateGuess = function(guessParameter){
    // If guess is empty
    if (guessParameter.length < 1){
        alert('Please input a guess into the textbox.');
        return false;
    }

    // If guess is invalid
    for (let i = 0; i < guessParameter.length; i++){
        if (!app.isLetter(guessParameter[i])){
            alert('One or more characters in your guess is not a letter.');
            return false;
        }
    }

    // If guess is valid
    return true;
}

// Return an array with only lowercase and non duplicate characters
app.cleanGuess = function(guessParameter){
    let output = guessParameter.toLowerCase().split('').filter(function(element, index, array){return array.indexOf(element) == index;
    });
    return output;
}


app.checkGuess = function(guessParameter){
    const guess = app.cleanGuess(guessParameter);

    for (let i = 0; i < guess.length; i++){
        
        // If guess is incorrect
        if(app.answer.indexOf(guess[i])<0){

            // If incorrect guess is new
            if(app.incorrectGuess.indexOf(guess[i])<0){
                app.incorrectGuess += guess[i];
                app.lives -= 1;
            }

        } 
        
        // If guess is correct
        else {

            // If correct guess is new
            if(app.correctGuess.indexOf(guess[i])<0){

                app.correctGuess += guess[i];

                // Track which letters have been found
                for (let j = 0; j < app.answer.length; j++){
                    if (app.answer[j] === guess[i]){
                        app.correctIndex[j] = true;
                    }
                }

            }

        }

    }

}

// Disable the guessing textfield and button
app.disableGuessing = function(toggle){
    app.$guessInput.attr('disabled', toggle);
    app.$guessSubmit.attr('disabled', toggle);
}

// Check if the user has won or lost
app.checkWinLose = function(){
    let correctCount = 0;

    if (app.lives <= 0){
        app.disableGuessing(true);
        alert(`You're out of guesses! Game over! The word was ${app.answer}`)
    } else {
        for (let i = 0; i < app.answer.length; i++){
            if(app.correctIndex[i]){
                correctCount += 1;
            }
        }
    }

    if (correctCount === app.answer.length){
        app.disableGuessing(true);
        alert('Nice! You got the word!')
    }

}

// Update the interface
app.updateScreen = function(){

    for (let i = 0; i < app.answer.length; i++){
        if (app.correctIndex[i]){
            $(`.letter${i}`).addClass('correct').text(app.answer[i]);
        }

        if (app.lives <= 0 && !app.correctIndex[i]) {
            $(`.letter${i}`).addClass('missed').text(app.answer[i]);
        }
    }

    app.$correctP.text(app.correctGuess);
    app.$incorrectP.text(app.incorrectGuess);
    app.$livesSpan.text(app.lives);

}




$(document).ready(function(){

    app.$startBtn.on('click', function(){
        app.$gameSection.removeClass('hidden');
        app.$startBtn.text('New Game')
        app.init();
    })


    $('form').on('submit', function(event){
        event.preventDefault();

        const guess = app.$guessInput.val();
        app.$guessInput.val('');

        if(app.validateGuess(guess)){
            app.checkGuess(guess)
        };

        app.checkWinLose();
        app.updateScreen();

    })


})