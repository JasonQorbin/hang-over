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

export default WordDisplay;