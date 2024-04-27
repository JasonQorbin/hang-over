import React from 'react';
import dictionaryFile from '../assets/dictionary.txt';
import LoadingScreen from "./LoadingScreen";
import WordPanel from "./WordPanel";
import HangingMan from "./HangingMan";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.selectLetter = this.selectLetter.bind(this);
        this.state = {
            dictionary : [],
            currentWord: "",
            revealedLetters: [],
            usedLetters: [],
            applicationReady: false,
            applicationLoading:false,
            hangedManStage: 0,
            gamesWon: 0,
            winStreak: 0,
            gamesPlayed: 0,
        };
    }

    /** The maximum number of incorrect guesses before you lose the level/word. */
    MAX_DEATH_STAGES = 11;

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
     * selected letter in the current word.
     *
     * @param letter The letter (lowercase expected) that the user clicked.
     * @returns An array with index positions where the given letter was found in the current word.
     */
    findLetter(letter) {
        let answer = [];
        answer = this.findLetterRecursive(answer, letter,  0);
        return answer;
    }

    /**
     * Recursive method to find all the instances of the given letter in the current word using the
     * <code>indexOf</code> function. Each time a new instance is found the index is appended to the
     * answer and the method is called again searching from the index position after that.
     *
     * @param prevAnswers The answers found in previous recursive calls. Pass an empty array to start.
     * @param letter The letter being searched for.
     * @param startIndex The index position to search from. Pass 0 to start.
     * @returns An array containing the index positions of each occurrence of the letter in the current word.
     */
    findLetterRecursive(prevAnswers, letter, startIndex) {
        const currentWord = this.state.currentWord;
        if (startIndex == currentWord.length) {
            return prevAnswers;
        }

        const nextIndex = currentWord.toLowerCase().indexOf(letter, startIndex);
        if (nextIndex == -1) {
            return prevAnswers;
        } else {
            prevAnswers.push(nextIndex);
            return this.findLetterRecursive(prevAnswers, letter, nextIndex + 1);
        }
    }

    selectLetter(eventObject) {
        let { usedLetters, revealedLetters, currentWord, hangedManStage } = this.state;
        const letterClicked = eventObject.target.innerText
        const positionNumber = letterClicked.codePointAt(0) - 97;

        //Reveal newly found letters in the current word
        const uncoveredLettersInTheWord = this.findLetter(letterClicked);
        if ( uncoveredLettersInTheWord.length > 0) {
            revealedLetters = revealedLetters.concat(uncoveredLettersInTheWord)
        }

        //Register that the letter that was clicked is now used
        usedLetters.push(positionNumber);

        //Check if the win condition has been reached
        const levelWon = revealedLetters.length == currentWord.length;
        if (levelWon) {
            this.loadNewLevel(true)
            return;
        }

        //Todo: Check for loss condition here and act appropriately
        if (uncoveredLettersInTheWord.length == 0) {
            hangedManStage++;
        }
        const levelLost = hangedManStage >= this.MAX_DEATH_STAGES;
        if (levelLost) {
            this.loadNewLevel(false);
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

    componentDidMount() {
        const {applicationReady, applicationLoading} = this.state;

        if (!applicationReady && !applicationLoading) {
            console.log("Getting the application ready...")
            this.getReady().then(() => {console.log("Application should be ready now...")});
            this.setState({applicationLoading: true});
        }
    }

    render() {
        const {applicationReady, hangedManStage, gamesWon,gamesPlayed,
            winStreak, usedLetters, currentWord, revealedLetters} = this.state;

        if (!applicationReady) {
            return (
                <div>
                    <LoadingScreen />
                </div>
            )
        } else {
            return (
                <div id="game">
                    <HangingMan
                        hangedManStage={hangedManStage}
                        gamesWon={gamesWon}
                        gamesPlayed={gamesPlayed}
                        winStreak={winStreak}
                    />
                    <WordPanel
                        currentWord={currentWord}
                        revealedLetters={revealedLetters}
                        usedLetters={usedLetters}
                        selectCallback={this.selectLetter}
                    />
                </div>
            )
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
            this.setState({
                dictionary: dictionaryWords,
                currentWord: newWord,
                applicationReady: true,
                applicationLoading: false
            });
        });
    }

    loadNewLevel(wonTheLastGame) {
        let { gamesWon, winStreak, gamesPlayed, dictionary } = this.state;
        gamesPlayed++;
        if (wonTheLastGame) {
            gamesWon++;
            winStreak++;
        } else {
            winStreak = 0;
        }

        const newWord = this.chooseRandomWord(dictionary);

        this.setState({
            gamesPlayed: gamesPlayed,
            winStreak : winStreak,
            gamesWon: gamesWon,
            revealedLetters: [],
            usedLetters: [],
            hangedManStage: 0,
            currentWord: newWord
        });
    }
}

export default Game;