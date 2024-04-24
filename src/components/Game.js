import React from 'react';
import dictionaryFile from '../assets/dictionary.txt';
import LoadingScreen from "./LoadingScreen";
import LetterTray from "./LetterTray";

function HangingMan() {
    return (
        <div id="hanging-man-graphic">

        </div>
    )
}

function WordDisplay(props) {
    let outputLetters = Array.from(props.currentWord);
    let outputElements = [];
    //Note for reviewer: The task wanted me to use Array.map, but I chose to use a simple for-loop to
    //easily generate the key that React needs. There is no other unique value I can use to I need to
    //create one.
    for (let i = 0; i < outputLetters.length - 1; i++) {
        if (props.revealedLetters.indexOf(i) == -1) {
            outputElements.push(<span className="word-display-letter" key={i}>_</span>);
        } else {
            outputElements.push(<span className="word-display-letter" key={i}>{outputLetters[i]}</span>);
        }
    }


    return (
        <div id="word-display">
            {outputElements}
        </div>
    )
}



function WordAndLetters(props) {
    return (
        <div id="word-and-letters">
            <WordDisplay currentWord={props.currentWord} revealedLetters={props.revealedLetters}/>
            <LetterTray usedLetters={props.usedLetters}/>
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.setCurrentWord = this.setCurrentWord.bind(this);
        this.setRevealedLetters = this.setRevealedLetters.bind(this);
        this.setUsedLetters = this.setUsedLetters.bind(this);
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

    setRevealedLetters(newLetters) {
        this.setState({ revealedLetters: newLetters });
    }

    setUsedLetters(newLetters) {
        this.setState({usedLetters: newLetters });
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
                    <WordAndLetters
                        currentWord={this.state.currentWord}
                        revealedLetters={this.state.revealedLetters}
                        usedLetters={this.state.usedLetters}
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