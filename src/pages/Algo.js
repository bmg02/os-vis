import React from 'react';

function Algo(props) {
    return (
        <div className='section-div section-margin-left'>
            <div className='section-heading extra-large'>{props.match.params.algo.replace(/-/g, ' ')}</div>
            <div className='flot-right'>Change Algorithm</div>
        </div>
    );
}

export default Algo;