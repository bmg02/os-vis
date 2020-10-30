import React from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, useTheme, useMediaQuery, Icon } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { check_field } from '../util/general';

const useStyle = makeStyles((theme) => ({
    dialogRoot: {
        //margin: '5px',
    },
    dialogPaperRoot: {
        //borderRadius: '10px',
        background: 'rgb(245,245,245)'
    },
    paperFullScreen: {
        //width: '99%',
    },
    closeButton: {
        float: 'right',
        padding: '3px',
    },
    dialogContentRoot: {
        minHeight: prop => prop.noRequireMinHeight ? 'auto' : '240px'
    }
}));

function DialogBox(props) {
    const classes = useStyle(props);
    const { open, onClose, preventClose, title, ariaLabel, dividers, content } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <React.Fragment>
            <Dialog 
                maxWidth='sm'
                fullWidth={true} 
                fullScreen={check_field(props.fullScreen) ? props.fullScreen : fullScreen } 
                classes={{ root: classes.dialogRoot, paper: classes.dialogPaperRoot, paperFullScreen: classes.paperFullScreen }} 
                open={ open } 
                onClose={ onClose } 
                aria-labelledby={ariaLabel} 
                disableBackdropClick={preventClose} 
                disableEscapeKeyDown={preventClose}
            >
                <DialogTitle id={ariaLabel}>
                    <IconButton classes={{ root: classes.closeButton }} onClick={ onClose }><Close fontSize="small" /></IconButton>
                    {
                        check_field(props.titleIcon) ?
                            <Icon className='grey-icon'>{props.titleIcon}</Icon>
                        :
                            ''
                    }
                    { check_field(title) ? title : '' }
                </DialogTitle>
                <DialogContent dividers={ check_field(dividers) ? dividers : true } classes={{ root: classes.dialogContentRoot }}>
                    { check_field(content) ? content : '' }
                </DialogContent>
                {
                    check_field(props.actions) ?
                        <DialogActions>
                            { props.actions }
                        </DialogActions>
                    :
                        ''
                }
            </Dialog>
        </React.Fragment>
    );
}

export default DialogBox;