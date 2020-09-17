import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import './Header.scss';
import headerImage from '../assets/images/osv-logo.png';

function Header() {
    return (
        <AppBar position='sticky' style={{ background: '#FFF' }}>
            <Toolbar variant="dense" style={{ display: 'block', justifyContent: 'center' }} class='header-div'>
                <div><img src={ headerImage } alt='OS-VIS logo' class='header-image' /></div>
                <div><h1 class='header-heading'>OS-VIS</h1></div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;