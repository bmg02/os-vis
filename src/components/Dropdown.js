import React from 'react';
import { MenuItem, Popover, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyle = makeStyles(theme => ({
    menuItemRoot: {
        padding: '8px 16px',
        fontSize: '14px'
    },
}));

function Dropdown(props) {

    const classes = useStyle();

    const [ anchorEl, setAnchorEl ] = React.useState(null);

    const handleChangeAlgoClose = (event) => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        if (props.open !== null) setAnchorEl(props.open);
        else setAnchorEl(null);
    }, [props.open]);

    return(
        <Popover
            id={ props.id }
            anchorEl={ anchorEl }
            keepMounted
            open={ Boolean(anchorEl) }
            onClose={ handleChangeAlgoClose }
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            {
                props.menuList.map((item, key) => {
                    return (
                        <MenuItem key={ key } classes={{ root: classes.menuItemRoot }}>
                            {
                                props.links ?
                                    <Link to={ '/scheduling/' + item.link }>{ item.name }</Link>
                                :
                                    typeof(item) === 'string' ? item : ''
                            }
                        </MenuItem>
                    )
                })
            }
            {/* <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/priority-scheduling'>Priority Scheduling</Link></MenuItem>
            <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/longest-job-first'>Longest Job First</Link></MenuItem>
            <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/longest-remaining-time-first'>Longest Remaining Time First</Link></MenuItem>
            <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/round-robin'>Round Robin</Link></MenuItem>
            <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/shortest-job-first'>Shortest Job First</Link></MenuItem>
            <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/shortest-remaining-time-first'>Shortest Remaining Time First</Link></MenuItem> */}
        </Popover>
    );
}

export default Dropdown;