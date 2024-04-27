function Header(props) {
    const winRate = props.gamesPlayed == 0 ? 0 : (props.gamesWon/props.gamesPlayed).toFixed(2);
    return (
        <header>
            <h1>Let's Play Hangman!</h1>
            <div id="scoreboard">
                <p>Winning streak: <span className="bold">{props.winStreak}</span></p>
                <p>Wins/Games: <span className="bold">{props.gamesWon}/{props.gamesPlayed}</span> ({winRate}% win rate)</p>
            </div>
        </header>
    )
}

export default Header;