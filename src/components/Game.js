import React, {useState} from 'react';

function HangingMan() {
    return (
        <div id="hanging-man-graphic">

        </div>
    )
}

function WordDisplay() {
    return (
        <div id="word-display">
            Word Display
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

function WordAndLetters() {
    return (
        <div id="word-and-letters">
            <WordDisplay/>
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
            currentWord: "",
            revealedLetters: [],
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
                <WordAndLetters/>
            </div>
        )
    }
}

export default Game;