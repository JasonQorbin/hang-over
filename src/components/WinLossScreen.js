/**
 * Functional that displays the transitional screens for wins, losses and skipping of levels
 *
 * Contains a button to allow the user to start the next level.
 */
function WinLossScreen(props) {
    if (props.wonLastLevel) {
        return (
            <div>
                <h2>Congratulations!!!</h2>
                <p>You found the word:</p>
                <h3>{props.currentWord}</h3>
                <button onClick={props.loadNextLevelCallback}>Next level</button>
            </div>
        );
    } else if (props.levelSkipped) {
        return (
            <div>
                <h2>You skipped the level...</h2>
                <p>The word you were looking for was:</p>
                <h3>{props.currentWord}</h3>
                <button onClick={props.loadNextLevelCallback}>Next level</button>
            </div>
        )
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

export default WinLossScreen