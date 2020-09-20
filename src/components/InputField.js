import React from 'react';
import { check_field } from '../util/general';
import './InputField.scss';
// import { makeStyles, TextField } from '@material-ui/core';

// const useStyle = makeStyles(theme => ({
//     root: {
//         '.MuiInput-input': {
//             textAlign: 'center',
//             border: '1px solid red'
//         }
//     }
// }));

function InputField(props) {
    return (
        <input type={ check_field(props.type) ? props.type : 'text' } className='input-field' style={{ width: props.type === 'number' ? '40px' : '', textAlign: props.type === 'number' ? 'center' : '', border: props.border === 'none' ? 'none' : '', }} maxLength='4' { ...props } />
    );
}

export default InputField;