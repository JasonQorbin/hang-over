function LetterTray(props) {
    let letters = []
    for (let i = 0; i < 26; i++) {
        let char = String.fromCharCode(97 + i);
        if (props.usedLetters.indexOf(i) != -1) {
            letters.push(<li
                key={char}
                className="letter-used"
            >{char}</li>);
        } else {
            letters.push(<li
                key={char}
                onClick={props.selectCallback}
            >{char}</li>);
        }
    }

    return (
        <div id="letter-tray">
            <ul>
                {letters}
            </ul>
        </div>
    );
}

export default LetterTray;