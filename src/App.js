import './App.css';

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

function App() {
  return (
    <div className="App">
        <h1>Hello World!</h1>
        <div id="game">
            <HangingMan/>
            <WordAndLetters />
        </div>
    </div>
  );
}

export default App;
