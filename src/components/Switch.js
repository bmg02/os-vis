import React from 'react';

import { Switch as MuiSwitch, makeStyles, FormControlLabel } from '@material-ui/core';


const useStyle = makeStyles(theme => ({
    root: {
        width: '46px',
        height: '26px',
        padding: '3px',
        margin: '0px',
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
        '& + $track': {
            backgroundColor: '#CDCDCD',
            opacity: 1,
            border: 'none',
        },
    },
    '&$focusVisible $thumb': {
        color: '#888',
        border: '6px solid #fff',
        },
    },
    thumb: {
        width: 22,
        height: 22,
    },
    track: {
        borderRadius: 26 / 2,
        border: 'none',
        backgroundColor: '#CDCDCD',
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    inputLabel: {
        marginRight: '20px',
        fontFamily: 'Montserrat-Bold, Verdana, Geneva, Tahoma, sans-serif'
    }
}));

function Switch(props) {
    const classes = useStyle();
    return (
        <FormControlLabel
            style={{ fontWeight: 'bold' }}
            control={
                <MuiSwitch
                    focusVisibleClassName={classes.focusVisible}
                    disableRipple
                    classes={{
                        root: classes.root,
                        switchBase: classes.switchBase,
                        thumb: classes.thumb,
                        track: classes.track,
                        checked: classes.checked,
                    }}
                    { ...props }
                />
            }
            classes={{ label: classes.inputLabel }}
            label={ props.label }
            labelPlacement='start'
        />
    );
}

export default Switch;