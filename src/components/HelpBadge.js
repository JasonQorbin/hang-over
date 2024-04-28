import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {Badge} from "react-bootstrap";
import React from "react";

/**
 * Functional component for the Help badge. The user hovers their mouse over it to see the help message
 *
 * Source: This code was repurposed from the tooltip example on the react-bootstrap website
 * URL: https://react-bootstrap.github.io/docs/components/overlays/#tooltips
 *
 */
function HelpBadge() {
    const toolTipText =
        `
        Hangman is a game about testing your vocabulary.
        
        Try to guess the hidden letters by picking all the letters it contains.
        You lose the game after 12 wrong guesses. Try to get a long win streak!! 
        `
    const TooltipWidget = ({ id, children, title }) => (
        <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
            <Badge variant="info">{children}</Badge>
        </OverlayTrigger>
    );

    return (
        <TooltipWidget title={toolTipText} id="t-1">
            Hover for help
        </TooltipWidget>
    );
}

export default HelpBadge;