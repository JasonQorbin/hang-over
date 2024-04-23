import React, {useState} from 'react';

function HangingMan() {
    return (
        <div id="hanging-man-graphic">

        </div>
    )
}

function WordDisplay(props) {
    let outputLetters = Array.from(props.currentWord);
    let outputElements = [];
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

function LetterTray() {
    return (
        <div id="letter-tray">
            Letter Tray
        </div>
    )
}

function WordAndLetters(props) {
    return (
        <div id="word-and-letters">
            <WordDisplay currentWord={props.currentWord} revealedLetters={props.revealedLetters}/>
            <LetterTray/>
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
            currentWord: "example",
            revealedLetters: [2],
            usedLetters: [],
        };
    }

    setCurrentWord(newWord) {
        this.setState({currentWord: newWord});
    }

    setRevealedLetters(newLetters) {
        this.setState({revealedLetters: newLetters });
    }

    setUsedLetters(newLetters) {
        this.setState({usedLetters: newLetters });
    }


    render() {
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

export default Game;