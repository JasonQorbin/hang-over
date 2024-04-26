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
            levelFinished: false,
            levelWon: false
        };
    }

    /** The maximum number of incorrect guesses before you lose the level/word. */
    MAX_DEATH_STAGES = 11;

    chooseRandomWord(dictionary) {
        return dictionary[Math.floor(Math.random() * (dictionary.length - 1))];
    }

    resetCurrentWord() {
        const newWord = this.chooseRandomWord(this.state.dictionary);
        this.setState({currentWord: newWord});
    }

    readDictionary() {
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
                            if (lines[i].length > 5) {
                                chosenWords.push(lines[i]);
                            }
                        }
                    }
                    resolve(chosenWords);
                });

        });
    }

    findLetter(letter) {
        let answer = [];
        answer = this.findLetterRecursive(answer, letter,  0);
        return answer;
    }

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
            //Do something
            //Would like to show a splash screen before continuing
        }

        //Todo: Check for loss condition here and act appropriately
        if (uncoveredLettersInTheWord.length == 0) {
            hangedManStage++;
            loadNewLevel(gameWon);
        }
        const levelLost = hangedManStage >= this.MAX_DEATH_STAGES;
        if (levelLost) {
            //Losing splash screen
            loadNewLevel(gameWon);
        }


        //The win and loss can never coincide because a letter is either correct or incorrect. So no need to
        //provide for both being true at the same time.

        //Update game state to redraw and continue.
        this.setState({
            usedLetters: usedLetters,
            revealedLetters: revealedLetters
        });



    }

    componentDidMount() {
        const {applicationReady, applicationLoading} = this.state;

        if (!applicationReady && !applicationLoading) {
            console.log("Getting the application ready...")
            this.getReady().then(r => {console.log("Application should be ready now...")});
            this.setState({applicationLoading: true});
        }
    }

    render() {
        if (!this.state.applicationReady) {
            return (
                <div>
                    <LoadingScreen />
                </div>
            )
        } else {
            return (
                <div id="game">
                    <HangingMan/>
                    <WordPanel
                        currentWord={this.state.currentWord}
                        revealedLetters={this.state.revealedLetters}
                        usedLetters={this.state.usedLetters}
                        selectCallback={this.selectLetter}
                    />
                </div>
            )
        }
    }

    async getReady() {
        this.readDictionary().then((dictionaryWords) => {
            const newWord = this.chooseRandomWord(dictionaryWords);
            this.setState({
                dictionary: dictionaryWords,
                currentWord: newWord,
                applicationReady: true,
                applicationLoading: false
            });
        });
    }
}

export default Game;