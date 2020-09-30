import { FormControlLabel } from '@material-ui/core';
import React from 'react';
import { check_field } from '../util/general';
import './InputField.scss';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
    inputLabel: {
        marginRight: '20px',
        fontFamily: 'Montserrat-Bold, Verdana, Geneva, Tahoma, sans-serif'
    }
}));

export function InputField(props) {
    return (
        <input type={ check_field(props.type) ? props.type : 'text' } className='input-field' style={{ width: props.type === 'number' ? '60px' : '', textAlign: props.type === 'number' ? 'center' : '', border: props.border === 'none' ? 'none' : '', ...props.style }} { ...props } />
    );
}

export function InputFieldWithLabel(props) {
    const classes = useStyle();
    return (
        <FormControlLabel
            style={{ fontWeight: 'bold' }}
            control={
                <input type={ check_field(props.type) ? props.type : 'text' } className='input-field' style={{ width: props.type === 'number' ? '40px' : '', textAlign: props.type === 'number' ? 'center' : '', border: props.border === 'none' ? 'none' : '', }} maxLength='4' { ...props } />
            }
            classes={{ label: classes.inputLabel }}
            label={ props.label }
            labelPlacement='start'
        />
    );
}