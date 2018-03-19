console.log("Starting game...");
var gameState = {
    randomWord: "",
    wordBank: ["Abyssinian", "Bengal", "Balinese", "Himalayan", "MaineCoon", "Manx", "Korat", "Ocicat", "EygptianMau"],
    guessCount: 20,
    lettersGuessed: [],
    wins: 0,
    losses: 0
};
console.log("Initial Game State", gameState);

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function updateWord(gs) {
    let newGs = gs;
    let i = getRandomInt(gs.wordBank.length);
    let newWord = gs.wordBank[i]
    newGs.randomWord = newWord;
    return newGs;
}

function updateGuessCount(gs, l) {
    let newGs = gs;
    let lowerCw = gs.randomWord.toLowerCase();
    console.log(lowerCw, l);
    if (!lowerCw.includes(l)) {
        let newCount = gs.guessCount - 1;
        console.log(newCount);
        newGs.guessCount = newCount;
        return newGs;
    }
    return newGs;

}

function updateWins(gs) {
    let newGs = gs;
    let newCount = gs.wins + 1;
    newGs.wins = newCount;
    newGs.guessCount = 20;
    newGs = updateWord(newGs);
    newGs.lettersGuessed = [];
    return newGs;
}

function updateLosses(gs) {
    let newGs = gs;
    let newCount = gs.losses + 1;
    newGs.losses = newCount;
    newGs.guessCount = 20;
    newGs = updateWord(newGs);
    newGs.lettersGuessed = [];
    return newGs;
}

function updateLetterGuess(gs, l) {
    let newGs = gs;
    let letterArray = gs.lettersGuessed.concat(l);
    newGs.lettersGuessed = letterArray;
    return newGs;
}
function eventUpdateGuess(l) {
    gameState = updateGuessCount(gameState, l);
}

function eventUpdateWord() {
    gameState = updateWord(gameState);
}
function eventUpdateLetterGuess(l) {
    gameState = updateLetterGuess(gameState, l);
}

function hiddenWord(gs) {
    let currentWord = gs.randomWord;
    let guessLetter = gs.lettersGuessed.map(
        function (v) {
            return v.toLowerCase()
        });

    var hw = "";
    for (w = 0; w < currentWord.length; w++) {
        let lowerCw = currentWord.toLowerCase();
        if (guessLetter.indexOf(lowerCw[w]) > -1) {
            hw += currentWord[w];
        }
        else {
            hw += "_ ";
        }
    }
    return hw;
}

function wrongGuessLetters(gs) {
    let currentWord = gs.randomWord.toLowerCase();
    let guessLetter = gs.lettersGuessed.map(
        function (x) {
            return x.toLowerCase();
        })
    var wl = [];
    for (w = 0; w < guessLetter.length; w++) {
        if (!currentWord.includes(guessLetter[w])) {
            wl = wl.concat(guessLetter[w]);
        }
    }
    return wl;
}

/**
 * Takes in the game state and determines if it's a winning state
 * @param {*} gs -- game state 
 * @returns true/false
 */
function winner(gs) {
    let hw = hiddenWord(gs);
    return (hw === gs.randomWord && gs.guessCount > 0);
}

function loser(gs) {
    let ngs = gs;
    return gs.guessCount <= 0;
}

function render() {
    //console.log(gameState);
    let hWord = hiddenWord(gameState);
    document.getElementById("randomWord").innerHTML = hWord;
    document.getElementById("wrongGuessLetters").innerHTML = wrongGuessLetters(gameState);
    document.getElementById("guessCount").innerHTML = gameState.guessCount;
    document.getElementById("wins").innerHTML = gameState.wins;
    document.getElementById("losses").innerHTML = gameState.losses;
}

function handleLetterPress(e) {
    let l = String.fromCharCode(e.which).toLowerCase();
    eventUpdateLetterGuess(l);
    eventUpdateGuess(l);
    setTimeout(
        function () {
            if (winner(gameState)) {
                alert("Congrats - you saved the kitty by guessing the breed. Press any key to continue.")
                gameState = updateWins(gameState);
                render();
            }
            else if (loser(gameState)) {
                alert("You lose this round, and the cat was skinned. Press any key to continue.")
                gameState = updateLosses(gameState);
                render();
            }
        }, 0
    )
    render();
}

function wireEvents() {
    document.onkeyup = handleLetterPress
}

document.addEventListener("DOMContentLoaded", function () {
    // Handler when the DOM is fully loaded
    //initialize gameState w/ a random word
    gameState = updateWord(gameState);
    //alert("Play Skin the Cat - it's like classic Hangman, but with a kitty twist. Press 'Okay' to start.")
    render();
    wireEvents();
    alert("Play Skin the Cat - it's like classic Hangman, but with a kitty twist. Press 'Okay' to start.")
});