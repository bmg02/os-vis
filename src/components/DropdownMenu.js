import { List, ListItem, ListItemText, Menu, MenuItem } from '@material-ui/core';
import React from 'react';

function DropdownMenu(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        props.changeItem(props.id, index);
        setAnchorEl(null);
    };
    
    const handleClose = () => setAnchorEl(null);


    return (
        <div style={{ display: props.display }}>
            <List component='nav' aria-label={ props.id + ' list' }>
                <ListItem button aria-haspopup='true' aria-controls={ props.id + '-menu' } aria-label={ props.label } onClick={ handleClickListItem }>
                    <ListItemText primary={ props.label } secondary={ props.menuList[props.selectedItem[props.id]] } />
                </ListItem>
            </List>
            <Menu id={ props.id + '-menu' } anchorEl={ anchorEl } keepMounted open={ Boolean(anchorEl) } onClose={ handleClose }>
                {
                    props.menuList.map((option, index) => (
                        <MenuItem key={ option } selected={ index === props.selectedItem[props.id] } onClick={ (event) => handleMenuItemClick(event, index) }>
                            { option }
                        </MenuItem>
                    ))
                }
            </Menu>
        </div>
    );
}

export default DropdownMenu;