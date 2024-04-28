import React from 'react';
import Button from 'react-bootstrap/Button';
import dictionaryFile from '../assets/dictionary.txt';
import LoadingScreen from "./LoadingScreen";
import WordPanel from "./WordPanel";
import HangingMan from "./HangingMan";
import WinLossScreen from "./WinLossScreen";
import Header from "./Header";
import HelpBadge from "./HelpBadge";


class Game extends React.Component {
    constructor(props) {
        super(props);

        this.selectLetter = this.selectLetter.bind(this);
        this.loadNewLevel = this.loadNewLevel.bind(this);
        this.skipLevel = this.skipLevel.bind(this);
        this.resetScores = this.resetScores.bind(this);

        this.state = {
            dictionary : [],            //Holds that words read from the dictionary file
            currentWord: "",            //The Wof the current level that the user is trying to guess
            revealedLetters: [],        //Holds the index positions of letters in the current word that have been correctly guessed so far
            usedLetters: [],            //Holds index positions of the letters from the alphabet the that have been used
            applicationReady: false,    //Ready to play i.e. the dictionary has been loaded and a random word chosen
            applicationLoading:false,   //The dictionary is being loaded (Display the loading screen while true)
            hangedManStage: 0,          //Number of incorrect guesses in this level. Determines the hanging man image to be displayed
            gamesWon: 0,                //Total games won
            winStreak: 0,               //Total consecutive games won
            gamesPlayed: 0,             //Total games played since the last reset or page reload
            levelDone: false,           //User is out of guesses or completely guessed the word. Display win/loss screen when true.
            wonLastLevel: false,        //If levelDone is true this makes the victory screen display instead of the loss screen.
            levelSkipped: false         //True is the user clicked the skip button. Makes the skip screen display instead of the loss screen.
        };
    }

    render() {
        const {
            applicationReady, hangedManStage, gamesWon, gamesPlayed,
            winStreak, usedLetters, currentWord, revealedLetters,
            levelDone, wonLastLevel, levelSkipped
        } = this.state;

        if (!applicationReady) {
            return (
                <div id="game">
                    <LoadingScreen/>
                </div>
            )
        } else if (levelSkipped || levelDone) {
            return (
                <div id="game">
                    <WinLossScreen
                        currentWord={currentWord}
                        wonLastLevel={wonLastLevel}
                        loadNextLevelCallback={this.loadNewLevel}
                        levelSkipped={levelSkipped}
                    />
                </div>
            )

        } else {
            return (
                <div>
                    <Header
                    gamesWon={gamesWon}
                    gamesPlayed={gamesPlayed}
                    winStreak={winStreak}
                    />
                    <div id="game">
                        <HangingMan
                            hangedManStage={hangedManStage}
                        />
                        <WordPanel
                            currentWord={currentWord}
                            revealedLetters={revealedLetters}
                            usedLetters={usedLetters}
                            selectCallback={this.selectLetter}
                        />
                    </div>
                    <div id="help-tray">
                        <div>
                            <HelpBadge />
                        </div>
                    </div>
                    <Button variant="outline-primary" onClick={this.skipLevel}>Skip Level</Button>
                    <Button variant="outline-primary" onClick={this.resetScores}>Reset Scores</Button>
                </div>
            )
        }
    }

    /** The maximum number of incorrect guesses before you lose the level/word. */
    MAX_DEATH_STAGES = 11;

    /**
     * Retrieves a random word from the dictionary. The dictionary is passed in so that we can use this function
     * during app initialisation when the dictionary has not yet been saved to the app state.
     *
     * @param dictionary A reference to the dictionary.
     * @returns string A word from the dictionary
     */
    chooseRandomWord(dictionary) {
        return dictionary[Math.floor(Math.random() * (dictionary.length - 1))];
    }

    /**
     * Method to asynchronously read the dictionary file when the application initialises. Skips over words
     * below a certain length
     *
     * @param minimumWordLength An integer specifying the minimum word length that will be accepted.
     * @returns {Promise<string[]>} Return a promise resolving to the array of the words that must
     */
    readDictionary(minimumWordLength) {
        return new Promise(function(resolve) {
            fetch(dictionaryFile)
                .then(result => {
                    return result.text();
                })
                .then(contents => {
                    const lines = contents.split('\n');
                    let chosenWords = [];
                    let notFoundTheStartYet = true;
                    for (let i = 0; i < lines.length; i++) {

                        if (notFoundTheStartYet) { // Skip the preamble
                            if (lines[i] === "START") {
                                notFoundTheStartYet = false;
                            }
                        } else {
                            //Only take words longer than 5 characters
                            if (lines[i].length >= minimumWordLength) {
                                chosenWords.push(lines[i]);
                            }
                        }
                    }
                    resolve(chosenWords);
                });

        });
    }

    /**
     * This method serves as the entry point to the recursive method (below) that finds all instances of the
     * selected letter in the given word.
     *
     * @param letter The letter (lowercase expected) that the user clicked.
     * @param word The word to search in.
     * @returns An array with index positions where the given letter was found in the given word.
     */
    findLetter(letter, word) {
        return this.findLetterRecursive([], letter,  0, word);
    }

