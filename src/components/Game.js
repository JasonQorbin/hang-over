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
            revealedLetters: [2],
            usedLetters: [],
            applicationReady: false,
            applicationLoading:false
        };
    }

    chooseRandomWord(dictionary) {
        return dictionary[Math.floor(Math.random() * (dictionary.length - 1))];
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

    setCurrentWord(newWord) {
        this.setState({ currentWord: newWord });
    }

    selectLetter(eventObject) {
        const letterClicked = eventObject.target.innerText
        const positionNumber = letterClicked.codePointAt(0) - 97;
        let usedLetters = this.state.usedLetters;
        usedLetters.push(positionNumber);
        this.setState({
            usedLetters: usedLetters
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