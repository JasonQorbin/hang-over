function HangingMan(props) {

    return (
        <div id="hanging-man-graphic">
            <p>Hanging stage: {props.hangedManStage}</p>
            <p>Streak: {props.winStreak}</p>
            <p>Wins: {props.gamesWon}</p>
            <p>Games: {props.gamesPlayed}</p>
        </div>
    )
}

export default HangingMan;