import React from 'react';
import { Drawer as MuiDrawer, makeStyles, Toolbar } from '@material-ui/core';
import { check_field } from '../util/general';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: '260px',
        flexShrink: 0,
    },
    drawerPaper: {
        paddingLeft: '20px',
        width: '280px',
        zIndex: '100',
        background: '#F1F1F1'
    },
    drawerContainer: {
        overflow: 'auto',
    },
    paperAnchorDockedLeft: {
        borderRight: 'none'
    }
}));

function Drawer(props) {

    const classes = useStyles();

    return (
        <MuiDrawer
            className={classes.drawer}
            variant={ check_field(props.variant) ? props.variant : 'permanent' }
            classes={{
                paper: classes.drawerPaper,
                paperAnchorDockedLeft: classes.paperAnchorDockedLeft
            }}
            anchor={ check_field(props.anchor) ? props.anchor : 'right' }
        >
            <Toolbar />
            <div className={classes.drawerContainer}>
                { props.content }
            </div>
        </MuiDrawer>
    );
}

export default Drawer;