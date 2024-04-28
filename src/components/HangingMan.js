import state1 from '../assets/images/state1.GIF';
import state2 from '../assets/images/state2.GIF';
import state3 from '../assets/images/state3.GIF';
import state4 from '../assets/images/state4.GIF';
import state5 from '../assets/images/state5.GIF';
import state6 from '../assets/images/state6.GIF';
import state7 from '../assets/images/state7.GIF';
import state8 from '../assets/images/state8.GIF';
import state9 from '../assets/images/state9.GIF';
import state10 from '../assets/images/state10.GIF';
import state11 from '../assets/images/state11.GIF';

/**
 * Functional component to display the "hanging man" images
 */
function HangingMan(props) {
    let stateImage;
    switch (props.hangedManStage) {
        case 0:
            stateImage = state1;
            break;
        case 1:
            stateImage = state2;
            break;
        case 2:
            stateImage = state3;
            break;
        case 3:
            stateImage = state4;
            break;
        case 4:
            stateImage = state5;
            break;
        case 5:
            stateImage = state6;
            break;
        case 6:
            stateImage = state7;
            break;
        case 7:
            stateImage = state8;
            break;
        case 8:
            stateImage = state9;
            break;
        case 9:
            stateImage = state10;
            break;
        case 10:
            stateImage = state11;
            break;
    }

    return (
        <div id="hanging-man-graphic">
            <img src={stateImage} alt="Hanging-man" />
        </div>
    )
}

export default HangingMan;