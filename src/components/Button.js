import React from 'react';
import './Button.scss';


function Button(props) {
    return (
        <button className={'button-element' + (props.size === 'small' ? ' small-button ' : ' ') + props.classnames } { ...props }>{ props.children }</button>
    );
}

export default Button;