    /**
     * Recursive method to find all the instances of the given letter in the given word using the
     * <code>indexOf</code> function. Each time a new instance is found the index is appended to the
     * answer and the method is called again searching from the index position after that.
     *
     * @param prevAnswers The answers found in previous recursive calls. Pass an empty array to start.
     * @param letter The letter being searched for.
     * @param startIndex The index position to search from. Pass 0 to start.
     * @param word The word to search in
     * @returns An array containing the index positions of each occurrence of the letter in the given word.
     */
    findLetterRecursive(prevAnswers, letter, startIndex, word) {
        if (startIndex == word.length) {
            return prevAnswers;
        }

        const nextIndex = word.toLowerCase().indexOf(letter, startIndex);
        if (nextIndex == -1) {
            return prevAnswers;
        } else {
            prevAnswers.push(nextIndex);
            return this.findLetterRecursive(prevAnswers, letter, nextIndex + 1, word);
        }
    }

    /**
     * The callback method that fires when the user clicks a letter on the letter tray.
     *
     * Marks the letter as used, checks if new letters in the current word should be revealed, checks
     * the win loss condition for the level and then updates the game state appropriately.
     *
     * @param eventObject
     */
    selectLetter(eventObject) {
        let { usedLetters, revealedLetters, currentWord, hangedManStage } = this.state;
        const letterClicked = eventObject.target.innerText
        const positionNumber = letterClicked.codePointAt(0) - 97;

        //Reveal newly found letters in the current word
        const uncoveredLettersInTheWord = this.findLetter(letterClicked, currentWord);
        if ( uncoveredLettersInTheWord.length > 0) {
            revealedLetters = revealedLetters.concat(uncoveredLettersInTheWord)
        }

        //Register that the letter that was clicked is now used
        usedLetters.push(positionNumber);

        //Check if the win condition has been reached
        const levelWon = revealedLetters.length == currentWord.length;
        if (levelWon) {
            this.setState({
                wonLastLevel: true,
                levelDone: true
            })
            return;
        }

        //If no new letters were discovered then the guess was incorrect and the hangman graphic must advance.
        if (uncoveredLettersInTheWord.length == 0) {
            hangedManStage++;
        }

        const levelLost = hangedManStage >= this.MAX_DEATH_STAGES;
        if (levelLost) {
            this.setState({
                wonLastLevel: false,
                levelDone: true
            })
            return;
        }


        //The win and loss can never coincide because a letter is either correct or incorrect. So no need to
        //provide for both being true at the same time.

        //Update game state to redraw and continue.
        this.setState({
            usedLetters: usedLetters,
            revealedLetters: revealedLetters,
            hangedManStage: hangedManStage
        });
    }

    /**
     * This is used to initialise the app state by calling the getReady method. We don't do this in the constructor
     * because it's a long-running operation that involves updating state (which shouldn't be done until the component
     * is on-screen). After starting the process it sets the applicationLoading variable to true to both keep the
     * loading screen up and prevent us from firing the getReady function over and over.
     */
    componentDidMount() {
        const {applicationReady, applicationLoading} = this.state;

        if (!applicationReady && !applicationLoading) {
            this.getReady().then(() => {console.log("Application should be ready now...")});
            this.setState({applicationLoading: true});
        }
    }

    /**
     * Asynchronous method to get the game is a state of being ready to play i.e. all assets loaded (the dictionary)
     * and state variables initialised. The reading of the dictionary in particular can take a noticeable amount of
     * time to load so a "Loading" screen should be displayed until the <code>applicationReady</code> state variable
     * is set to <code>true</code>.
     *
     * @returns {Promise<void>} Can be ignored because it doesn't get resolved. Rather proceed when the applicationReady
     * state variable is set to true.
     */
    async getReady() {
        this.readDictionary(6).then((dictionaryWords) => {
            const newWord = this.chooseRandomWord(dictionaryWords);
            let specialCharacterPositions = [];
            specialCharacterPositions = specialCharacterPositions.concat(this.findLetter('-', newWord));
            this.setState({
                dictionary: dictionaryWords,
                currentWord: newWord,
                applicationReady: true,
                applicationLoading: false,
                revealedLetters: specialCharacterPositions
            });
        });
    }

    /**
     * Called after the win/loss screen has displayed and the user clicks "Next level".
     *
     * Loads a new word from the dictionary and resting the game state for a new level.
     */
    loadNewLevel() {
        let { gamesWon, winStreak, gamesPlayed, dictionary, wonLastLevel } = this.state;
        gamesPlayed++;
        if (wonLastLevel) {
            gamesWon++;
            winStreak++;
        } else {
            winStreak = 0;
        }

        const newWord = this.chooseRandomWord(dictionary);
        let revealedSpecialCharacters = [];
        revealedSpecialCharacters = revealedSpecialCharacters.concat(this.findLetter('-', newWord));

        this.setState({
            gamesPlayed: gamesPlayed,
            winStreak : winStreak,
            gamesWon: gamesWon,
            revealedLetters: revealedSpecialCharacters,
            usedLetters: [],
            hangedManStage: 0,
            currentWord: newWord,
            wonLastLevel:false,
            levelDone: false,
            levelSkipped: false
        });
    }

    /**
     * Callback method for the "Reset Scores" button.
     *
     * Resets the game state to zero out the scores and also load up a new word and level.
     */
    resetScores() {
        const newWord = this.chooseRandomWord(this.state.dictionary);
        let revealedSpecialCharacters = [];
        revealedSpecialCharacters = revealedSpecialCharacters.concat(this.findLetter('-', newWord));

        this.setState({
            gamesPlayed: 0,
            gamesWon: 0,
            winStreak: 0,
            currentWord: newWord,
            revealedLetters: revealedSpecialCharacters,
            hangedManStage: 0,
            usedLetters: []
        });

    }

    /**
     * This method serves as a callback for the skip level button. Loads the next level as is the user lost
     * the current one.
     */
    skipLevel() {
        this.setState({
            levelSkipped: true,
            levelDone: true
        })
    }
}


export default Game;