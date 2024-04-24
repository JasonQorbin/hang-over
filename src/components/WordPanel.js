import WordDisplay from "./WordDisplay";
import LetterTray from "./LetterTray";

function WordPanel(props) {
    return (
        <div id="word-and-letters">
            <WordDisplay currentWord={props.currentWord} revealedLetters={props.revealedLetters}/>
            <LetterTray usedLetters={props.usedLetters} selectCallback={props.selectCallback}/>
        </div>
    );
}

export default WordPanel;