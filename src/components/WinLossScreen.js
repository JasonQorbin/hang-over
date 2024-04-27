function WinLossScreen(props) {
    if (props.wonTheLastLevel) {
        return (
            <div>
                <h2>Congratulations!!!</h2>
                <p>You found the word:</p>
                <h3>{props.currentWord}</h3>
                <button onClick={props.loadNextLevelCallback}>Next level</button>
            </div>
        );
    } else {
        return (
            <div>
                <h2>Whoops!!! You didn't get it in time...</h2>
                <p>The word you were looking for was:</p>
                <h3>{props.currentWord}</h3>
                <button onClick={props.loadNextLevelCallback}>Next level</button>
            </div>
        );
    }
}